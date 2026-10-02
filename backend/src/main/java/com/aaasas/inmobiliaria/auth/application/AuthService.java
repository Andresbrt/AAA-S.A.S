package com.aaasas.inmobiliaria.auth.application;

import com.aaasas.inmobiliaria.auth.api.ChangePasswordRequest;
import com.aaasas.inmobiliaria.auth.api.LoginRequest;
import com.aaasas.inmobiliaria.auth.api.TokenResponse;
import com.aaasas.inmobiliaria.auth.domain.RefreshToken;
import com.aaasas.inmobiliaria.auth.infrastructure.RefreshTokenRepository;
import com.aaasas.inmobiliaria.security.CustomUserDetails;
import com.aaasas.inmobiliaria.security.jwt.JwtProperties;
import com.aaasas.inmobiliaria.security.jwt.JwtProvider;
import com.aaasas.inmobiliaria.shared.exception.BusinessRuleException;
import com.aaasas.inmobiliaria.shared.exception.UnauthorizedException;
import com.aaasas.inmobiliaria.user.domain.User;
import com.aaasas.inmobiliaria.user.infrastructure.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.HexFormat;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);
    private static final int MAX_FAILED_ATTEMPTS = 5;
    private static final int LOCK_DURATION_MINUTES = 15;

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    private final JwtProperties jwtProperties;

    @Transactional
    public TokenResponse login(LoginRequest request) {
        User user = userRepository.findByEmailAndDeletedAtIsNull(request.email())
            .orElseThrow(() -> new UnauthorizedException("Credenciales inválidas."));

        if (!user.isActive()) {
            throw new UnauthorizedException("Cuenta desactivada. Contacte al administrador.");
        }

        if (user.isAccountLocked()) {
            throw new UnauthorizedException("Cuenta bloqueada temporalmente. Intente más tarde.");
        }

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            user.incrementFailedAttempts();
            if (user.getFailedAttempts() >= MAX_FAILED_ATTEMPTS) {
                user.lock(LOCK_DURATION_MINUTES);
                log.warn("Account locked for user: {}", user.getEmail());
            }
            userRepository.save(user);
            throw new UnauthorizedException("Credenciales inválidas.");
        }

        // Reset failed attempts on successful login
        user.resetFailedAttempts();
        userRepository.save(user);

        return generateTokens(user);
    }

    @Transactional
    public TokenResponse refresh(String refreshTokenValue) {
        String tokenHash = hashToken(refreshTokenValue);
        RefreshToken storedToken = refreshTokenRepository.findByTokenHashAndRevokedFalse(tokenHash)
            .orElseThrow(() -> new UnauthorizedException("Refresh token inválido."));

        if (storedToken.isExpired()) {
            storedToken.setRevoked(true);
            refreshTokenRepository.save(storedToken);
            throw new UnauthorizedException("Refresh token expirado.");
        }

        // Rotate: revoke old, issue new
        storedToken.setRevoked(true);
        refreshTokenRepository.save(storedToken);

        User user = userRepository.findById(storedToken.getUserId())
            .orElseThrow(() -> new UnauthorizedException("Usuario no encontrado."));

        return generateTokens(user);
    }

    @Transactional
    public void logout(String refreshTokenValue) {
        String tokenHash = hashToken(refreshTokenValue);
        refreshTokenRepository.findByTokenHashAndRevokedFalse(tokenHash)
            .ifPresent(token -> {
                token.setRevoked(true);
                refreshTokenRepository.save(token);
            });
    }

    @Transactional
    public void changePassword(CustomUserDetails currentUser, ChangePasswordRequest request) {
        User user = userRepository.findById(currentUser.getId())
            .orElseThrow(() -> new UnauthorizedException("Usuario no encontrado."));

        if (!passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
            throw new BusinessRuleException("La contraseña actual es incorrecta.");
        }

        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);

        // Revoke all refresh tokens on password change
        refreshTokenRepository.revokeAllByUserId(user.getId());
        log.info("Password changed and all tokens revoked for user: {}", user.getEmail());
    }

    private TokenResponse generateTokens(User user) {
        String accessToken = jwtProvider.generateAccessToken(user.getId(), user.getEmail(), user.getRole().name());
        String refreshTokenValue = jwtProvider.generateRefreshToken();

        RefreshToken refreshToken = RefreshToken.builder()
            .tokenHash(hashToken(refreshTokenValue))
            .userId(user.getId())
            .expiresAt(LocalDateTime.now().plusSeconds(jwtProperties.refreshTokenExpirationMs() / 1000))
            .build();
        refreshTokenRepository.save(refreshToken);

        return new TokenResponse(accessToken, refreshTokenValue, jwtProperties.accessTokenExpirationMs() / 1000);
    }

    private String hashToken(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(token.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 not available", e);
        }
    }
}
