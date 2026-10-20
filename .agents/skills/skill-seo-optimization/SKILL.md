---
name: skill-seo-optimization
description: Técnicas de posicionamiento en buscadores para aplicaciones Next.js.
---

# 🔍 Skill: SEO & Metadata para Next.js (App Router)

Garantizar la máxima visibilidad orgánica y autoridad técnica del proyecto inmobiliario.

---

## 📌 Reglas Clave:

1. **Next.js Metadata API:**
   * Utiliza `export const metadata: Metadata = {...}` en Server Components para generar títulos, descripciones, palabras clave, canonicals y etiquetas Open Graph dinámicas.
   * Utiliza `metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://grupoaaa.com.co')` para resolver rutas relativas de imágenes OG y canonicals.

2. **Open Graph & Twitter Cards:**
   * Configura las imágenes y descripciones enriquecidas (`summary_large_image`) para asegurar que cuando el enlace se comparta en WhatsApp, Facebook o LinkedIn, se vea una previsualización de ultra lujo.
   * Especificar dimensiones recomendadas: 1200x630 píxeles con relación de aspecto 1.91:1.

3. **Sitemap y Robots Dinámicos:**
   * Mantener `app/sitemap.ts` generando un XML indexable con prioridades (`priority: 1.0` para home, `0.8` para proyectos) y `changeFrequency`.
   * Mantener `app/robots.ts` permitiendo la indexación de páginas públicas y restringiendo rutas sensibles (`/admin/`, `/login`, `/api/`).

4. **Datos Estructurados (Schema.org / JSON-LD):**
   * Inserta scripts `<script type="application/ld+json">` con esquemas oficiales como `RealEstateListing`, `Organization`, `FAQPage` y `BreadcrumbList`.

5. **Rendimiento y Core Web Vitals:**
   * LCP < 2.5s mediante optimización de imágenes (`next/image` con tamaños `sizes` bien definidos y `priority` en imágenes del viewport inicial).
   * CLS = 0 evitando elementos flotantes sin reserva de espacio.
   * Preconexión de fuentes con `next/font` de Google Fonts (subconjunto `latin` y variable CSS).
