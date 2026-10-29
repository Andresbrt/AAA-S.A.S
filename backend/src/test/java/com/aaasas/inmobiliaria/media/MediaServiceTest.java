package com.aaasas.inmobiliaria.media;

import com.aaasas.inmobiliaria.media.api.CompleteDirectUploadRequest;
import com.aaasas.inmobiliaria.media.api.MediaFileResponse;
import com.aaasas.inmobiliaria.media.api.PresignedUploadRequest;
import com.aaasas.inmobiliaria.media.api.PresignedUploadResponse;
import com.aaasas.inmobiliaria.media.application.MediaService;
import com.aaasas.inmobiliaria.media.domain.*;
import com.aaasas.inmobiliaria.media.infrastructure.MediaFileRepository;
import com.aaasas.inmobiliaria.shared.exception.BusinessRuleException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MediaServiceTest {

    @Mock
    private FileStoragePort fileStoragePort;

    @Mock
    private MediaFileRepository mediaFileRepository;

    @Mock
    private CacheManager cacheManager;

    @Mock
    private Cache cache;

    private MediaService mediaService;

    @BeforeEach
    void setUp() {
        mediaService = new MediaService(fileStoragePort, mediaFileRepository, cacheManager);
    }

    @Test
    @DisplayName("createPresignedUpload genera URL firmada exitosamente para imagen válida")
    void shouldCreatePresignedUploadSuccessfully() {
        UUID entityId = UUID.randomUUID();
        PresignedUploadRequest request = new PresignedUploadRequest(
            "render-vista-mar.webp",
            "image/webp",
            "MAIN_IMAGE",
            "PROJECT",
            entityId,
            2 * 1024 * 1024L
        );

        PresignedUploadResponse expectedResponse = new PresignedUploadResponse(
            "project/" + entityId + "/test-key.webp",
            "https://storage.supabase.co/upload?token=xyz",
            "https://storage.supabase.co/public/test-key.webp",
            "PUT",
            Map.of("Content-Type", "image/webp")
        );

        when(fileStoragePort.createPresignedUploadUrl(anyString(), eq("image/webp"), eq(15)))
            .thenReturn(expectedResponse);

        PresignedUploadResponse response = mediaService.createPresignedUpload(request);

        assertThat(response).isNotNull();
        assertThat(response.uploadUrl()).isEqualTo(expectedResponse.uploadUrl());
        assertThat(response.httpMethod()).isEqualTo("PUT");
        verify(fileStoragePort).createPresignedUploadUrl(anyString(), eq("image/webp"), eq(15));
    }

    @Test
    @DisplayName("createPresignedUpload rechaza archivos SVG para prevenir Stored XSS")
    void shouldRejectSvgUploadToPreventXss() {
        PresignedUploadRequest request = new PresignedUploadRequest(
            "vector.svg",
            "image/svg+xml",
            "GALLERY_IMAGE",
            "PROJECT",
            UUID.randomUUID(),
            1024L
        );

        assertThatThrownBy(() -> mediaService.createPresignedUpload(request))
            .isInstanceOf(BusinessRuleException.class)
            .hasMessageContaining("Tipo de archivo no permitido");

        verifyNoInteractions(fileStoragePort);
    }

    @Test
    @DisplayName("createPresignedUpload rechaza imágenes que superen 10 MB")
    void shouldRejectImagesExceedingLimit() {
        PresignedUploadRequest request = new PresignedUploadRequest(
            "huge-image.jpg",
            "image/jpeg",
            "BANNER_IMAGE",
            "PROJECT",
            UUID.randomUUID(),
            15 * 1024 * 1024L // 15 MB
        );

        assertThatThrownBy(() -> mediaService.createPresignedUpload(request))
            .isInstanceOf(BusinessRuleException.class)
            .hasMessageContaining("El archivo excede el tamaño máximo de 10 MB");

        verifyNoInteractions(fileStoragePort);
    }

    @Test
    @DisplayName("completeDirectUpload persiste archivo y reemplaza archivo anterior si es slot único")
    void shouldCompleteDirectUploadAndReplacePreviousSlot() {
        UUID entityId = UUID.randomUUID();
        UUID oldId = UUID.randomUUID();

        MediaFile oldFile = MediaFile.builder()
            .id(oldId)
            .fileKey("project/" + entityId + "/old.webp")
            .url("https://supabase.co/old.webp")
            .originalName("old.webp")
            .contentType("image/webp")
            .fileSize(1000L)
            .mediaType(MediaType.MAIN_IMAGE)
            .entityType(EntityType.PROJECT)
            .entityId(entityId)
            .build();

        when(mediaFileRepository.findByEntityTypeAndEntityIdOrderByDisplayOrderAsc(EntityType.PROJECT, entityId))
            .thenReturn(List.of(oldFile));

        when(mediaFileRepository.save(any(MediaFile.class))).thenAnswer(invocation -> {
            MediaFile m = invocation.getArgument(0);
            return MediaFile.builder()
                .id(UUID.randomUUID())
                .fileKey(m.getFileKey())
                .url(m.getUrl())
                .originalName(m.getOriginalName())
                .contentType(m.getContentType())
                .fileSize(m.getFileSize())
                .mediaType(m.getMediaType())
                .displayOrder(m.getDisplayOrder())
                .altText(m.getAltText())
                .entityType(m.getEntityType())
                .entityId(m.getEntityId())
                .build();
        });

        when(cacheManager.getCache(anyString())).thenReturn(cache);

        CompleteDirectUploadRequest request = new CompleteDirectUploadRequest(
            "project/" + entityId + "/new.webp",
            "https://supabase.co/new.webp",
            "new.webp",
            "image/webp",
            2000L,
            "MAIN_IMAGE",
            "PROJECT",
            entityId,
            "Fachada principal",
            0
        );

        MediaFileResponse response = mediaService.completeDirectUpload(request);

        assertThat(response).isNotNull();
        assertThat(response.url()).isEqualTo("https://supabase.co/new.webp");
        assertThat(response.mediaType()).isEqualTo("MAIN_IMAGE");

        verify(fileStoragePort).delete("project/" + entityId + "/old.webp");
        verify(mediaFileRepository).delete(oldFile);
        verify(mediaFileRepository).save(any(MediaFile.class));
        verify(cacheManager, atLeastOnce()).getCache(anyString());
    }

    @Test
    @DisplayName("delete elimina archivo de la base de datos y de almacenamiento")
    void shouldDeleteMediaFile() {
        UUID id = UUID.randomUUID();
        MediaFile file = MediaFile.builder()
            .id(id)
            .fileKey("project/123/img.webp")
            .url("https://supabase.co/img.webp")
            .entityType(EntityType.PROJECT)
            .entityId(UUID.randomUUID())
            .build();

        when(mediaFileRepository.findById(id)).thenReturn(Optional.of(file));
        when(cacheManager.getCache(anyString())).thenReturn(cache);

        mediaService.delete(id);

        verify(fileStoragePort).delete("project/123/img.webp");
        verify(mediaFileRepository).delete(file);
    }
}
