package com.aaasas.inmobiliaria.auth.api;

import com.aaasas.inmobiliaria.auth.application.AuthService;
import com.aaasas.inmobiliaria.security.CustomUserDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Autenticación", description = "Login, refresh, logout y cambio de contraseña")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Iniciar sesión", description = "Retorna access token y refresh token")
    public ResponseEntity<TokenResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Renovar token", description = "Genera un nuevo par de tokens usando el refresh token")
    public ResponseEntity<TokenResponse> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(authService.refresh(request.refreshToken()));
    }

    @PostMapping("/logout")
    @Operation(summary = "Cerrar sesión", description = "Revoca el refresh token")
    public ResponseEntity<Void> logout(@Valid @RequestBody RefreshTokenRequest request) {
        authService.logout(request.refreshToken());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/change-password")
    @Operation(summary = "Cambiar contraseña", description = "Requiere autenticación. Revoca todos los refresh tokens.")
    public ResponseEntity<Void> changePassword(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @Valid @RequestBody ChangePasswordRequest request) {
        authService.changePassword(currentUser, request);
        return ResponseEntity.noContent().build();
    }
}
