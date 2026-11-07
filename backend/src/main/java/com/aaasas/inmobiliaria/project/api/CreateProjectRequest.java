package com.aaasas.inmobiliaria.project.api;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
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
    public CreateProjectRequest(
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
             false, new BigDecimal("1000000.00"), new BigDecimal("20.00"), 12, 24, new BigDecimal("1.00"));
    }
}
