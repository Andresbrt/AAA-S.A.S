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
        "image/jpeg", "image/png", "image/webp", "image/gif",
        "video/mp4", "application/pdf"
    );
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

    private final FileStoragePort fileStoragePort;
    private final MediaFileRepository mediaFileRepository;

    @Transactional
    public MediaFileResponse upload(MultipartFile file, String mediaType, String entityType,
                                    UUID entityId, String altText, int displayOrder) {
        validateFile(file);

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
                .mediaType(com.aaasas.inmobiliaria.media.domain.MediaType.valueOf(mediaType))
                .displayOrder(displayOrder)
                .altText(altText)
                .entityType(EntityType.valueOf(entityType))
                .entityId(entityId)
                .build();

            MediaFile saved = mediaFileRepository.save(mediaFile);
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
        log.info("File deleted: {}", file.getFileKey());
    }

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new BusinessRuleException("El archivo está vacío.");
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new BusinessRuleException("El archivo excede el tamaño máximo de 10 MB.");
        }
        if (!ALLOWED_MIME_TYPES.contains(file.getContentType())) {
            throw new BusinessRuleException("Tipo de archivo no permitido: " + file.getContentType());
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
