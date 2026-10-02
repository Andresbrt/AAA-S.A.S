package com.aaasas.inmobiliaria.shared.audit;

import com.aaasas.inmobiliaria.security.CustomUserDetails;
import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

/**
 * Provides the current authenticated user's UUID for JPA auditing fields.
 */
@Component
public class AuditorAwareImpl implements AuditorAware<UUID> {

    @Override
    public Optional<UUID> getCurrentAuditor() {
        return Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication())
            .filter(Authentication::isAuthenticated)
            .map(Authentication::getPrincipal)
            .filter(CustomUserDetails.class::isInstance)
            .map(CustomUserDetails.class::cast)
            .map(CustomUserDetails::getId);
    }
}
