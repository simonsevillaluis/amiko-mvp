# AMIKO MVP

Demo web para validar el corazon de AMIKO: un adulto (padre, madre o cuidador) ingresa una tarea escolar, la app la adapta en pasos simples y cortos, y el estudiante avanza en la vista guiada de la tarea — una instruccion por pantalla, sin sobrecarga visual.

El adulto gestiona la experiencia completa: crea el perfil del estudiante, adapta tareas y revisa el progreso. El estudiante solo interactua con la vista guiada de cada tarea, disenada para minimizar distracciones.

## Roles

| Quien | Ruta principal | Que puede hacer |
|-------|---------------|-----------------|
| Adulto (padre/cuidador) | `/dashboard` | Crear perfiles de estudiantes, adaptar tareas, revisar logros |
| Estudiante | `/paso-a-paso/[id]` | Avanzar paso a paso en una tarea adaptada |
| Estudiante (demo) | `/demo/student-portal` | Explorar el portal estudiantil sin cuenta |

## Recorrido de demo

1. Abrir `/login` para iniciar sesion con correo/contrasena o Google usando Supabase.
2. Entrar a `/dashboard` y presentar el perfil, tareas recientes y accesos rapidos.
3. Ir a `/adapt-task` y revisar el formulario de adaptacion de tarea escolar.
4. Abrir `/tasks/task-1` para mostrar la adaptacion estructurada generada por Gemini.
5. Activar la vista guiada del estudiante desde una tarea adaptada — ruta `/paso-a-paso/[id]` — con los botones `Lo hice`, `Necesito ayuda` y `Necesito pausa`.
6. Revisar `/logros` para mostrar el avance semanal del estudiante al adulto acompanante.
7. Demostrar `/demo/student-portal/amiko` para mostrar la experiencia del lado del estudiante (Amiko chat, sin cuenta requerida).

> `/teacher` existe como prototipo de vista docente pero no forma parte del recorrido de demo actual. Se activara en una fase futura.

## Criterios de validacion

- La propuesta se entiende sin explicar una plataforma compleja.
- La adaptacion reduce carga cognitiva: pasos cortos, apoyo visual y tono calmado.
- La vista guiada del estudiante evita sobrecarga visual y permite avanzar de a un paso.
- Los logros ayudan al adulto a acompanar sin parecer reporte clinico.
- El limite del producto queda claro: AMIKO es apoyo pedagogico, no herramienta medica.

## Estado actual

- Demo con Next.js, TypeScript, Tailwind CSS y Supabase Auth integrado.
- Guarda usuarios adultos y perfiles de estudiantes en Supabase cuando las variables estan configuradas.
- La ruta `/api/chat` usa Google Gemini mediante `GEMINI_API_KEY`.
- No hay integracion OpenAI activa todavia; si se migra a OpenAI, mantener la clave solo en servidor.
- No incluye pagos, marketplace, especialistas, comunidad ni app movil nativa.
- El estudiante no tiene cuenta propia todavia; su acceso futuro sera via correo de invitacion desde el perfil del adulto.

## Documentos de investigacion (docs/)

| Archivo | Contenido |
|---------|-----------|
| `docs/brief-mvp-nino.md` | Brief del MVP para la experiencia del estudiante |
| `docs/analisis-competencia-nino.md` | Analisis de competencia enfocado en la experiencia del nino |
| `docs/hallazgos-competencia-nino.md` | Hallazgos clave del analisis competitivo |

## Supabase

1. Crear un proyecto en Supabase.
2. En el SQL Editor, ejecutar `supabase/schema.sql`.
3. En Authentication > Providers, activar Email y Google si se usara login social.
4. En Authentication > URL Configuration, agregar:
   - `http://localhost:3000`
   - `https://tu-app.vercel.app`
   - `https://tu-dominio.com` cuando exista dominio propio.
5. En Google Cloud Console, agregar como redirect URI autorizado:
   - `https://TU-PROYECTO.supabase.co/auth/v1/callback`

Variables de entorno:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
GEMINI_API_KEY=
```

`NEXT_PUBLIC_SUPABASE_ANON_KEY` tambien funciona como fallback si el proyecto usa la clave publica anterior. No usar `SUPABASE_SERVICE_ROLE_KEY` en el cliente ni exponer claves de IA con prefijo `NEXT_PUBLIC_`.

Consultas utiles para medir el MVP:

```sql
select count(*) as usuarios_registrados from public.profiles;

select role, count(*) as total
from public.profiles
group by role
order by total desc;

select count(*) as estudiantes_registrados from public.student_profiles;

select date_trunc('day', created_at) as dia, count(*) as registros
from public.profiles
group by dia
order by dia desc;
```

## Preparacion para Vercel

1. Ejecutar `npm run lint`.
2. Ejecutar `npm run build`.
3. Crear proyecto en Vercel apuntando a este repositorio.
4. Framework preset: Next.js. Build command: `npm run build`. Install command: `npm install`. Output directory: dejar el valor automatico de Next.js.
5. Configurar estas variables en Preview y Production:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `GEMINI_API_KEY`
6. Configurar en Supabase Authentication > URL Configuration:
   - Site URL de produccion: `https://tu-app.vercel.app` o dominio propio.
   - Redirect URLs: `http://localhost:3000/**`, `https://tu-app.vercel.app/**` y la URL de preview si se validara login manualmente.
7. Mantener claves y secretos fuera del cliente. No configurar `SUPABASE_SERVICE_ROLE_KEY` salvo que exista una ruta server-only que la necesite.
8. Validar preview sin automatizar registro ni login contra Supabase real, para evitar rate limits.

Checklist de despliegue:

- [ ] `npm run lint` sin errores.
- [ ] `npm run build` exitoso.
- [ ] Variables de entorno configuradas en Vercel para Preview y Production.
- [ ] `supabase/schema.sql` aplicado en el proyecto Supabase correspondiente.
- [ ] URLs de Supabase Auth actualizadas para dominio Vercel y dominio propio si aplica.
- [ ] Preview revisado manualmente: `/`, `/login`, `/dashboard`, `/adapt-task`, `/logros`.
- [ ] Flujos de registro e inicio de sesion probados manualmente por una persona, no por automatizacion.
- [ ] Production deploy aprobado despues de validar preview.
