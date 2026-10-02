package com.aaasas.inmobiliaria.auth;

import com.aaasas.inmobiliaria.AbstractIntegrationTest;
import com.aaasas.inmobiliaria.auth.api.LoginRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("POST /api/v1/auth/login — success with admin user")
    void login_success() throws Exception {
        LoginRequest request = new LoginRequest("admin@test.com", "TestPassword123!");

        mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.accessToken").isNotEmpty())
            .andExpect(jsonPath("$.refreshToken").isNotEmpty())
            .andExpect(jsonPath("$.tokenType").value("Bearer"));
    }

    @Test
    @DisplayName("POST /api/v1/auth/login — invalid credentials returns 401")
    void login_invalidCredentials() throws Exception {
        LoginRequest request = new LoginRequest("admin@test.com", "wrong-password");

        mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("POST /api/v1/auth/login — non-existent user returns 401")
    void login_nonExistentUser() throws Exception {
        LoginRequest request = new LoginRequest("nobody@test.com", "password");

        mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("POST /api/v1/auth/login — missing email returns 400")
    void login_missingEmail() throws Exception {
        mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"password\":\"test\"}"))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /api/v1/auth/refresh — invalid token returns 401")
    void refresh_invalidToken() throws Exception {
        mockMvc.perform(post("/api/v1/auth/refresh")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"refreshToken\":\"invalid-token\"}"))
            .andExpect(status().isUnauthorized());
    }
}
