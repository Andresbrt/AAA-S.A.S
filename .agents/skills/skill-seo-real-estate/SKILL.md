---
name: skill-seo-real-estate
description: Estrategias avanzadas de SEO para el sector inmobiliario de lujo, parcelaciones campestres y lotes en el Caribe Colombiano.
---

# 🏖️ Skill: SEO Inmobiliario de Ultra Lujo (Caribe Colombiano)

Directrices y tácticas para dominar las búsquedas de alta intención de compra e inversión en finca raíz turística y campestre en Colombia.

---

## 🎯 1. Matriz de Palabras Clave de Alta Intención (Keyword Clusters)

### Cluster A: Transaccionales / Compra Directa
* `lotes en venta frente al mar san bernardo del viento`
* `lotes campestres cordoba colombia`
* `condominio cerrado playa caribe colombiano`
* `venta de lotes con escritura publica cerca al mar`
* `parcelacion corales del viento san bernardo`

### Cluster B: Inversión & Rentabilidad
* `inversion inmobiliaria caribe colombiano plusvalia`
* `comprar lote cerca a isla fuerte y archipielago san bernardo`
* `rentabilidad de lotes turisticos frente a la playa colombia`
* `lotes con financiacion directa sin bancos caribe`

### Cluster C: Estilo de Vida & Construcción Bioclimática
* `casas campestres bioclimaticas en el caribe`
* `lotes ecologicos sostenibles cerca al mar`
* `vivir frente a la playa san bernardo del viento cordoba`

---

## 🏗️ 2. Plantilla Schema.org (JSON-LD) para Proyectos Inmobiliarios

Insertar en el componente Server Component de la página del proyecto (ej. `app/proyectos/[slug]/page.tsx`):

```json
{
  "@context": "https://schema.org",
  "@type": "RealEstateListing",
  "name": "Corales del Viento - Condominio Campestre Frente al Mar",
  "description": "Exclusivo condominio de lotes campestres a 150m del mar Caribe en San Bernardo del Viento, Córdoba. Escritura pública individual y financiación directa.",
  "url": "https://grupoaaa.com.co/proyectos/corales-del-viento",
  "image": "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Sector Playas del Viento",
    "addressLocality": "San Bernardo del Viento",
    "addressRegion": "Córdoba",
    "postalCode": "231010",
    "addressCountry": "CO"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 9.354200,
    "longitude": -75.952100
  },
  "offers": {
    "@type": "AggregateOffer",
    "priceCurrency": "COP",
    "lowPrice": "48443200",
    "highPrice": "150000000",
    "offerCount": "66",
    "availability": "https://schema.org/InStock"
  }
}
```

---

## 📑 3. Directrices E-E-A-T (Experiencia, Especialización, Autoridad y Confianza)
1. **Blindaje Notarial Explícito:** Mencionar que cada lote cuenta con matrícula inmobiliaria independiente libre de gravámenes.
2. **Ubicación Geográfica Precisa:** No limitarse a "Costa Caribe"; especificar coordenadas exactas, distancia a la playa (150m), municipios aledaños (San Bernardo del Viento, Lorica, Moñitos) y puntos de referencia náuticos (Isla Fuerte).
3. **Información de la Desarrolladora:** Citar explícitamente a *Grupo AAA S.A.S.* con sus años de trayectoria (+12 años) y canales de contacto verificados.
