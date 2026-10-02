---
name: skill-spring-security
description: Directrices para la implementación segura de Spring Security 6+.
---

# 🔐 Skill: Spring Security 6

Reglas de configuración para el firewall de la aplicación backend.

## 📌 Reglas Clave:
1. **SecurityFilterChain:** Usa la nueva API basada en lambdas para configurar el `SecurityFilterChain` en lugar del obsoleto `WebSecurityConfigurerAdapter`.
2. **Stateless:** La aplicación debe configurarse como `SessionCreationPolicy.STATELESS` ya que usaremos tokens JWT.
3. **CORS y CSRF:** Configura un `CorsConfigurationSource` estricto permitiendo solo los orígenes del frontend de producción y desarrollo. Deshabilita CSRF ya que la app es stateless.
4. **Manejo de Excepciones:** Proveer un `AuthenticationEntryPoint` y `AccessDeniedHandler` personalizados para retornar respuestas JSON estándar (RFC 7807) en lugar del HTML por defecto.
