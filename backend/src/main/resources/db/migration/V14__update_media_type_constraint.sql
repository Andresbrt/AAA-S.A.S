ALTER TABLE media_files DROP CONSTRAINT IF EXISTS media_files_media_type_check;

ALTER TABLE media_files ADD CONSTRAINT media_files_media_type_check 
CHECK (media_type IN ('MAIN_IMAGE', 'BANNER_IMAGE', 'GALLERY_IMAGE', 'LOGO', 'DOCUMENT', 'VIDEO', 'IMAGE', 'PLAN', 'BROCHURE'));
