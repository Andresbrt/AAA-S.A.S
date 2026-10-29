-- V21: Remover dirección de contacto (Cartagena de Indias) según instrucción de gerencia

UPDATE company_info
SET contact_address = NULL,
    updated_at = NOW()
WHERE id = 'c1000000-0000-0000-0000-000000000001'
   OR name ILIKE '%Grupo AAA%'
   OR name ILIKE '%AAA S.A.S.%';
