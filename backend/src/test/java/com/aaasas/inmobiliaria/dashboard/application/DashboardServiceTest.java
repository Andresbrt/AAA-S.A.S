package com.aaasas.inmobiliaria.dashboard.application;

import com.aaasas.inmobiliaria.dashboard.api.DashboardStatsResponse;
import com.aaasas.inmobiliaria.lead.domain.LeadStatus;
import com.aaasas.inmobiliaria.lead.infrastructure.LeadRepository;
import com.aaasas.inmobiliaria.project.infrastructure.LotRepository;
import com.aaasas.inmobiliaria.project.infrastructure.ProjectRepository;
import com.aaasas.inmobiliaria.property.domain.PropertyStatus;
import com.aaasas.inmobiliaria.property.infrastructure.PropertyRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DashboardServiceTest {

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private PropertyRepository propertyRepository;

    @Mock
    private LeadRepository leadRepository;

    @Mock
    private LotRepository lotRepository;

    @InjectMocks
    private DashboardService dashboardService;

    @Test
    @DisplayName("getStats aggregates counts correctly from all modules")
    void getStats_aggregatesCorrectly() {
        when(projectRepository.countByDeletedAtIsNull()).thenReturn(3L);
        when(propertyRepository.countByDeletedAtIsNullAndStatus(PropertyStatus.DISPONIBLE)).thenReturn(5L);
        when(propertyRepository.countByDeletedAtIsNullAndStatus(PropertyStatus.VENDIDO)).thenReturn(2L);
        when(lotRepository.countAvailableLots()).thenReturn(10L);
        when(lotRepository.countSoldLots()).thenReturn(4L);
        when(leadRepository.countByStatus(LeadStatus.NUEVO)).thenReturn(8L);

        DashboardStatsResponse response = dashboardService.getStats();

        assertEquals(3L, response.activeProjects());
        assertEquals(15L, response.availableLots()); // 5 properties + 10 lots
        assertEquals(6L, response.soldLots());       // 2 properties + 4 lots
        assertEquals(8L, response.newLeads());
    }
}
