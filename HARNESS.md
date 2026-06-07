# AMIKO Harness Multi-Agent

Este proyecto tiene dos capas de coordinacion para trabajar con varios agentes sin perder coherencia.

## 1. Constitucion Del Producto

`AGENTS.md` es la fuente principal. Todo agente debe leerlo antes de cambiar codigo.

Define:

- Producto y alcance del MVP.
- Prioridad actual: experiencia para padres, madres y cuidadores.
- Reglas de marca, UX, seguridad y privacidad.
- Reglas de IA.
- Reglas de formularios.
- Limites: no pagos, no marketplace, no app movil nativa, no pensum educativo.

## 2. Harness Operativo

`.agent-harness/` resume el contexto para ejecucion diaria.

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

## 3. Agentes De GitHub Copilot

Si usas GitHub Copilot, tambien existen agentes en:

```text
.github/
  AGENTS.md
  agents/
    frontend.agent.md
    backend.agent.md
    pedagogical.agent.md
    devops.agent.md
  instructions/
    frontend.instructions.md
    backend.instructions.md
```

## Como Pedir Trabajo

Usa prompts cerrados:

```text
Trabaja en C:\Users\Luis Simon\Documents\Amiko.
Lee AGENTS.md y .agent-harness.
Usa el track frontend.

Objetivo:
Crear un componente TaskCard para tareas de AMIKO.

Limites:
No tocar autenticacion, Supabase ni rutas.

Criterios:
TypeScript, responsive, estados draft/adapted/in_progress/completed.

Al terminar:
Usa .agent-harness/handoff-template.md.
```

## Flujo Recomendado Para Ahorrar Creditos

1. Coordinador define la tarea.
2. Un solo agente implementa.
3. Otro agente revisa el diff o archivos modificados.
4. Coordinador integra o pide ajustes.

No pongas a tres agentes a resolver la misma tarea completa.

## Tracks

- `frontend`: componentes, UI, paginas, accesibilidad visual.
- `backend`: Supabase, queries, APIs, RLS, OpenAI server-side.
- `pedagogical`: lenguaje claro, TEA, accesibilidad cognitiva, child mode.
- `devops`: Vercel, build, env vars, secretos, CI.

## Backup

- GitHub es la fuente principal del codigo.
- Drive sirve para materiales humanos: capturas, demos, feedback, documentos y zips limpios ocasionales.
- No subir `.env.local`, claves, tokens ni secretos a GitHub o Drive.

## Checklist Rapido

- Abrir workspace: `C:\Users\Luis Simon\Documents\Amiko`
- Leer `AGENTS.md`
- Leer `.agent-harness/README.md`
- Elegir un track
- Usar `task-template.md`
- Cerrar con `handoff-template.md`
