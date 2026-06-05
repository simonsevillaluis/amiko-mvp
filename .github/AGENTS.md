# AMIKO Harness: Specialized Agents

Este documento explica cómo usar el **harness multi-agente** de AMIKO. Tienes 4 agentes especializados, cada uno optimizado para un dominio específico del proyecto.

## 🚀 Quick Start

Cambiar entre agentes:

```
@frontend    → Diseño, componentes, Tailwind, accesibilidad
@backend     → Supabase, APIs, base de datos, autenticación
@pedagogical → UX para niños con TEA, inclusividad, diseño pedagógico
@devops      → Deployment, CI/CD, ambiente, infraestructura
```

## Agentes Disponibles

### 1. Frontend Agent (`@frontend`)

**Especialista en**: React, componentes, UI/UX, Tailwind CSS, Next.js pages

**Úsalo cuando**:
- Construir o refactorizar componentes
- Maquetar nuevas pantallas (Dashboard, Adapt Task, Child Mode)
- Mejorar accesibilidad (WCAG, screen readers, keyboard nav)
- Optimizar performance (images, lazy loading)
- Mantener consistencia de marca AMIKO

**No es para**: Supabase, APIs, decisiones pedagógicas, deployment

**Herramientas**: frontend-design skill, graphify para entender la estructura

---

### 2. Backend Agent (`@backend`)

**Especialista en**: Supabase, PostgreSQL, APIs, autenticación, data models

**Úsalo cuando**:
- Diseñar o modificar schema SQL
- Implementar RLS (Row-Level Security)
- Crear endpoints de API (`/api/tasks`, `/api/progress`)
- Optimizar queries, índices, performance
- Integrar APIs externas (OpenAI para adaptaciones)

**No es para**: React, styling, pedagogía, infraestructura

**Herramientas**: supabase skill, supabase-postgres-best-practices

---

### 3. Pedagogical Agent (`@pedagogical`)

**Especialista en**: Diseño inclusivo, niños con TEA, accesibilidad neurodiversa, pedagog ía

**Úsalo cuando**:
- Decidir cómo mostrar tareas al niño (una instrucción por pantalla)
- Diseñar el "Child Mode" (botones simples, sin sobrecarga visual)
- Validar que AMIKO no sea confuso ni abrumador
- Revisar tono y lenguaje (simple, positivo, seguro)
- Pensar en apoyos visuales (pictogramas, iconografía)

**No es para**: Código React, queries SQL, deployment

**Referencia**: AGENTS.md (dirección de producto), README.md (criterios de validación)

---

### 4. DevOps Agent (`@devops`)

**Especialista en**: Deployment, CI/CD, Vercel, GitHub Actions, secrets, monitoring

**Úsalo cuando**:
- Configurar environment variables
- Deployar a Vercel (main → production, preview)
- Setupear GitHub Actions (lint, build, test)
- Manejar secretos (SUPABASE_SERVICE_ROLE_KEY, OPENAI_API_KEY)
- Monitorear performance, logs, errores

**No es para**: React, Supabase schema, pedagogía

---

## 📋 Flujo Típico de Desarrollo

1. **Pedagógico**: "Necesito que el child mode muestre una instrucción por pantalla"
   → Usa `@pedagogical` para validar la idea

2. **Backend**: "Necesito un endpoint para guardar si el niño hizo clic en 'Lo hice'"
   → Usa `@backend` para diseñar la API y el schema

3. **Frontend**: "Necesito una pantalla con botones grandes y colores AMIKO"
   → Usa `@frontend` para construir el componente

4. **DevOps**: "Necesito deployar esto a staging"
   → Usa `@devops` para configurar variables y desplegar

## 🔄 Contexto Compartido

Cada agente tiene acceso a:
- **AGENTS.md** (este archivo): dirección de producto, valores de marca
- **README.md**: alcance, criterios de validación, stack
- **Codebase**: tu proyecto (`graphify-out/` si exists)
- **Skills compartidas**: frontend-design, supabase, etc.

## 🎯 Invocación

### Opción 1: Slash Command (si está configurado)
```
@frontend: Crea un componente TaskCard
@backend: Diseña la tabla de adaptaciones
@pedagogical: Valida que el child mode sea accesible
@devops: Configura Vercel para production
```

### Opción 2: Archivo .agent.md
Cada agente tiene su archivo en `.github/agents/`:
- `frontend.agent.md`
- `backend.agent.md`
- `pedagogical.agent.md`
- `devops.agent.md`

Copilot los detectará automáticamente.

## 💡 Best Practices

### Para cada agente:
1. **Sé específico**: "Necesito una API para guardar progreso" vs "Trabaja en backend"
2. **Dale contexto**: "Estoy en child mode, necesito que X pase cuando el niño hace clic"
3. **Usa archivos**: Si hablas de un archivo específico, menciona la ruta
4. **Valida**: Pide al agente que verifique su salida (linting, tipos, accesibilidad)

### Entre agentes:
1. **Documenta decisiones**: Si el Pedagogical Agent sugiere algo, comparte eso con Frontend
2. **Reutiliza**: El Backend Agent puede compartir queries optimizadas con Frontend
3. **No silos**: Cada agente conoce los límites de su dominio

## 📝 Ejemplos de Uso

### Ejemplo 1: Agregar un step indicator
```
@frontend: Los pasos del child mode necesitan un indicador visual.
- Que muestre "Paso 2 de 5"
- Colores AMIKO (verde para completado, azul para actual)
- Accesible (ARIA labels para lectores de pantalla)
```

### Ejemplo 2: Optimizar query de progreso
```
@backend: La query que trae el progreso del estudiante es lenta.
- Estamos haciendo N+1 en tareas
- Necesito traer task_id, step_index, completed_at, feedback
- Agregar índices si ayuda
```

### Ejemplo 3: Validar child mode
```
@pedagogical: ¿Este child mode es accesible para un niño con TEA?
- Pantalla: step.tsx
- Decisiones: un botón "Lo hice", uno "Necesito ayuda"
- ¿Falta algo? ¿Es confuso?
```

### Ejemplo 4: Deployment a production
```
@devops: Necesito deployar main a production.
- ENV: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, OPENAI_API_KEY
- ¿Están configurados en Vercel?
- ¿Necesito correr migrations en Supabase?
```

## 📚 Documentación Adicional

- **AGENTS.md** (este archivo): Guía de agentes
- **[.github/agents/frontend.agent.md](.github/agents/frontend.agent.md)**: Detalles del agente frontend
- **[.github/agents/backend.agent.md](.github/agents/backend.agent.md)**: Detalles del agente backend
- **[.github/agents/pedagogical.agent.md](.github/agents/pedagogical.agent.md)**: Detalles del agente pedagógico
- **[.github/agents/devops.agent.md](.github/agents/devops.agent.md)**: Detalles del agente devops
- **[AGENTS.md](AGENTS.md)**: Dirección de producto original (mantener como referencia)

---

**Última actualización**: 2026-06-05  
**Harness versión**: 1.0  
**Estatus**: En producción ✓

*Pro tip: Cada agente está optimizado. Si cambias entre ellos frecuentemente, ganas contexto especializado sin perder el panorama general.*
