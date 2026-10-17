package com.aaasas.inmobiliaria.security.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class JwtProvider {

    private static final Logger log = LoggerFactory.getLogger(JwtProvider.class);

    private final JwtProperties jwtProperties;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtProperties.secret().getBytes(StandardCharsets.UTF_8));
    }

    public static final String CLAIM_TOKEN_TYPE = "token_type";
    public static final String TYPE_ACCESS = "access";
    public static final String TYPE_MFA = "mfa";
    private static final long MFA_TOKEN_EXPIRATION_MS = 5 * 60 * 1000; // 5 minutos

    public String generateAccessToken(UUID userId, String email, String role) {
        return Jwts.builder()
            .subject(userId.toString())
            .claim("email", email)
            .claim("role", role)
            .claim(CLAIM_TOKEN_TYPE, TYPE_ACCESS)
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + jwtProperties.accessTokenExpirationMs()))
            .signWith(getSigningKey())
            .compact();
    }

    /**
     * Token de corta duración emitido tras validar la contraseña cuando el usuario tiene MFA.
     * NO sirve como token de acceso: solo se acepta en /auth/mfa/verify.
     */
    public String generateMfaToken(UUID userId) {
        return Jwts.builder()
            .subject(userId.toString())
            .claim(CLAIM_TOKEN_TYPE, TYPE_MFA)
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + MFA_TOKEN_EXPIRATION_MS))
            .signWith(getSigningKey())
            .compact();
    }

    /** Devuelve el userId si el token es un token MFA válido y vigente. */
    public Optional<UUID> parseMfaToken(String token) {
        if (token == null || !validateToken(token)) return Optional.empty();
        Claims claims = parseClaims(token);
        if (!TYPE_MFA.equals(claims.get(CLAIM_TOKEN_TYPE, String.class))) return Optional.empty();
        return Optional.of(UUID.fromString(claims.getSubject()));
    }

    /** Solo los tokens de tipo "access" autentican peticiones. */
    public boolean isAccessToken(String token) {
        return TYPE_ACCESS.equals(parseClaims(token).get(CLAIM_TOKEN_TYPE, String.class));
    }

    public String generateRefreshToken() {
        return UUID.randomUUID().toString();
    }

    public String getUserIdFromToken(String token) {
        return parseClaims(token).getSubject();
    }

    public String getEmailFromToken(String token) {
        return parseClaims(token).get("email", String.class);
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token);
            return true;
        } catch (SecurityException ex) {
            log.warn("Invalid JWT signature");
        } catch (MalformedJwtException ex) {
            log.warn("Malformed JWT token");
        } catch (ExpiredJwtException ex) {
            log.warn("Expired JWT token");
        } catch (UnsupportedJwtException ex) {
            log.warn("Unsupported JWT token");
        } catch (IllegalArgumentException ex) {
            log.warn("JWT claims string is empty");
        }
        return false;
    }

    private Claims parseClaims(String token) {
        return Jwts.parser()
            .verifyWith(getSigningKey())
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }
}
