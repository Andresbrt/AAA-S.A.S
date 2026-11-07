package com.aaasas.inmobiliaria.project.api;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;

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
    Boolean published,

    // Financing Calculator
    Boolean hasFinancingCalculator,
    @DecimalMin("0.0") BigDecimal reservationAmount,
    @DecimalMin("0.0") @DecimalMax("100.0") BigDecimal downPaymentPercentage,
    @Min(0) Integer interestFreeMonths,
    @Min(0) Integer interestMonths,
    @DecimalMin("0.0") BigDecimal monthlyInterestRate
) {
    // Backwards-compatible constructor for 19 arguments
    public UpdateProjectRequest(
        String name, String shortDescription, String longDescription,
        String status, BigDecimal minPrice, BigDecimal maxPrice,
        LocalDate estimatedDelivery, String address, BigDecimal latitude,
        BigDecimal longitude, String mapUrl, UUID cityId, UUID neighborhoodId,
        String metaTitle, String metaDescription, List<UUID> amenityIds,
        List<String> tags, Boolean featured, Boolean published
    ) {
        this(name, shortDescription, longDescription, status, minPrice, maxPrice,
             estimatedDelivery, address, latitude, longitude, mapUrl, cityId, neighborhoodId,
             metaTitle, metaDescription, amenityIds, tags, featured, published,
             null, null, null, null, null, null);
    }
}
