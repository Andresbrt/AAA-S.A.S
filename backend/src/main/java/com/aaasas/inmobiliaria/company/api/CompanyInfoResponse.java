package com.aaasas.inmobiliaria.company.api;

import java.util.UUID;

public record CompanyInfoResponse(
    UUID id, String name, String aboutUs, String mission, String vision,
    String contactEmail, String contactPhone, String contactAddress, String logoUrl,
    String whatsappNumber, String whatsappMessage,
    String instagramUrl, String facebookUrl, String youtubeUrl,
    String heroVideoUrl, String heroTitle, String heroSubtitle,
    String metaTitle, String metaDescription, String metaKeywords
) {}
