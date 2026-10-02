---
name: skill-microservices
description: Directrices de arquitectura de microservicios, Event-Driven, y API Gateways.
---

# 🏢 Skill: Microservices & Distributed Architecture

Reglas para la evolución futura del monolito a un entorno distribuido.

## 📌 Reglas Clave:
1. **Base de Datos por Servicio:** Si la arquitectura es verdaderamente de microservicios, cada servicio (ej. Inventario de Lotes, Facturación, Usuarios) DEBE poseer y controlar su propia base de datos. Nada de DBs compartidas.
2. **Comunicación Asíncrona:** Usa eventos de dominio (Kafka / RabbitMQ) para comunicar cambios de estado (ej. "Lote Reservado") en lugar de llamadas sincrónicas HTTP directas que generan acoplamiento fuerte.
3. **API Gateway:** Oculta la complejidad de la red detrás de un API Gateway (ej. Spring Cloud Gateway) que centralice el ruteo, autenticación (validación de JWT) y rate limiting.
4. **Tolerancia a Fallos:** Implementar Circuit Breakers y Fallbacks para que la falla de un servicio de menor prioridad (ej. Recomendaciones) no tumbe el servicio principal (ej. Compra).
