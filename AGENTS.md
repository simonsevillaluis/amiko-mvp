# AGENTS.md

## Producto

AMIKO es un asistente pedagógico inclusivo con IA para niños, niñas y adolescentes con TEA. Su propósito es ayudar a padres, madres, cuidadores y docentes a transformar tareas escolares en instrucciones simples, visuales y paso a paso.

El producto debe facilitar que el estudiante comprenda mejor qué debe hacer, avance con más autonomía y reciba apoyo adulto cuando lo necesite. AMIKO es una herramienta de apoyo pedagógico: no diagnostica, no sustituye a profesionales de salud, terapeutas ni docentes, y debe comunicar ese límite con claridad.

## Dirección Actual Del Producto

La implementación debe avanzar por etapas:

1. Construir y validar primero toda la experiencia para padres, madres y cuidadores.
2. Construir después las pantallas y la experiencia directa para el estudiante.

Durante la primera etapa, la prioridad es que el adulto pueda registrarse, crear o consultar el perfil del estudiante, organizar su día, ingresar tareas, recibir adaptaciones claras y revisar información útil para acompañarlo.

El modo niño y las demás pantallas usadas directamente por el estudiante siguen siendo parte de la visión del producto, pero no deben bloquear ni desviar el desarrollo de la experiencia para padres.

AMIKO no manejará un pensum educativo. No construir funciones para administrar currículos, planes académicos oficiales, mallas curriculares, contenidos por grado ni planificación institucional.

## Imagen Y Voz De Marca

Conservar la imagen y voz de marca ya desarrolladas en el proyecto. Antes de crear o rediseñar una pantalla, revisar los componentes, assets y patrones visuales existentes.

La marca AMIKO debe sentirse:

- Cálida, cercana y tranquilizadora.
- Inclusiva y respetuosa.
- Clara, positiva y práctica.
- Infantil cuando acompaña al estudiante, pero nunca condescendiente.
- Confiable y ordenada cuando se dirige al adulto.
- Alejada del lenguaje clínico complejo, alarmista o frío.

Mantener la identidad visual existente: personaje de AMIKO, colores verdes y azules, tarjetas suaves, jerarquías claras, iconografía amigable y espacios visuales tranquilos. Evitar rediseñar la marca desde cero o introducir estilos que contradigan los assets y pantallas actuales.

## Objetivo del MVP

Construir una demo web funcional que permita validar el corazón del producto:

- Si padres, madres y cuidadores entienden el valor de AMIKO.
- Si la adaptación de tareas escolares ayuda al estudiante a comprender mejor la actividad.
- Si la experiencia para padres facilita organizar, adaptar y acompañar las tareas del estudiante.
- Si la información básica de progreso entrega valor sin crear complejidad innecesaria.

El MVP debe enfocarse en validar la experiencia principal, no en construir una plataforma completa.

## Alcance Del MVP

El MVP debe incluir:

- Adaptar tareas escolares.
- Mostrar instrucciones simples paso a paso.
- Sugerir pictogramas o apoyos visuales.
- Registrar progreso básico.
- Mostrar una experiencia completa y coherente para padres, madres y cuidadores.

Después de validar la experiencia para padres, el producto podrá incluir:

- Modo niño con una instrucción por pantalla.
- Pantallas usadas directamente por el estudiante.
- Interacciones simplificadas para completar pasos y pedir ayuda.

El MVP no debe incluir todavía:

- Pagos.
- Marketplace.
- Videollamadas con especialistas.
- App móvil nativa.
- Panel institucional avanzado.
- Sistema complejo de reportes.
- Comunidad o foro.
- Gestión de pensum educativo.
- Planificación curricular o institucional.

## Usuarios Y Prioridad

- Prioridad actual, padre, madre o cuidador: crea perfiles, organiza el día, ingresa tareas, revisa adaptaciones y consulta progreso.
- Segunda etapa, estudiante con TEA: usa experiencias simples para avanzar una instrucción a la vez.
- Etapa posterior, docente: revisa tareas originales, adaptaciones generadas y observaciones relevantes.

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

