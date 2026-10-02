-- V8: Add missing audit columns to Envers tables

ALTER TABLE projects_aud 
ADD COLUMN created_at TIMESTAMP, 
ADD COLUMN updated_at TIMESTAMP;

ALTER TABLE properties_aud 
ADD COLUMN created_at TIMESTAMP, 
ADD COLUMN updated_at TIMESTAMP;

ALTER TABLE company_info_aud 
ADD COLUMN created_at TIMESTAMP, 
ADD COLUMN updated_at TIMESTAMP;

ALTER TABLE leads_aud 
ADD COLUMN created_at TIMESTAMP, 
ADD COLUMN updated_at TIMESTAMP,
ADD COLUMN created_by UUID;

ALTER TABLE company_services_aud 
ADD COLUMN created_at TIMESTAMP, 
ADD COLUMN updated_at TIMESTAMP,
ADD COLUMN created_by UUID,
ADD COLUMN updated_by UUID;
