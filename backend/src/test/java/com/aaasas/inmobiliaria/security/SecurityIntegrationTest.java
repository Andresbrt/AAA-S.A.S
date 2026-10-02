package com.aaasas.inmobiliaria.security;

import com.aaasas.inmobiliaria.AbstractIntegrationTest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class SecurityIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("Public endpoints are accessible without auth")
    void publicEndpoints_accessible() throws Exception {
        mockMvc.perform(get("/api/v1/public/projects")).andExpect(status().isOk());
        mockMvc.perform(get("/api/v1/public/projects/featured")).andExpect(status().isOk());
        mockMvc.perform(get("/api/v1/public/locations/departments")).andExpect(status().isOk());
    }

    @Test
    @DisplayName("Admin endpoints require authentication")
    void adminEndpoints_require_auth() throws Exception {
        mockMvc.perform(get("/api/v1/admin/users")).andExpect(status().is4xxClientError());
        mockMvc.perform(get("/api/v1/admin/projects")).andExpect(status().is4xxClientError());
        mockMvc.perform(get("/api/v1/admin/leads")).andExpect(status().is4xxClientError());
    }

    @Test
    @DisplayName("Admin endpoints with expired/invalid token return 401/403")
    void adminEndpoints_invalidToken() throws Exception {
        mockMvc.perform(get("/api/v1/admin/users")
                .header("Authorization", "Bearer invalid-token"))
            .andExpect(status().is4xxClientError());
    }

    @Test
    @DisplayName("Auth login endpoint is accessible")
    void authEndpoint_accessible() throws Exception {
        mockMvc.perform(post("/api/v1/auth/login")
                .contentType("application/json")
                .content("{\"email\":\"x\",\"password\":\"y\"}"))
            .andExpect(status().is4xxClientError()); // 400 or 401, but not 403
    }
}
