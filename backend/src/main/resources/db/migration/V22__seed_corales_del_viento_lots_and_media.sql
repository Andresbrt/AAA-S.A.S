-- V22: Seed oficial de Lotes (66 unidades), detalles y medios para Corales del Viento
-- Proyecto: Condominio Campestre Corales del Viento (8b6c778a-7393-415d-9bb2-ba01dcdf6a41)

-- 1. Asegurar Ciudad San Bernardo del Viento en Córdoba
INSERT INTO cities (id, name, department_id)
VALUES ('b1000000-0000-0000-0000-000000000009', 'San Bernardo del Viento', 'a1000000-0000-0000-0000-000000000005')
ON CONFLICT (id) DO NOTHING;

-- 2. Actualizar datos completos de Corales del Viento en la tabla projects
UPDATE projects
SET 
    name = 'Condominio Campestre Corales del Viento',
    slug = 'corales-del-viento',
    short_description = 'En el caribe colombiano a solo 5 minutos del mar en zona turística de alta valorización',
    long_description = 'Condominio Campestre Corales del Viento te ofrece la oportunidad de construir el hogar de tus sueños en terreno 100% plano, con respaldo legal de escritura individual. Ubicado estratégicamente en San Bernardo del Viento (Córdoba), en el caribe colombiano a solo 5 minutos del mar en zona turística de alta valorización. A tan solo 90 minutos de Montería, 50 minutos del aeropuerto de Tolú, y con acceso privilegiado a destinos emblemáticos como Isla Fuerte, San Antero, Coveñas y Cartagena de Indias. Cuenta con portería 24 horas, piscina, juegos infantiles, zona BBQ, amplias zonas verdes y vía principal pavimentada.',
    address = 'San Bernardo del Viento, Córdoba',
    city_id = 'b1000000-0000-0000-0000-000000000009',
    min_price = 260000.00,
    max_price = 260000.00,
    is_featured = true,
    is_published = true,
    meta_title = 'Corales del Viento | Lotes Campestres Frente al Mar',
    meta_description = 'Lotes 100% planos a $260.000 el metro cuadrado con escritura individual en San Bernardo del Viento. A 5 min del mar, portería 24h, piscina y zonas verdes.',
    map_url = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d23158.58947186937!2d-76.01472060247147!3d9.349420335356847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e59bf0031585ccb%3A0x778be77018f3c7ec!2sCondominio%20campestre%20corales%20del%20viento!5e1!3m2!1ses!2sco!4v1793217623126!5m2!1ses!2sco',
    updated_at = NOW()
WHERE id = '8b6c778a-7393-415d-9bb2-ba01dcdf6a41'
   OR slug IN ('corales-del-viento', 'condominio-campestre-corales-del-viento');

-- 3. Limpiar y registrar los archivos multimedia oficiales verificados en Supabase
DELETE FROM media_files 
WHERE entity_type = 'PROJECT' 
  AND entity_id = '8b6c778a-7393-415d-9bb2-ba01dcdf6a41';

