package com.aaasas.inmobiliaria.company.api;

import com.aaasas.inmobiliaria.company.application.CompanyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/company")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'EDITOR')")
@Tag(name = "Empresa (Admin)", description = "Gestión administrativa de la información corporativa")
public class CompanyAdminController {

    private final CompanyService companyService;

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar información de la empresa")
    public ResponseEntity<CompanyInfoResponse> updateCompanyInfo(
            @PathVariable UUID id,
            @RequestBody CompanyInfoResponse request) {
        return ResponseEntity.ok(companyService.updateCompanyInfo(id, request));
    }
}
