package com.aaasas.inmobiliaria.project.api;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record CreateProjectRequest(
    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 200)
    String name,

    @Size(max = 500) String shortDescription,
    String longDescription,
    String status,
    BigDecimal minPrice,
    BigDecimal maxPrice,
    LocalDate estimatedDelivery,
    @Size(max = 500) String address,
    BigDecimal latitude,
    BigDecimal longitude,
    String mapUrl,
    UUID cityId,
    UUID neighborhoodId,
    @Size(max = 200) String metaTitle,
    @Size(max = 500) String metaDescription,
    List<UUID> amenityIds,
    List<String> tags,
    Boolean featured,
    Boolean published
) {}
