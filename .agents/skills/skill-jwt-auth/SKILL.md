---
name: skill-jwt-auth
description: Estándares para el manejo de JSON Web Tokens en Frontend y Backend.
---

# 🔑 Skill: JWT Authentication

Implementación segura de flujos de autenticación stateless.

## 📌 Reglas Clave:
1. **Almacenamiento Seguro:** En el frontend, NUNCA guardes el Access Token en `localStorage`. Guárdalo en memoria, y guarda el Refresh Token en una cookie `HttpOnly`, `Secure`, `SameSite=Strict`.
2. **Tiempos de Vida Cortos:** Los Access Tokens deben expirar rápido (ej. 15-30 minutos). El Refresh Token puede durar más (ej. 7 días).
3. **Firmas y Algoritmos:** El backend debe firmar los JWT utilizando algoritmos robustos como RS256 con pares de claves asimétricas, no HS256 con contraseñas débiles.
4. **Revocación:** Implementar una lista de tokens revocados (blacklist temporal en Redis) para el cierre de sesión, o usar el approach de Family Tokens.
