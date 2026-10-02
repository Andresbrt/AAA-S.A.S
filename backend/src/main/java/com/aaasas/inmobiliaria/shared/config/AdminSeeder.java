package com.aaasas.inmobiliaria.shared.config;

import com.aaasas.inmobiliaria.user.domain.Role;
import com.aaasas.inmobiliaria.user.domain.User;
import com.aaasas.inmobiliaria.user.infrastructure.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Seeds the initial SUPER_ADMIN user from environment variables on first startup.
 * Password is NEVER hardcoded — must be provided via ADMIN_PASSWORD env var.
 */
@Configuration
@RequiredArgsConstructor
public class AdminSeeder {

    private static final Logger log = LoggerFactory.getLogger(AdminSeeder.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.email}")
    private String adminEmail;

    @Value("${app.admin.password}")
    private String adminPassword;

    @Value("${app.admin.name}")
    private String adminName;

    @Bean
    public ApplicationRunner seedAdmin() {
        return args -> {
            if (adminPassword == null || adminPassword.isBlank()) {
                log.warn("ADMIN_PASSWORD not set. Skipping admin seed.");
                return;
            }

            if (userRepository.existsByEmail(adminEmail)) {
                log.info("Admin user already exists: {}", adminEmail);
                return;
            }

            User admin = User.builder()
                .email(adminEmail)
                .password(passwordEncoder.encode(adminPassword))
                .name(adminName)
                .role(Role.SUPER_ADMIN)
                .active(true)
                .build();

            userRepository.save(admin);
            log.info("Admin user created: {}", adminEmail);
        };
    }
}
