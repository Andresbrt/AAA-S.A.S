package com.aaasas.inmobiliaria.auth.api;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

/** Paso 2 del login: token MFA temporal + código de 6 dígitos de la app autenticadora. */
public record MfaVerifyRequest(
    @NotBlank(message = "El token MFA es obligatorio")
    String mfaToken,

    @NotBlank(message = "El código es obligatorio")
    @Pattern(regexp = "\\d{6}", message = "El código debe tener 6 dígitos")
    String code
) {}
