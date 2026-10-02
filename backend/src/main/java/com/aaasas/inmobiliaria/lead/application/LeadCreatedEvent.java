package com.aaasas.inmobiliaria.lead.application;

import java.util.UUID;

/**
 * Domain event published when a new lead is created, for async email notification.
 */
public record LeadCreatedEvent(UUID leadId, String fullName, String email) {}
