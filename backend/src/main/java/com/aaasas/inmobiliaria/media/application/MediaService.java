package com.aaasas.inmobiliaria.media.application;

import com.aaasas.inmobiliaria.media.api.MediaFileResponse;
import com.aaasas.inmobiliaria.media.domain.*;
import com.aaasas.inmobiliaria.media.infrastructure.MediaFileRepository;
import com.aaasas.inmobiliaria.shared.exception.BusinessRuleException;
import com.aaasas.inmobiliaria.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MediaService {

    private static final Logger log = LoggerFactory.getLogger(MediaService.class);
    private static final Set<String> ALLOWED_MIME_TYPES = Set.of(
        "image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml",
        "video/mp4", "video/quicktime", "video/webm", "application/pdf"
    );
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB (imágenes / PDF)
    private static final long MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50 MB (videos)

    /** Tipos que solo admiten un archivo por entidad (se reemplaza el anterior). */
    private static final Set<com.aaasas.inmobiliaria.media.domain.MediaType> SINGLE_SLOT_TYPES = Set.of(
        com.aaasas.inmobiliaria.media.domain.MediaType.MAIN_IMAGE,
        com.aaasas.inmobiliaria.media.domain.MediaType.BANNER_IMAGE,
        com.aaasas.inmobiliaria.media.domain.MediaType.LOGO,
        com.aaasas.inmobiliaria.media.domain.MediaType.BROCHURE
    );

    private final FileStoragePort fileStoragePort;
    private final MediaFileRepository mediaFileRepository;
    private final org.springframework.cache.CacheManager cacheManager;

    @Transactional
    public MediaFileResponse upload(MultipartFile file, String mediaType, String entityType,
                                    UUID entityId, String altText, int displayOrder) {
        validateFile(file);

        com.aaasas.inmobiliaria.media.domain.MediaType typeEnum = com.aaasas.inmobiliaria.media.domain.MediaType.valueOf(mediaType);
        
        // Si es un tipo de archivo único, eliminar el anterior
        if (SINGLE_SLOT_TYPES.contains(typeEnum)) {
            List<MediaFile> existingFiles = mediaFileRepository.findByEntityTypeAndEntityIdOrderByDisplayOrderAsc(
                EntityType.valueOf(entityType), entityId
            ).stream().filter(m -> m.getMediaType() == typeEnum).toList();
            
            for (MediaFile oldFile : existingFiles) {
                fileStoragePort.delete(oldFile.getFileKey());
                mediaFileRepository.delete(oldFile);
            }
        }

        String sanitizedName = sanitizeFileName(file.getOriginalFilename());
        String key = String.format("%s/%s/%s-%s",
            entityType.toLowerCase(), entityId, UUID.randomUUID(), sanitizedName);

        try {
            String url = fileStoragePort.upload(key, file.getInputStream(), file.getSize(), file.getContentType());

            MediaFile mediaFile = MediaFile.builder()
                .fileKey(key)
                .url(url)
                .originalName(sanitizedName)
                .contentType(file.getContentType())
                .fileSize(file.getSize())
                .mediaType(typeEnum)
                .displayOrder(displayOrder)
                .altText(altText)
                .entityType(EntityType.valueOf(entityType))
                .entityId(entityId)
                .build();

            MediaFile saved = mediaFileRepository.save(mediaFile);
            
            // Invalidar la caché de proyectos explícitamente si la entidad es PROJECT
            if (EntityType.valueOf(entityType) == EntityType.PROJECT) {
                evictProjectCaches();
            }
            
            log.info("File uploaded: {} -> {}", key, url);
            return toResponse(saved);
        } catch (IOException e) {
            throw new com.aaasas.inmobiliaria.shared.exception.FileStorageException("Error reading uploaded file", e);
        }
    }

    @Transactional(readOnly = true)
    public List<MediaFileResponse> findByEntity(String entityType, UUID entityId) {
        return mediaFileRepository
            .findByEntityTypeAndEntityIdOrderByDisplayOrderAsc(EntityType.valueOf(entityType), entityId)
            .stream().map(this::toResponse).toList();
    }

    @Transactional
    public void delete(UUID id) {
        MediaFile file = mediaFileRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("MediaFile", "id", id));
        fileStoragePort.delete(file.getFileKey());
        mediaFileRepository.delete(file);
        if (file.getEntityType() == EntityType.PROJECT) {
            evictProjectCaches();
        }
        log.info("File deleted: {}", file.getFileKey());
    }

    private void evictProjectCaches() {
        if (cacheManager == null) return;
        for (String name : List.of("publicProjects", "featuredProjects")) {
            org.springframework.cache.Cache cache = cacheManager.getCache(name);
            if (cache != null) cache.clear();
        }
    }

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new BusinessRuleException("El archivo está vacío.");
        }
        if (!ALLOWED_MIME_TYPES.contains(file.getContentType())) {
            throw new BusinessRuleException("Tipo de archivo no permitido: " + file.getContentType());
        }
        boolean isVideo = file.getContentType() != null && file.getContentType().startsWith("video/");
        if (isVideo && file.getSize() > MAX_VIDEO_SIZE) {
            throw new BusinessRuleException("El video excede el tamaño máximo de 50 MB.");
        }
        if (!isVideo && file.getSize() > MAX_FILE_SIZE) {
            throw new BusinessRuleException("El archivo excede el tamaño máximo de 10 MB.");
        }
    }

    private String sanitizeFileName(String fileName) {
        if (fileName == null) return "unnamed";
        return fileName.replaceAll("[^a-zA-Z0-9._-]", "_");
    }

    private MediaFileResponse toResponse(MediaFile m) {
        return new MediaFileResponse(
            m.getId(), m.getUrl(), m.getOriginalName(), m.getContentType(),
            m.getFileSize(), m.getMediaType().name(), m.getDisplayOrder(),
            m.getAltText(), m.getEntityType().name(), m.getEntityId()
        );
    }
}
