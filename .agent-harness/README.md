# AMIKO Agent Harness

Este harness es la memoria operativa compartida para trabajar AMIKO con varios agentes sin perder coherencia.

## Como Usarlo

Antes de pedir una tarea a un agente, dale este contexto:

```text
Trabaja en C:\Users\Luis Simon\Documents\Amiko.
Lee AGENTS.md y la carpeta .agent-harness antes de editar.
Usa el track correspondiente a tu tarea.
Al terminar, responde con .agent-harness/handoff-template.md.
```

## Estructura

```text
.agent-harness/
  README.md
  shared/
    context.md
    product-rules.md
    coding-rules.md
    ux-rules.md
    safety-privacy.md
  tracks/
    frontend.md
    backend.md
    pedagogical.md
    devops.md
  task-template.md
  review-template.md
  handoff-template.md
```

## Orden De Lectura

Para cualquier agente:

1. `AGENTS.md`
2. `.agent-harness/shared/context.md`
3. `.agent-harness/shared/product-rules.md`
4. `.agent-harness/shared/safety-privacy.md`
5. Track especifico en `.agent-harness/tracks/`

## Tracks

- Frontend: componentes, pantallas, UI, accesibilidad visual.
- Backend: Supabase, queries, APIs, RLS, IA en servidor.
- Pedagogical: lenguaje, TEA, accesibilidad cognitiva, child mode.
- DevOps: Vercel, build, env vars, secretos, CI.

## Regla Para Ahorrar Creditos

No pidas a varios agentes que implementen lo mismo.

Usa este flujo:

1. Coordinador define tarea.
2. Un agente implementa.
3. Otro agente revisa solo el diff.
4. Coordinador decide si se integra.

## Backup

La fuente principal del codigo debe ser GitHub. Drive puede usarse para capturas, videos, documentos de validacion o zips limpios ocasionales, pero no como sincronizacion principal del repo.
