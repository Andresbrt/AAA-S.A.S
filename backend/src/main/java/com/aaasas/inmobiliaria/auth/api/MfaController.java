package com.aaasas.inmobiliaria.auth.api;

import com.aaasas.inmobiliaria.auth.api.MfaDtos.DisableRequest;
import com.aaasas.inmobiliaria.auth.api.MfaDtos.EnableRequest;
import com.aaasas.inmobiliaria.auth.api.MfaDtos.SetupResponse;
import com.aaasas.inmobiliaria.auth.api.MfaDtos.StatusResponse;
import com.aaasas.inmobiliaria.auth.application.MfaService;
import com.aaasas.inmobiliaria.security.CustomUserDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/** Gestión de MFA del usuario autenticado. Bajo /admin/** → requiere JWT de acceso. */
@RestController
@RequestMapping("/api/v1/admin/mfa")
@RequiredArgsConstructor
@Tag(name = "MFA", description = "Verificación en 2 pasos con app autenticadora (TOTP)")
public class MfaController {

    private final MfaService mfaService;

    @GetMapping("/status")
    @Operation(summary = "Estado de MFA del usuario actual")
    public ResponseEntity<StatusResponse> status(@AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(mfaService.status(user.getId()));
    }

    @PostMapping("/setup")
    @Operation(summary = "Generar secreto y URI para el código QR")
    public ResponseEntity<SetupResponse> setup(@AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(mfaService.setup(user.getId()));
    }

    @PostMapping("/enable")
    @Operation(summary = "Activar MFA confirmando un código de la app")
    public ResponseEntity<StatusResponse> enable(
            @AuthenticationPrincipal CustomUserDetails user,
            @Valid @RequestBody EnableRequest request) {
        return ResponseEntity.ok(mfaService.enable(user.getId(), request.code()));
    }

    @PostMapping("/disable")
    @Operation(summary = "Desactivar MFA (requiere contraseña y código)")
    public ResponseEntity<StatusResponse> disable(
            @AuthenticationPrincipal CustomUserDetails user,
            @Valid @RequestBody DisableRequest request) {
        return ResponseEntity.ok(mfaService.disable(user.getId(), request.password(), request.code()));
    }
}
