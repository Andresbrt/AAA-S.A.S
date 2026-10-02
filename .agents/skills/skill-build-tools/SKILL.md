---
name: skill-build-tools
description: Optimización del proceso de build con Turbopack, Webpack, Maven y Gradle.
---

# 🏗️ Skill: Build Tools & Bundling

Estandarización del empaquetado de aplicaciones.

## 📌 Reglas Clave:
1. **Next.js Compiler:** Prioriza el uso del compilador de Rust (SWC) y Turbopack (en dev) sobre Babel y Webpack para tiempos de compilación HMR ultra-rápidos.
2. **Maven/Gradle:** En Spring Boot, mantén el `pom.xml` limpio. Agrupa las dependencias lógicamente (Spring, DB, Utils, Test) y usa propiedades `<properties>` para manejar las versiones centralizadamente.
3. **Tree Shaking:** Asegúrate de importar módulos específicos en JS/TS (ej. `import { isDate } from 'date-fns'`) en lugar del paquete entero, permitiendo al bundler eliminar el código muerto.
4. **Análisis de Bundle:** Configura `@next/bundle-analyzer` para auditar el tamaño de los chunks en producción y detectar librerías pesadas (como moment.js o lodash completo).
