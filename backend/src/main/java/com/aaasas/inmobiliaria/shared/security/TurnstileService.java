package com.aaasas.inmobiliaria.shared.security;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

import java.util.List;

@Service
public class TurnstileService {

    private static final Logger log = LoggerFactory.getLogger(TurnstileService.class);
    private static final String TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

    private final String secretKey;
    private final RestClient restClient;

    public TurnstileService(@Value("${app.turnstile.secret-key:}") String secretKey) {
        this.secretKey = secretKey != null ? secretKey.trim() : "";
        this.restClient = RestClient.builder().build();
    }

    public boolean verify(String token, String remoteIp) {
        // En desarrollo local o pruebas, si la clave secreta no está configurada o se usa bypass
        if (secretKey.isBlank()) {
            log.debug("Turnstile secret key is not configured. Permitting request in dev/local mode.");
            return true;
        }

        if ("bypass-test".equalsIgnoreCase(token)) {
            log.debug("Bypass test token detected. Permitting request.");
            return true;
        }

        if (token == null || token.isBlank()) {
            log.warn("Turnstile verification failed: Empty or missing token.");
            return false;
        }

        try {
            MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
            formData.add("secret", secretKey);
            formData.add("response", token);
            if (remoteIp != null && !remoteIp.isBlank()) {
                formData.add("remoteip", remoteIp);
            }

            TurnstileResponse response = restClient.post()
                .uri(TURNSTILE_VERIFY_URL)
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(formData)
                .retrieve()
                .body(TurnstileResponse.class);

            if (response != null && response.isSuccess()) {
                log.debug("Turnstile captcha verification succeeded.");
                return true;
            } else {
                log.warn("Turnstile captcha verification rejected: {}", 
                    response != null ? response.getErrorCodes() : "null response");
                return false;
            }
        } catch (Exception e) {
            log.error("Error communicating with Cloudflare Turnstile service: {}", e.getMessage());
            // Si hay fallo de red hacia Cloudflare, permitir o rechazar según política de resiliencia
            return false;
        }
    }

    @Getter
    @Setter
    public static class TurnstileResponse {
        private boolean success;
        @JsonProperty("error-codes")
        private List<String> errorCodes;
        private String challenge_ts;
        private String hostname;
    }
}
