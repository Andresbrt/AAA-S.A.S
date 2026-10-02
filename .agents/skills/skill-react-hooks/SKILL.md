---
name: skill-react-hooks
description: Mejores prácticas y reglas para el uso de React Hooks (useState, useEffect, useMemo, useCallback).
---

# 🪝 Skill: React Hooks Mastery

Define las reglas estrictas para usar React Hooks en componentes del Frontend.

## 📌 Reglas Clave:
1. **Reglas de Hooks:** Solo llamar Hooks en el nivel superior y dentro de componentes React o Custom Hooks.
2. **Dependencias Exhaustivas:** El array de dependencias de `useEffect`, `useMemo` y `useCallback` debe contener TODAS las variables reactivas utilizadas dentro del hook. Nunca dejes dependencias vacías a menos que sea intencional (onMount).
3. **Evitar useEffect innecesarios:** Si un estado puede derivarse de otro durante el renderizado, NO uses un `useEffect` para sincronizarlos.
4. **Optimización:** Usa `useMemo` y `useCallback` solo cuando estés pasando funciones/objetos a componentes hijos envueltos en `React.memo` o cuando un cálculo sea verdaderamente costoso.
