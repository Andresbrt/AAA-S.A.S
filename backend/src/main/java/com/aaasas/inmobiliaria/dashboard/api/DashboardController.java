package com.aaasas.inmobiliaria.dashboard.api;

import com.aaasas.inmobiliaria.lead.domain.LeadStatus;
import com.aaasas.inmobiliaria.lead.infrastructure.LeadRepository;
import com.aaasas.inmobiliaria.project.infrastructure.LotRepository;
import com.aaasas.inmobiliaria.project.infrastructure.ProjectRepository;
import com.aaasas.inmobiliaria.property.domain.PropertyStatus;
import com.aaasas.inmobiliaria.property.infrastructure.PropertyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/dashboard")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
public class DashboardController {

    private final ProjectRepository projectRepository;
    private final PropertyRepository propertyRepository;
    private final LeadRepository leadRepository;
    private final LotRepository lotRepository;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        long activeProjects = projectRepository.countByDeletedAtIsNull();
        long availableProperties = propertyRepository.countByDeletedAtIsNullAndStatus(PropertyStatus.DISPONIBLE);
        long soldProperties = propertyRepository.countByDeletedAtIsNullAndStatus(PropertyStatus.VENDIDO);
        long availableLots = lotRepository.countAvailableLots();
        long soldLots = lotRepository.countSoldLots();
        long newLeads = leadRepository.countByStatus(LeadStatus.NUEVO);

        return ResponseEntity.ok(Map.of(
            "activeProjects", activeProjects,
            "availableLots", availableProperties + availableLots,
            "soldLots", soldProperties + soldLots,
            "newLeads", newLeads
        ));
    }
}
