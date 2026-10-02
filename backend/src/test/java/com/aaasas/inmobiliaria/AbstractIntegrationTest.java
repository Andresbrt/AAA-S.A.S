package com.aaasas.inmobiliaria;

import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

/**
 * Base test class with PostgreSQL Testcontainer.
 * All integration tests should extend this class.
 */
@Testcontainers
public abstract class AbstractIntegrationTest {

    @Container
    static final PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine")
        .withDatabaseName("test_db")
        .withUsername("test")
        .withPassword("test");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
        registry.add("spring.flyway.enabled", () -> true);
        registry.add("app.jwt.secret", () -> "test-secret-key-for-unit-tests-must-be-at-least-256-bits-long-for-hmac-sha");
        registry.add("app.admin.email", () -> "admin@test.com");
        registry.add("app.admin.password", () -> "TestPassword123!");
        registry.add("app.admin.name", () -> "Test Admin");
        registry.add("app.cors.allowed-origins", () -> "http://localhost:3000");
        registry.add("app.storage.provider", () -> "s3");
    }
}
