# 🎯 AMIKO Harness Multi-Agent

Tu proyecto tiene un **harness especializado** con 4 agentes Copilot optimizados para diferentes aspectos de AMIKO.

## 📂 Estructura

```
.github/
├── agents/                    # Agentes especializados
│   ├── frontend.agent.md      # React, componentes, UI/UX
│   ├── backend.agent.md       # Supabase, APIs, base de datos
│   ├── pedagogical.agent.md   # UX para niños con TEA
│   └── devops.agent.md        # Deployment, CI/CD
├── instructions/              # Instrucciones contextuales
│   ├── frontend.instructions.md
│   └── backend.instructions.md
└── AGENTS.md                  # Guía central (este archivo)
```

## 🚀 Cómo Usar

### Opción 1: Slash Command (recomendado)
```
@frontend Crea un componente TaskCard con colores AMIKO
@backend Diseña el endpoint para guardar progreso
@pedagogical ¿Es accesible este child mode para TEA?
@devops Configura Vercel para production
```

### Opción 2: Mención en chat
```
"Hola @frontend, necesito una página de dashboard"
```

## 👥 Agentes

| Agente | Expertise | Úsalo para | Ubicación |
|--------|-----------|-----------|-----------|
| **Frontend** | React, Tailwind, a11y | Componentes, páginas, diseño | `.github/agents/frontend.agent.md` |
| **Backend** | Supabase, SQL, APIs | Base de datos, endpoints, RLS | `.github/agents/backend.agent.md` |
| **Pedagogical** | TEA, inclusión, pedagogía | Decisiones UX, child mode, accesibilidad neuro | `.github/agents/pedagogical.agent.md` |
| **DevOps** | Vercel, CI/CD, secrets | Deployment, env vars, monitoreo | `.github/agents/devops.agent.md` |

## 📖 Flujo Típico

1. **Pedagógico** → Define la experiencia ("child mode: una instrucción por pantalla")
2. **Backend** → Implementa datos (endpoint, schema)
3. **Frontend** → Construye UI (componente, estilos)
4. **DevOps** → Deploya (Vercel, env vars)

## 🔑 Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind, Radix UI
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **APIs**: OpenAI (adaptaciones), Supabase Edge Functions (futuro)
- **Deploy**: Vercel (auto-deploy on main)
- **Linting**: ESLint, TypeScript

## 🎨 AMIKO Brand

- **Colores**: Verde (#10b981), Azul (#3b82f6)
- **Voz**: Cálida, inclusiva, simple, tranquilizadora
- **Para niños**: Nunca condescendiente, nunca clínico
- **Para adultos**: Confiable, ordenado, fácil de usar

Revisar componentes en `components/` y `tailwind.config.ts` antes de crear nuevos.

## 📝 Instrucciones Especiales

Archivos `.instructions.md` se aplican automáticamente:
- `.github/instructions/frontend.instructions.md` → todos `app/**/*.tsx, components/**/*.tsx`
- `.github/instructions/backend.instructions.md` → todos `supabase/**/*.sql, app/api/**/*.ts`

Contenido: patrones, checklists, ejemplos de código.

## 🔗 Referencias

- **AGENTS.md original**: [AGENTS.md](../AGENTS.md) (dirección de producto)
- **README.md**: [README.md](../README.md) (MVP, stack, setup)
- **Agentes**: [`.github/agents/`](.github/agents/)
- **Instrucciones**: [`.github/instructions/`](.github/instructions/)

## ✅ Checklist para Empezar

- [ ] Workspace abierto: `C:\Users\Luis Simon\Documents\Amiko`
- [ ] Copilot detecta los agentes (verifica que Copilot esté activo)
- [ ] Prueba con `@frontend` en el chat
- [ ] Lee `.github/AGENTS.md` para más detalles
- [ ] Explora `supabase/schema.sql` (Backend)
- [ ] Explora `components/` (Frontend)

## 🆘 Troubleshooting

**Copilot no detecta los agentes**
- Asegúrate de que el workspace esté abierto
- Los `.agent.md` están en `.github/agents/` ✓
- Recarga Copilot: Cmd+Shift+P → "Developer: Reload Window"

**No sé cuál agente usar**
- ¿Es React/UI? → `@frontend`
- ¿Es Supabase/API? → `@backend`
- ¿Es UX para niños? → `@pedagogical`
- ¿Es deploy/secrets? → `@devops`

**Necesito ayuda con el harness**
- Lee `.github/AGENTS.md` (guía central)
- Cada `.agent.md` tiene ejemplos

---

**Harness v1.0** | 2026-06-05 | GitHub Copilot (Haiku 4.5)

*No gasta créditos de Claude. Está integrado con tu suscripción de Copilot.*
