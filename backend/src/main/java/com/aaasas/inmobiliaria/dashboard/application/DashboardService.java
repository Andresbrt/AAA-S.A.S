package com.aaasas.inmobiliaria.dashboard.application;

import com.aaasas.inmobiliaria.dashboard.api.DashboardStatsResponse;
import com.aaasas.inmobiliaria.lead.domain.LeadStatus;
import com.aaasas.inmobiliaria.lead.infrastructure.LeadRepository;
import com.aaasas.inmobiliaria.project.infrastructure.LotRepository;
import com.aaasas.inmobiliaria.project.infrastructure.ProjectRepository;
import com.aaasas.inmobiliaria.property.domain.PropertyStatus;
import com.aaasas.inmobiliaria.property.infrastructure.PropertyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ProjectRepository projectRepository;
    private final PropertyRepository propertyRepository;
    private final LeadRepository leadRepository;
    private final LotRepository lotRepository;

    @Transactional(readOnly = true)
    public DashboardStatsResponse getStats() {
        long activeProjects = projectRepository.countByDeletedAtIsNull();
        long availableProperties = propertyRepository.countByDeletedAtIsNullAndStatus(PropertyStatus.DISPONIBLE);
        long soldProperties = propertyRepository.countByDeletedAtIsNullAndStatus(PropertyStatus.VENDIDO);
        long availableLots = lotRepository.countAvailableLots();
        long soldLots = lotRepository.countSoldLots();
        long newLeads = leadRepository.countByStatus(LeadStatus.NUEVO);

        return new DashboardStatsResponse(
            activeProjects,
            availableProperties + availableLots,
            soldProperties + soldLots,
            newLeads
        );
    }
}
