---
name: skill-hibernate-jpa
description: Mejores prácticas para el ORM de Java, prevención de problemas N+1 y caching de segundo nivel.
---

# 📝 Skill: Hibernate & Spring Data JPA

Manipulación eficiente de entidades en Java.

## 📌 Reglas Clave:
1. **Problema N+1:** Evitar sentencias lazy cargadas iterativamente. Usa `@EntityGraph` o `JOIN FETCH` en consultas personalizadas de Spring Data para cargar asociaciones de forma eager cuando se necesiten.
2. **Proyecciones:** Cuando no necesites modificar datos, usa proyecciones (DTOs mediante constructores JPQL) en lugar de retornar entidades administradas completas para ahorrar memoria.
3. **Lógica en Entidades vs Servicios:** Mantén las Entidades lo más anémicas posibles con respecto a dependencias de base de datos, pero ricas en comportamiento de dominio puro (validaciones internas).
4. **Auditoría:** Usa `@CreatedDate`, `@LastModifiedDate` de Spring Data JPA Auditing para trazar la creación y modificación de reservas o lotes.
