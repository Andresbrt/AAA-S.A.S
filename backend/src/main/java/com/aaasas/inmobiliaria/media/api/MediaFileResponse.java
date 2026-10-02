package com.aaasas.inmobiliaria.media.api;

import java.util.UUID;

public record MediaFileResponse(
    UUID id, String url, String originalName, String contentType,
    Long fileSize, String mediaType, int displayOrder, String altText,
    String entityType, UUID entityId
) {}
