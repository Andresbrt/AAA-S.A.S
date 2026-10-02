package com.aaasas.inmobiliaria.lead.api;

import java.time.LocalDateTime;
import java.util.UUID;

public record LeadResponse(
    UUID id, String fullName, String email, String phone, String message,
    String origin, String status, boolean dataConsent, UUID projectId,
    UUID assignedTo, String internalNotes, LocalDateTime createdAt
) {}
