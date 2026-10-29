package com.aaasas.inmobiliaria.shared.security;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class TurnstileServiceTest {

    @Test
    @DisplayName("TurnstileService bypasses verification when secretKey is not configured (dev/local)")
    void verify_bypassesWhenSecretKeyIsBlank() {
        TurnstileService service = new TurnstileService("");
        assertTrue(service.verify("any-token", "127.0.0.1"), "Should permit all tokens when secretKey is unconfigured");
        assertTrue(service.verify(null, "127.0.0.1"), "Should permit even null token when secretKey is unconfigured");
    }

    @Test
    @DisplayName("TurnstileService permits 'bypass-test' token even when secretKey is set")
    void verify_permitsBypassTestToken() {
        TurnstileService service = new TurnstileService("mock-secret-key-12345");
        assertTrue(service.verify("bypass-test", "127.0.0.1"), "Should permit bypass-test token");
        assertTrue(service.verify("BYPASS-TEST", "127.0.0.1"), "Should permit bypass-test case-insensitively");
    }

    @Test
    @DisplayName("TurnstileService rejects null or blank token when secretKey is configured")
    void verify_rejectsNullOrBlankWhenConfigured() {
        TurnstileService service = new TurnstileService("mock-secret-key-12345");
        assertFalse(service.verify(null, "127.0.0.1"), "Should reject null token");
        assertFalse(service.verify("", "127.0.0.1"), "Should reject empty token");
        assertFalse(service.verify("   ", "127.0.0.1"), "Should reject blank token");
    }
}
