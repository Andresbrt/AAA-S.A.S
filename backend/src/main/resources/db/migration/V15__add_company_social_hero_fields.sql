-- Add new fields to company_info for full homepage customization

ALTER TABLE company_info
ADD COLUMN instagram_url VARCHAR(500),
ADD COLUMN facebook_url VARCHAR(500),
ADD COLUMN youtube_url VARCHAR(500),
ADD COLUMN hero_video_url VARCHAR(500),
ADD COLUMN hero_title VARCHAR(255),
ADD COLUMN hero_subtitle TEXT;

-- Update audit table as well
ALTER TABLE company_info_aud
ADD COLUMN instagram_url VARCHAR(500),
ADD COLUMN facebook_url VARCHAR(500),
ADD COLUMN youtube_url VARCHAR(500),
ADD COLUMN hero_video_url VARCHAR(500),
ADD COLUMN hero_title VARCHAR(255),
ADD COLUMN hero_subtitle TEXT;

-- Set default values for the existing row
UPDATE company_info
SET 
    hero_title = 'Vive el lujo en Armonía Natural',
    hero_subtitle = 'Explora nuestro selecto portafolio de lotes campestres, condominios y proyectos costeros. La mejor inversión para tu estilo de vida está aquí.',
    hero_video_url = '/video/drone.mp4'
WHERE hero_title IS NULL;
