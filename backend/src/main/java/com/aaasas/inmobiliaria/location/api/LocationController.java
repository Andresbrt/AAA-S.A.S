package com.aaasas.inmobiliaria.location.api;

import com.aaasas.inmobiliaria.location.application.LocationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/public/locations")
@RequiredArgsConstructor
@Tag(name = "Ubicaciones (Público)", description = "Catálogos de departamentos y ciudades")
public class LocationController {

    private final LocationService locationService;

    @GetMapping("/departments")
    @Operation(summary = "Listar departamentos")
    public ResponseEntity<List<DepartmentResponse>> getDepartments() {
        return ResponseEntity.ok(locationService.findAllDepartments());
    }

    @GetMapping("/cities")
    @Operation(summary = "Listar ciudades", description = "Opcionalmente filtrar por departamento")
    public ResponseEntity<List<CityResponse>> getCities(
            @RequestParam(required = false) UUID departmentId) {
        return ResponseEntity.ok(locationService.findCities(departmentId));
    }
}
