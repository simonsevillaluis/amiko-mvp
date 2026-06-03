# AGENTS.md

## Producto

AMIKO es un asistente pedagógico inclusivo con IA para niños, niñas y adolescentes con TEA. Su propósito es ayudar a padres, madres, cuidadores y docentes a transformar tareas escolares en instrucciones simples, visuales y paso a paso.

El producto debe facilitar que el estudiante comprenda mejor qué debe hacer, avance con más autonomía y reciba apoyo adulto cuando lo necesite. AMIKO es una herramienta de apoyo pedagógico: no diagnostica, no sustituye a profesionales de salud, terapeutas ni docentes, y debe comunicar ese límite con claridad.

## Objetivo del MVP

Construir una demo web funcional que permita validar el corazón del producto:

- Si padres, madres y docentes entienden el valor de AMIKO.
- Si la adaptación de tareas escolares ayuda al estudiante a comprender mejor la actividad.
- Si el modo niño facilita avanzar paso a paso.
- Si el registro básico de progreso entrega información útil sin crear complejidad innecesaria.

El MVP debe enfocarse en validar la experiencia principal, no en construir una plataforma completa.

## Alcance Del MVP

El MVP debe incluir:

- Adaptar tareas escolares.
- Mostrar instrucciones simples paso a paso.
- Sugerir pictogramas o apoyos visuales.
- Activar un modo niño con una instrucción por pantalla.
- Registrar progreso básico.
- Mostrar una vista básica para padres, madres y docentes.

El MVP no debe incluir todavía:

- Pagos.
- Marketplace.
- Videollamadas con especialistas.
- App móvil nativa.
- Panel institucional avanzado.
- Sistema complejo de reportes.
- Comunidad o foro.

## Usuarios Principales

- Padre, madre o cuidador: crea perfiles, ingresa tareas, revisa adaptaciones y progreso.
- Docente: revisa tareas originales, adaptaciones generadas y observaciones del estudiante.
- Estudiante con TEA: usa el modo niño para avanzar una instrucción a la vez.

## Stack Recomendado

- Next.js con App Router.
- React.
- TypeScript.
- Tailwind CSS.
- Supabase para autenticación, base de datos y almacenamiento.
- OpenAI API para adaptar tareas escolares.
- Vercel para despliegue.

## Funcionalidades Principales

### Autenticación

- Registro de usuario.
- Inicio de sesión.
- Cierre de sesión.
- Acceso protegido a las vistas privadas.

### Perfil Básico Del Estudiante

Cada usuario debe poder crear y consultar perfiles de estudiantes con información mínima:

- Nombre.
- Edad.
- Grado escolar.
- Nivel de apoyo.
- Preferencias visuales.

Evitar pedir información clínica detallada o datos sensibles innecesarios.

### Ingreso De Tarea Escolar

Debe existir un formulario para ingresar una tarea escolar. El formulario debe permitir capturar:

- Perfil del estudiante.
- Título o materia de la tarea.
- Texto original de la tarea.
- Observaciones opcionales del padre, madre o docente.

### Adaptación Automática Con IA

El sistema debe enviar la tarea a un servicio de IA y recibir una adaptación estructurada. La respuesta debe mostrarse de forma clara e incluir:

- Explicación simple.
- Pasos numerados.
- Pictogramas o apoyos visuales sugeridos.
- Recomendación emocional si la tarea puede generar frustración.
- Nivel de dificultad estimado.

### Modo Niño

El modo niño debe ser extremadamente simple:

- Una instrucción por pantalla.
- Botones grandes.
- Poco texto.
- Alto contraste.
- Avance paso a paso.
- Opción `Lo hice`.
- Opción `Necesito ayuda`.
- Opción `Me frustré`.

Cada interacción importante debe registrar un evento básico de progreso.

### Progreso Básico

El sistema debe registrar y mostrar:

- Tareas adaptadas.
- Pasos completados.
- Cantidad de ayudas solicitadas.
- Momentos de frustración reportados.
- Fecha y hora de los eventos relevantes.

