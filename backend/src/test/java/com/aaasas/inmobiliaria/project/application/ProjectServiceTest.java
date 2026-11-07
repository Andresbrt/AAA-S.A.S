package com.aaasas.inmobiliaria.project.application;

import com.aaasas.inmobiliaria.location.infrastructure.CityRepository;
import com.aaasas.inmobiliaria.project.api.CreateProjectRequest;
import com.aaasas.inmobiliaria.project.api.ProjectDetailResponse;
import com.aaasas.inmobiliaria.project.api.ProjectSummaryResponse;
import com.aaasas.inmobiliaria.project.api.UpdateProjectRequest;
import com.aaasas.inmobiliaria.project.domain.Project;
import com.aaasas.inmobiliaria.project.domain.ProjectStatus;
import com.aaasas.inmobiliaria.project.infrastructure.AmenityRepository;
import com.aaasas.inmobiliaria.project.infrastructure.ProjectRepository;
import com.aaasas.inmobiliaria.project.infrastructure.ProjectSearchRepository;
import com.aaasas.inmobiliaria.shared.pagination.PageResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.lang.reflect.Method;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProjectServiceTest {

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private AmenityRepository amenityRepository;

    @Mock
    private CityRepository cityRepository;

    @Mock
    private ProjectSearchRepository projectSearchRepository;

    private ProjectService projectService;

    @BeforeEach
    void setUp() {
        projectService = new ProjectService(
            projectRepository,
            amenityRepository,
            cityRepository,
            Optional.of(projectSearchRepository)
        );
    }

    @Test
    @DisplayName("create sets custom financial parameters properly when provided")
    void create_withCustomFinancingParameters_persistsAllValues() {
        CreateProjectRequest request = new CreateProjectRequest(
            "Corales del Viento",
            "Condominio campestre a 5 min del mar Caribe",
            "Lotes campestres de lujo",
            "EN_PLANOS",
            new BigDecimal("150000000"),
            new BigDecimal("300000000"),
            LocalDate.of(2027, 12, 31),
            "San Bernardo del Viento, Córdoba",
            new BigDecimal("9.351234"),
            new BigDecimal("-75.951234"),
            "https://maps.google.com/test",
            null,
            null,
            "Lotes en Corales del Viento",
            "Venta de lotes campestres",
            List.of(),
            List.of("Playa", "Naturaleza"),
            true,
            true,
            true,
            new BigDecimal("2000000.00"),
            new BigDecimal("25.00"),
            18,
            36,
            new BigDecimal("1.25")
        );

        when(projectRepository.existsBySlug(anyString())).thenReturn(false);
        when(projectRepository.save(any(Project.class))).thenAnswer(invocation -> {
            Project p = invocation.getArgument(0);
            p.setId(UUID.randomUUID());
            return p;
        });

        ProjectDetailResponse response = projectService.create(request);

        assertThat(response).isNotNull();
        assertThat(response.hasFinancingCalculator()).isTrue();
        assertThat(response.reservationAmount()).isEqualByComparingTo("2000000.00");
        assertThat(response.downPaymentPercentage()).isEqualByComparingTo("25.00");
        assertThat(response.interestFreeMonths()).isEqualTo(18);
        assertThat(response.interestMonths()).isEqualTo(36);
        assertThat(response.monthlyInterestRate()).isEqualByComparingTo("1.25");

        ArgumentCaptor<Project> captor = ArgumentCaptor.forClass(Project.class);
        verify(projectRepository).save(captor.capture());
        Project saved = captor.getValue();
        assertThat(saved.isHasFinancingCalculator()).isTrue();
        assertThat(saved.getReservationAmount()).isEqualByComparingTo("2000000.00");
        assertThat(saved.getDownPaymentPercentage()).isEqualByComparingTo("25.00");
        assertThat(saved.getInterestFreeMonths()).isEqualTo(18);
        assertThat(saved.getInterestMonths()).isEqualTo(36);
        assertThat(saved.getMonthlyInterestRate()).isEqualByComparingTo("1.25");
    }

    @Test
    @DisplayName("create applies standard defaults when financial parameters are null")
    void create_withNullFinancingParameters_appliesDefaultValues() {
        CreateProjectRequest request = new CreateProjectRequest(
            "Lote Campestre",
            "Descripción",
            "Descripción detallada",
            "BORRADOR",
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null
        );

        when(projectRepository.existsBySlug(anyString())).thenReturn(false);
        when(projectRepository.save(any(Project.class))).thenAnswer(invocation -> {
            Project p = invocation.getArgument(0);
            p.setId(UUID.randomUUID());
            return p;
        });

        ProjectDetailResponse response = projectService.create(request);

        assertThat(response).isNotNull();
        assertThat(response.hasFinancingCalculator()).isFalse();
        assertThat(response.reservationAmount()).isEqualByComparingTo("1000000.00");
        assertThat(response.downPaymentPercentage()).isEqualByComparingTo("20.00");
        assertThat(response.interestFreeMonths()).isEqualTo(12);
        assertThat(response.interestMonths()).isEqualTo(24);
        assertThat(response.monthlyInterestRate()).isEqualByComparingTo("1.00");

        ArgumentCaptor<Project> captor = ArgumentCaptor.forClass(Project.class);
        verify(projectRepository).save(captor.capture());
        Project saved = captor.getValue();
        assertThat(saved.isHasFinancingCalculator()).isFalse();
        assertThat(saved.getReservationAmount()).isEqualByComparingTo("1000000.00");
        assertThat(saved.getDownPaymentPercentage()).isEqualByComparingTo("20.00");
        assertThat(saved.getInterestFreeMonths()).isEqualTo(12);
        assertThat(saved.getInterestMonths()).isEqualTo(24);
        assertThat(saved.getMonthlyInterestRate()).isEqualByComparingTo("1.00");
    }

    @Test
    @DisplayName("update modifies financial parameters when provided")
    void update_withCustomFinancingParameters_updatesFields() {
        UUID projectId = UUID.randomUUID();
        Project existing = Project.builder()
            .id(projectId)
            .name("Corales")
            .slug("corales")
            .status(ProjectStatus.EN_PLANOS)
            .hasFinancingCalculator(false)
            .reservationAmount(new BigDecimal("1000000.00"))
            .downPaymentPercentage(new BigDecimal("20.00"))
            .interestFreeMonths(12)
            .interestMonths(24)
            .monthlyInterestRate(new BigDecimal("1.00"))
            .build();

        when(projectRepository.findByIdAndDeletedAtIsNull(projectId)).thenReturn(Optional.of(existing));
        when(projectRepository.save(any(Project.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UpdateProjectRequest request = new UpdateProjectRequest(
            null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,
            true,
            new BigDecimal("1500000.00"),
            new BigDecimal("30.00"),
            18,
            36,
            new BigDecimal("1.50")
        );

        ProjectDetailResponse response = projectService.update(projectId, request);

        assertThat(response.hasFinancingCalculator()).isTrue();
        assertThat(response.reservationAmount()).isEqualByComparingTo("1500000.00");
        assertThat(response.downPaymentPercentage()).isEqualByComparingTo("30.00");
        assertThat(response.interestFreeMonths()).isEqualTo(18);
        assertThat(response.interestMonths()).isEqualTo(36);
        assertThat(response.monthlyInterestRate()).isEqualByComparingTo("1.50");

        assertThat(existing.isHasFinancingCalculator()).isTrue();
        assertThat(existing.getReservationAmount()).isEqualByComparingTo("1500000.00");
        assertThat(existing.getDownPaymentPercentage()).isEqualByComparingTo("30.00");
        assertThat(existing.getInterestFreeMonths()).isEqualTo(18);
        assertThat(existing.getInterestMonths()).isEqualTo(36);
        assertThat(existing.getMonthlyInterestRate()).isEqualByComparingTo("1.50");
    }

    @Test
    @DisplayName("update preserves existing financial parameters when null values are passed")
    void update_withNullFinancingParameters_preservesExistingValues() {
        UUID projectId = UUID.randomUUID();
        Project existing = Project.builder()
            .id(projectId)
            .name("Corales del Viento")
            .slug("corales-del-viento")
            .status(ProjectStatus.EN_PLANOS)
            .hasFinancingCalculator(true)
            .reservationAmount(new BigDecimal("2500000.00"))
            .downPaymentPercentage(new BigDecimal("25.00"))
            .interestFreeMonths(15)
            .interestMonths(30)
            .monthlyInterestRate(new BigDecimal("1.10"))
            .build();

        when(projectRepository.findByIdAndDeletedAtIsNull(projectId)).thenReturn(Optional.of(existing));
        when(projectRepository.save(any(Project.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Use legacy 19-parameter constructor which passes null for financing fields
        UpdateProjectRequest request = new UpdateProjectRequest(
            "Corales del Viento Renombrado", null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null
        );

        ProjectDetailResponse response = projectService.update(projectId, request);

        assertThat(response.name()).isEqualTo("Corales del Viento Renombrado");
        // Financial values preserved
        assertThat(response.hasFinancingCalculator()).isTrue();
        assertThat(response.reservationAmount()).isEqualByComparingTo("2500000.00");
        assertThat(response.downPaymentPercentage()).isEqualByComparingTo("25.00");
        assertThat(response.interestFreeMonths()).isEqualTo(15);
        assertThat(response.interestMonths()).isEqualTo(30);
        assertThat(response.monthlyInterestRate()).isEqualByComparingTo("1.10");

        assertThat(existing.isHasFinancingCalculator()).isTrue();
        assertThat(existing.getReservationAmount()).isEqualByComparingTo("2500000.00");
        assertThat(existing.getDownPaymentPercentage()).isEqualByComparingTo("25.00");
        assertThat(existing.getInterestFreeMonths()).isEqualTo(15);
        assertThat(existing.getInterestMonths()).isEqualTo(30);
        assertThat(existing.getMonthlyInterestRate()).isEqualByComparingTo("1.10");
    }

    @Test
    @DisplayName("findBySlug exposes financial parameters in ProjectDetailResponse")
    void findBySlug_exposesFinancingParametersInDetailResponse() {
        String slug = "corales-del-viento";
        Project project = Project.builder()
            .id(UUID.randomUUID())
            .name("Condominio Campestre Corales del Viento")
            .slug(slug)
            .status(ProjectStatus.EN_PLANOS)
            .hasFinancingCalculator(true)
            .reservationAmount(new BigDecimal("1000000.00"))
            .downPaymentPercentage(new BigDecimal("20.00"))
            .interestFreeMonths(12)
            .interestMonths(24)
            .monthlyInterestRate(new BigDecimal("1.00"))
            .published(true)
            .build();

        when(projectRepository.findBySlugAndDeletedAtIsNullAndPublishedTrue(slug))
            .thenReturn(Optional.of(project));

        ProjectDetailResponse detail = projectService.findBySlug(slug);

        assertThat(detail).isNotNull();
        assertThat(detail.slug()).isEqualTo(slug);
        assertThat(detail.hasFinancingCalculator()).isTrue();
        assertThat(detail.reservationAmount()).isEqualByComparingTo("1000000.00");
        assertThat(detail.downPaymentPercentage()).isEqualByComparingTo("20.00");
        assertThat(detail.interestFreeMonths()).isEqualTo(12);
        assertThat(detail.interestMonths()).isEqualTo(24);
        assertThat(detail.monthlyInterestRate()).isEqualByComparingTo("1.00");
    }

    @Test
    @DisplayName("findPublicProjects exposes financial parameters in ProjectSummaryResponse")
    void findPublicProjects_exposesFinancingParametersInSummaryResponse() {
        Project project = Project.builder()
            .id(UUID.randomUUID())
            .name("Condominio Campestre Corales del Viento")
            .slug("corales-del-viento")
            .status(ProjectStatus.EN_PLANOS)
            .hasFinancingCalculator(true)
            .reservationAmount(new BigDecimal("1000000.00"))
            .downPaymentPercentage(new BigDecimal("20.00"))
            .interestFreeMonths(12)
            .interestMonths(24)
            .monthlyInterestRate(new BigDecimal("1.00"))
            .published(true)
            .build();

        when(projectRepository.findAll(any(Specification.class), any(Pageable.class)))
            .thenReturn(new PageImpl<>(List.of(project)));

        PageResponse<ProjectSummaryResponse> result = projectService.findPublicProjects(
            0, 10, null, null, null, null, null, null
        );

        assertThat(result.content()).hasSize(1);
        ProjectSummaryResponse summary = result.content().get(0);
        assertThat(summary.hasFinancingCalculator()).isTrue();
        assertThat(summary.reservationAmount()).isEqualByComparingTo("1000000.00");
        assertThat(summary.downPaymentPercentage()).isEqualByComparingTo("20.00");
        assertThat(summary.interestFreeMonths()).isEqualTo(12);
        assertThat(summary.interestMonths()).isEqualTo(24);
        assertThat(summary.monthlyInterestRate()).isEqualByComparingTo("1.00");
    }

    @Test
    @DisplayName("verify @CacheEvict annotation configuration on mutations")
    void cacheEvictAnnotations_presentOnMutations() throws Exception {
        List<String> mutatingMethods = List.of("create", "update", "delete", "togglePublish", "toggleFeatured");

        for (String methodName : mutatingMethods) {
            Method method = Arrays.stream(ProjectService.class.getDeclaredMethods())
                .filter(m -> m.getName().equals(methodName))
                .findFirst()
                .orElseThrow(() -> new AssertionError("Method not found: " + methodName));

            CacheEvict cacheEvict = method.getAnnotation(CacheEvict.class);
            assertThat(cacheEvict)
                .withFailMessage("Method %s must be annotated with @CacheEvict", methodName)
                .isNotNull();

            assertThat(cacheEvict.value())
                .containsExactlyInAnyOrder("publicProjects", "featuredProjects", "projectBySlug");
            assertThat(cacheEvict.allEntries()).isTrue();
        }
    }
}