INSERT INTO media_files (id, file_key, url, original_name, content_type, file_size, media_type, display_order, alt_text, entity_type, entity_id)
VALUES 
    -- Foto principal y banner en alta resolución
    (uuid_generate_v4(), 'project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/banner', 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp', 'IMG_0533.JPG.webp', 'image/webp', 2233550, 'BANNER_IMAGE', 0, 'Paisaje Corales del Viento', 'PROJECT', '8b6c778a-7393-415d-9bb2-ba01dcdf6a41'),
    (uuid_generate_v4(), 'project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/main', 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp', 'IMG_0533.JPG.webp', 'image/webp', 2233550, 'MAIN_IMAGE', 1, 'Fotografía Terreno Corales del Viento', 'PROJECT', '8b6c778a-7393-415d-9bb2-ba01dcdf6a41'),
    -- Logo del proyecto (se usa como logotipo, nunca como fondo estirado)
    (uuid_generate_v4(), 'project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/logo', 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/08e535d2-f7e8-4a1b-99e9-1949355cd0a9-LOGO_page-0001.webp', 'LOGO_page-0001.webp', 'image/webp', 349362, 'LOGO', 2, 'Logo Oficial Corales del Viento', 'PROJECT', '8b6c778a-7393-415d-9bb2-ba01dcdf6a41'),
    -- Galería fotográfica
    (uuid_generate_v4(), 'project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/gallery-1', 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp', 'IMG_0533.JPG.webp', 'image/webp', 2233550, 'GALLERY_IMAGE', 3, 'Vista del Terreno Plano', 'PROJECT', '8b6c778a-7393-415d-9bb2-ba01dcdf6a41'),
    (uuid_generate_v4(), 'project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/gallery-2', 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/90cfc907-9663-4a13-9c1a-6ac8730269e0-IMG_0536.JPG.webp', 'IMG_0536.JPG.webp', 'image/webp', 1852148, 'GALLERY_IMAGE', 4, 'Acceso Vial y Entorno Natural', 'PROJECT', '8b6c778a-7393-415d-9bb2-ba01dcdf6a41');

-- 4. Registrar los 66 lotes de Corales del Viento en la tabla properties
DELETE FROM properties 
WHERE project_id = '8b6c778a-7393-415d-9bb2-ba01dcdf6a41';

INSERT INTO properties (id, project_id, name, type, private_area, price, status, floor_or_tower)
VALUES
    (uuid_generate_v4(), '8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Lote 01', 'LOTE', 167.51, 43552600.00, 'VENDIDO', '150m Playa'),
    (uuid_generate_v4(), '8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Lote 02', 'LOTE', 151.65, 39429000.00, 'VENDIDO', '150m Playa'),
    (uuid_generate_v4(), '8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Lote 03', 'LOTE', 196.27, 51030200.00, 'DISPONIBLE', '150m Playa'),
    (uuid_generate_v4(), '8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Lote 04', 'LOTE', 195.34, 50788400.00, 'DISPONIBLE', '150m Playa'),
    (uuid_generate_v4(), '8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Lote 05', 'LOTE', 168.57, 43828200.00, 'VENDIDO', '150m Playa'),
    (uuid_generate_v4(), '8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Lote 06', 'LOTE', 164.25, 42705000.00, 'VENDIDO', '150m Playa'),
    (uuid_generate_v4(), '8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Lote 07', 'LOTE', 164.31, 42720600.00, 'VENDIDO', '150m Playa'),
    (uuid_generate_v4(), '8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Lote 08', 'LOTE', 177.46, 46139600.00, 'VENDIDO', '150m Playa'),
    (uuid_generate_v4(), '8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Lote 09', 'LOTE', 198.99, 51737400.00, 'VENDIDO', '150m Playa'),
    (uuid_generate_v4(), '8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Lote 10', 'LOTE', 166.89, 43391400.00, 'VENDIDO', '150m Playa'),
    (uuid_generate_v4(), '8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Lote 11', 'LOTE', 163.96, 42629600.00, 'VENDIDO', '150m Playa'),
    (uuid_generate_v4(), '8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Lote 12', 'LOTE', 152.49, 39647400.00, 'VENDIDO', '150m Playa'),
    (uuid_generate_v4(), '8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Lote 13', 'LOTE', 139.60, 36296000.00, 'VENDIDO', '150m Playa'),
    (uuid_generate_v4(), '8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Lote 14', 'LOTE', 194.49, 50567400.00, 'VENDIDO', '150m Playa'),
    (uuid_generate_v4(), '8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Lote 15', 'LOTE', 167.59, 43573400.00, 'VENDIDO', '150m Playa'),
    (uuid_generate_v4(), '8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Lote 16', 'LOTE', 166.99, 43417400.00, 'VENDIDO', '150m Playa'),
    (uuid_generate_v4(), '8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Lote 17', 'LOTE', 140.00, 36400000.00, 'VENDIDO', '150m Playa'),
    (uuid_generate_v4(), '8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Lote 18', 'LOTE', 144.61, 37598600.00, 'VENDIDO', '150m Playa'),
    (uuid_generate_v4(), '8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Lote 19', 'LOTE', 165.30, 42978000.00, 'VENDIDO', '150m Playa'),
    (uuid_generate_v4(), '8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Lote 20', 'LOTE', 168.00, 43680000.00, 'VENDIDO', '150m Playa'),
    (uuid_generate_v4(), '8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Lote 21', 'LOTE', 166.99, 43417400.00, 'VENDIDO', '150m Playa'),
    (uuid_generate_v4(), '8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Lote 22', 'LOTE', 140.00, 36400000.00, 'VENDIDO', '150m Playa'),
    (uuid_generate_v4(), '8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Lote 23', 'LOTE', 147.00, 38220000.00, 'VENDIDO', '150m Playa'),
    (uuid_generate_v4(), '8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Lote 24', 'LOTE', 179.34, 46628400.00, 'VENDIDO', '150m Playa'),
    (uuid_generate_v4(), '8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Lote 25', 'LOTE', 140.00, 36400000.00, 'VENDIDO', '150m Playa'),
    (uuid_generate_v4(), '8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Lote 26', 'LOTE', 137.64, 35786400.00, 'VENDIDO', '150m Playa'),
    (uuid_generate_v4(), '8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Lote 27', 'LOTE', 146.59, 38113400.00, 'VENDIDO', '150m Playa'),
    (uuid_generate_v4(), '8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Lote 28', 'LOTE', 146.86, 38183600.00, 'VENDIDO', '150m Playa'),
    (uuid_generate_v4(), '8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Lote 29', 'LOTE', 150.00, 39000000.00, 'VENDIDO', '150m Playa'),
    (uuid_generate_v4(), '8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Lote 30', 'LOTE', 140.00, 36400000.00, 'VENDIDO', '150m Playa'),
    (uuid_generate_v4(), '8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Lote 31', 'LOTE', 138.27, 35950200.00, 'VENDIDO', '150m Playa'),
    (uuid_generate_v4(), '8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Lote 32', 'LOTE', 145.32, 37783200.00, 'VENDIDO', '150m Playa'),
    (uuid_generate_v4(), '8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Lote 33', 'LOTE', 148.83, 38695800.00, 'VENDIDO', '150m Playa'),
    (uuid_generate_v4(), '8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Lote 34', 'LOTE', 205.64, 53466400.00, 'VENDIDO', '150m Playa'),
    (uuid_generate_v4(), '8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Lote 35', 'LOTE', 182.04, 47330400.00, 'VENDIDO', '150m Playa'),
    (uuid_generate_v4(), '8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Lote 36', 'LOTE', 144.19, 37489400.00, 'VENDIDO', '150m Playa'),
    (uuid_generate_v4(), '8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Lote 37', 'LOTE', 156.01, 40562600.00, 'VENDIDO', '150m Playa'),
    (uuid_generate_v4(), '8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Lote 38', 'LOTE', 189.00, 49140000.00, 'VENDIDO', '150m Playa'),
    (uuid_generate_v4(), '8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Lote 39', 'LOTE', 167.81, 43630600.00, 'VENDIDO', '150m Playa'),
    (uuid_generate_v4(), '8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Lote 40', 'LOTE', 144.31, 37520600.00, 'VENDIDO', '150m Playa'),
    (uuid_generate_v4(), '8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Lote 41', 'LOTE', 159.01, 41342600.00, 'VENDIDO', '150m Playa'),
    (uuid_generate_v4(), '8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Lote 42', 'LOTE', 148.47, 38602200.00, 'VENDIDO', '150m Playa'),
    (uuid_generate_v4(), '8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Lote 43', 'LOTE', 203.00, 52780000.00, 'VENDIDO', '150m Playa'),
    (uuid_generate_v4(), '8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Lote 44', 'LOTE', 180.00, 46800000.00, 'VENDIDO', '150m Playa'),
    (uuid_generate_v4(), '8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Lote 45', 'LOTE', 180.00, 46800000.00, 'VENDIDO', '150m Playa'),
    (uuid_generate_v4(), '8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Lote 46', 'LOTE', 234.63, 61003800.00, 'VENDIDO', '150m Playa'),
    (uuid_generate_v4(), '8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Lote 47', 'LOTE', 212.54, 55260400.00, 'DISPONIBLE', '150m Playa'),
    (uuid_generate_v4(), '8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Lote 48', 'LOTE', 193.10, 50206000.00, 'DISPONIBLE', '150m Playa'),
    (uuid_generate_v4(), '8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Lote 49', 'LOTE', 196.62, 51121200.00, 'DISPONIBLE', '150m Playa'),
    (uuid_generate_v4(), '8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Lote 50', 'LOTE', 177.44, 46134400.00, 'VENDIDO', '150m Playa'),
    (uuid_generate_v4(), '8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Lote 51', 'LOTE', 186.32, 48443200.00, 'DISPONIBLE', '150m Playa'),
    (uuid_generate_v4(), '8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Lote 52', 'LOTE', 253.17, 65824200.00, 'DISPONIBLE', 'Lotes XL'),
    (uuid_generate_v4(), '8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Lote 53', 'LOTE', 377.88, 98248800.00, 'DISPONIBLE', 'Lotes XL'),
    (uuid_generate_v4(), '8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Lote 54', 'LOTE', 405.00, 105300000.00, 'DISPONIBLE', 'Lotes XL'),
    (uuid_generate_v4(), '8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Lote 55', 'LOTE', 228.67, 59454200.00, 'VENDIDO', '150m Playa'),
    (uuid_generate_v4(), '8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Lote 56', 'LOTE', 200.00, 52000000.00, 'VENDIDO', '150m Playa'),
    (uuid_generate_v4(), '8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Lote 57', 'LOTE', 235.28, 61172800.00, 'VENDIDO', '150m Playa'),
    (uuid_generate_v4(), '8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Lote 58', 'LOTE', 265.09, 68923400.00, 'VENDIDO', 'Lotes XL'),
    (uuid_generate_v4(), '8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Lote 59', 'LOTE', 278.41, 72386600.00, 'VENDIDO', 'Lotes XL'),
    (uuid_generate_v4(), '8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Lote 60', 'LOTE', 294.46, 76559600.00, 'DISPONIBLE', 'Lotes XL'),
    (uuid_generate_v4(), '8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Lote 61', 'LOTE', 303.79, 78985400.00, 'VENDIDO', 'Lotes XL'),
    (uuid_generate_v4(), '8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Lote 62', 'LOTE', 303.58, 78930800.00, 'VENDIDO', 'Lotes XL'),
    (uuid_generate_v4(), '8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Lote 63', 'LOTE', 257.08, 66840800.00, 'DISPONIBLE', 'Lotes XL'),
    (uuid_generate_v4(), '8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Lote 64', 'LOTE', 259.70, 67522000.00, 'VENDIDO', 'Lotes XL'),
    (uuid_generate_v4(), '8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Lote 65', 'LOTE', 504.34, 131128400.00, 'VENDIDO', 'Lotes XL'),
    (uuid_generate_v4(), '8b6c778a-7393-415d-9bb2-ba01dcdf6a41', 'Lote 66', 'LOTE', 432.19, 112369400.00, 'DISPONIBLE', 'Lotes XL');
