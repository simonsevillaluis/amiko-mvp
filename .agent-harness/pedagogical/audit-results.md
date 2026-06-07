# 🧠 Auditoría de Accesibilidad Cognitiva y Lectura Fácil: Flujo de Tareas de AMIKO

*Este reporte fue generado y entregado por el track de Pedagogía y Accesibilidad en respuesta a la auditoría del flujo de ingreso, adaptación y visualización de tareas en AMIKO (incluido el Modo Niño).*

---

## 1. Flujo de Ingreso de Tareas (`/adapt-task`)

### 👍 Qué está bien
* **Carga mental reducida para el adulto:** El cartel de bienvenida ("*No necesitas simplificarla antes. Escríbela tal como la envió el docente*") tranquiliza al cuidador y le evita el esfuerzo inicial de estructurar la tarea.
* **Opciones rápidas intuitivas:** Los chips de opciones contextuales ("Pasos muy simples", "Puede causar frustración", etc.) permiten personalizar la adaptación con un solo clic.
* **Tono cercano y positivo:** El lenguaje es empático, evitando términos clínicos y enfocándose en el acompañamiento.

### ⚠️ Riesgos de accesibilidad y carga cognitiva
* **Botón inactivo confuso:** El botón de "Subir foto de la tarea (Próximamente)" comparte protagonismo visual y accesibilidad con el botón de acción principal. Los usuarios pueden intentar pulsarlo repetidamente, generando frustración.
* **Etiquetas abstractas:** La pregunta "¿Qué podría ayudar?" es muy genérica. Para un adulto cansado o estresado, puede ser confuso saber qué responder o seleccionar de los chips.
* **Mensajes de error rústicos:** Si hay un error, el recuadro de color rojo intenso y texto plano resulta tosco y alarmista, lo que rompe la estética de calma del producto.

---

## 2. Visualización de la Adaptación (`/tasks/new` y `/tasks/[id]`)

### 👍 Qué está bien
* **Estructura limpia e hilada:** El desglose en pasos numerados con colores suaves facilita la lectura escaneable.
* **Uso correcto de "Apoyo Visual":** Se evita saturar la interfaz con la palabra "pictograma", presentándolo de forma complementaria como "Apoyo visual", cumpliendo la directriz de la marca.
* **Orientación dual:** Se incluye una sección clara y diferenciada para el adulto acompañante ("Para acompañar: ...") y una de "Apoyo para el adulto".

### ⚠️ Riesgos de accesibilidad y carga cognitiva
* **Falta de concordancia en dificultad:** Mostrar "Dificultad bajo", "Dificultad medio", "Dificultad alto" en los tags de estado resulta gramaticalmente chocante en español ("dificultad" es un sustantivo femenino, por lo que debería ser *baja*, *media* o *alta*). Esto añade una fricción de lectura evitable.
* **Ambigüedad en el Mensaje Emocional:** El bloque "Pausa y acompaña" muestra un texto generado en segunda persona del singular que se dirige al estudiante ("Si *te* sientes cansado... puedes respirar profundo... Vas bien"). Sin embargo, este bloque se titula "Apoyo para el adulto". Esta discrepancia confunde: el adulto no sabe si el mensaje es para él o si debe leérselo al niño.
* **Inconsistencia en los apoyos visuales:** Los textos de los apoyos visuales generados por el mock o la IA a veces incluyen el prefijo `"Imagen: ..."` (ej. `"Imagen: mesa limpia con útiles"`) y otras veces no (ej. `"Mesa ordenada"`). Esto genera confusión visual y asimetría en las tarjetas de pasos.
* **Falta de llamado a la acción principal (CTA):** En la pantalla de tarea adaptada, no hay un botón directo y destacado para iniciar la tarea en el "Modo Niño". El único botón disponible es "Registrar después", que desvía al usuario hacia la organización de su día (`/mi-dia`). Si la tarea acaba de ser adaptada, el flujo natural es empezarla o guardarla formalmente.