La vista de progreso debe ser simple y útil para un adulto, sin intentar convertirse en un reporte clínico.

### Vista Docente Básica

La vista docente debe mostrar:

- Tarea original.
- Adaptación generada.
- Perfil básico del estudiante.
- Observaciones del estudiante o del adulto.
- Progreso básico relacionado con la tarea.

## Estructura Sugerida De Base De Datos

Usar Supabase con reglas de acceso por usuario. Los nombres exactos pueden ajustarse al código existente, pero esta estructura debe guiar el diseño inicial.

### `users`

Puede apoyarse en `auth.users` de Supabase y una tabla pública de perfil si hace falta.

Campos sugeridos:

- `id`: UUID, referencia al usuario autenticado.
- `email`: texto.
- `full_name`: texto opcional.
- `role`: texto o enum, por ejemplo `parent`, `teacher` o `caregiver`.
- `created_at`: timestamp.
- `updated_at`: timestamp.

### `student_profiles`

Campos sugeridos:

- `id`: UUID.
- `user_id`: UUID, dueño del perfil.
- `name`: texto.
- `age`: número.
- `school_grade`: texto.
- `support_level`: texto, por ejemplo `bajo`, `medio` o `alto`.
- `visual_preferences`: texto o JSON.
- `notes`: texto opcional.
- `created_at`: timestamp.
- `updated_at`: timestamp.

### `tasks`

Campos sugeridos:

- `id`: UUID.
- `user_id`: UUID.
- `student_id`: UUID.
- `title`: texto.
- `subject`: texto opcional.
- `original_text`: texto.
- `adult_notes`: texto opcional.
- `status`: texto, por ejemplo `draft`, `adapted`, `in_progress` o `completed`.
- `created_at`: timestamp.
- `updated_at`: timestamp.

### `adapted_tasks`

Campos sugeridos:

- `id`: UUID.
- `task_id`: UUID.
- `user_id`: UUID.
- `simple_summary`: texto.
- `steps`: JSON.
- `emotional_support`: texto.
- `difficulty_level`: texto, por ejemplo `bajo`, `medio` o `alto`.
- `model`: texto opcional.
- `raw_response`: JSON opcional.
- `created_at`: timestamp.
- `updated_at`: timestamp.

### `progress_events`

Campos sugeridos:

- `id`: UUID.
- `user_id`: UUID.
- `student_id`: UUID.
- `task_id`: UUID.
- `adapted_task_id`: UUID opcional.
- `step_number`: número opcional.
- `event_type`: texto, por ejemplo `step_completed`, `help_requested` o `frustration_reported`.
- `notes`: texto opcional.
- `created_at`: timestamp.

## Reglas Para La IA

La IA debe:

- Usar español claro y sencillo.
- Evitar lenguaje clínico complejo.
- Dividir instrucciones en pasos pequeños.
- No diagnosticar.
- No sustituir a psicólogos, terapeutas, médicos ni docentes.
- Recomendar acompañamiento adulto cuando sea necesario.
- Usar tono calmado, positivo y estructurado.
- Generar siempre una salida en JSON estructurado.
- Mantener las instrucciones concretas y accionables.
- Priorizar seguridad, claridad y contención emocional.

La salida de la IA debe tener siempre este formato:

```json
{
  "simple_summary": "Resumen simple de la tarea",
  "steps": [
    {
      "number": 1,
      "instruction": "Instrucción corta",
      "visual_support": "Pictograma sugerido",
      "adult_support": "Sugerencia para el adulto"
    }
  ],
  "emotional_support": "Mensaje breve de regulación emocional",
  "difficulty_level": "bajo | medio | alto"
}
```

Si la IA no puede adaptar una tarea con seguridad, debe devolver una respuesta estructurada que explique el límite y sugiera acompañamiento adulto.

## Principios De UX/UI

- Interfaz limpia.
- Colores principales: azul y verde.
- Botones grandes.
- Tipografía legible.
- Poco texto por pantalla.
- Contraste alto.
- Evitar sobrecarga visual.
- Usar tarjetas, iconos y pasos numerados.
- Mantener jerarquías visuales simples.
- Priorizar claridad antes que decoración.
- El modo niño debe ser extremadamente simple.

