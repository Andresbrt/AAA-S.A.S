-- V20: Actualizar correo de contacto oficial único de Grupo AAA S.A.S.
-- Solicitud de la gerencia: aaagrupo.med@gmail.com como único correo corporativo

UPDATE company_info
SET contact_email = 'aaagrupo.med@gmail.com',
    updated_at = NOW()
WHERE id = 'c1000000-0000-0000-0000-000000000001'
   OR name ILIKE '%Grupo AAA%'
   OR name ILIKE '%AAA S.A.S.%';
