package com.aaasas.inmobiliaria.user.api;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateUserRequest(
    @NotBlank(message = "El email es obligatorio")
    @Email(message = "Formato de email inválido")
    String email,

    @NotBlank(message = "La contraseña es obligatoria")
    @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres")
    String password,

    @NotBlank(message = "El nombre es obligatorio")
    String name,

    @NotNull(message = "El rol es obligatorio")
    String role
) {}
