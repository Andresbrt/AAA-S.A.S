package com.aaasas.inmobiliaria.project.api;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record ProjectSummaryResponse(
    UUID id, String name, String slug, String shortDescription,
    String status, BigDecimal minPrice, BigDecimal maxPrice,
    String cityName, String departmentName,
    boolean featured, String metaTitle,
    LocalDate estimatedDelivery, String mapUrl, String mainImageUrl,
    String bannerImageUrl, String logoUrl, List<String> galleryUrls,
    List<String> tags
) {}
