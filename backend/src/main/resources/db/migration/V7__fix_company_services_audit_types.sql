-- V7: Fix company_services audit columns types from VARCHAR to UUID

ALTER TABLE company_services 
ALTER COLUMN created_by TYPE UUID USING created_by::UUID,
ALTER COLUMN updated_by TYPE UUID USING updated_by::UUID;
