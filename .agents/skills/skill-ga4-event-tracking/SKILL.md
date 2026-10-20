---
name: skill-ga4-event-tracking
description: Implementación técnica de Google Analytics 4 (GA4) y Google Tag Manager en aplicaciones Next.js (App Router).
---

# 📈 Skill: GA4 & Event Tracking en Next.js (App Router)

Reglas de implementación limpia para el seguimiento de eventos y conversiones en Next.js sin perjudicar los Core Web Vitals.

---

## 📌 1. Reglas Clave de Rendimiento

1. **Estrategia de Carga:** Siempre utilizar `next/script` con `strategy="afterInteractive"`. Nunca insertar scripts sincrónicos en el `<head>`.
2. **Defensividad en Cliente:** Comprobar siempre la existencia de `typeof window !== 'undefined'` y `window.gtag` antes de disparar eventos.
3. **Control de Entorno:**
   * En desarrollo (`localhost`), si no hay Measurement ID configurado (`process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID`), registrar los eventos en la consola del desarrollador con fines de depuración (`[GA4 Debug] Event:...`).
   * En producción, enviar los datos a los servidores de Google Analytics.

---

## 📐 2. Catálogo Oficial de Eventos del Proyecto

| Nombre del Evento | Parámetros Recomendados | Disparador (Trigger) |
|---|---|---|
| `page_view` | `page_path`, `page_title` | Al cambiar de ruta en Next.js |
| `lead_form_submitted` | `form_name`, `project_name`, `method` | Envío exitoso en ContactForm |
| `whatsapp_click` | `placement`, `target_number`, `message` | Clic en botón flotante o Navbar |
| `lot_selected` | `lot_number`, `lot_area`, `lot_price` | Clic en lote del Master Plan |
| `brochure_download` | `project_slug`, `project_name` | Descarga de PDF de Brochure |
| `faq_search` | `search_term`, `results_count` | Búsqueda en el acordeón de FAQs |
| `filter_projects` | `category_name` | Cambio de filtro en el catálogo |

---

## 💻 3. Ejemplo de Uso en Componente Cliente

```tsx
import { trackEvent } from '@/lib/analytics';

export function LotButton({ lotNumber, price }: { lotNumber: string; price: number }) {
  const handleClick = () => {
    trackEvent('lot_selected', {
      lot_number: lotNumber,
      lot_price: price,
      currency: 'COP',
    });
  };

  return <button onClick={handleClick}>Lote {lotNumber}</button>;
}
```
