-- V19: Actualización oficial de contenido para Grupo AAA y Proyecto Corales del Viento
-- Basado en las directrices comerciales y técnicas:
-- 1. Hero: "Vive el lujo en tu lugar ideal" + subtítulo de condominios y proyectos costeros.
-- 2. Corales del Viento: Precio por m² ($260.000), tags oficiales, descripción ampliada y claim turístico.

-- 1. Actualización de Company Info
UPDATE company_info
SET 
    hero_title = 'Vive el lujo en' || chr(10) || 'tu lugar ideal',
    hero_subtitle = 'Descubre nuestros condominios y proyectos costeros diseñados para un estilo de vida excepcional.'
WHERE id = 'c1000000-0000-0000-0000-000000000001'
   OR name ILIKE '%Grupo AAA%'
   OR name ILIKE '%AAA S.A.S.%';

-- 2. Actualización de Proyecto Corales del Viento
UPDATE projects
SET 
    short_description = 'En el caribe colombiano a solo 5 minutos del mar en zona turística de alta valorización',
    long_description = 'Condominio Campestre Corales del Viento te ofrece la oportunidad de construir el hogar de tus sueños en terreno 100% plano, con respaldo legal de escritura individual. Ubicado estratégicamente en San Bernardo del Viento (Córdoba), en el caribe colombiano a solo 5 minutos del mar en zona turística de alta valorización. A tan solo 90 minutos de Montería, 50 minutos del aeropuerto de Tolú, y con acceso privilegiado a destinos emblemáticos como Isla Fuerte, San Antero, Coveñas y Cartagena de Indias. Cuenta con portería 24 horas, piscina, juegos infantiles, zona BBQ, amplias zonas verdes y vía principal pavimentada.',
    min_price = 260000.00,
    max_price = 260000.00,
    meta_title = 'Corales del Viento | Lotes Campestres Frente al Mar',
    meta_description = 'Lotes 100% planos a $260.000 el metro cuadrado con escritura individual en San Bernardo del Viento. A 5 min del mar, portería 24h, piscina y zonas verdes.',
    updated_at = NOW()
WHERE slug IN ('condominio-campestre-corales-del-viento', 'corales-del-viento')
   OR id = '8b6c778a-7393-415d-9bb2-ba01dcdf6a41';

-- 3. Actualización de Etiquetas (Tags) de Corales del Viento
DELETE FROM project_tags
WHERE project_id IN (
    SELECT id FROM projects 
    WHERE slug IN ('condominio-campestre-corales-del-viento', 'corales-del-viento')
       OR id = '8b6c778a-7393-415d-9bb2-ba01dcdf6a41'
);

INSERT INTO project_tags (project_id, tag)
SELECT p.id, t.tag
FROM projects p
CROSS JOIN (
    VALUES 
        ('Frente al Mar'),
        ('Lotes Campestres'),
        ('Portería 24 horas'),
        ('Piscina'),
        ('Juegos infantiles'),
        ('Zona BBQ'),
        ('Zonas verdes'),
        ('Vía principal pavimentada'),
        ('A 5 min del mar'),
        ('A 90 min de Montería'),
        ('A 50 min de Tolú')
) AS t(tag)
WHERE p.slug IN ('condominio-campestre-corales-del-viento', 'corales-del-viento')
   OR p.id = '8b6c778a-7393-415d-9bb2-ba01dcdf6a41';
