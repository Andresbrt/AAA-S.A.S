-- ═══════════════════════════════════════════════════════════════
-- V13: Autenticación en 2 pasos (TOTP — RFC 6238)
-- mfa_secret se guarda CIFRADO (AES-256-GCM) con MFA_ENCRYPTION_KEY
-- mfa_last_used_step evita reutilizar el mismo código (replay)
-- ═══════════════════════════════════════════════════════════════
ALTER TABLE users ADD COLUMN mfa_enabled        BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE users ADD COLUMN mfa_secret         VARCHAR(255);
ALTER TABLE users ADD COLUMN mfa_last_used_step BIGINT;