Las pantallas para adultos pueden tener más información, pero deben seguir siendo escaneables y tranquilas. Las pantallas para estudiantes deben reducir al mínimo la cantidad de decisiones visibles.

## Rutas Sugeridas

- `/`: página inicial o redirección según sesión.
- `/login`: inicio de sesión y registro.
- `/dashboard`: resumen principal para adultos.
- `/students`: gestión de perfiles de estudiantes.
- `/adapt-task`: formulario para ingresar y adaptar una tarea.
- `/tasks/[id]`: detalle de tarea y adaptación.
- `/child-mode/[id]`: experiencia paso a paso para el estudiante.
- `/progress`: resumen básico de progreso.
- `/teacher`: vista docente básica.

## Componentes Sugeridos

- `AppShell`: estructura general de navegación.
- `Sidebar`: navegación lateral para vistas adultas.
- `StudentProfileCard`: resumen de un perfil de estudiante.
- `TaskInputForm`: formulario para ingresar tarea escolar.
- `AdaptedTaskResult`: visualización de la adaptación generada.
- `VisualSupportCard`: tarjeta para pictogramas o apoyos visuales sugeridos.
- `ChildModeStep`: pantalla de una instrucción en modo niño.
- `ProgressSummary`: resumen simple de progreso.
- `TeacherTaskView`: vista docente de tarea, adaptación y observaciones.

## Criterios De Aceptación Del MVP

El MVP se considera listo cuando:

- Un usuario puede iniciar sesión.
- Un usuario puede crear un perfil de estudiante.
- Un usuario puede ingresar una tarea escolar.
- La IA devuelve una adaptación estructurada.
- El resultado se muestra de forma clara.
- El estudiante puede usar el modo niño.
- El sistema registra eventos básicos de progreso.
- El padre, madre o docente puede ver un resumen simple.
- La app puede desplegarse en Vercel.

## Estilo De Código

- Usar TypeScript.
- Crear componentes pequeños y reutilizables.
- Validar formularios.
- Manejar errores de API con mensajes claros.
- Separar la lógica de IA en un servicio.
- Separar llamadas a Supabase en una capa de datos.
- No hardcodear claves ni secretos.
- Usar variables de entorno.
- Comentar solo donde aporte claridad.
- Mantener nombres de archivos, componentes y funciones descriptivos.
- Preferir código simple y explícito durante el MVP.

## Seguridad Y Privacidad

- No guardar datos sensibles innecesarios.
- No pedir diagnóstico clínico detallado.
- Proteger datos de menores.
- Usar autenticación.
- Aplicar reglas de acceso por usuario en Supabase.
- Mostrar aviso de que AMIKO es apoyo pedagógico, no herramienta médica.
- Evitar exponer claves de API en el cliente.
- Registrar solo la información necesaria para validar el MVP.

## Orden Recomendado De Implementación

### Primero

- Crear estructura Next.js.
- Crear diseño base.
- Crear pantallas mockeadas.
- Definir componentes principales.

### Segundo

- Conectar Supabase.
- Crear login.
- Crear perfil del estudiante.
- Proteger rutas privadas.

### Tercero

- Conectar OpenAI API.
- Crear servicio de adaptación de tareas.
- Validar salida JSON.
- Mostrar resultado adaptado.

### Cuarto

- Crear modo niño.
- Registrar progreso.
- Mostrar resumen básico de eventos.

### Quinto

- Pulir UI.
- Revisar accesibilidad básica.
- Preparar demo para pruebas con padres, madres y docentes.
- Verificar despliegue en Vercel.

## Prioridad Del Proyecto

La prioridad es validar una experiencia clara, humana y útil: una persona adulta ingresa una tarea escolar, AMIKO la transforma en pasos simples con apoyos visuales, y el estudiante puede avanzar con una instrucción por pantalla.

Cada decisión técnica o de diseño debe proteger ese flujo principal.
