# AMIKO Niño - Brief Inicial del MVP

Este documento define la especificación funcional y técnica para el desarrollo del **Modo Niño** de AMIKO como un portal independiente.

---

## 1. Arquitectura de Sesiones y Portal Independiente
*   **Separación de Portales:** El portal de adultos y el de niños correrán en rutas diferenciadas.
*   **Gestión de Cuentas:** Cada portal se asocia a un correo distinto. El cambio de portal se realiza cerrando sesión e ingresando con las credenciales correspondientes.
*   **Demostración Local (Sin Supabase):** 
    *   La base de datos real se simulará localmente usando `localStorage`.
    *   Los eventos registrados por el niño persistirán en el navegador para que el portal de adultos (padres/docentes) pueda leerlos y renderizar el panel de progreso en tiempo real.

---

## 2. Pantallas y Flujos Clave del Portal Niño

### A. Pantalla de Inicio (Home Niño)
*   **Saludo y Avatar:** Muestra el avatar de emoji del niño y un saludo temporal dinámico (ej: *"¡Hola, Mateo!"*).
*   **Asistente AMIKO (Voz/Foto):** Un botón destacado para *"Hablar con AMIKO"*, simulando la captura de una tarea verbalmente o tomando una foto.
*   **Mis Tareas Pendientes:** Listado de tarjetas grandes con las tareas escolares asignadas para el día actual.

### B. Flujo Paso a Paso de Tareas
*   **Pantalla de Anticipación (Primero - Entonces):** Antes de iniciar la tarea, muestra de forma secuencial qué se hará y cuál será la recompensa (ej: *"Primero hacemos matemáticas, Entonces jugamos"*).
*   **Una Instrucción por Pantalla:** Tarjeta central fija, letra grande, alto contraste.
*   **Herramientas de Accesibilidad:** Botón altavoz de lectura en voz alta (Text-to-Speech) nativo.
*   **Navegación:** Flechas gigantes de avance/retroceso lineal.

### C. Centro de Regulación (Pausas ante Frustración)
Al presionar **"Me frustré"** o **"Necesito pausa"**, se despliega un panel integrando tres opciones seleccionables por el estudiante:
1.  **Respiración Visual:** Animación de expansión circular guiada por 30 segundos (Inhala / Exhala).
2.  **Actividades de Descanso:** Pictogramas simples para registrar pausas activas (ej: tomar agua, estirarse, dibujar).
3.  **Contención Afectiva y Ayuda:** Mensaje cálido validando el sentimiento y ofreciendo un botón para llamar físicamente al tutor.

### D. Salida y Notificación Segura (Cero Frustración)
*   **Salida Libre:** Para evitar desespero, el niño puede salirse de la tarea en cualquier momento.
*   **Notificación Silenciosa:** Si el niño sale sin completar la tarea, la app registra un evento de suspensión en `localStorage` que se reflejará en la pantalla del padre en tiempo real.

---

## 3. Hoja de Ruta de Implementación MVP

1.  **Mock de Datos:** Ampliar `lib/mock-data.ts` para soportar múltiples tareas del niño y avatares.
2.  **Lógica de LocalStorage:** Crear un servicio en `lib/security/local-progress.ts` que capture eventos de click en *"Lo hice"*, *"Necesito ayuda"*, *"Me frustré"* y salidas de la app.
3.  **Desarrollo de Vistas Niño:**
    *   Home del Portal del Niño.
    *   Flujo inmersivo de pasos con TTS.
    *   Centro de Regulación (Respiración animada + Pictogramas de pausa).
