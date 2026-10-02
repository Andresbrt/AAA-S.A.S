package com.aaasas.inmobiliaria.user.api;

import java.util.UUID;

public record UserResponse(
    UUID id,
    String email,
    String name,
    String role,
    boolean active
) {}
