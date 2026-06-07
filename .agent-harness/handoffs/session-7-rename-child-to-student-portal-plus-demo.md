---
session: 7
task: Rename child → student (portal) + Demo pública /demo/student-portal
date: 2026-06-07
---

# Handoff — Sesión 7: Rename child-portal → student-portal + Demo pública

## Que Hice

### Parte 1: Rename técnico child → student

Renombré toda la nomenclatura del portal de estudiante de "child" a "student":

| Componente anterior | Componente nuevo | Estado anterior |
|---|---|---|
| `components/child-adventure.tsx` | `components/student-adventure.tsx` | Shim de re-export |
| `components/child-shell.tsx` | `components/student-shell.tsx` | Shim de re-export |
| `app/child-portal/` (todas las páginas) | `app/student-portal/` (nuevas) | Redirects a student-portal |

**`lib/student-mock-data.ts`** creada como copia de `child-mock-data.ts` + aliases student-named:
- `studentPortalStudent` = `childStudent`
- `studentPortalTasks` = `childTasks`
- `StudentPortalStudent`, `StudentPortalTask`, `StudentPortalStep` como tipos aliases

### Parte 2: Demo pública /demo/student-portal

Creada la ruta pública `app/demo/student-portal/` con 5 páginas:
- `page.tsx` — Home con checkin emocional (siempre visible en demo) + lista de tareas
- `amiko/page.tsx` — Chat mock con Amiko
- `aventura/[id]/page.tsx` — Aventura paso a paso en `demoMode`
- `mi-red/page.tsx` — Mi Red (sin `saveProgressEvent`)
- `recursos/page.tsx` — Recursos (sin localStorage)

La demo usa `StudentShell` con `basePath="/demo/student-portal"` y `StudentAdventure` con `demoMode={true}`.

## Archivos Nuevos

| Archivo | Descripción |
|---|---|
| `lib/student-mock-data.ts` | Datos mock con aliases student-named |
| `components/student-adventure.tsx` | `StudentAdventure` con prop `demoMode?: boolean` |
| `components/student-shell.tsx` | `StudentShell` con prop `basePath?: string` |
| `app/student-portal/layout.tsx` | Layout con `StudentShell` |
| `app/student-portal/page.tsx` | Home portal estudiante |
| `app/student-portal/amiko/page.tsx` | Chat Amiko |
| `app/student-portal/aventura/[id]/page.tsx` | Aventura por tarea |
| `app/student-portal/mi-red/page.tsx` | Mi Red |
| `app/student-portal/recursos/page.tsx` | Recursos |
| `app/demo/student-portal/layout.tsx` | Layout demo con `basePath` |
| `app/demo/student-portal/page.tsx` | Home demo |
| `app/demo/student-portal/amiko/page.tsx` | Amiko demo |
| `app/demo/student-portal/aventura/[id]/page.tsx` | Aventura demo (demoMode) |
| `app/demo/student-portal/mi-red/page.tsx` | Mi Red demo (sin localStorage) |
| `app/demo/student-portal/recursos/page.tsx` | Recursos demo |

## Archivos Modificados

| Archivo | Cambio |
|---|---|
| `app/child-portal/page.tsx` | Redirect → `/student-portal` |
| `app/child-portal/layout.tsx` | Passthrough sin ChildShell |
| `app/child-portal/amiko/page.tsx` | Redirect → `/student-portal/amiko` |
| `app/child-portal/mi-red/page.tsx` | Redirect → `/student-portal/mi-red` |
| `app/child-portal/recursos/page.tsx` | Redirect → `/student-portal/recursos` |
| `app/child-portal/aventura/[id]/page.tsx` | Redirect → `/student-portal/aventura/[id]` |
| `components/child-adventure.tsx` | Shim: re-export de `student-adventure.tsx` |
| `components/child-shell.tsx` | Shim: re-export de `student-shell.tsx` |
| `lib/supabase/proxy.ts` | `/student-portal` agregado a `protectedRoutes` |

## Rutas y Seguridad

| Ruta | Auth requerida | Descripción |
|---|---|---|
| `/student-portal/*` | Sí | Portal estudiante real |
| `/child-portal/*` | Sí | Redirects de compatibilidad (protegidos por proxy) |
| `/demo/student-portal/*` | **No** | Demo pública para validación con padres/docentes |

`/demo/student-portal` NO está en `protectedRoutes`, por lo que funciona sin sesión en producción.

## Decisiones Técnicas

- **`demoMode` prop en `StudentAdventure`**: cuando `true`, `save` es un `useMemo` que devuelve `() => {}` (no-op). Cero escrituras a localStorage. Los callbacks de `useCallback` dependen del memoized `save`, evitando warnings de hooks exhaustive-deps.
- **`basePath` prop en `StudentShell`**: los links de navegación usan `${basePath}` como prefijo. La demo pasa `"/demo/student-portal"`, el portal real usa el default `"/student-portal"`.
- **Demo siempre muestra checkin**: `showCheckin` inicia en `true` (no lee `shouldShowCheckin`) para dar experiencia completa en demo.
- **`lib/student-mock-data.ts` con datos propios**: en lugar de re-exportar desde `child-mock-data.ts` (que causó problemas con Turbopack), el archivo contiene copia completa de los datos + aliases student-named. Esto da independencia entre los dos archivos.
- **`child-mock-data.ts` sin importadores activos**: ningún archivo del proyecto importa desde `child-mock-data.ts` actualmente. Se mantiene como archivo de referencia para no descartar historial de git.

## Pruebas Realizadas

```powershell
npm run lint   # 0 errores, 3 warnings preexistentes (conversation/page.tsx)
npm run build  # ✓ Compilado limpio, 46 páginas generadas
               # /child-portal y subrutas: ○ (static, redirects)
               # /student-portal y subrutas: ○ (static, portal real)
               # /demo/student-portal y subrutas: ○ (static, demo pública)
```

## URLs Para Probar

| URL | Requiere login | Propósito |
|---|---|---|
| `/student-portal` | Sí | Portal estudiante real |
| `/child-portal` | Sí | Redirige a `/student-portal` |
| `/demo/student-portal` | **No** | Demo pública para padres/docentes |

Para compartir en Vercel sin cuenta: `https://tu-app.vercel.app/demo/student-portal`

## Pendientes

- Conectar `app/student-portal/` a datos reales de Supabase (student_profiles, tasks adaptadas)
- Reemplazar nombre "Mateo" / emoji 🐻 en demo con datos del estudiante real cuando haya sesión
- Eliminar `lib/child-mock-data.ts` cuando se confirme que no es necesario (actualmente sin importadores)
- Eliminar shims `child-adventure.tsx` y `child-shell.tsx` cuando el codebase esté listo
- Agregar metadata OpenGraph para la URL de demo (para compartir por WhatsApp/Slack con vista previa)
