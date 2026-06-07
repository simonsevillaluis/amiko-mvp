# Plantilla De Tarea Para Agentes

Usa esta plantilla al pedir trabajo a Codex, Claude Code, Antigravity, Copilot u otro agente.

## Contexto

Proyecto: AMIKO.
Ruta: `C:\Users\Luis Simon\Documents\Amiko`

Lee primero:

- `AGENTS.md`
- `.agent-harness/shared/context.md`
- `.agent-harness/shared/product-rules.md`
- Track correspondiente en `.agent-harness/tracks/`

## Objetivo

Describe una tarea concreta.

Ejemplo:

> Crear un componente `TaskCard` reutilizable para mostrar tareas del adulto con estados `draft`, `adapted`, `in_progress` y `completed`.

## Archivos Relevantes

Lista los archivos o carpetas que debe revisar primero:

- `components/`
- `app/dashboard/page.tsx`
- `lib/`

## Limites

Indica que no debe tocar:

- No modificar autenticacion.
- No cambiar base de datos.
- No redisenar marca.
- No tocar modo nino.

## Criterios De Aceptacion

- El cambio compila.
- Respeta marca AMIKO.
- Tiene TypeScript.
- Maneja estados vacios o errores.
- No expone secretos.

## Como Verificar

- `npm run lint`
- `npm run build`
- Revision manual de la pantalla afectada.

## Handoff

Al terminar, el agente debe responder usando `.agent-harness/handoff-template.md`.
