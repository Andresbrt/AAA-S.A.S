package com.aaasas.inmobiliaria.project;

import com.aaasas.inmobiliaria.AbstractIntegrationTest;
import com.aaasas.inmobiliaria.auth.api.LoginRequest;
import com.aaasas.inmobiliaria.project.api.CreateProjectRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.math.BigDecimal;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class ProjectControllerIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String adminToken;

    @BeforeEach
    void setUp() throws Exception {
        LoginRequest loginRequest = new LoginRequest("admin@test.com", "TestPassword123!");
        MvcResult result = mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
            .andReturn();

        String response = result.getResponse().getContentAsString();
        adminToken = objectMapper.readTree(response).get("accessToken").asText();
    }

    @Test
    @DisplayName("GET /api/v1/public/projects — returns paginated projects")
    void publicProjects_returnsPaginated() throws Exception {
        mockMvc.perform(get("/api/v1/public/projects"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.content").isArray())
            .andExpect(jsonPath("$.page").value(0))
            .andExpect(jsonPath("$.totalElements").isNumber());
    }

    @Test
    @DisplayName("POST /api/v1/admin/projects — creates project with admin token")
    void createProject_withAuth() throws Exception {
        CreateProjectRequest request = new CreateProjectRequest(
            "Proyecto Test", "Descripción corta", "Descripción larga",
            "BORRADOR", new BigDecimal("200000000"), new BigDecimal("500000000"),
            null, "Calle 100 #45-67", null, null, null, null, null,
            "Proyecto Test | AAA S.A.S.", "Descripción SEO del proyecto test", List.of(), List.of(), false, true
        );

        mockMvc.perform(post("/api/v1/admin/projects")
                .header("Authorization", "Bearer " + adminToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.name").value("Proyecto Test"))
            .andExpect(jsonPath("$.slug").value("proyecto-test"))
            .andExpect(jsonPath("$.status").value("BORRADOR"));
    }

    @Test
    @DisplayName("POST /api/v1/admin/projects — fails without auth")
    void createProject_withoutAuth_returns401or403() throws Exception {
        mockMvc.perform(post("/api/v1/admin/projects")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"Test\"}"))
            .andExpect(status().is4xxClientError());
    }

    @Test
    @DisplayName("GET /api/v1/public/projects/featured — returns featured list")
    void featuredProjects_returnsList() throws Exception {
        mockMvc.perform(get("/api/v1/public/projects/featured"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray());
    }

    @Test
    @DisplayName("GET /api/v1/public/projects/{slug} — non-existent returns 404")
    void projectBySlug_notFound() throws Exception {
        mockMvc.perform(get("/api/v1/public/projects/non-existent-slug"))
            .andExpect(status().isNotFound());
    }
}
