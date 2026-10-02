-- V11__enable_rls_all_tables.sql
-- Habilita Row Level Security (RLS) en todas las tablas del esquema public
-- Esto cierra el acceso a la API directa de Supabase (PostgREST)
-- Spring Boot (conectado vía usuario postgres con permisos de superusuario/BYPASSRLS) 
-- seguirá operando con normalidad.

DO $$
DECLARE
    row record;
BEGIN
    FOR row IN
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
          AND tablename != 'flyway_schema_history'
    LOOP
        EXECUTE 'ALTER TABLE public.' || quote_ident(row.tablename) || ' ENABLE ROW LEVEL SECURITY;';
    END LOOP;
END;
$$;
