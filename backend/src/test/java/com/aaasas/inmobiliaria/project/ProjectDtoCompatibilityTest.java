package com.aaasas.inmobiliaria.project;

import com.aaasas.inmobiliaria.project.api.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class ProjectDtoCompatibilityTest {

    private ObjectMapper objectMapper;
    private Validator validator;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    @DisplayName("CreateProjectRequest: deserializes from legacy 19-field JSON with null financing values")
    void createProjectRequest_deserializesFromLegacyJson() throws Exception {
        String legacyJson = """
            {
                "name": "Condominio Brisas",
                "shortDescription": "Lotes campestres",
                "longDescription": "Lotes campestres de ensueño",
                "status": "EN_PLANOS",
                "minPrice": 120000000,
                "maxPrice": 250000000,
                "estimatedDelivery": "2026-12-31",
                "address": "Km 5 via al mar",
                "latitude": 9.3512,
                "longitude": -75.9512,
                "mapUrl": "https://maps.google.com/brisas",
                "metaTitle": "Brisas del Mar",
                "metaDescription": "Lotes frente al mar",
                "tags": ["Playa", "Brisa"],
                "featured": false,
                "published": true
            }
            """;

        CreateProjectRequest request = objectMapper.readValue(legacyJson, CreateProjectRequest.class);

        assertThat(request.name()).isEqualTo("Condominio Brisas");
        assertThat(request.hasFinancingCalculator()).isNull();
        assertThat(request.reservationAmount()).isNull();
        assertThat(request.downPaymentPercentage()).isNull();
        assertThat(request.interestFreeMonths()).isNull();
        assertThat(request.interestMonths()).isNull();
        assertThat(request.monthlyInterestRate()).isNull();
    }

    @Test
    @DisplayName("CreateProjectRequest: deserializes from full 25-field JSON with financing parameters")
    void createProjectRequest_deserializesFromFullJson() throws Exception {
        String fullJson = """
            {
                "name": "Corales del Viento",
                "status": "EN_PLANOS",
                "hasFinancingCalculator": true,
                "reservationAmount": 1000000.00,
                "downPaymentPercentage": 20.00,
                "interestFreeMonths": 12,
                "interestMonths": 24,
                "monthlyInterestRate": 1.00
            }
            """;

        CreateProjectRequest request = objectMapper.readValue(fullJson, CreateProjectRequest.class);

        assertThat(request.name()).isEqualTo("Corales del Viento");
        assertThat(request.hasFinancingCalculator()).isTrue();
        assertThat(request.reservationAmount()).isEqualByComparingTo("1000000.00");
        assertThat(request.downPaymentPercentage()).isEqualByComparingTo("20.00");
        assertThat(request.interestFreeMonths()).isEqualTo(12);
        assertThat(request.interestMonths()).isEqualTo(24);
        assertThat(request.monthlyInterestRate()).isEqualByComparingTo("1.00");
    }

    @Test
    @DisplayName("CreateProjectRequest: validates invalid financial inputs (negative rates, >100% down payment)")
    void createProjectRequest_validationConstraints() {
        CreateProjectRequest invalidRequest = new CreateProjectRequest(
            "Proyecto Invalido", null, null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null, null,
            true,
            new BigDecimal("-500000"), // invalid negative
            new BigDecimal("150.00"),  // invalid > 100%
            -5,                        // invalid negative
            -12,                       // invalid negative
            new BigDecimal("-1.5")     // invalid negative
        );

        var violations = validator.validate(invalidRequest);
        assertThat(violations).hasSize(5);
    }

    @Test
    @DisplayName("UpdateProjectRequest: preserves nulls when financing fields omitted")
    void updateProjectRequest_deserializesWithNullFinancingFields() throws Exception {
        String updateJson = """
            {
                "name": "Nombre Actualizado"
            }
            """;

        UpdateProjectRequest request = objectMapper.readValue(updateJson, UpdateProjectRequest.class);

        assertThat(request.name()).isEqualTo("Nombre Actualizado");
        assertThat(request.hasFinancingCalculator()).isNull();
        assertThat(request.reservationAmount()).isNull();
        assertThat(request.downPaymentPercentage()).isNull();
    }

    @Test
    @DisplayName("ProjectDetailResponse: serializes and formats JSON correctly")
    void projectDetailResponse_serializesToJson() throws Exception {
        ProjectDetailResponse detail = new ProjectDetailResponse(
            UUID.randomUUID(), "Corales del Viento", "corales-del-viento",
            "Resumen", "Descripción", "EN_PLANOS",
            new BigDecimal("150000000"), new BigDecimal("350000000"),
            LocalDate.of(2027, 6, 30), "San Bernardo",
            new BigDecimal("9.35"), new BigDecimal("-75.95"), "https://map.url",
            true, true, "SEO Title", "SEO Desc", "San Bernardo", "Córdoba",
            "https://img.jpg", "https://banner.jpg", "https://logo.png", "https://brochure.pdf",
            List.of("https://gal1.jpg"), List.of(), List.of("Playa"),
            true,
            new BigDecimal("1000000.00"),
            new BigDecimal("20.00"),
            12,
            24,
            new BigDecimal("1.00")
        );

        String json = objectMapper.writeValueAsString(detail);
        JsonNode root = objectMapper.readTree(json);

        assertThat(root.get("hasFinancingCalculator").asBoolean()).isTrue();
        assertThat(root.get("reservationAmount").asDouble()).isEqualTo(1000000.00);
        assertThat(root.get("downPaymentPercentage").asDouble()).isEqualTo(20.00);
        assertThat(root.get("interestFreeMonths").asInt()).isEqualTo(12);
        assertThat(root.get("interestMonths").asInt()).isEqualTo(24);
        assertThat(root.get("monthlyInterestRate").asDouble()).isEqualTo(1.00);
    }

    @Test
    @DisplayName("ProjectSummaryResponse: serializes and formats JSON correctly")
    void projectSummaryResponse_serializesToJson() throws Exception {
        ProjectSummaryResponse summary = new ProjectSummaryResponse(
            UUID.randomUUID(), "Corales del Viento", "corales-del-viento", "Resumen",
            "EN_PLANOS", new BigDecimal("150000000"), new BigDecimal("350000000"),
            "San Bernardo", "Córdoba", true, "SEO Title", LocalDate.of(2027, 6, 30),
            "https://map.url", "https://main.jpg", "https://banner.jpg", "https://logo.png",
            "https://brochure.pdf", List.of(), List.of("Playa"),
            true,
            new BigDecimal("1000000.00"),
            new BigDecimal("20.00"),
            12,
            24,
            new BigDecimal("1.00")
        );

        String json = objectMapper.writeValueAsString(summary);
        JsonNode root = objectMapper.readTree(json);

        assertThat(root.get("hasFinancingCalculator").asBoolean()).isTrue();
        assertThat(root.get("reservationAmount").asDouble()).isEqualTo(1000000.00);
        assertThat(root.get("downPaymentPercentage").asDouble()).isEqualTo(20.00);
        assertThat(root.get("interestFreeMonths").asInt()).isEqualTo(12);
        assertThat(root.get("interestMonths").asInt()).isEqualTo(24);
        assertThat(root.get("monthlyInterestRate").asDouble()).isEqualTo(1.00);
    }

    @Test
    @DisplayName("Backwards compatibility: 19-arg constructors produce valid defaults")
    void backwardsCompatibilityConstructors_produceValidDefaults() {
        CreateProjectRequest createReq = new CreateProjectRequest(
            "Legacy", null, null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null, null
        );
        assertThat(createReq.hasFinancingCalculator()).isFalse();
        assertThat(createReq.reservationAmount()).isEqualByComparingTo("1000000.00");
        assertThat(createReq.downPaymentPercentage()).isEqualByComparingTo("20.00");
        assertThat(createReq.interestFreeMonths()).isEqualTo(12);
        assertThat(createReq.interestMonths()).isEqualTo(24);
        assertThat(createReq.monthlyInterestRate()).isEqualByComparingTo("1.00");

        UpdateProjectRequest updateReq = new UpdateProjectRequest(
            "Legacy", null, null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null, null
        );
        assertThat(updateReq.hasFinancingCalculator()).isNull();
        assertThat(updateReq.reservationAmount()).isNull();

        ProjectDetailResponse detailResp = new ProjectDetailResponse(
            UUID.randomUUID(), "Legacy", "legacy", null, null, "BORRADOR",
            null, null, null, null, null, null, null, false, false,
            null, null, null, null, null, null, null, null, List.of(), List.of(), List.of()
        );
        assertThat(detailResp.hasFinancingCalculator()).isFalse();
        assertThat(detailResp.reservationAmount()).isEqualByComparingTo("1000000.00");

        ProjectSummaryResponse summaryResp = new ProjectSummaryResponse(
            UUID.randomUUID(), "Legacy", "legacy", null, "BORRADOR",
            null, null, null, null, false, null, null, null, null, null, null, null, List.of(), List.of()
        );
        assertThat(summaryResp.hasFinancingCalculator()).isFalse();
        assertThat(summaryResp.reservationAmount()).isEqualByComparingTo("1000000.00");
    }
}
