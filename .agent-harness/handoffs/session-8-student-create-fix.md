---
session: 8
task: Fix flujo de creación de estudiante — columnas faltantes en Supabase
date: 2026-06-14
---

# Handoff — Sesión 8: Fix creación de perfil de estudiante

## Causa Raíz

`schema.sql` usa `CREATE TABLE IF NOT EXISTS`. Si la tabla `student_profiles`
ya existía en Supabase cuando se agregaron las columnas `birth_date date` y
`email text` al CREATE TABLE, esas columnas **nunca se añadieron** a la tabla real.

El INSERT en `app/actions/create-student.ts` intentaba escribir esas columnas
→ Postgres devolvía error `42703` (undefined_column) → la server action
atrapaba el error y mostraba el mensaje genérico "No pudimos guardar el perfil."

**Evidencia del diagnóstico:**
- `lib/supabase/students.ts` → tipo `StudentProfile` no incluye `birth_date`
  ni `email`, y el SELECT los omite explícitamente. Señal de que no existían
  cuando se definió la capa de datos.
- No existía ninguna carpeta `supabase/migrations/`.
- El backend implementation report no menciona esas columnas.

## Que Hice

### 1. Creé `supabase/migrations/001_add_student_profile_columns.sql`

Script idempotente con `ADD COLUMN IF NOT EXISTS`. Seguro de ejecutar en
entornos que ya tienen las columnas (no falla) y en los que no las tienen.

```sql
alter table public.student_profiles
  add column if not exists birth_date date,
  add column if not exists email text;
```

**⚠️ ACCIÓN REQUERIDA DEL HUMANO: este script aún no se ejecutó en Supabase.**
Ver sección "Pruebas manuales" abajo.

### 2. Mejoré el manejo de errores en `app/actions/create-student.ts`

Antes: `console.error(insertError)` + mensaje genérico para todos los errores.

Ahora:
- `console.error` estructurado con `code`, `message`, `details`, `hint` (más
  fácil de leer en Vercel Logs).
- Mapa de códigos Postgres a mensajes en español:
  - `42703` (column does not exist) → avisa que es configuración del servidor
  - `23514` (check_violation) → pide revisar datos del formulario
  - `42501` (insufficient_privilege / RLS) → pide cerrar sesión e intentar de nuevo
  - Resto → mensaje genérico original

El insert en sí NO se modificó — es correcto. Solo necesita que la migración
esté aplicada en el servidor.

## Archivos Modificados

| Archivo | Tipo de cambio |
|---|---|
| `supabase/migrations/001_add_student_profile_columns.sql` | **Nuevo** — migración idempotente |
| `app/actions/create-student.ts` | Mejorado error handling (console + mensajes de usuario) |

## Archivos NO modificados (y por qué)

| Archivo | Razón |
|---|---|
| `lib/supabase/students.ts` | El tipo `StudentProfile` y el SELECT son correctos para la UI actual. `birth_date` y `email` no se muestran en ninguna pantalla todavía. Agregar campos al tipo sin agregarlos al SELECT introduciría undefined silencioso. |
| `supabase/schema.sql` | El schema ya tiene las columnas correctas. No tocarlo evita confusión sobre qué es fuente de verdad. |
| `app/register/student/page.tsx` | El formulario está correcto y no tiene errores. |

## Pruebas Realizadas (código)

```powershell
npm run lint   # ✓ 0 errores, 0 warnings nuevos
npm run build  # ✓ 50 páginas, 0 errores TypeScript
```

## Pruebas Manuales Requeridas (humano)

### Paso 1 — Aplicar la migración en Supabase

1. Abre [Supabase Dashboard](https://supabase.com/dashboard) → tu proyecto
2. Ve a **SQL Editor**
3. Pega el contenido de `supabase/migrations/001_add_student_profile_columns.sql`
4. Ejecuta
5. Verifica en **Table Editor → student_profiles** que existen las columnas
   `birth_date` (tipo date) y `email` (tipo text)

### Paso 2 — Probar el flujo completo

1. Abre la app en el navegador (sin sesión activa)
2. Crea una cuenta nueva en `/register`
3. Completa el formulario de perfil de estudiante en `/register/student`:
   - Nombre: cualquier nombre con acentos (ej. "María José")
   - Fecha de nacimiento: elige una fecha que dé edad entre 4 y 25 años
   - Grado: selecciona Primaria → 3er grado
   - Apoyo: cualquier opción incluyendo "No lo sé todavía"
4. Toca **Crear perfil**
5. Verifica pantalla de éxito "¡Todo listo! 🌟"
6. Verifica que al ir a `/dashboard` y `/students` el estudiante aparece

### Paso 3 — Verificar en Supabase

En **Table Editor → student_profiles**, confirma que el nuevo registro tiene:
- `name`, `age`, `school_grade`, `support_level` poblados
- `birth_date` con la fecha ingresada
- `email` como null (si no se ingresó) o con el valor ingresado
- `user_id` igual al UUID del adulto autenticado

## Riesgos

| Riesgo | Severidad | Mitigación |
|---|---|---|
| Migración no aplicada = bug persiste | Alta | Paso obligatorio antes de probar |
| `CREATE TABLE IF NOT EXISTS` en schema.sql sigue siendo la estrategia | Media | Considerar agregar un comentario en schema.sql indicando que los cambios de columnas van en migrations/ |
| `StudentProfile` type no incluye `birth_date` / `email` | Baja | No es un bug hoy — nadie lee esos campos en la UI. Si se necesitan en el futuro, agregar al SELECT y al tipo en students.ts |

## Pendientes (no incluidos en esta sesión)

- [ ] **Mostrar `birth_date` en la UI** — actualmente se guarda pero no se lee en ninguna pantalla
- [ ] **Editar perfil de estudiante** — no existe un flujo de edición aún
- [ ] **Agregar `metadataBase` en app/layout.tsx** — warning preexistente de Next.js que afecta Open Graph en producción (no relacionado con este fix)
- [ ] Documentar en `supabase/schema.sql` que los cambios de esquema deben ir en `migrations/`

## Recomendación Para El Siguiente Agente

Antes de cualquier otro trabajo de backend, confirmar que la migración fue
aplicada en el proyecto Supabase real. Una vez confirmado, el flujo de creación
de estudiante debería funcionar de extremo a extremo sin más cambios en el código.