Esta funcionalidad corresponde a una segunda etapa, después de validar y completar la experiencia para padres.

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
- `/mi-dia`: organización y resumen diario para padres o cuidadores.
- `/students`: gestión de perfiles de estudiantes.
- `/adapt-task`: formulario para ingresar y adaptar una tarea.
- `/tasks/[id]`: detalle de tarea y adaptación.
- `/progress`: resumen básico de progreso.

Rutas para una segunda etapa:

- `/child-mode/[id]`: experiencia paso a paso para el estudiante.
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
- El sistema registra eventos básicos de progreso.
- El padre, madre o cuidador puede entender y navegar el flujo completo.
- La experiencia conserva la imagen y voz de marca de AMIKO.
- La app puede desplegarse en Vercel.

Después de completar esta primera etapa, se definirán criterios de aceptación específicos para las pantallas del estudiante y el modo niño.

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
- Crear y pulir primero las pantallas para padres, madres y cuidadores.
- Definir componentes principales.
- Conservar la imagen, assets y voz de marca existentes.

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

- Registrar progreso.
- Mostrar resumen básico de eventos.
- Validar el flujo completo para padres y cuidadores.

### Quinto

- Pulir UI.
- Revisar accesibilidad básica.
- Preparar demo para pruebas con padres, madres y cuidadores.
- Verificar despliegue en Vercel.

### Después Del MVP Para Padres

- Diseñar y construir las pantallas usadas directamente por el estudiante.
- Crear modo niño.
- Validar interacciones simples, visuales y paso a paso.
- Evaluar posteriormente las necesidades de docentes.

## Prioridad Del Proyecto

La prioridad actual es validar una experiencia clara, humana y útil para padres, madres y cuidadores: una persona adulta organiza la información del estudiante, ingresa una tarea escolar, AMIKO la transforma en pasos simples con apoyos visuales y ofrece una guía práctica para acompañarlo.

Cada decisión técnica o de diseño debe proteger primero ese flujo para adultos, mantener la imagen y voz de marca existente y evitar introducir gestión de pensum educativo.

## Auditoría De Formularios Y Usabilidad

Antes de considerar listo un formulario nuevo o modificado, revisar estos puntos sin esperar a que el usuario los pida:

- Validar campos requeridos antes de enviar.
- Marcar visualmente el campo y su label cuando el dato no es válido.
- Mantener los mensajes de error cerca del campo que los causa cuando el error es específico.
- Evitar mensajes innecesarios si el estado visual basta, por ejemplo caracteres no permitidos en un nombre.
- Permitir nombres reales en español y otros idiomas: letras, acentos, espacios, guion, punto y apóstrofe.
- Bloquear caracteres claramente accidentales en nombres, como `@`, números y símbolos no propios de nombres.
- Verificar contraseñas cuando se crean cuentas y mostrar error si no coinciden.
- Hacer que los iconos interactivos sean botones reales, con estados visibles, `aria-label` y feedback claro.
- No usar enlaces que parezcan acción pero no hagan nada, por ejemplo recuperación de contraseña apuntando a la misma pantalla.
- Reducir opciones redundantes en pantallas de alta concentración como registro; dejar una salida clara con flecha o enlace de regreso.
- Probar manualmente estados de error, campos vacíos, datos inválidos, mostrar/ocultar contraseña y navegación de regreso.

## Reglas de Pruebas Automáticas y Rate Limit en Supabase

Para evitar el bloqueo de la dirección IP por exceso de peticiones (Rate Limit / Error 429) en el entorno de Supabase Auth durante el desarrollo local, los agentes de IA **tienen estrictamente prohibido realizar flujos de registro (Sign-Up) o de inicio de sesión (Sign-In) de forma automatizada** mediante el navegador subagent contra la base de datos real.

* Las pruebas de interfaz en navegador (browser subagent) deben limitarse a inspeccionar la estructura visual de las páginas públicas o estados sin sesión.
* Cualquier validación de registro o inicio de sesión en local con cuentas reales debe ser ejecutada manualmente por el desarrollador humano desde su propio navegador, para no saturar los límites de la API de Supabase en el plan gratuito.

