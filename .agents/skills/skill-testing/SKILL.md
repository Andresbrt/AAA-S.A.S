---
name: skill-testing
description: Estándares para testing, TDD, Mocks, Stubs y aserciones.
---

# 🛡️ Skill: Testing Standards

Garantías de calidad a través del código.

## 📌 Reglas Clave:
1. **Patrón AAA:** Estructura todos los tests usando el patrón Arrange (Preparar el contexto), Act (Ejecutar la función), Assert (Comprobar el resultado).
2. **No probar Detalles de Implementación:** Prueba la interfaz pública y el comportamiento esperado (lo que retorna, lo que hace), no cómo está escrito el código internamente. 
3. **Mocks Apropiados:** En pruebas unitarias, mockea (ej. `Mockito.mock()`) dependencias externas como bases de datos, APIs o el reloj del sistema. Pero NO mockees lógica de negocio interna (eso debe probarse).
4. **Testcontainers:** Para pruebas de integración en Spring Boot, ABANDONA la base de datos H2 en memoria. Usa `Testcontainers` para levantar una instancia real efímera de PostgreSQL en un contenedor Docker, garantizando paridad exacta con Producción.
