package com.aaasas.inmobiliaria.shared.ratelimit;

import com.aaasas.inmobiliaria.shared.exception.RateLimitExceededException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
@RequiredArgsConstructor
public class RateLimitInterceptor implements HandlerInterceptor {

    private static final Logger log = LoggerFactory.getLogger(RateLimitInterceptor.class);
    private final RateLimiterService rateLimiterService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String clientIp = extractClientIp(request);
        String uri = request.getRequestURI();
        String method = request.getMethod();

        // Rate limit for authentication endpoints (login, MFA, refresh)
        if (uri.startsWith("/api/v1/auth/") && "POST".equalsIgnoreCase(method)) {
            if (!rateLimiterService.tryConsumeLogin(clientIp)) {
                log.warn("Rate limit exceeded for auth endpoints from IP: {}", clientIp);
                throw new RateLimitExceededException();
            }
        }

        // Rate limit for public lead creation
        if (uri.equals("/api/v1/public/leads") && "POST".equalsIgnoreCase(method)) {
            if (!rateLimiterService.tryConsumeLead(clientIp)) {
                log.warn("Rate limit exceeded for public leads from IP: {}", clientIp);
                throw new RateLimitExceededException();
            }
        }

        // Rate limit for brochure generation (PDF on the fly)
        if (uri.contains("/brochure") && "GET".equalsIgnoreCase(method)) {
            if (!rateLimiterService.tryConsumeBrochure(clientIp)) {
                log.warn("Rate limit exceeded for brochure download from IP: {}", clientIp);
                throw new RateLimitExceededException();
            }
        }

        return true;
    }

    private String extractClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isBlank()) {
            return xForwardedFor.split(",")[0].trim();
        }
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isBlank()) {
            return xRealIp.trim();
        }
        return request.getRemoteAddr();
    }
}
