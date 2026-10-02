---
name: skill-nextjs-routing
description: Directrices para el uso correcto del App Router, Intercepting Routes y Parallel Routes.
---

# 🚦 Skill: Next.js App Router

Estructuración de navegación avanzada en Next.js.

## 📌 Reglas Clave:
1. **Carpetas Privadas:** Usa el prefijo `_` (ej. `_components`) para carpetas dentro de `app/` que no deben ser tratadas como rutas accesibles por URL.
2. **Grupos de Rutas:** Usa `(nombres)` (ej. `(auth)`, `(dashboard)`) para compartir Layouts sin afectar la estructura de la URL visible.
3. **Parallel & Intercepting Routes:** Usa `@folder` y `(..)folder` para implementar modales avanzados (ej. abrir los detalles de un lote en un modal sobre la página del Master Plan, pero que tengan su propia URL compartible).
4. **Loading & Error:** Implementa siempre `loading.tsx` y `error.tsx` en puntos críticos del árbol de rutas para mejorar la UX percibida.
