package com.aaasas.inmobiliaria.lead.api;

import com.aaasas.inmobiliaria.lead.application.LeadService;
import com.aaasas.inmobiliaria.shared.pagination.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/public/leads")
@RequiredArgsConstructor
@Tag(name = "Leads (Público)", description = "Formulario de contacto público")
public class LeadPublicController {

    private final LeadService leadService;

    @PostMapping
    @Operation(summary = "Enviar formulario de contacto")
    public ResponseEntity<LeadResponse> createLead(@Valid @RequestBody CreateLeadRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(leadService.createPublicLead(request));
    }
}
