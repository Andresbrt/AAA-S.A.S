-- V25: Add financing calculator parameters to projects and projects_aud
-- Grupo AAA - Corales del Viento Interactive Financing Calculator

ALTER TABLE projects
    ADD COLUMN IF NOT EXISTS has_financing_calculator BOOLEAN DEFAULT false NOT NULL,
    ADD COLUMN IF NOT EXISTS reservation_amount NUMERIC(15,2) DEFAULT 1000000.00 NOT NULL,
    ADD COLUMN IF NOT EXISTS down_payment_percentage NUMERIC(5,2) DEFAULT 20.00 NOT NULL,
    ADD COLUMN IF NOT EXISTS interest_free_months INTEGER DEFAULT 12 NOT NULL,
    ADD COLUMN IF NOT EXISTS interest_months INTEGER DEFAULT 24 NOT NULL,
    ADD COLUMN IF NOT EXISTS monthly_interest_rate NUMERIC(5,2) DEFAULT 1.00 NOT NULL;

ALTER TABLE projects_aud
    ADD COLUMN IF NOT EXISTS has_financing_calculator BOOLEAN,
    ADD COLUMN IF NOT EXISTS reservation_amount NUMERIC(15,2),
    ADD COLUMN IF NOT EXISTS down_payment_percentage NUMERIC(5,2),
    ADD COLUMN IF NOT EXISTS interest_free_months INTEGER,
    ADD COLUMN IF NOT EXISTS interest_months INTEGER,
    ADD COLUMN IF NOT EXISTS monthly_interest_rate NUMERIC(5,2);

UPDATE projects
SET 
    has_financing_calculator = true,
    reservation_amount = 1000000.00,
    down_payment_percentage = 20.00,
    interest_free_months = 12,
    interest_months = 24,
    monthly_interest_rate = 1.00,
    updated_at = NOW()
WHERE id = '8b6c778a-7393-415d-9bb2-ba01dcdf6a41'
   OR slug IN ('corales-del-viento', 'condominio-campestre-corales-del-viento');
