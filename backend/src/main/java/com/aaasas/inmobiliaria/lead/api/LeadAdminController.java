package com.aaasas.inmobiliaria.lead.api;

import com.aaasas.inmobiliaria.lead.application.LeadService;
import com.aaasas.inmobiliaria.lead.api.UpdateLeadCrmRequest;
import com.aaasas.inmobiliaria.shared.pagination.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/leads")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
@Tag(name = "Leads (Admin)", description = "Gestión de leads/contactos")
public class LeadAdminController {

    private final LeadService leadService;

    @GetMapping
    @Operation(summary = "Listar leads con filtros")
    public ResponseEntity<PageResponse<LeadResponse>> findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(leadService.findAll(page, size, status));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Actualizar estado de un lead")
    public ResponseEntity<Void> updateStatus(@PathVariable UUID id, @RequestParam String status) {
        leadService.updateStatus(id, status);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/crm")
    @Operation(summary = "Actualizar detalles de CRM de un lead (asignación, notas, estado)")
    public ResponseEntity<LeadResponse> updateCrmDetails(@PathVariable UUID id, @RequestBody UpdateLeadCrmRequest request) {
        return ResponseEntity.ok(leadService.updateCrmDetails(id, request));
    }
}
