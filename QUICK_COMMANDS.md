# 🎯 AMIKO Quick Commands

Copilot ready. Usa estos comandos para invocar agentes especializados.

## Frontend Agent
```
@frontend: [tu descripción]

Ejemplos:
@frontend: Crea un componente Button con variantes (primary, secondary, ghost)
@frontend: Revisa la accesibilidad del child mode (tab, screen reader, contrast)
@frontend: Optimiza las imágenes en dashboard
@frontend: Verifica que los colores AMIKO sean consistentes
```

## Backend Agent
```
@backend: [tu descripción]

Ejemplos:
@backend: Diseña la tabla de step_progress para rastrear pasos completados
@backend: Escribe un endpoint POST /api/tasks para guardar tareas
@backend: Optimiza la query que trae tareas del estudiante (está lenta)
@backend: Configura RLS para que adultos solo vean sus estudiantes
@backend: Crea un índice en created_at para tareas
```

## Pedagogical Agent
```
@pedagogical: [tu descripción]

Ejemplos:
@pedagogical: ¿Es el child mode confuso para un niño con TEA?
@pedagogical: Valida que las instrucciones sean simples (Flesch-Kincaid 3-5)
@pedagogical: Sugiere pictogramas para los pasos
@pedagogical: Revisa el tono (¿es cálido y positivo?)
@pedagogical: ¿Falta algo para hacer la experiencia más accesible?
```

## DevOps Agent
```
@devops: [tu descripción]

Ejemplos:
@devops: Configura env vars en Vercel (SUPABASE_URL, OPENAI_API_KEY)
@devops: Deploya main a production
@devops: Setupea GitHub Actions para linting y build
@devops: Manejar secrets (nunca exponer SUPABASE_SERVICE_ROLE_KEY)
@devops: Monitorea performance en Vercel Analytics
```

## Common Workflows

### Agregar una Feature Completa

1. **Pedagogical** → Define la idea
   ```
   @pedagogical: Necesito que el child mode muestre 
   una instrucción por pantalla. ¿Cómo haría esto accesible?
   ```

2. **Backend** → Diseña datos
   ```
   @backend: Basado en la idea anterior, diseña 
   la tabla de tasks/steps y el endpoint
   ```

3. **Frontend** → Construye UI
   ```
   @frontend: Basado en los pasos anteriores, crea:
   - ComponenteTaskStep (muestra 1 instrucción)
   - Botones "Lo hice", "Necesito ayuda", "Necesito pausa"
   - Colores AMIKO, accesible
   ```

4. **DevOps** → Deploya
   ```
   @devops: Configura variables y deploya a preview
   ```

### Debug Flow

```
@backend: ¿Por qué la query de tasks es lenta?
→ [Backend optimiza]

@frontend: Implementa la query optimizada en componente
@devops: Deploya y monitorea
```

## File Structure Reference

```
amiko/
├── app/                       # Next.js pages + API routes
│   ├── layout.tsx
│   ├── dashboard/page.tsx
│   ├── api/tasks/route.ts
│   └── child-mode/[taskId]/page.tsx
├── components/                # React components
│   ├── Button.tsx
│   ├── TaskCard.tsx
│   ├── StepIndicator.tsx
│   └── ...
├── lib/                       # Utilities
│   ├── supabase.ts
│   ├── openai.ts
│   └── types.ts
├── supabase/                  # Database
│   ├── schema.sql
│   ├── seed.sql
│   └── migrations/
├── public/                    # Assets
│   └── icons/
├── .github/
│   ├── agents/                ← Tus agentes
│   ├── instructions/          ← Guías
│   └── AGENTS.md              ← Documentación central
├── HARNESS.md                 ← Este archivo en raíz
├── README.md                  ← MVP, setup
└── AGENTS.md                  ← Dirección de producto original
```

## Pro Tips

1. **Contexto compartido**: Los agentes leen AGENTS.md y README.md automáticamente
2. **Chains**: Puedes referir respuestas entre agentes ("basado en lo que @backend hizo...")
3. **Review**: Pide a un agente que revise el trabajo de otro
4. **Documentación viva**: Los .agent.md se actualizan conforme el proyecto crece

## Status
✅ Harness configurado y listo
✅ 4 agentes especializados activos
✅ Instrucciones contextuales aplicadas automáticamente
⏳ Esperando cuenta de estudiante en GitHub para public repo

---
**Última actualización**: 2026-06-05  
**Versión**: 1.0  
**Estado**: 🟢 Production Ready
