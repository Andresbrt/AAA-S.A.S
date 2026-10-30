-- V23: Actualización oficial de Corales del Viento:
-- 1. Actualización de clasificación de lotes a 'Frente al Mar' (elimina '150m Playa')
-- 2. Actualización de multimedia oficial con foto frontal de portería y galería completa de 6 fotos
-- 3. Actualización de descripciones, distancias a aeropuertos (Los Garzones y Golfo de Morrosquillo) y destinos (Barranquilla, Santa Marta)
-- 4. Unificación de distancia a 150 metros (5 min a pie por vía de acceso) y defensa jurídica

-- 1. Actualizar clasificación de lotes de Corales del Viento
UPDATE properties
SET floor_or_tower = 'Frente al Mar'
WHERE project_id = '8b6c778a-7393-415d-9bb2-ba01dcdf6a41'
  AND (floor_or_tower ILIKE '%150m%' OR floor_or_tower ILIKE '%playa%');

-- 2. Actualizar datos de proyecto Corales del Viento
UPDATE projects
SET 
    short_description = 'En el caribe colombiano a solo 150 metros del mar (5 min a pie) en zona turística de alta valorización',
    long_description = 'Condominio Campestre Corales del Viento te ofrece la oportunidad de construir el hogar de tus sueños en terreno 100% plano, con respaldo de defensa jurídica y escritura individual registrada. Ubicado estratégicamente en San Bernardo del Viento (Córdoba), en el caribe colombiano a solo 150 metros de la orilla del mar (a 5 minutos a pie por la vía de acceso conformada) en zona turística de alta valorización. Cuenta con una conectividad aérea y terrestre privilegiada: a 90 minutos del Aeropuerto Internacional Los Garzones de Montería y a 50 minutos del Aeropuerto Golfo de Morrosquillo en Tolú, con rápida conexión hacia Barranquilla, Santa Marta y Cartagena de Indias, y a minutos de destinos paradisíacos como Isla Fuerte, San Antero y Coveñas. Ofrece portería 24 horas, piscina, juegos infantiles, zona BBQ, amplias zonas verdes y vía principal pavimentada.',
    status = 'EN_PLANOS',
    map_url = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d23158.58947186937!2d-76.01472060247147!3d9.349420335356847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e59bf0031585ccb%3A0x778be77018f3c7ec!2sCondominio%20campestre%20corales%20del%20viento!5e1!3m2!1ses!2sco!4v1793217623126!5m2!1ses!2sco',
    updated_at = NOW()
WHERE id = '8b6c778a-7393-415d-9bb2-ba01dcdf6a41'
   OR slug IN ('corales-del-viento', 'condominio-campestre-corales-del-viento');

-- 3. Actualizar medios oficiales en la tabla media_files
DELETE FROM media_files 
WHERE entity_type = 'PROJECT' 
  AND entity_id = '8b6c778a-7393-415d-9bb2-ba01dcdf6a41';

INSERT INTO media_files (id, file_key, url, original_name, content_type, file_size, media_type, display_order, alt_text, entity_type, entity_id)
VALUES 
    -- Foto frontal de portería como Banner y Main Image oficial
    (uuid_generate_v4(), 'project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/banner', 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/porteria-frontal.jpg', 'porteria-frontal.jpg', 'image/jpeg', 1238472, 'BANNER_IMAGE', 0, 'Portería Principal de Frente Corales del Viento', 'PROJECT', '8b6c778a-7393-415d-9bb2-ba01dcdf6a41'),
    (uuid_generate_v4(), 'project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/main', 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/porteria-frontal.jpg', 'porteria-frontal.jpg', 'image/jpeg', 1238472, 'MAIN_IMAGE', 1, 'Fotografía Frontal Entrada Corales del Viento', 'PROJECT', '8b6c778a-7393-415d-9bb2-ba01dcdf6a41'),
    -- Logotipo oficial del proyecto
    (uuid_generate_v4(), 'project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/logo', 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/08e535d2-f7e8-4a1b-99e9-1949355cd0a9-LOGO_page-0001.webp', 'LOGO_page-0001.webp', 'image/webp', 349362, 'LOGO', 2, 'Logo Oficial Corales del Viento', 'PROJECT', '8b6c778a-7393-415d-9bb2-ba01dcdf6a41'),
    -- Galería de imágenes completa y diferenciada
    (uuid_generate_v4(), 'project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/gallery-1', 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/porteria-frontal.jpg', 'porteria-frontal.jpg', 'image/jpeg', 1238472, 'GALLERY_IMAGE', 3, 'Fachada Frontal de la Portería 24 Horas', 'PROJECT', '8b6c778a-7393-415d-9bb2-ba01dcdf6a41'),
    (uuid_generate_v4(), 'project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/gallery-2', 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/lote-mar.jpg', 'lote-mar.jpg', 'image/jpeg', 1108532, 'GALLERY_IMAGE', 4, 'Lotes Frente al Mar Caribe', 'PROJECT', '8b6c778a-7393-415d-9bb2-ba01dcdf6a41'),
    (uuid_generate_v4(), 'project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/gallery-3', 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/amenities.jpg', 'amenities.jpg', 'image/jpeg', 977913, 'GALLERY_IMAGE', 5, 'Piscina y Club Social Exclusivo', 'PROJECT', '8b6c778a-7393-415d-9bb2-ba01dcdf6a41'),
    (uuid_generate_v4(), 'project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/gallery-4', 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/lote-campestre.jpg', 'lote-campestre.jpg', 'image/jpeg', 1080360, 'GALLERY_IMAGE', 6, 'Terreno 100% Plano Delimitado', 'PROJECT', '8b6c778a-7393-415d-9bb2-ba01dcdf6a41'),
    (uuid_generate_v4(), 'project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/lifestyle.jpg', 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/lifestyle.jpg', 'lifestyle.jpg', 'image/jpeg', 937841, 'GALLERY_IMAGE', 7, 'Estilo de Vida Caribe y Entorno Natural', 'PROJECT', '8b6c778a-7393-415d-9bb2-ba01dcdf6a41'),
    (uuid_generate_v4(), 'project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/gallery-6', 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp', 'IMG_0533.JPG.webp', 'image/webp', 2233550, 'GALLERY_IMAGE', 8, 'Perspectiva Panorámica del Condominio', 'PROJECT', '8b6c778a-7393-415d-9bb2-ba01dcdf6a41');

-- 4. Actualizar etiquetas de Corales del Viento
DELETE FROM project_tags
WHERE project_id = '8b6c778a-7393-415d-9bb2-ba01dcdf6a41';

INSERT INTO project_tags (project_id, tag)
VALUES 
    ('8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Frente al Mar'),
    ('8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Lotes Campestres Planos'),
    ('8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Portería 24 horas'),
    ('8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Piscina & Club Social'),
    ('8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Juegos infantiles'),
    ('8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Zona BBQ'),
    ('8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Zonas verdes'),
    ('8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Vía principal pavimentada'),
    ('8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'A 150m del mar (5 min a pie)'),
    ('8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Aeropuerto Los Garzones (Montería · 90 min)'),
    ('8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Aeropuerto Golfo de Morrosquillo (Tolú · 50 min)'),
    ('8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Conexión Barranquilla y Santa Marta'),
    ('8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Cerca de Isla Fuerte, Coveñas y San Antero');
