package com.aaasas.inmobiliaria.property.api;

import java.math.BigDecimal;
import java.util.UUID;

public record PropertyResponse(
    UUID id, UUID projectId, String projectName, String name,
    String type, BigDecimal builtArea, BigDecimal privateArea,
    Integer bedrooms, Integer bathrooms, Integer parkingSpots,
    Integer stratum, BigDecimal price, String status, String floorOrTower
) {}
