---
name: skill-caching
description: Estrategias de Caché: Redis, CDN, Caché HTTP, Next.js ISR.
---

# 🚀 Skill: Caching Strategies

Reglas para no saturar las bases de datos y responder en milisegundos.

## 📌 Reglas Clave:
1. **Patrón Cache-Aside:** La aplicación consulta primero el caché (ej. Redis). Si no está (Miss), va a la DB, lo guarda en caché, y retorna. Esta es la regla por defecto para datos consultados frecuentemente.
2. **Invalidación Activa:** El mayor desafío del caché es cuándo invalidarlo. Usa eventos de dominio o AOP (ej. `@CacheEvict` en Spring) para borrar/actualizar la caché tan pronto como los datos subyacentes cambien en la DB.
3. **Next.js ISR (Incremental Static Regeneration):** Para la página principal y catálogos, genera las páginas estáticamente y configúralas para revalidarse cada `X` segundos o bajo demanda (`revalidateTag`) cuando el backend notifique un cambio de precio o estado.
4. **Evitar Stampeding Herd:** Si un caché clave expira y 1000 usuarios lo piden simultáneamente, los 1000 irán a la DB y la tumbarán. Usa mecanismos de *lock* (Mutex) o actualización asíncrona en background.
