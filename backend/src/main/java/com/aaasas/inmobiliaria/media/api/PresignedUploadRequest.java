package com.aaasas.inmobiliaria.media.api;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record PresignedUploadRequest(
    @NotBlank(message = "El nombre de archivo es requerido")
    String fileName,

    @NotBlank(message = "El tipo de contenido (MIME) es requerido")
    String contentType,

    @NotBlank(message = "El tipo de medio es requerido")
    String mediaType,

    @NotBlank(message = "El tipo de entidad es requerido")
    String entityType,

    @NotNull(message = "El ID de entidad es requerido")
    UUID entityId,

    Long fileSize
) {}
