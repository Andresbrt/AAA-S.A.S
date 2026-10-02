package com.aaasas.inmobiliaria.property.api;

import com.aaasas.inmobiliaria.property.application.PropertyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import java.net.URI;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/properties")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'EDITOR')")
@Tag(name = "Inmuebles (Admin)", description = "Gestión de inmuebles")
public class PropertyAdminController {

    private final PropertyService propertyService;

    @PostMapping
    @Operation(summary = "Crear inmueble")
    public ResponseEntity<PropertyResponse> create(@Valid @RequestBody CreatePropertyRequest request) {
        PropertyResponse created = propertyService.create(request);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
            .path("/{id}").buildAndExpand(created.id()).toUri();
        return ResponseEntity.created(location).body(created);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar detalles de un inmueble (lote, apartamento)")
    public ResponseEntity<PropertyResponse> update(
            @PathVariable UUID id, 
            @Valid @RequestBody UpdatePropertyRequest request) {
        return ResponseEntity.ok(propertyService.update(id, request));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Cambiar el estado de un inmueble (ej. VENDIDO, DISPONIBLE)")
    public ResponseEntity<Void> updateStatus(
            @PathVariable UUID id, 
            @RequestParam String status) {
        propertyService.updateStatus(id, status);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar inmueble")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        propertyService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
