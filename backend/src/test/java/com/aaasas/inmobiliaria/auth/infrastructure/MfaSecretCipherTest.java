package com.aaasas.inmobiliaria.auth.infrastructure;

import com.aaasas.inmobiliaria.shared.exception.BusinessRuleException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Base64;

import static org.junit.jupiter.api.Assertions.*;

class MfaSecretCipherTest {

    private static final String KEY = Base64.getEncoder().encodeToString(new byte[32]);

    @Test
    @DisplayName("cifra y descifra; cada cifrado usa un IV distinto")
    void roundTrip() {
        MfaSecretCipher cipher = new MfaSecretCipher(KEY);
        String a = cipher.encrypt("JBSWY3DPEHPK3PXP");
        String b = cipher.encrypt("JBSWY3DPEHPK3PXP");
        assertNotEquals(a, b);
        assertFalse(a.contains("JBSWY3DPEHPK3PXP"));
        assertEquals("JBSWY3DPEHPK3PXP", cipher.decrypt(a));
    }

    @Test
    @DisplayName("falla al descifrar con otra clave (GCM autenticado)")
    void wrongKeyFails() {
        String encrypted = new MfaSecretCipher(KEY).encrypt("SECRET");
        byte[] other = new byte[32];
        other[0] = 1;
        MfaSecretCipher otherCipher = new MfaSecretCipher(Base64.getEncoder().encodeToString(other));
        assertThrows(IllegalStateException.class, () -> otherCipher.decrypt(encrypted));
    }

    @Test
    @DisplayName("sin clave configurada → error de negocio claro")
    void missingKey() {
        assertThrows(BusinessRuleException.class, () -> new MfaSecretCipher("").encrypt("x"));
    }

    @Test
    @DisplayName("clave de longitud incorrecta → falla al arrancar")
    void invalidKeyLength() {
        assertThrows(IllegalStateException.class,
            () -> new MfaSecretCipher(Base64.getEncoder().encodeToString(new byte[16])));
    }
}
