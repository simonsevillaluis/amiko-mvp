# AMIKO MVP

Demo web para validar el corazón de AMIKO: una persona adulta ingresa una tarea escolar, la app la muestra como una adaptación simple y el estudiante puede avanzar en modo niño con una instrucción por pantalla.

## Recorrido de demo

1. Abrir `/login` para explicar que la autenticación real será con Supabase.
2. Entrar a `/dashboard` y presentar el perfil, tareas recientes y progreso básico.
3. Ir a `/adapt-task` y revisar el formulario de tarea escolar.
4. Abrir `/tasks/task-1` para mostrar la adaptación estructurada.
5. Probar `/child-mode/task-1` con los botones `Lo hice`, `Necesito ayuda` y `Me frustré`.
6. Revisar `/progress` y `/teacher` para conversar sobre utilidad para adultos y docentes.

## Criterios de validación

- La propuesta se entiende sin explicar una plataforma compleja.
- La adaptación reduce carga cognitiva: pasos cortos, apoyo visual y tono calmado.
- El modo niño evita sobrecarga visual y permite avanzar paso a paso.
- El progreso básico ayuda a acompañar sin parecer reporte clínico.
- El límite del producto queda claro: AMIKO es apoyo pedagógico, no herramienta médica.

## Estado actual

- Demo mockeada con Next.js, TypeScript y Tailwind CSS.
- No guarda datos reales todavía.
- No llama a OpenAI todavía.
- No usa Supabase todavía.
- No incluye pagos, marketplace, especialistas, comunidad ni app móvil nativa.

## Preparación para Vercel

1. Ejecutar `npm run lint`.
2. Ejecutar `npm run build`.
3. Crear proyecto en Vercel apuntando a este repositorio.
4. Configurar variables de entorno cuando se conecten Supabase y OpenAI.
5. Mantener claves y secretos fuera del cliente.

## Variables futuras

Cuando se active backend real, usar variables de entorno como:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
```
