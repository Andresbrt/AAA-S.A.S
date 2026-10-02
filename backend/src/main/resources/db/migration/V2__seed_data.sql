-- ═══════════════════════════════════════════════════════════════
-- V2 — Seed reference data: departments, cities, amenities
-- ═══════════════════════════════════════════════════════════════

-- ── Departments (Colombia) ────────────────────────────────────
INSERT INTO departments (id, name) VALUES
    ('a1000000-0000-0000-0000-000000000001', 'Bolívar'),
    ('a1000000-0000-0000-0000-000000000002', 'Atlántico'),
    ('a1000000-0000-0000-0000-000000000003', 'Sucre'),
    ('a1000000-0000-0000-0000-000000000004', 'Magdalena'),
    ('a1000000-0000-0000-0000-000000000005', 'Córdoba'),
    ('a1000000-0000-0000-0000-000000000006', 'Cundinamarca'),
    ('a1000000-0000-0000-0000-000000000007', 'Antioquia');

-- ── Cities ────────────────────────────────────────────────────
INSERT INTO cities (id, name, department_id) VALUES
    ('b1000000-0000-0000-0000-000000000001', 'Cartagena',     'a1000000-0000-0000-0000-000000000001'),
    ('b1000000-0000-0000-0000-000000000002', 'Barranquilla',  'a1000000-0000-0000-0000-000000000002'),
    ('b1000000-0000-0000-0000-000000000003', 'Santa Marta',   'a1000000-0000-0000-0000-000000000004'),
    ('b1000000-0000-0000-0000-000000000004', 'Sincelejo',     'a1000000-0000-0000-0000-000000000003'),
    ('b1000000-0000-0000-0000-000000000005', 'Montería',      'a1000000-0000-0000-0000-000000000005'),
    ('b1000000-0000-0000-0000-000000000006', 'Bogotá',        'a1000000-0000-0000-0000-000000000006'),
    ('b1000000-0000-0000-0000-000000000007', 'Medellín',      'a1000000-0000-0000-0000-000000000007'),
    ('b1000000-0000-0000-0000-000000000008', 'Turbaco',       'a1000000-0000-0000-0000-000000000001');

-- ── Amenities ─────────────────────────────────────────────────
INSERT INTO amenities (name, icon) VALUES
    ('Piscina',           'pool'),
    ('Gimnasio',          'fitness'),
    ('Zona BBQ',          'grill'),
    ('Parque infantil',   'playground'),
    ('Salón social',      'event-room'),
    ('Cancha de tenis',   'tennis'),
    ('Senderos ecológicos','trail'),
    ('Seguridad 24h',     'security'),
    ('Parqueadero cubierto','parking'),
    ('Zona verde',        'garden'),
    ('Jacuzzi',           'hot-tub'),
    ('Portería',          'gate'),
    ('Pet friendly',      'pet'),
    ('Cicloruta',         'bike');

-- ── Company Info (singleton) ──────────────────────────────────
INSERT INTO company_info (id, name, about_us, mission, vision, contact_email, contact_phone, contact_address) VALUES
    ('c1000000-0000-0000-0000-000000000001',
     'AAA S.A.S.',
     'Somos una empresa inmobiliaria comprometida con el desarrollo de proyectos campestres y costeros en el Caribe colombiano.',
     'Desarrollar proyectos inmobiliarios de alta calidad que transformen la calidad de vida de nuestros clientes.',
     'Ser la inmobiliaria líder del Caribe colombiano, reconocida por la excelencia de nuestros proyectos.',
     'info@aaasas.com',
     '+57 300 000 0000',
     'Cartagena de Indias, Bolívar, Colombia');
