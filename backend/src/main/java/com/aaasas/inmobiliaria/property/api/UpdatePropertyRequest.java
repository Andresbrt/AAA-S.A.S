package com.aaasas.inmobiliaria.property.api;

import java.math.BigDecimal;

public record UpdatePropertyRequest(
    String name,
    String type,
    BigDecimal builtArea,
    BigDecimal privateArea,
    Integer bedrooms,
    Integer bathrooms,
    Integer parkingSpots,
    Integer stratum,
    BigDecimal price,
    String status,
    String floorOrTower
) {}
