package com.aaasas.inmobiliaria.auth.application;

import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URLEncoder;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Clock;

/**
 * Implementación de TOTP (RFC 6238) compatible con Google Authenticator, Authy y 1Password.
 * <ul>
 *   <li>HMAC-SHA1, 6 dígitos, periodo de 30 s</li>
 *   <li>Tolerancia de ±1 periodo para desfases de reloj</li>
 *   <li>Rechaza códigos de un periodo ya usado (anti-replay)</li>
 * </ul>
 */
@Component
public class TotpService {

    static final int DIGITS = 6;
    static final int PERIOD_SECONDS = 30;
    static final int WINDOW = 1;
    private static final int SECRET_BYTES = 20; // 160 bits, recomendado por RFC 4226
    private static final String BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

    private final SecureRandom random = new SecureRandom();
    private final Clock clock;

    public TotpService() {
        this(Clock.systemUTC());
    }

    TotpService(Clock clock) {
        this.clock = clock;
    }

    /** Genera un secreto aleatorio codificado en Base32 (sin padding). */
    public String generateSecret() {
        byte[] bytes = new byte[SECRET_BYTES];
        random.nextBytes(bytes);
        return base32Encode(bytes);
    }

    /**
     * Verifica un código TOTP.
     *
     * @return el time-step que coincidió, o {@code -1} si el código no es válido
     *         o ya fue usado (step &lt;= lastUsedStep).
     */
    public long verify(String base32Secret, String code, Long lastUsedStep) {
        if (base32Secret == null || code == null) return -1;
        String normalized = code.replaceAll("\\s", "");
        if (!normalized.matches("\\d{" + DIGITS + "}")) return -1;

        byte[] key = base32Decode(base32Secret);
        long current = currentStep();
        byte[] provided = normalized.getBytes(StandardCharsets.US_ASCII);

        for (int offset = -WINDOW; offset <= WINDOW; offset++) {
            long step = current + offset;
            if (lastUsedStep != null && step <= lastUsedStep) continue;
            byte[] expected = generateCode(key, step).getBytes(StandardCharsets.US_ASCII);
            if (MessageDigest.isEqual(expected, provided)) {
                return step;
            }
        }
        return -1;
    }

    /** URI estándar para el código QR (otpauth://). */
    public String buildOtpAuthUri(String issuer, String accountName, String base32Secret) {
        String label = encode(issuer + ":" + accountName);
        return "otpauth://totp/" + label
            + "?secret=" + base32Secret
            + "&issuer=" + encode(issuer)
            + "&algorithm=SHA1&digits=" + DIGITS
            + "&period=" + PERIOD_SECONDS;
    }

    long currentStep() {
        return clock.instant().getEpochSecond() / PERIOD_SECONDS;
    }

    static String generateCode(byte[] key, long step) {
        try {
            Mac mac = Mac.getInstance("HmacSHA1");
            mac.init(new SecretKeySpec(key, "HmacSHA1"));
            byte[] hash = mac.doFinal(ByteBuffer.allocate(8).putLong(step).array());

            int offset = hash[hash.length - 1] & 0x0F;
            int binary = ((hash[offset] & 0x7F) << 24)
                | ((hash[offset + 1] & 0xFF) << 16)
                | ((hash[offset + 2] & 0xFF) << 8)
                | (hash[offset + 3] & 0xFF);

            int otp = binary % (int) Math.pow(10, DIGITS);
            return String.format("%0" + DIGITS + "d", otp);
        } catch (GeneralSecurityException e) {
            throw new IllegalStateException("HmacSHA1 no disponible", e);
        }
    }

    // ── Base32 (RFC 4648, sin padding) ───────────────────────────

    static String base32Encode(byte[] data) {
        StringBuilder sb = new StringBuilder((data.length * 8 + 4) / 5);
        int buffer = 0, bits = 0;
        for (byte b : data) {
            buffer = (buffer << 8) | (b & 0xFF);
            bits += 8;
            while (bits >= 5) {
                sb.append(BASE32_ALPHABET.charAt((buffer >> (bits - 5)) & 0x1F));
                bits -= 5;
            }
        }
        if (bits > 0) {
            sb.append(BASE32_ALPHABET.charAt((buffer << (5 - bits)) & 0x1F));
        }
        return sb.toString();
    }

    static byte[] base32Decode(String input) {
        String clean = input.replace("=", "").replace(" ", "").toUpperCase();
        ByteBuffer out = ByteBuffer.allocate(clean.length() * 5 / 8);
        int buffer = 0, bits = 0;
        for (char c : clean.toCharArray()) {
            int val = BASE32_ALPHABET.indexOf(c);
            if (val < 0) throw new IllegalArgumentException("Carácter Base32 inválido");
            buffer = (buffer << 5) | val;
            bits += 5;
            if (bits >= 8) {
                out.put((byte) ((buffer >> (bits - 8)) & 0xFF));
                bits -= 8;
            }
        }
        byte[] result = new byte[out.position()];
        out.flip();
        out.get(result);
        return result;
    }

    private static String encode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8).replace("+", "%20");
    }
}
