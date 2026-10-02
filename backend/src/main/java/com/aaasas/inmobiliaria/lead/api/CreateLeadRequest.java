package com.aaasas.inmobiliaria.lead.api;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.AssertTrue;
import java.util.UUID;

public record CreateLeadRequest(
    @NotBlank(message = "El nombre es obligatorio") String fullName,
    @NotBlank(message = "El email es obligatorio") @Email(message = "Formato de email inválido") String email,
    String phone,
    String message,
    String origin,
    UUID projectId,
    @AssertTrue(message = "Debe aceptar el tratamiento de datos personales (Ley 1581)") boolean dataConsent,
    String honeypot
) {}
