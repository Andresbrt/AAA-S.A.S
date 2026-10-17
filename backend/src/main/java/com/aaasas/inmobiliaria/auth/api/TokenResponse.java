package com.aaasas.inmobiliaria.auth.api;

/**
 * Respuesta de autenticación.
 * <ul>
 *   <li>Login normal: accessToken + refreshToken.</li>
 *   <li>Usuario con MFA: {@code mfaRequired=true} + {@code mfaToken} (sin tokens de acceso).</li>
 * </ul>
 * Los campos nulos se omiten en el JSON (jackson non_null).
 */
public record TokenResponse(
    String accessToken,
    String refreshToken,
    String tokenType,
    Long expiresIn,
    Boolean mfaRequired,
    String mfaToken
) {
    public TokenResponse(String accessToken, String refreshToken, long expiresIn) {
        this(accessToken, refreshToken, "Bearer", expiresIn, null, null);
    }

    public static TokenResponse mfaChallenge(String mfaToken) {
        return new TokenResponse(null, null, null, null, true, mfaToken);
    }
}
