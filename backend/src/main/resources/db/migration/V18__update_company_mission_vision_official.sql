-- V18: Actualizar Misión, Visión y Redes Oficiales de Grupo AAA S.A.S.
UPDATE company_info
SET mission = 'Desarrollar y comercializar proyectos inmobiliarios que generen valor y bienestar para nuestros clientes, ofreciendo inmuebles con potencial de crecimiento, calidad y ubicación estratégica. Trabajamos con compromiso, transparencia y responsabilidad, acompañando a nuestros clientes durante el proceso de adquisición y construyendo relaciones basadas en la confianza.',
    vision = 'Consolidarnos como una empresa referente en el sector inmobiliario, reconocida por la calidad de nuestros proyectos, la confianza de nuestros clientes y nuestra capacidad para identificar y desarrollar oportunidades de inversión. Buscamos crecer de manera sostenible, ampliando nuestro portafolio y contribuyendo al desarrollo de espacios que mejoren la calidad de vida y generen valor a largo plazo.',
    instagram_url = 'https://www.instagram.com/grupoaaa_inversiones?stkn=M204eDJoaWJuZXRs',
    facebook_url = 'https://www.facebook.com/share/1CYRi2nCtT/?mibextid=wwXIfr',
    contact_address = 'Cartagena de Indias, Bolívar, Colombia',
    contact_email = 'info@aaasas.com',
    contact_phone = '+57 312 238 4172',
    whatsapp_number = '573122384172'
WHERE id = 'c1000000-0000-0000-0000-000000000001'
   OR name ILIKE '%Grupo AAA%';
