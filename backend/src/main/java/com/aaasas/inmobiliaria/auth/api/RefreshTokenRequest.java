package com.aaasas.inmobiliaria.auth.api;

import jakarta.validation.constraints.NotBlank;

public record RefreshTokenRequest(
    @NotBlank(message = "El refresh token es obligatorio")
    String refreshToken
) {}
