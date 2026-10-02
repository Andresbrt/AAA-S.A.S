---
name: skill-logging
description: Estándares para logging estructurado, ELK Stack y monitoreo.
---

# 📜 Skill: Logging & Observability

Reglas sobre cómo generar trazas de ejecución útiles y monitoreables.

## 📌 Reglas Clave:
1. **Logging Estructurado (JSON):** Abandona el log de texto plano (`logger.info("El usuario " + id + " ingresó")`). Envía logs estructurados en JSON a stdout, donde el id es un campo indexable. Esto permite búsquedas eficientes en Datadog o Kibana.
2. **Niveles Correctos:**
   - `ERROR`: Para fallos graves que requieren atención inmediata y que impactan al usuario.
   - `WARN`: Para situaciones anómalas pero recuperables.
   - `INFO`: Hitos importantes de la aplicación (ej. "Sistema iniciado", "Sincronización terminada").
   - `DEBUG`: Información de seguimiento útil para desarrollo (no activa en Producción).
3. **Correlation IDs:** Usa `MDC` (Mapped Diagnostic Context) en Spring Boot para generar un UUID único por cada request HTTP entrante. Este ID debe propagarse en todos los logs y llamadas a microservicios relacionados a ese request.
4. **PII Masking:** NUNCA loguees contraseñas, tokens JWT completos, ni información financiera (Tarjetas). Enmascara o elimina estos datos antes de que lleguen al sistema de recolección de logs.
