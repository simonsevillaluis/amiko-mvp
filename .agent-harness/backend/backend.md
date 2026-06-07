# 💾 Guía del Track Backend - AMIKO

Esta guía orienta el diseño de base de datos, enrutamiento de API, lógica de integraciones y control de acceso en AMIKO.

## 1. Capa de Datos e Infraestructura
* **Capa de Datos:** Revisa `supabase/` y `lib/` para familiarizarte con las funciones de cliente Supabase inicializadas. No dupliques clientes ni crees nuevas conexiones redundantes.
* **Compatibilidad de Esquema:** Asegúrate de seguir la estructura sugerida en `AGENTS.md` para las tablas de:
  * `users`
  * `student_profiles`
  * `tasks`
  * `adapted_tasks`
  * `progress_events`
* **Políticas RLS (Row Level Security):** Es obligatorio habilitar y validar las políticas RLS en todas las tablas de Supabase. Ningún usuario debe poder modificar, leer o eliminar datos que no le correspondan. El campo `user_id` debe ser el punto de anclaje de seguridad.

## 2. Optimización de Consultas (Queries)
* **Eficiencia de Datos:** Limita los campos devueltos en las consultas (usa `.select('id, title, status')` en lugar de traer todo el objeto si no es necesario). Evita "overfetching" de campos pesados como respuestas JSON crudas en listados de tareas.
* **Consultas de Tareas:** Las consultas que recuperen el listado de tareas del día de un estudiante deben estar optimizadas y ordenadas por fecha de creación o fecha límite.

## 3. Integración de IA
* **Formato de Respuesta:** Toda llamada al backend de IA debe estructurar el prompt de Gemini (@google/generative-ai) para asegurar el retorno de un objeto JSON estructurado y válido, conforme a la estructura de salida descrita en las reglas de la IA.
* **Manejo de Errores de API:** Implementa bloques try/catch robustos para capturar caídas de Gemini o Supabase, retornando códigos HTTP semánticos (por ejemplo, 500 para errores internos o 400 para entradas incorrectas del usuario) con mensajes de error entendibles en español.

## 4. Pruebas y Seguridad
* **Rate Limits:** No uses scripts automatizados de registro o login contra Supabase local/producción real en pruebas automatizadas.
* **Gestión de Entorno:** Todas las llaves privadas de Supabase (`SUPABASE_SERVICE_ROLE_KEY`) y Gemini (`GEMINI_API_KEY`) deben mantenerse estrictamente en el servidor.
