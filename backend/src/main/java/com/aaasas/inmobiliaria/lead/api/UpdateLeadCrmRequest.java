package com.aaasas.inmobiliaria.lead.api;

import java.util.UUID;

public record UpdateLeadCrmRequest(
    String status,
    UUID assignedTo,
    String internalNotes
) {}
