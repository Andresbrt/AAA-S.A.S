-- V16: Actualizar teléfono oficial y WhatsApp de Grupo AAA
UPDATE company_info
SET contact_phone = '+57 312 238 4172',
    whatsapp_number = '573122384172',
    whatsapp_message = 'Hola, me interesa conocer más sobre el Portafolio de Proyectos de Grupo AAA.'
WHERE id = 'c1000000-0000-0000-0000-000000000001'
   OR contact_phone = '+57 300 000 0000'
   OR contact_phone IS NULL;
