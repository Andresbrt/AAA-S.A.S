package com.aaasas.inmobiliaria.lead.api;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.AssertTrue;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.validation.constraints.Size;

@JsonIgnoreProperties(ignoreUnknown = true)
public record CreateLeadRequest(
    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 200, message = "El nombre no puede exceder 200 caracteres")
    String fullName,

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "Formato de email inválido")
    @Size(max = 200, message = "El email no puede exceder 200 caracteres")
    String email,

    @Size(max = 50, message = "El teléfono no puede exceder 50 caracteres")
    String phone,

    @Size(max = 2000, message = "El mensaje no puede exceder 2000 caracteres")
    String message,

    @Size(max = 100, message = "El origen no puede exceder 100 caracteres")
    String origin,

    UUID projectId,

    @AssertTrue(message = "Debe aceptar el tratamiento de datos personales (Ley 1581)")
    boolean dataConsent,

    String honeypot,

    String turnstileToken
) {}
