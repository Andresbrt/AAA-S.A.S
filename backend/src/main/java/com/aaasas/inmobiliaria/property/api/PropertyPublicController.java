package com.aaasas.inmobiliaria.property.api;

import com.aaasas.inmobiliaria.property.application.PropertyService;
import com.aaasas.inmobiliaria.shared.pagination.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/public/properties")
@RequiredArgsConstructor
@Tag(name = "Inmuebles (Público)", description = "Consulta pública de inmuebles")
public class PropertyPublicController {

    private final PropertyService propertyService;

    @GetMapping
    @Operation(summary = "Listar inmuebles por proyecto")
    public ResponseEntity<PageResponse<PropertyResponse>> findByProject(
            @RequestParam UUID projectId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(propertyService.findByProject(projectId, page, size));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Detalle de inmueble")
    public ResponseEntity<PropertyResponse> findById(@PathVariable UUID id) {
        return ResponseEntity.ok(propertyService.findById(id));
    }
}
