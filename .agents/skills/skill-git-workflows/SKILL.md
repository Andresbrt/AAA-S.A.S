---
name: skill-git-workflows
description: Protocolos de control de versiones, Trunk-Based Development, y convenciones de commits.
---

# 🌿 Skill: Git Workflows & Commit Standards

Reglas para la colaboración en repositorios de Grupo AAA.

## 📌 Reglas Clave:
1. **Conventional Commits:** Todo commit debe seguir la convención: `tipo(scope): descripción breve`. Ejemplos de tipo: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`.
2. **Trunk-Based Development:** Prefiere ramas de vida corta que se integren rápidamente a `main` mediante Pull Requests pequeños, en lugar de largas ramas de `feature` (GitFlow).
3. **Rebase vs Merge:** Usa `git rebase` para actualizar tu rama local con los cambios de `main`, manteniendo un historial lineal y limpio antes de hacer merge.
4. **Protección de Ramas:** La rama `main` debe estar protegida. Nadie hace push directo. Todo cambio pasa por PR y requiere aprobación y paso exitoso de CI/CD.
