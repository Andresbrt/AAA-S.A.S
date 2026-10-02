package com.aaasas.inmobiliaria.dashboard.api;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/dashboard")
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
public class DashboardController {

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(Map.of(
            "activeProjects", 12,
            "availableLots", 45,
            "newLeads", 8,
            "soldLots", 134
        ));
    }
}
