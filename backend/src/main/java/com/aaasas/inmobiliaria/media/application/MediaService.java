package com.aaasas.inmobiliaria.media.application;

import com.aaasas.inmobiliaria.media.api.CompleteDirectUploadRequest;
import com.aaasas.inmobiliaria.media.api.MediaFileResponse;
import com.aaasas.inmobiliaria.media.api.PresignedUploadRequest;
import com.aaasas.inmobiliaria.media.api.PresignedUploadResponse;
import com.aaasas.inmobiliaria.media.domain.*;
import com.aaasas.inmobiliaria.media.infrastructure.MediaFileRepository;
import com.aaasas.inmobiliaria.shared.exception.BusinessRuleException;
import com.aaasas.inmobiliaria.shared.exception.FileStorageException;
import com.aaasas.inmobiliaria.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
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

    // SVG eliminado para prevenir Stored XSS
    private static final Set<String> ALLOWED_MIME_TYPES = Set.of(
        "image/jpeg", "image/png", "image/webp", "image/gif",
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
    private final CacheManager cacheManager;

    /**
     * Genera URL prefirmada para subida directa desde el navegador (cero consumo de RAM en servidor).
     */
    public PresignedUploadResponse createPresignedUpload(PresignedUploadRequest request) {
        validateMetadata(request.fileName(), request.contentType(), request.fileSize());

        String sanitizedName = sanitizeFileName(request.fileName());
        String key = String.format("%s/%s/%s-%s",
            request.entityType().toLowerCase(), request.entityId(), UUID.randomUUID(), sanitizedName);

        return fileStoragePort.createPresignedUploadUrl(key, request.contentType(), 15);
    }

    /**
     * Confirma la subida directa y persiste los metadatos en la base de datos dentro de una transacción corta.
     */
    @Transactional
    public MediaFileResponse completeDirectUpload(CompleteDirectUploadRequest request) {
        com.aaasas.inmobiliaria.media.domain.MediaType typeEnum =
            com.aaasas.inmobiliaria.media.domain.MediaType.valueOf(request.mediaType());
        EntityType entityTypeEnum = EntityType.valueOf(request.entityType());

        // Si es tipo único, limpiar archivo previo
        if (SINGLE_SLOT_TYPES.contains(typeEnum)) {
            List<MediaFile> existingFiles = mediaFileRepository.findByEntityTypeAndEntityIdOrderByDisplayOrderAsc(
                entityTypeEnum, request.entityId()
            ).stream().filter(m -> m.getMediaType() == typeEnum).toList();

            for (MediaFile oldFile : existingFiles) {
                try {
                    fileStoragePort.delete(oldFile.getFileKey());
                } catch (Exception ex) {
                    log.warn("Could not delete previous file from storage: {}", oldFile.getFileKey());
                }
                mediaFileRepository.delete(oldFile);
            }
        }

        MediaFile mediaFile = MediaFile.builder()
            .fileKey(request.fileKey())
            .url(request.url())
            .originalName(sanitizeFileName(request.originalName()))
            .contentType(request.contentType())
            .fileSize(request.fileSize() != null ? request.fileSize() : 0L)
            .mediaType(typeEnum)
            .displayOrder(request.displayOrder() != null ? request.displayOrder() : 0)
            .altText(request.altText() != null ? request.altText() : "")
            .entityType(entityTypeEnum)
            .entityId(request.entityId())
            .build();

        MediaFile saved = mediaFileRepository.save(mediaFile);

        if (entityTypeEnum == EntityType.PROJECT) {
            evictProjectCaches();
        }

        log.info("Direct upload recorded successfully: {} -> {}", request.fileKey(), request.url());
        return toResponse(saved);
    }

    /**
     * Subida tradicional vía API. El I/O de red ocurre FUERA de la transacción para no agotar el pool de Hikari.
     */
    public MediaFileResponse upload(MultipartFile file, String mediaType, String entityType,
                                    UUID entityId, String altText, int displayOrder) {
        validateFile(file);

        String sanitizedName = sanitizeFileName(file.getOriginalFilename());
        String key = String.format("%s/%s/%s-%s",
            entityType.toLowerCase(), entityId, UUID.randomUUID(), sanitizedName);

        String url;
        try {
            url = fileStoragePort.upload(key, file.getInputStream(), file.getSize(), file.getContentType());
        } catch (IOException e) {
            throw new FileStorageException("Error reading uploaded file", e);
        }

        try {
            return saveUploadedMediaFile(key, url, sanitizedName, file.getContentType(), file.getSize(),
                mediaType, entityType, entityId, altText, displayOrder);
        } catch (Exception e) {
            // Limpieza en almacenamiento si falló el guardado en base de datos
            try {
                fileStoragePort.delete(key);
            } catch (Exception ex) {
                log.warn("Failed to delete orphaned storage file: {}", key);
            }
            throw e;
        }
    }

    @Transactional
    public MediaFileResponse saveUploadedMediaFile(String key, String url, String originalName,
                                                  String contentType, long fileSize,
                                                  String mediaType, String entityType,
                                                  UUID entityId, String altText, int displayOrder) {
        com.aaasas.inmobiliaria.media.domain.MediaType typeEnum =
            com.aaasas.inmobiliaria.media.domain.MediaType.valueOf(mediaType);
        EntityType entityTypeEnum = EntityType.valueOf(entityType);

        if (SINGLE_SLOT_TYPES.contains(typeEnum)) {
            List<MediaFile> existingFiles = mediaFileRepository.findByEntityTypeAndEntityIdOrderByDisplayOrderAsc(
                entityTypeEnum, entityId
            ).stream().filter(m -> m.getMediaType() == typeEnum).toList();

            for (MediaFile oldFile : existingFiles) {
                try {
                    fileStoragePort.delete(oldFile.getFileKey());
                } catch (Exception ex) {
                    log.warn("Could not delete previous file from storage: {}", oldFile.getFileKey());
                }
                mediaFileRepository.delete(oldFile);
            }
        }

        MediaFile mediaFile = MediaFile.builder()
            .fileKey(key)
            .url(url)
            .originalName(originalName)
            .contentType(contentType)
            .fileSize(fileSize)
            .mediaType(typeEnum)
            .displayOrder(displayOrder)
            .altText(altText)
            .entityType(entityTypeEnum)
            .entityId(entityId)
            .build();

        MediaFile saved = mediaFileRepository.save(mediaFile);

        if (entityTypeEnum == EntityType.PROJECT) {
            evictProjectCaches();
        }

        log.info("File uploaded and saved: {} -> {}", key, url);
        return toResponse(saved);
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
        for (String name : List.of("publicProjects", "featuredProjects", "projectBySlug")) {
            Cache cache = cacheManager.getCache(name);
            if (cache != null) cache.clear();
        }
    }

    private void validateMetadata(String fileName, String contentType, Long fileSize) {
        if (fileName == null || fileName.isBlank()) {
            throw new BusinessRuleException("El nombre del archivo es obligatorio.");
        }
        if (contentType == null || !ALLOWED_MIME_TYPES.contains(contentType)) {
            throw new BusinessRuleException("Tipo de archivo no permitido: " + contentType);
        }
        boolean isVideo = contentType.startsWith("video/");
        if (isVideo && fileSize != null && fileSize > MAX_VIDEO_SIZE) {
            throw new BusinessRuleException("El video excede el tamaño máximo de 50 MB.");
        }
        if (!isVideo && fileSize != null && fileSize > MAX_FILE_SIZE) {
            throw new BusinessRuleException("El archivo excede el tamaño máximo de 10 MB.");
        }
    }

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new BusinessRuleException("El archivo está vacío.");
        }
        validateMetadata(file.getOriginalFilename(), file.getContentType(), file.getSize());
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
