package com.aaasas.inmobiliaria.user.api;

import jakarta.validation.constraints.Email;

public record UpdateUserRequest(
    @Email(message = "Formato de email inválido")
    String email,
    String name,
    String role,
    Boolean active
) {}
