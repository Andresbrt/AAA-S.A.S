package com.aaasas.inmobiliaria.project.api;

import java.time.LocalDateTime;

public record ProjectSitemapDto(
    String slug,
    LocalDateTime updatedAt
) {}
