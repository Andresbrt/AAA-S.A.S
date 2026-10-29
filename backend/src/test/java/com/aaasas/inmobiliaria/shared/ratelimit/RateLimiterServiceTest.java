package com.aaasas.inmobiliaria.shared.ratelimit;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class RateLimiterServiceTest {

    private RateLimiterService rateLimiterService;

    @BeforeEach
    void setUp() {
        // Capacity: 3 tokens, refill: 1 per 60 seconds for quick testing
        rateLimiterService = new RateLimiterService(
            3, 1, 60,
            2, 1, 60,
            2, 1, 60
        );
    }

    @Test
    @DisplayName("Login limit allows requests up to capacity and rejects subsequent ones")
    void loginRateLimit_exhaustion() {
        String testIp = "192.168.1.100";

        assertTrue(rateLimiterService.tryConsumeLogin(testIp), "1st attempt should be allowed");
        assertTrue(rateLimiterService.tryConsumeLogin(testIp), "2nd attempt should be allowed");
        assertTrue(rateLimiterService.tryConsumeLogin(testIp), "3rd attempt should be allowed");

        // 4th attempt exceeds capacity 3
        assertFalse(rateLimiterService.tryConsumeLogin(testIp), "4th attempt should be blocked by rate limit");

        // Different IP should still have its own fresh capacity
        String otherIp = "192.168.1.101";
        assertTrue(rateLimiterService.tryConsumeLogin(otherIp), "Different IP should not be blocked");
    }

    @Test
    @DisplayName("Lead limit enforces lead-specific capacity")
    void leadRateLimit_exhaustion() {
        String testIp = "10.0.0.5";

        assertTrue(rateLimiterService.tryConsumeLead(testIp));
        assertTrue(rateLimiterService.tryConsumeLead(testIp));
        assertFalse(rateLimiterService.tryConsumeLead(testIp), "3rd lead attempt should exceed limit of 2");
    }

    @Test
    @DisplayName("Brochure limit enforces brochure-specific capacity")
    void brochureRateLimit_exhaustion() {
        String testIp = "172.16.0.2";

        assertTrue(rateLimiterService.tryConsumeBrochure(testIp));
        assertTrue(rateLimiterService.tryConsumeBrochure(testIp));
        assertFalse(rateLimiterService.tryConsumeBrochure(testIp), "3rd brochure download should exceed limit of 2");
    }
}
