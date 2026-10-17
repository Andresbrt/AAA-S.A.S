package com.aaasas.inmobiliaria.auth.application;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.nio.charset.StandardCharsets;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;

import static org.junit.jupiter.api.Assertions.*;

class TotpServiceTest {

    /** Secreto del Apéndice B del RFC 6238 ("12345678901234567890" en ASCII). */
    private static final byte[] RFC_KEY = "12345678901234567890".getBytes(StandardCharsets.US_ASCII);
    private static final String RFC_SECRET_B32 = TotpService.base32Encode(RFC_KEY);

    private static TotpService at(long epochSeconds) {
        return new TotpService(Clock.fixed(Instant.ofEpochSecond(epochSeconds), ZoneOffset.UTC));
    }

    @Test
    @DisplayName("RFC 6238 — vectores oficiales (últimos 6 dígitos, SHA1)")
    void rfc6238Vectors() {
        assertEquals("287082", TotpService.generateCode(RFC_KEY, 59L / 30));
        assertEquals("081804", TotpService.generateCode(RFC_KEY, 1111111109L / 30));
        assertEquals("050471", TotpService.generateCode(RFC_KEY, 1111111111L / 30));
        assertEquals("005924", TotpService.generateCode(RFC_KEY, 1234567890L / 30));
        assertEquals("279037", TotpService.generateCode(RFC_KEY, 2000000000L / 30));
    }

    @Test
    @DisplayName("Base32 — ida y vuelta")
    void base32RoundTrip() {
        assertEquals("GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ", RFC_SECRET_B32);
        assertArrayEquals(RFC_KEY, TotpService.base32Decode(RFC_SECRET_B32));
    }

    @Test
    @DisplayName("verify — acepta el código actual y devuelve su step")
    void verifyCurrent() {
        TotpService totp = at(1111111111L);
        assertEquals(1111111111L / 30, totp.verify(RFC_SECRET_B32, "050471", null));
    }

    @Test
    @DisplayName("verify — tolera ±1 periodo de desfase de reloj")
    void verifyClockSkew() {
        long t = 1234567890L;
        String code = TotpService.generateCode(RFC_KEY, t / 30);
        assertTrue(at(t + 30).verify(RFC_SECRET_B32, code, null) >= 0, "un periodo después");
        assertTrue(at(t - 30).verify(RFC_SECRET_B32, code, null) >= 0, "un periodo antes");
        assertEquals(-1, at(t + 90).verify(RFC_SECRET_B32, code, null), "tres periodos después");
    }

    @Test
    @DisplayName("verify — rechaza reutilizar un código (anti-replay)")
    void verifyRejectsReplay() {
        TotpService totp = at(1111111111L);
        long step = totp.verify(RFC_SECRET_B32, "050471", null);
        assertEquals(-1, totp.verify(RFC_SECRET_B32, "050471", step));
    }

    @Test
    @DisplayName("verify — rechaza formatos inválidos")
    void verifyRejectsGarbage() {
        TotpService totp = at(1111111111L);
        assertEquals(-1, totp.verify(RFC_SECRET_B32, "000000", null));
        assertEquals(-1, totp.verify(RFC_SECRET_B32, "12345", null));
        assertEquals(-1, totp.verify(RFC_SECRET_B32, "abcdef", null));
        assertEquals(-1, totp.verify(RFC_SECRET_B32, null, null));
    }

    @Test
    @DisplayName("generateSecret — 160 bits, Base32, aleatorio")
    void generateSecret() {
        TotpService totp = new TotpService();
        String a = totp.generateSecret();
        assertEquals(32, a.length());
        assertTrue(a.matches("[A-Z2-7]+"));
        assertNotEquals(a, totp.generateSecret());
    }

    @Test
    @DisplayName("otpauth URI — formato compatible con Google Authenticator")
    void otpAuthUri() {
        String uri = new TotpService().buildOtpAuthUri("Grupo AAA", "a@b.com", "ABC");
        assertEquals("otpauth://totp/Grupo%20AAA%3Aa%40b.com?secret=ABC&issuer=Grupo%20AAA&algorithm=SHA1&digits=6&period=30", uri);
    }
}