---

## 3. Modo Niño (`/child-mode/[id]`)

### 👍 Qué está bien
* **Una instrucción por pantalla:** El diseño a pantalla limpia con letras grandes minimiza las distracciones.
* **Interacciones simplificadas:** Botones gigantescos, táctiles y con alto contraste para las acciones clave (`Lo hice`, `Necesito ayuda`, `Me frustré`).
* **Indicación visual de progreso:** Barra de progreso limpia en la parte superior.

### ⚠️ Riesgos de accesibilidad y carga cognitiva
* **Falta de apoyos visuales reales:** En lugar de mostrar un icono, ilustración o pictograma real, la tarjeta de "Apoyo visual" muestra texto (ej. `"Imagen: ojos leyendo"`). Para un estudiante con TEA que requiere apoyo visual para la comprensión, leer texto descriptivo sobre una imagen añade carga cognitiva verbal en lugar de aliviarla.
* **Ruido visual de retroalimentación (`lastAction`):** La caja con el estado de la última acción (ej. `"Muy bien. Marcamos este paso como hecho"`) añade texto innecesario en la pantalla del niño. En el Modo Niño, cada palabra cuenta; la confirmación de las acciones debe ser puramente visual, auditiva o con microanimaciones, no a través de bloques de lectura.
* **Botón de salida poco amigable:** El botón "Volver" en la cabecera es un enlace genérico. Puede pulsarse por accidente y carece de confirmación visual o un icono amigable que el niño asocie con "Cerrar" o "Salir".
* **Instrucciones de preparación mezcladas:** El primer paso suele ser "Busca un lugar tranquilo y prepara tus materiales". Aunque es una buena práctica de autorregulación, mezclar pasos de preparación con los pasos reales de la tarea puede confundir al estudiante sobre el progreso de su actividad.

---

## 4. Plan de Cambios Recomendados (Priorizados)

| Prioridad | Elemento / Pantalla | Descripción del Cambio Recomendado | Razón Pedagógica |
| :--- | :--- | :--- | :--- |
| **Alta** | `/tasks/new` | **Añadir botón "Empezar tarea (Modo Niño)"** como acción principal en la visualización de la tarea adaptada. | Reduce la carga de decisión y conecta directamente el trabajo de adaptación del adulto con la experiencia del niño. |
| **Alta** | `/child-mode/[id]` | **Ocultar el texto de `lastAction`** o sustituirlo por una animación / color de éxito breve. | Evita saturar al estudiante con lecturas de bitácora del sistema y mantiene el foco en una sola instrucción. |
| **Alta** | `/child-mode/[id]` | **Reemplazar descripciones de texto por pictogramas/iconos reales** en el bloque de apoyo visual. | El texto descriptivo no funciona como apoyo visual para estudiantes que requieren simplificación cognitiva. |
| **Media** | `/tasks/new` | **Corregir concordancia de dificultad** ("baja", "media", "alta") y aclarar el destinatario en el panel de apoyo emocional (ej. *"Guía para decirle al estudiante: '...' "*). | Mejora la coherencia de lectura fácil y aclara el rol de mediación del adulto. |
| **Media** | `/adapt-task` | **Desactivar o atenuar visualmente el botón de "Subir foto"** para que no parezca un botón activo principal. | Evita la frustración por interacción fallida en funciones no implementadas. |
| **Baja** | `/adapt-task` | **Redactar la etiqueta del formulario de manera más explícita** (ej. *"¿Qué apoyos adicionales le ayudarían hoy?"*). | Da más claridad sobre el propósito de las opciones de personalización de la IA. |
| **Baja** | `/child-mode/[id]` | **Agregar un paso o pantalla previa de "Preparación"** antes de iniciar el conteo formal de los pasos de la tarea. | Estructura la rutina antes de la tarea sin alterar la percepción de progreso de la actividad escolar propiamente dicha. |
