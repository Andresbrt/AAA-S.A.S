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
    String bannerImageUrl, String logoUrl, String brochureUrl, List<String> galleryUrls,
    List<String> tags,

    // Financing Calculator
    boolean hasFinancingCalculator,
    BigDecimal reservationAmount,
    BigDecimal downPaymentPercentage,
    Integer interestFreeMonths,
    Integer interestMonths,
    BigDecimal monthlyInterestRate
) {
    // Backwards-compatible constructor for 19 arguments
    public ProjectSummaryResponse(
        UUID id, String name, String slug, String shortDescription,
        String status, BigDecimal minPrice, BigDecimal maxPrice,
        String cityName, String departmentName,
        boolean featured, String metaTitle,
        LocalDate estimatedDelivery, String mapUrl, String mainImageUrl,
        String bannerImageUrl, String logoUrl, String brochureUrl, List<String> galleryUrls,
        List<String> tags
    ) {
        this(id, name, slug, shortDescription, status, minPrice, maxPrice,
             cityName, departmentName, featured, metaTitle, estimatedDelivery,
             mapUrl, mainImageUrl, bannerImageUrl, logoUrl, brochureUrl, galleryUrls, tags,
             false, new BigDecimal("1000000.00"), new BigDecimal("20.00"), 12, 24, new BigDecimal("1.00"));
    }
}
