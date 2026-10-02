# Reglas Generales del Proyecto: Corales del Viento

## Arquitectura Base
- **Frontend**: Ubicado en `/frontend/`. Usamos Next.js 16 (App Router), Tailwind CSS y TypeScript.
- **Backend**: Ubicado en `/backend/`. Usamos Java 21, Spring Boot 3, y PostgreSQL.
- **Flujo de Datos**: El Frontend es "cliente ligero" en cuanto a reglas de negocio. Todo el inventario, disponibilidad, usuarios, y pasarelas de pago se gestionan desde el Backend vía REST API.

## Pautas Estilísticas
- Diseño "Ultra Lujo / Mar Caribe".
- Utilizar siempre el archivo `frontend/src/app/globals.css` como la biblia de componentes, variables CSS (`var(--color-primary-ocean)`) y clases globales (`.btn-primary-glow`).

## Reglas Innegociables
1. Nunca hardcodear (quemar en el código del frontend) precios de lotes.
2. Nunca crear scripts SQL que rompan el historial de Flyway. Siempre crear una migración nueva (ej. `V3__Nombre.sql`).
3. Al interactuar con el entorno del usuario, respeta las rutas relativas al Workspace actual.
