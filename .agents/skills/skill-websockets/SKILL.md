---
name: skill-websockets
description: Directrices para comunicación bidireccional y actualizaciones en tiempo real.
---

# 📡 Skill: WebSockets & Real-Time

Manejo de conexiones activas para disponibilidad de lotes en tiempo real.

## 📌 Reglas Clave:
1. **Spring WebSockets:** Utiliza STOMP sobre WebSockets para enviar mensajes tipificados entre Spring Boot y Next.js.
2. **Reconexión Automática:** El cliente frontend debe implementar lógica de reconexión exponencial y backoff en caso de caídas de conexión.
3. **Desacoplamiento:** Usa WebSockets solo para alertas (ej. "Un usuario ha reservado el Lote 05"). No envíes enormes payloads; envía notificaciones que triggeren refetches via REST/SWR.
4. **Seguridad:** Los endpoints de WebSocket (ej. `/ws`) también deben requerir autenticación JWT durante el handshake.
