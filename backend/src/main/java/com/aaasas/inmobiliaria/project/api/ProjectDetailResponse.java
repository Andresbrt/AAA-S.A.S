package com.aaasas.inmobiliaria.project.api;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record ProjectDetailResponse(
    UUID id, String name, String slug,
    String shortDescription, String longDescription,
    String status, BigDecimal minPrice, BigDecimal maxPrice,
    LocalDate estimatedDelivery, String address,
    BigDecimal latitude, BigDecimal longitude,
    boolean featured, boolean published,
    String metaTitle, String metaDescription,
    String cityName, String departmentName,
    List<AmenityResponse> amenities,
    List<String> tags
) {}
