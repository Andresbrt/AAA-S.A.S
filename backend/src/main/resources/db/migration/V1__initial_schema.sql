-- ═══════════════════════════════════════════════════════════════
-- V1 — Initial Schema for AAA S.A.S. Inmobiliaria
-- ═══════════════════════════════════════════════════════════════

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ───────────────────────────────────────────────────────────────
-- DEPARTMENTS
-- ───────────────────────────────────────────────────────────────
CREATE TABLE departments (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        VARCHAR(100) NOT NULL UNIQUE,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ───────────────────────────────────────────────────────────────
-- CITIES
-- ───────────────────────────────────────────────────────────────
CREATE TABLE cities (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(100) NOT NULL,
    department_id   UUID NOT NULL REFERENCES departments(id),
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (name, department_id)
);

CREATE INDEX idx_cities_department ON cities(department_id);

-- ───────────────────────────────────────────────────────────────
-- NEIGHBORHOODS
-- ───────────────────────────────────────────────────────────────
CREATE TABLE neighborhoods (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        VARCHAR(150) NOT NULL,
    city_id     UUID NOT NULL REFERENCES cities(id),
    created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (name, city_id)
);

CREATE INDEX idx_neighborhoods_city ON neighborhoods(city_id);

-- ───────────────────────────────────────────────────────────────
-- USERS
-- ───────────────────────────────────────────────────────────────
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email           VARCHAR(255) NOT NULL UNIQUE,
    password        VARCHAR(255) NOT NULL,
    name            VARCHAR(150) NOT NULL,
    role            VARCHAR(20) NOT NULL CHECK (role IN ('SUPER_ADMIN', 'ADMIN', 'EDITOR')),
    active          BOOLEAN NOT NULL DEFAULT TRUE,
    failed_attempts INT NOT NULL DEFAULT 0,
    locked_until    TIMESTAMP,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by      UUID,
    updated_by      UUID,
    deleted_at      TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

-- ───────────────────────────────────────────────────────────────
-- REFRESH TOKENS
-- ───────────────────────────────────────────────────────────────
CREATE TABLE refresh_tokens (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    token_hash  VARCHAR(255) NOT NULL UNIQUE,
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at  TIMESTAMP NOT NULL,
    revoked     BOOLEAN NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_hash ON refresh_tokens(token_hash);

-- ───────────────────────────────────────────────────────────────
-- COMPANY INFO (singleton row)
-- ───────────────────────────────────────────────────────────────
CREATE TABLE company_info (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name                VARCHAR(200) NOT NULL,
    about_us            TEXT,
    mission             TEXT,
    vision              TEXT,
    contact_email       VARCHAR(255),
    contact_phone       VARCHAR(50),
    contact_address     VARCHAR(500),
    logo_url            VARCHAR(500),
    created_at          TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by          UUID,
    updated_by          UUID
);

-- ───────────────────────────────────────────────────────────────
-- COMPANY SOCIAL LINKS
-- ───────────────────────────────────────────────────────────────
CREATE TABLE company_social_links (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id      UUID NOT NULL REFERENCES company_info(id) ON DELETE CASCADE,
    platform        VARCHAR(50) NOT NULL,
    url             VARCHAR(500) NOT NULL,
    display_order   INT NOT NULL DEFAULT 0,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ───────────────────────────────────────────────────────────────
-- TEAM MEMBERS
-- ───────────────────────────────────────────────────────────────
CREATE TABLE team_members (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name       VARCHAR(200) NOT NULL,
    position        VARCHAR(200) NOT NULL,
    bio             TEXT,
    photo_url       VARCHAR(500),
    display_order   INT NOT NULL DEFAULT 0,
    active          BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by      UUID,
    updated_by      UUID,
    deleted_at      TIMESTAMP
);

-- ───────────────────────────────────────────────────────────────
-- AMENITIES (catalog)
-- ───────────────────────────────────────────────────────────────
CREATE TABLE amenities (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        VARCHAR(100) NOT NULL UNIQUE,
    icon        VARCHAR(100),
    created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ───────────────────────────────────────────────────────────────
-- PROJECTS
-- ───────────────────────────────────────────────────────────────
CREATE TABLE projects (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name                VARCHAR(200) NOT NULL,
    slug                VARCHAR(250) NOT NULL UNIQUE,
    short_description   VARCHAR(500),
    long_description    TEXT,
    status              VARCHAR(30) NOT NULL DEFAULT 'BORRADOR'
                        CHECK (status IN ('BORRADOR','EN_PLANOS','EN_CONSTRUCCION','ENTREGADO','VENDIDO')),
    min_price           DECIMAL(15,2),
    max_price           DECIMAL(15,2),
    estimated_delivery  DATE,
    address             VARCHAR(500),
    latitude            DECIMAL(10,8),
    longitude           DECIMAL(11,8),
    is_featured         BOOLEAN NOT NULL DEFAULT FALSE,
    is_published        BOOLEAN NOT NULL DEFAULT FALSE,
    meta_title          VARCHAR(200),
    meta_description    VARCHAR(500),
    city_id             UUID REFERENCES cities(id),
    neighborhood_id     UUID REFERENCES neighborhoods(id),
    created_at          TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by          UUID,
    updated_by          UUID,
    deleted_at          TIMESTAMP
);

CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_city ON projects(city_id);
CREATE INDEX idx_projects_featured ON projects(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_projects_published ON projects(is_published) WHERE is_published = TRUE;
CREATE INDEX idx_projects_price ON projects(min_price, max_price);
CREATE INDEX idx_projects_name_trgm ON projects USING gin (name gin_trgm_ops);

-- ───────────────────────────────────────────────────────────────
-- PROJECT ↔ AMENITY (N:M)
-- ───────────────────────────────────────────────────────────────
CREATE TABLE project_amenities (
    project_id  UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    amenity_id  UUID NOT NULL REFERENCES amenities(id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, amenity_id)
);

-- ───────────────────────────────────────────────────────────────
-- PROPERTIES (units inside a project)
-- ───────────────────────────────────────────────────────────────
CREATE TABLE properties (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id      UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name            VARCHAR(200),
    type            VARCHAR(30) NOT NULL
                    CHECK (type IN ('APARTAMENTO','CASA','LOTE','LOCAL','OFICINA')),
    built_area      DECIMAL(10,2),
    private_area    DECIMAL(10,2),
    bedrooms        INT,
    bathrooms       INT,
    parking_spots   INT,
    stratum         INT CHECK (stratum BETWEEN 1 AND 6),
    price           DECIMAL(15,2),
    status          VARCHAR(20) NOT NULL DEFAULT 'DISPONIBLE'
                    CHECK (status IN ('DISPONIBLE','SEPARADO','VENDIDO')),
    floor_or_tower  VARCHAR(50),
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by      UUID,
    updated_by      UUID,
    deleted_at      TIMESTAMP
);

CREATE INDEX idx_properties_project ON properties(project_id);
CREATE INDEX idx_properties_type ON properties(type);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_price ON properties(price);

-- ───────────────────────────────────────────────────────────────
-- MEDIA FILES (polymorphic via entity_type + entity_id)
-- ───────────────────────────────────────────────────────────────
CREATE TABLE media_files (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_key        VARCHAR(500) NOT NULL,
    url             VARCHAR(1000) NOT NULL,
    original_name   VARCHAR(300),
    content_type    VARCHAR(100),
    file_size       BIGINT,
    media_type      VARCHAR(20) NOT NULL
                    CHECK (media_type IN ('IMAGE','VIDEO','PLAN','BROCHURE')),
    display_order   INT NOT NULL DEFAULT 0,
    alt_text        VARCHAR(300),
    entity_type     VARCHAR(30) NOT NULL
                    CHECK (entity_type IN ('PROJECT','PROPERTY','TEAM_MEMBER','COMPANY')),
    entity_id       UUID NOT NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by      UUID
);

CREATE INDEX idx_media_entity ON media_files(entity_type, entity_id);
CREATE INDEX idx_media_order ON media_files(entity_type, entity_id, display_order);

-- ───────────────────────────────────────────────────────────────
-- LEADS (contact forms / interested parties)
-- ───────────────────────────────────────────────────────────────
CREATE TABLE leads (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name       VARCHAR(200) NOT NULL,
    email           VARCHAR(255) NOT NULL,
    phone           VARCHAR(30),
    message         TEXT,
    origin          VARCHAR(50),
    status          VARCHAR(20) NOT NULL DEFAULT 'NUEVO'
                    CHECK (status IN ('NUEVO','CONTACTADO','CERRADO')),
    data_consent    BOOLEAN NOT NULL DEFAULT FALSE,
    honeypot        VARCHAR(255),
    project_id      UUID REFERENCES projects(id),
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_by      UUID
);

CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_project ON leads(project_id);
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_created ON leads(created_at DESC);
