# the-cy-studio — Project constraints

Metodología general en `~/.claude/CLAUDE.md` (The CY Studio System Core). Este archivo cubre solo lo específico de este proyecto.

## Design language

- **Identidad**: fondo `paper` (#F1EFEA), tinta `ink` (#12110E) y `ink-soft` (#43413B), acento `cobalt` (#1E2BE0). Tipos: `font-display` (Space Grotesk) para títulos, `font-body` (Inter) para texto, `font-mono` (Space Mono) para detalles técnicos (`tracking-[.16em]` uppercase estilo "tag").
- **Semántica de estados**: en `CoreControl`, `solid` = activo/seleccionado en todo el sitio (la negrita es portadora de ese significado). `soft` = neutro. No rompas ese convenio.
- **Voz de copy**: presente, sin jerga, y siempre **ES + EN** vía la i18n por diccionario (`app/data/i18n.ts`, `LocalizedText = { es; en }`). Los títulos dicen exactamente lo que es el producto.
- **Restricción técnica**: hay interacciones finas (drag & drop en galería, carril de posiciones de visuales con anclas por URL de imagen, subidas asíncronas firmadas, mosaico medido con GSAP ScrollTrigger). Cada iteración debe caber en esa arquitectura — si un fix pide desmontarla, dilo explícitamente y marca el techo `ponytail:` en lugar de sobre-ingeniar.
- **Contraste específico**: calcula el color efectivo con las alphas contra `paper` (p. ej. `text-ink-soft/60` sobre `paper` no llega a 4.5:1; `/80` y `ink-soft` pleno sí).

Movido desde `agents/ui-auditor.md` (System Core) el 2026-09-22 — ese archivo es compartido entre proyectos y no debe cargar tokens de uno solo. `ui-auditor` y `frontend-engineer` deben leer este archivo antes de auditar/construir en este repo.
