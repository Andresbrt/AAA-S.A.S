package com.aaasas.inmobiliaria.auth.application;

import com.aaasas.inmobiliaria.auth.api.MfaDtos.SetupResponse;
import com.aaasas.inmobiliaria.auth.api.MfaDtos.StatusResponse;
import com.aaasas.inmobiliaria.auth.infrastructure.MfaSecretCipher;
import com.aaasas.inmobiliaria.shared.exception.BusinessRuleException;
import com.aaasas.inmobiliaria.shared.exception.UnauthorizedException;
import com.aaasas.inmobiliaria.user.domain.User;
import com.aaasas.inmobiliaria.user.infrastructure.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

/**
 * Gestión de la verificación en 2 pasos (TOTP) del usuario autenticado.
 * Flujo: setup (genera secreto + QR) → enable (confirma con un código) → disable (contraseña + código).
 */
@Service
@RequiredArgsConstructor
public class MfaService {

    private static final Logger log = LoggerFactory.getLogger(MfaService.class);

    private final UserRepository userRepository;
    private final TotpService totpService;
    private final MfaSecretCipher cipher;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.mfa.issuer:Grupo AAA}")
    private String issuer;

    @Transactional(readOnly = true)
    public StatusResponse status(UUID userId) {
        return new StatusResponse(getUser(userId).isMfaEnabled());
    }

    /** Genera un secreto nuevo (pendiente de confirmar). Reemplaza cualquier configuración previa sin activar. */
    @Transactional
    public SetupResponse setup(UUID userId) {
        User user = getUser(userId);
        if (user.isMfaEnabled()) {
            throw new BusinessRuleException("La verificación en 2 pasos ya está activa. Desactívala para reconfigurarla.");
        }

        String secret = totpService.generateSecret();
        user.setMfaSecret(cipher.encrypt(secret));
        user.setMfaLastUsedStep(null);
        userRepository.save(user);

        return new SetupResponse(secret, totpService.buildOtpAuthUri(issuer, user.getEmail(), secret));
    }

    /** Activa MFA solo si el usuario demuestra que su app genera códigos correctos. */
    @Transactional
    public StatusResponse enable(UUID userId, String code) {
        User user = getUser(userId);
        if (user.isMfaEnabled()) {
            throw new BusinessRuleException("La verificación en 2 pasos ya está activa.");
        }
        if (user.getMfaSecret() == null) {
            throw new BusinessRuleException("Primero genera el código QR.");
        }

        long step = totpService.verify(cipher.decrypt(user.getMfaSecret()), code, null);
        if (step < 0) {
            throw new BusinessRuleException("Código incorrecto. Verifica la hora de tu teléfono e inténtalo de nuevo.");
        }

        user.setMfaEnabled(true);
        user.setMfaLastUsedStep(step);
        userRepository.save(user);
        log.info("MFA enabled for user: {}", user.getEmail());
        return new StatusResponse(true);
    }

    /** Desactivar exige contraseña + código para que un token robado no baste. */
    @Transactional
    public StatusResponse disable(UUID userId, String password, String code) {
        User user = getUser(userId);
        if (!user.isMfaEnabled()) {
            throw new BusinessRuleException("La verificación en 2 pasos no está activa.");
        }
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new BusinessRuleException("Contraseña incorrecta.");
        }
        long step = totpService.verify(cipher.decrypt(user.getMfaSecret()), code, user.getMfaLastUsedStep());
        if (step < 0) {
            throw new BusinessRuleException("Código de verificación inválido.");
        }

        user.setMfaEnabled(false);
        user.setMfaSecret(null);
        user.setMfaLastUsedStep(null);
        userRepository.save(user);
        log.warn("MFA disabled for user: {}", user.getEmail());
        return new StatusResponse(false);
    }

    private User getUser(UUID userId) {
        return userRepository.findById(userId)
            .orElseThrow(() -> new UnauthorizedException("Usuario no encontrado."));
    }
}
