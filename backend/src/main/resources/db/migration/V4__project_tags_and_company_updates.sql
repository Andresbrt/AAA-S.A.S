-- V4: Add Project Tags, Company Services and WhatsApp info

-- 1. Add tags to projects using a collection table
CREATE TABLE project_tags (
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    tag VARCHAR(255) NOT NULL
);

-- 2. Add whatsapp fields to company_info
ALTER TABLE company_info 
ADD COLUMN whatsapp_number VARCHAR(50),
ADD COLUMN whatsapp_message VARCHAR(500);

-- 3. Add company_services table
CREATE TABLE company_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(255),
    display_order INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100)
);

-- 4. Audit tables for company_services
CREATE TABLE company_services_aud (
    id UUID NOT NULL,
    rev INTEGER NOT NULL REFERENCES revinfo(rev),
    revtype SMALLINT,
    title VARCHAR(255),
    description TEXT,
    icon VARCHAR(255),
    display_order INTEGER,
    PRIMARY KEY (id, rev)
);

-- Note: company_info_aud needs to be updated too
ALTER TABLE company_info_aud
ADD COLUMN whatsapp_number VARCHAR(50),
ADD COLUMN whatsapp_message VARCHAR(500);
