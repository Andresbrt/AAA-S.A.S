-- V17: Soporte de control de concurrencia optimista (optimistic locking) e índices de inventario de lotes

ALTER TABLE properties ADD COLUMN IF NOT EXISTS version BIGINT NOT NULL DEFAULT 0;
ALTER TABLE properties_aud ADD COLUMN IF NOT EXISTS version BIGINT;

ALTER TABLE lots ADD COLUMN IF NOT EXISTS version BIGINT NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_lots_project ON lots(project_id);
CREATE UNIQUE INDEX IF NOT EXISTS uq_lots_project_number ON lots(project_id, lot_number);
