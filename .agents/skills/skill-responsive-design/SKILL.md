---
name: skill-responsive-design
description: Patrones de diseño adaptable, CSS Grid, Flexbox y media queries.
---

# 📐 Skill: Responsive Design Patterns

Reglas para layouts que funcionen impecablemente en cualquier pantalla.

## 📌 Reglas Clave:
1. **Enfoque Mobile-First:** El código por defecto (sin media queries) asume una pantalla pequeña. Luego usa los prefijos de Tailwind (`sm:`, `md:`, `lg:`) para ajustar a pantallas más grandes.
2. **Grid Dinámico:** Prefiere `grid-template-columns: repeat(auto-fit, minmax(...))` cuando la cantidad de tarjetas/lotes es dinámica, en lugar de media queries rígidos.
3. **Imágenes Fluidas:** Siempre usa `max-w-full h-auto` (o en Next.js `layout="fill" objectFit="cover"`) para evitar que las imágenes rompan el contenedor horizontal.
4. **Áreas Táctiles:** Las áreas clicables en móviles deben tener un mínimo de 44x44 CSS pixels para evitar el síndrome del "dedo gordo".
