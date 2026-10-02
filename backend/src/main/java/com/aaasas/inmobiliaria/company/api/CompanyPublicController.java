package com.aaasas.inmobiliaria.company.api;

import com.aaasas.inmobiliaria.company.application.CompanyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/public/company")
@RequiredArgsConstructor
@Tag(name = "Empresa (Público)", description = "Información corporativa pública")
public class CompanyPublicController {

    private final CompanyService companyService;

    @GetMapping
    @Operation(summary = "Obtener información de la empresa y equipo")
    public ResponseEntity<CompanyPublicResponse> getCompanyInfo() {
        return ResponseEntity.ok(companyService.getPublicInfo());
    }
}
