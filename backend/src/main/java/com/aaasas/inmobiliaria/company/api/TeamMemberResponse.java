package com.aaasas.inmobiliaria.company.api;

import java.util.UUID;

public record TeamMemberResponse(UUID id, String fullName, String position, String bio, String photoUrl, int displayOrder) {}
