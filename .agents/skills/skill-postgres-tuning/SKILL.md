---
name: skill-postgres-tuning
description: Directrices para optimización de consultas, índices y modelado en PostgreSQL.
---

# 🐘 Skill: PostgreSQL Tuning

Optimización profunda del motor de base de datos relacional.

## 📌 Reglas Clave:
1. **Tipos de Datos Correctos:** Usa `UUID` para claves primarias expuestas externamente, `TIMESTAMPTZ` para fechas, y `VARCHAR` con límites razonables.
2. **Índices Parciales:** Crea índices que filtren datos comunes (ej. `CREATE INDEX ON lotes (id) WHERE estado = 'DISPONIBLE'`) para búsquedas ultra-rápidas en el inventario activo.
3. **VACUUM:** Entiende el impacto del Autovacuum y diseña tablas evitando el update-bloat.
4. **Búsqueda de Texto:** Utiliza `tsvector` y `tsquery` nativos de Postgres en lugar de consultas ineficientes con `LIKE '%text%'`.
