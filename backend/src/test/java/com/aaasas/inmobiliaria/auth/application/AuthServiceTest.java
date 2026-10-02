package com.aaasas.inmobiliaria.auth.application;

import com.aaasas.inmobiliaria.auth.api.LoginRequest;
import com.aaasas.inmobiliaria.auth.api.TokenResponse;
import com.aaasas.inmobiliaria.auth.infrastructure.RefreshTokenRepository;
import com.aaasas.inmobiliaria.security.jwt.JwtProperties;
import com.aaasas.inmobiliaria.security.jwt.JwtProvider;
import com.aaasas.inmobiliaria.shared.exception.UnauthorizedException;
import com.aaasas.inmobiliaria.user.domain.Role;
import com.aaasas.inmobiliaria.user.domain.User;
import com.aaasas.inmobiliaria.user.infrastructure.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private RefreshTokenRepository refreshTokenRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtProvider jwtProvider;
    @Mock private JwtProperties jwtProperties;

    @InjectMocks private AuthService authService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
            .id(UUID.randomUUID())
            .email("test@test.com")
            .password("encoded-password")
            .name("Test User")
            .role(Role.ADMIN)
            .active(true)
            .build();
    }

    @Test
    @DisplayName("login — success with valid credentials")
    void login_success() {
        when(userRepository.findByEmailAndDeletedAtIsNull("test@test.com"))
            .thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("password", "encoded-password")).thenReturn(true);
        when(jwtProvider.generateAccessToken(any(), any(), any())).thenReturn("access-token");
        when(jwtProvider.generateRefreshToken()).thenReturn("refresh-token");
        when(jwtProperties.refreshTokenExpirationMs()).thenReturn(604800000L);
        when(refreshTokenRepository.save(any())).thenReturn(null);
        when(userRepository.save(any())).thenReturn(testUser);

        TokenResponse response = authService.login(new LoginRequest("test@test.com", "password"));

        assertNotNull(response);
        assertEquals("access-token", response.accessToken());
        assertEquals("refresh-token", response.refreshToken());
    }

    @Test
    @DisplayName("login — throws UnauthorizedException for wrong password")
    void login_wrongPassword() {
        when(userRepository.findByEmailAndDeletedAtIsNull("test@test.com"))
            .thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("wrong", "encoded-password")).thenReturn(false);
        when(userRepository.save(any())).thenReturn(testUser);

        assertThrows(UnauthorizedException.class,
            () -> authService.login(new LoginRequest("test@test.com", "wrong")));
    }

    @Test
    @DisplayName("login — throws UnauthorizedException for non-existent user")
    void login_nonExistentUser() {
        when(userRepository.findByEmailAndDeletedAtIsNull("nobody@test.com"))
            .thenReturn(Optional.empty());

        assertThrows(UnauthorizedException.class,
            () -> authService.login(new LoginRequest("nobody@test.com", "password")));
    }

    @Test
    @DisplayName("login — throws UnauthorizedException for inactive user")
    void login_inactiveUser() {
        testUser.setActive(false);
        when(userRepository.findByEmailAndDeletedAtIsNull("test@test.com"))
            .thenReturn(Optional.of(testUser));

        assertThrows(UnauthorizedException.class,
            () -> authService.login(new LoginRequest("test@test.com", "password")));
    }

    @Test
    @DisplayName("login — increments failed attempts on wrong password")
    void login_incrementsFailedAttempts() {
        when(userRepository.findByEmailAndDeletedAtIsNull("test@test.com"))
            .thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("wrong", "encoded-password")).thenReturn(false);
        when(userRepository.save(any())).thenReturn(testUser);

        assertThrows(UnauthorizedException.class,
            () -> authService.login(new LoginRequest("test@test.com", "wrong")));

        assertEquals(1, testUser.getFailedAttempts());
    }
}
