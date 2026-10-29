package com.aaasas.inmobiliaria.media.api;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record CompleteDirectUploadRequest(
    @NotBlank(message = "La clave del archivo es requerida")
    String fileKey,

    @NotBlank(message = "La URL pública es requerida")
    String url,

    @NotBlank(message = "El nombre original es requerido")
    String originalName,

    @NotBlank(message = "El tipo de contenido es requerido")
    String contentType,

    Long fileSize,

    @NotBlank(message = "El tipo de medio es requerido")
    String mediaType,

    @NotBlank(message = "El tipo de entidad es requerido")
    String entityType,

    @NotNull(message = "El ID de entidad es requerido")
    UUID entityId,

    String altText,

    Integer displayOrder
) {}
