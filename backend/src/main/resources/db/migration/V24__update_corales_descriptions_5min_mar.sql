-- V24: Reemplazar referencias a '150 metros' por '5 min del mar Caribe' en Corales del Viento
-- Preserva los archivos multimedia (logos, brochures, fotos) cargados en media_files

UPDATE projects
SET 
    short_description = 'En el caribe colombiano a solo 5 min del mar Caribe en zona turística de alta valorización',
    long_description = 'Condominio Campestre Corales del Viento te ofrece la oportunidad de construir el hogar de tus sueños en terreno 100% plano, con respaldo de defensa jurídica y escritura individual registrada. Ubicado estratégicamente en San Bernardo del Viento (Córdoba), en el caribe colombiano a solo 5 min del mar Caribe (por la vía de acceso conformada) en zona turística de alta valorización. Cuenta con una conectividad aérea y terrestre privilegiada: a 90 minutos del Aeropuerto Internacional Los Garzones de Montería y a 50 minutos del Aeropuerto Golfo de Morrosquillo en Tolú, con rápida conexión hacia Barranquilla, Santa Marta y Cartagena de Indias, y a minutos de destinos paradisíacos como Isla Fuerte, San Antero y Coveñas. Ofrece portería 24 horas, piscina, juegos infantiles, zona BBQ, amplias zonas verdes y vía principal pavimentada.',
    updated_at = NOW()
WHERE id = '8b6c778a-7393-415d-9bb2-ba01dcdf6a41'
   OR slug IN ('corales-del-viento', 'condominio-campestre-corales-del-viento')
   OR short_description ILIKE '%150 metros%'
   OR long_description ILIKE '%150 metros%';

UPDATE project_tags
SET tag = 'A 5 min del mar Caribe'
WHERE project_id = '8b6c778a-7393-415d-9bb2-ba01dcdf6a41'
  AND (tag ILIKE '%150m%' OR tag ILIKE '%150 metros%');

UPDATE properties
SET floor_or_tower = 'Frente al Mar'
WHERE project_id = '8b6c778a-7393-415d-9bb2-ba01dcdf6a41'
  AND (floor_or_tower ILIKE '%150m%' OR floor_or_tower ILIKE '%150 metros%' OR floor_or_tower ILIKE '%playa%');

