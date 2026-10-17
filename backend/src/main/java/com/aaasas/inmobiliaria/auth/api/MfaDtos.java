package com.aaasas.inmobiliaria.auth.api;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

/** DTOs de gestión de MFA desde el panel admin. */
public final class MfaDtos {

    private MfaDtos() {}

    public record StatusResponse(boolean enabled) {}

    /** Se muestra UNA sola vez al configurar. El secreto permite ingreso manual si no se puede escanear el QR. */
    public record SetupResponse(String secret, String otpauthUri) {}

    public record EnableRequest(
        @NotBlank @Pattern(regexp = "\\d{6}", message = "El código debe tener 6 dígitos")
        String code
    ) {}

    public record DisableRequest(
        @NotBlank(message = "La contraseña es obligatoria")
        String password,

        @NotBlank @Pattern(regexp = "\\d{6}", message = "El código debe tener 6 dígitos")
        String code
    ) {}
}
