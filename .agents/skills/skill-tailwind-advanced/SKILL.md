---
name: skill-tailwind-advanced
description: Técnicas avanzadas de Tailwind CSS, plugins y personalización del theme.
---

# 🌪️ Skill: Tailwind Advanced Techniques

Uso profesional de Tailwind CSS para evitar código spaghetti y mantener escalabilidad.

## 📌 Reglas Clave:
1. **Agrupación lógica:** Ordena las clases en un patrón predecible (Layout -> Flexbox/Grid -> Spacing -> Sizing -> Typography -> Backgrounds -> Borders -> Effects -> Transitions).
2. **Plugins Oficiales:** Asegúrate de configurar `@tailwindcss/forms`, `@tailwindcss/typography` o `@tailwindcss/container-queries` si son necesarios en `tailwind.config.ts`.
3. **Valores Arbitrarios:** Evita el abuso de valores arbitrarios (ej. `w-[317px]`). Extiende el theme en el archivo de configuración si el valor se usa múltiples veces.
4. **Responsive Modifiers:** Usa correctamente los breakpoints (`sm:`, `md:`, `lg:`) garantizando la estrategia Mobile-First.
