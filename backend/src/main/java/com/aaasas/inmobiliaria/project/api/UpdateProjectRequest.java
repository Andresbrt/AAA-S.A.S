package com.aaasas.inmobiliaria.project.api;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record UpdateProjectRequest(
    String name,
    String shortDescription,
    String longDescription,
    String status,
    BigDecimal minPrice,
    BigDecimal maxPrice,
    LocalDate estimatedDelivery,
    String address,
    BigDecimal latitude,
    BigDecimal longitude,
    String mapUrl,
    UUID cityId,
    UUID neighborhoodId,
    String metaTitle,
    String metaDescription,
    List<UUID> amenityIds,
    List<String> tags,
    Boolean featured,
    Boolean published
) {}
