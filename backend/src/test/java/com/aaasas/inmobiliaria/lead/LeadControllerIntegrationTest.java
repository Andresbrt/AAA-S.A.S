package com.aaasas.inmobiliaria.lead;

import com.aaasas.inmobiliaria.AbstractIntegrationTest;
import com.aaasas.inmobiliaria.lead.api.CreateLeadRequest;
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
class LeadControllerIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("POST /api/v1/public/leads — creates lead successfully")
    void createLead_success() throws Exception {
        CreateLeadRequest request = new CreateLeadRequest(
            "Juan Pérez", "juan@example.com", "+573001234567",
            "Estoy interesado en el proyecto", "web", null, true, null
        );

        mockMvc.perform(post("/api/v1/public/leads")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.fullName").value("Juan Pérez"))
            .andExpect(jsonPath("$.status").value("NUEVO"));
    }

    @Test
    @DisplayName("POST /api/v1/public/leads — rejects without data consent")
    void createLead_noConsent() throws Exception {
        CreateLeadRequest request = new CreateLeadRequest(
            "Juan Pérez", "juan@example.com", null, "Mensaje", "web", null, false, null
        );

        mockMvc.perform(post("/api/v1/public/leads")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /api/v1/public/leads — honeypot rejects spam")
    void createLead_honeypotTriggered() throws Exception {
        CreateLeadRequest request = new CreateLeadRequest(
            "Bot", "bot@spam.com", null, "spam", "web", null, true, "filled-by-bot"
        );

        mockMvc.perform(post("/api/v1/public/leads")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isUnprocessableEntity());
    }

    @Test
    @DisplayName("POST /api/v1/public/leads — missing name returns 400")
    void createLead_missingName() throws Exception {
        mockMvc.perform(post("/api/v1/public/leads")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"test@test.com\",\"dataConsent\":true}"))
            .andExpect(status().isBadRequest());
    }
}
