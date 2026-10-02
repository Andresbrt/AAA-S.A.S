---
name: skill-state-management
description: Guía para el manejo de estado global vs local en React usando Zustand y Context API.
---

# 🧠 Skill: State Management

Reglas para evitar el prop-drilling y re-renders innecesarios en el Frontend.

## 📌 Reglas Clave:
1. **Estado Local Primero:** Siempre prefiere `useState` o `useReducer` para estado que solo afecta a un componente y sus hijos directos.
2. **Zustand para Globales:** Usa Zustand en lugar de Redux para estados globales ligeros (ej. UI Theme, panel de carrito, filtros del Master Plan).
3. **Context API:** Usa `React.Context` estrictamente para inyección de dependencias (ej. Tema, Sesión) y no para estados que cambian muy rápido, ya que provoca re-renders en todos los consumidores.
4. **Estado del Servidor:** NUNCA dupliques datos del backend en un estado global (Zustand/Redux). Usa React Query o SWR para gestionar la caché de datos de la API.
