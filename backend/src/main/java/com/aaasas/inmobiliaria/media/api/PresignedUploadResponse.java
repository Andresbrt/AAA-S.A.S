package com.aaasas.inmobiliaria.media.api;

import java.util.Map;

public record PresignedUploadResponse(
    String fileKey,
    String uploadUrl,
    String publicUrl,
    String httpMethod,
    Map<String, String> headers
) {}
