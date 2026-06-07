# Contexto Compartido De AMIKO

Este archivo es el punto de arranque rapido para cualquier agente que trabaje en el proyecto.

## Producto

AMIKO es un asistente pedagogico inclusivo con IA para ninos, ninas y adolescentes con TEA. Ayuda a padres, madres, cuidadores y docentes a convertir tareas escolares en instrucciones simples, visuales y paso a paso.

AMIKO es apoyo pedagogico. No diagnostica, no reemplaza a profesionales de salud, terapeutas ni docentes.

## Prioridad Actual

La etapa actual debe validar primero la experiencia para adultos:

- Registro e inicio de sesion.
- Perfil basico del estudiante.
- Organizacion del dia.
- Ingreso de tareas escolares.
- Adaptacion con IA.
- Revision de progreso simple.

El modo estudiante o modo nino pertenece a una segunda etapa. Puede existir como demo, pero no debe bloquear ni desviar el MVP para padres, madres y cuidadores.

## Corazon Del MVP

El flujo principal que todos los agentes deben proteger es:

1. El adulto crea o consulta el perfil del estudiante.
2. El adulto ingresa una tarea escolar.
3. AMIKO adapta la tarea en pasos simples.
4. El adulto revisa apoyos visuales y sugerencias.
5. El sistema registra progreso basico.

## Fuera De Alcance

No implementar en esta etapa:

- Pagos.
- Marketplace.
- Videollamadas con especialistas.
- App movil nativa.
- Panel institucional avanzado.
- Comunidad o foro.
- Reportes complejos.
- Gestion de pensum educativo.
- Planificacion curricular institucional.

## Fuentes De Verdad

- `AGENTS.md`: reglas completas de producto, seguridad, UX y desarrollo.
- `.agent-harness/`: memoria operativa para agentes.
- `README.md`: setup y estado general del proyecto.
- `.github/agents/`: agentes especializados de GitHub Copilot, si se usan.
