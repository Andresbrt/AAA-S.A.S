---
name: skill-dockerization
description: Mejores prácticas para escribir Dockerfiles y docker-compose.yml seguros y ligeros.
---

# 🐳 Skill: Dockerization

Prácticas estándar para empaquetar aplicaciones del Grupo AAA.

## 📌 Reglas Clave:
1. **Multi-stage Builds:** Utiliza construcciones en múltiples etapas. Compila el código Java/Node en una imagen pesada (builder) y copia solo los binarios resultantes a una imagen distroless o alpine muy ligera.
2. **Capas de Caché:** Ordena las instrucciones del Dockerfile desde las que cambian con menos frecuencia (instalar dependencias) hasta las que cambian constantemente (copiar código fuente).
3. **Usuarios no root:** Agrega un usuario explícito `USER node` o `USER spring` para no ejecutar la aplicación como root dentro del contenedor.
4. **Salud del Contenedor:** Siempre incluye directivas `HEALTHCHECK` comprobando el endpoint `/actuator/health` o `/api/health`.
