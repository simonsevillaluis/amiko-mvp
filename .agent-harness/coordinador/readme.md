# 🎯 Coordinador de Hilos - AMIKO

Este espacio está reservado para la coordinación global de tareas, flujos de integración y priorización de desarrollos en AMIKO.

## Propósito
El Coordinador de Hilos actúa como el punto de control central para orquestar el trabajo entre los diferentes tracks especializados:
* **Frontend** (Vistas y componentes)
* **Backend** (Base de datos, Supabase y APIs)
* **Pedagogical** (Adecuación TEA y accesibilidad)
* **DevOps** (Compilación y despliegue)

## Flujo de Trabajo
1. **Definición de Tareas:** Se redacta una tarea utilizando el [Task Template](../task-template.md) y se ubica en la carpeta del track correspondiente.
2. **Desarrollo:** El agente/hilo asignado trabaja en su carpeta correspondiente y genera la solución.
3. **Revisión y Handoff:** Al terminar, el agente utiliza el [Review Template](../review-template.md) y [Handoff Template](../handoff-template.md) para dejar el reporte en su carpeta y pasarlo al Coordinador de Hilos.
4. **Merge y Deploy:** Tras la aprobación del Coordinador, DevOps se encarga del despliegue en Vercel.
