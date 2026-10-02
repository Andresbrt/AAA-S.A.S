-- V9: Create lots table for project masterplans

CREATE TABLE lots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lot_number INTEGER NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'DISPONIBLE',
    area_m2 DECIMAL(10,2),
    price_cop DECIMAL(15,2),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by UUID,
    updated_by UUID
);
