ALTER TABLE company_info ADD COLUMN meta_title VARCHAR(255);
ALTER TABLE company_info ADD COLUMN meta_description TEXT;
ALTER TABLE company_info ADD COLUMN meta_keywords TEXT;

-- Envers auditing table update
ALTER TABLE company_info_aud ADD COLUMN meta_title VARCHAR(255);
ALTER TABLE company_info_aud ADD COLUMN meta_description TEXT;
ALTER TABLE company_info_aud ADD COLUMN meta_keywords TEXT;
