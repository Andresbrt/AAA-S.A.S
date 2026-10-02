---
name: skill-cicd-pipelines
description: Reglas para la construcción e integración continua con GitHub Actions.
---

# ⚙️ Skill: CI/CD Pipelines

Automatización estricta del flujo de entrega de valor.

## 📌 Reglas Clave:
1. **Lint & Test en PRs:** Todo Pull Request debe desencadenar un job de validación que corra el linter (ESLint / Checkstyle) y la suite completa de pruebas unitarias. Si fallan, el PR no se puede mergear.
2. **Dependencias Cacheadas:** Configura el caché estricto (ej. `actions/setup-java` o `actions/setup-node`) para evitar descargar el `.m2` o `node_modules` de internet en cada build, reduciendo el tiempo de despliegue a minutos.
3. **Security Scans:** Integra un paso en el pipeline para buscar vulnerabilidades (ej. Dependabot, SonarQube, o Trivy para escaneo de contenedores).
4. **Despliegues Sin Downtime:** Las subidas a producción deben utilizar estrategias Blue-Green Deployment o Rolling Updates en el cluster.
