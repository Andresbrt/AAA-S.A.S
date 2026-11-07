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
    BigDecimal latitude, BigDecimal longitude, String mapUrl,
    boolean featured, boolean published,
    String metaTitle, String metaDescription,
    String cityName, String departmentName,
    String mainImageUrl, String bannerImageUrl, String logoUrl, String brochureUrl,
    List<String> galleryUrls,
    List<AmenityResponse> amenities,
    List<String> tags,

    // Financing Calculator
    boolean hasFinancingCalculator,
    BigDecimal reservationAmount,
    BigDecimal downPaymentPercentage,
    Integer interestFreeMonths,
    Integer interestMonths,
    BigDecimal monthlyInterestRate
) {
    // Backwards-compatible constructor for 25 arguments
    public ProjectDetailResponse(
        UUID id, String name, String slug,
        String shortDescription, String longDescription,
        String status, BigDecimal minPrice, BigDecimal maxPrice,
        LocalDate estimatedDelivery, String address,
        BigDecimal latitude, BigDecimal longitude, String mapUrl,
        boolean featured, boolean published,
        String metaTitle, String metaDescription,
        String cityName, String departmentName,
        String mainImageUrl, String bannerImageUrl, String logoUrl, String brochureUrl,
        List<String> galleryUrls,
        List<AmenityResponse> amenities,
        List<String> tags
    ) {
        this(id, name, slug, shortDescription, longDescription, status, minPrice, maxPrice,
             estimatedDelivery, address, latitude, longitude, mapUrl, featured, published,
             metaTitle, metaDescription, cityName, departmentName, mainImageUrl, bannerImageUrl,
             logoUrl, brochureUrl, galleryUrls, amenities, tags,
             false, new BigDecimal("1000000.00"), new BigDecimal("20.00"), 12, 24, new BigDecimal("1.00"));
    }
}
