---
name: skill-api-error-handling
description: Estandarización de respuestas HTTP de error según RFC 7807 (Problem Details).
---

# 🚨 Skill: API Error Handling (RFC 7807)

Contratos estrictos para la comunicación de errores del Backend al Frontend.

## 📌 Reglas Clave:
1. **No Stack Traces:** Nunca devolver el Stack Trace interno de Java o SQL al frontend.
2. **Formato Estándar:** Todos los errores HTTP 4xx y 5xx deben devolver un JSON bajo el estándar RFC 7807 `ProblemDetails`:
   `{ "type": "https://api.grupoaaa.com/errors/bad-request", "title": "Invalid Input", "status": 400, "detail": "El email no es válido." }`
3. **ControllerAdvice:** Centralizar todo el manejo de excepciones de Spring Boot en un `@RestControllerAdvice`.
4. **Códigos Semánticos:** Usa 400 para errores de validación, 401 para falta de token, 403 para falta de permisos, 404 para entidades no encontradas, 409 para conflictos (ej. Lote ya vendido).
