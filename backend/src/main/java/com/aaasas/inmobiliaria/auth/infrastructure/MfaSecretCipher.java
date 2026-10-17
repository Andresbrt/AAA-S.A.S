package com.aaasas.inmobiliaria.auth.infrastructure;

import com.aaasas.inmobiliaria.shared.exception.BusinessRuleException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.security.SecureRandom;
import java.util.Base64;

/**
 * Cifra los secretos MFA en reposo con AES-256-GCM.
 * Si la base de datos se filtra, los secretos TOTP no son utilizables sin MFA_ENCRYPTION_KEY.
 * Formato almacenado: Base64( IV[12] || ciphertext+tag ).
 */
@Component
public class MfaSecretCipher {

    private static final String ALGORITHM = "AES/GCM/NoPadding";
    private static final int IV_BYTES = 12;
    private static final int TAG_BITS = 128;

    private final SecretKeySpec key;
    private final SecureRandom random = new SecureRandom();

    public MfaSecretCipher(@Value("${app.mfa.encryption-key:}") String base64Key) {
        this.key = parseKey(base64Key);
    }

    public String encrypt(String plain) {
        try {
            byte[] iv = new byte[IV_BYTES];
            random.nextBytes(iv);
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.ENCRYPT_MODE, requireKey(), new GCMParameterSpec(TAG_BITS, iv));
            byte[] encrypted = cipher.doFinal(plain.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(
                ByteBuffer.allocate(iv.length + encrypted.length).put(iv).put(encrypted).array());
        } catch (GeneralSecurityException e) {
            throw new IllegalStateException("No se pudo cifrar el secreto MFA", e);
        }
    }

    public String decrypt(String stored) {
        try {
            ByteBuffer buffer = ByteBuffer.wrap(Base64.getDecoder().decode(stored));
            byte[] iv = new byte[IV_BYTES];
            buffer.get(iv);
            byte[] encrypted = new byte[buffer.remaining()];
            buffer.get(encrypted);
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.DECRYPT_MODE, requireKey(), new GCMParameterSpec(TAG_BITS, iv));
            return new String(cipher.doFinal(encrypted), StandardCharsets.UTF_8);
        } catch (GeneralSecurityException | IllegalArgumentException e) {
            throw new IllegalStateException("No se pudo descifrar el secreto MFA (¿cambió MFA_ENCRYPTION_KEY?)", e);
        }
    }

    private SecretKeySpec requireKey() {
        if (key == null) {
            throw new BusinessRuleException(
                "La verificación en 2 pasos no está configurada en el servidor (falta MFA_ENCRYPTION_KEY).");
        }
        return key;
    }

    private static SecretKeySpec parseKey(String base64Key) {
        if (base64Key == null || base64Key.isBlank()) return null;
        byte[] raw = Base64.getDecoder().decode(base64Key.trim());
        if (raw.length != 32) {
            throw new IllegalStateException("MFA_ENCRYPTION_KEY debe ser de 32 bytes en Base64 (openssl rand -base64 32)");
        }
        return new SecretKeySpec(raw, "AES");
    }
}
