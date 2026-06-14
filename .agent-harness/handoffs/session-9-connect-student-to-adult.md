---
session: 9
task: Conectar estudiante al adulto autenticado — dashboard y perfil con datos reales
date: 2026-06-14
---

# Handoff — Sesión 9: Conexión estudiante ↔ adulto autenticado

## Resumen ejecutivo

El flujo real de datos entre adulto y estudiante ya estaba mayormente correcto en el código
(`dashboard`, `students`, `getOrSyncProfile`, `getStudentProfiles`). El problema principal
era que dos páginas adultas reales importaban datos ficticios de `@/lib/mock-data`:

- `app/adapt-task/chat/conversation/page.tsx` — nombre del estudiante y nombre del adulto hardcodeados
- `app/teacher/page.tsx` — contenido de tarea adaptada hardcodeado

Ambos se resolvieron. Todas las vistas reales de adulto ahora leen datos de Supabase.

---

## Cambios realizados

### 1. `app/adapt-task/chat/conversation/` — separación server/client

**Problema:** La página del chat era `"use client"` e importaba `student.name` = "Ángel" y
el nombre "Luis" hardcodeado directamente en los saludos y en el payload al API `/api/chat`.

**Solución:** Patrón server wrapper + client component.

| Archivo | Tipo | Descripción |
|---|---|---|
| `app/adapt-task/chat/conversation/page.tsx` | **Reescrito** | Ahora es server component. Obtiene `firstStudent` y `adultFirstName` de Supabase y los pasa como props. |
| `app/adapt-task/chat/conversation/ConversationClient.tsx` | **Nuevo** | Contiene toda la lógica de UI/chat. Acepta `studentName: string` y `adultFirstName: string` como props. |

El server wrapper sigue el mismo patrón que `app/dashboard/page.tsx`:
```ts
const [profile, firstStudent] = await Promise.all([
  getOrSyncProfile(user.id),
  getFirstStudent(),
]);
const adultFirstName = profile?.full_name?.trim()?.split(" ")[0]
  || metaFullName?.trim()?.split(" ")[0]
  || "Adulto";
const studentName = firstStudent?.name ?? "tu estudiante";
```

La página `/adapt-task/chat/conversation` ahora es `ƒ` (Dynamic / server-rendered on demand)
en el build — correcto, porque ejecuta queries en Supabase por request.

### 2. `app/teacher/page.tsx` — eliminar tarea ficticia

**Problema:** La página ya leía `firstStudent` de Supabase (correcto) pero también
importaba `adaptedTask` de mock-data para llenar la columna derecha con una tarea ficticia.

**Solución:** Removido el import de mock-data. La columna derecha muestra un empty state:
"Cuando el adulto genere una adaptación de tarea, aparecerá aquí."

No existe tabla de adapted_tasks aún. El empty state es honesto y no hardcodea datos ficticios.

---

## Contrato de datos para el frontend

| Fuente | Función | Devuelve | Usado en |
|---|---|---|---|
| `getOrSyncProfile(userId)` | `lib/supabase/profile.ts` | `{ full_name, role, avatar_url }` | dashboard, students, conversation |
| `getStudentProfiles()` | `lib/supabase/students.ts` | `StudentProfile[]` filtrado por RLS | dashboard, students |
| `getFirstStudent()` | `lib/supabase/students.ts` | Primer `StudentProfile` o null | teacher, conversation |

La RLS policy `student_profiles_select_own` auto-filtra por `auth.uid() = user_id`.
No se necesita `.eq("user_id", userId)` explícito en las queries.

---

## Estado final de mock data

| Archivo | Páginas reales | Páginas demo |
|---|---|---|
| `@/lib/mock-data` | ✅ Ninguna (eliminado) | — |
| `@/lib/student-mock-data` | `student-portal/aventura/[id]` (excluido por alcance: "No tocar modo estudiante") | `demo/student-portal/**` ✅ correctas |

---

## Verificaciones

```powershell
npm run lint   # ✓ 0 errores, 0 warnings nuevos
npm run build  # ✓ 50 páginas, 0 errores TypeScript
               #   warning metadataBase preexistente (no relacionado)
```

---

## Flujo "Hola, Adulto" — análisis

El fallback chain en dashboard y conversation es:
```
profile.full_name → user.user_metadata.full_name → user.user_metadata.name → "Adulto"
```

La función `getOrSyncProfile()` ya maneja el caso donde la tabla `profiles` no tiene
`full_name` — la sincroniza desde auth metadata. Un usuario que se registró con nombre
verá su nombre propio. Solo usuarios que se crearon antes de que el formulario de registro
existiera verían "Adulto".

---

## Pruebas manuales requeridas (humano)

1. Iniciar sesión con una cuenta que tenga al menos un estudiante registrado
2. Navegar a `/adapt-task/chat` → iniciar conversación
3. Verificar que el saludo diga "Hola, [nombre real del adulto]" y "... qué necesita [nombre real del estudiante]"
4. Verificar que el panel de contexto (ícono escudo) muestre "Perfil de [nombre real del estudiante]"
5. Navegar a `/teacher` → verificar que la sección izquierda muestre el estudiante real
   y la sección derecha muestre el empty state (no datos ficticios)

---

## Pendientes (no incluidos en esta sesión)

- [ ] **Modo estudiante** (`student-portal/aventura/[id]`) aún usa `studentPortalTasks` de mock-data
  → fuera del alcance ("No tocar modo estudiante")
- [ ] **`metadataBase`** warning en build — preexistente, no bloqueante
- [ ] **Editar perfil de estudiante** — no existe flujo de edición de estudiante creado
- [ ] **`adaptedTask`** en teacher/page — empty state actual es correcto hasta que exista
  tabla `adapted_tasks` en Supabase
- [ ] **NVIDIA_API_KEY / DEEPSEEK_API_KEY** — confirmar que estén en Vercel production env vars
