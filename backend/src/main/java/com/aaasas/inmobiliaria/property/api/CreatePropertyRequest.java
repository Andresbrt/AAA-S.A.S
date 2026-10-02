package com.aaasas.inmobiliaria.property.api;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.UUID;

public record CreatePropertyRequest(
    @NotNull(message = "El proyecto es obligatorio") UUID projectId,
    String name,
    @NotBlank(message = "El tipo es obligatorio") String type,
    BigDecimal builtArea, BigDecimal privateArea,
    Integer bedrooms, Integer bathrooms, Integer parkingSpots,
    Integer stratum, BigDecimal price, String status, String floorOrTower
) {}
