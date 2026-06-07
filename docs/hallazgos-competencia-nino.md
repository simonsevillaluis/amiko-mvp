# AMIKO Niño - Síntesis y Hallazgos de Competencia

Este documento consolida los aprendizajes extraídos del análisis de competencia visual y funcional para el **Modo Niño** de AMIKO. El objetivo es estructurar los insights para guiar el diseño del MVP.

---

## 1. Qué Funciona en las Referencias (Buenas Prácticas)
*   **Selección por Chips (Pills):** Reemplazar el ingreso de texto por botones de selección rápida de gran tamaño para reducir carga cognitiva y motriz.
*   **Check-in Emocional Visual:** Evaluar el estado de ánimo o energía inicial a través de una escala simple de 5 emojis claros.
*   **Navegación Lineal Paginada:** Usar un diseño de tarjeta central fija con botones de flecha gigantes para avanzar y retroceder a ritmo propio.
*   **Lectura por Voz (Text-to-Speech):** Integrar reproducción de audio para narrar las instrucciones en voz alta, mejorando la accesibilidad.
*   **Animaciones Sensoriales de Calma:** Emplear gráficos de expansión circular fluida (visual stimming) para sincronizar la respiración.
*   **Avatares de Emojis:** Permitir personalizar el perfil usando emojis sencillos en lugar de exigir fotos reales, protegiendo la privacidad.

---

## 2. Qué No Funciona o Debemos Evitar
*   **Formularios Densos de Texto:** Evitar cajas de texto libres que requieran tecleado manual prolongado.
*   **Etiquetado Clínico Masivo:** No categorizar o forzar al niño a identificarse con diagnósticos médicos (ej. autismo, TDAH, TOC).
*   **Saturación en Cabeceras y Menús:** Prescindir de múltiples iconos de control e interfaces de doble navegación que distraigan de la tarea.
*   **Botones de Alerta en Rojo Intenso:** Evitar elementos flotantes rojos o iconos de peligro (`!`) que induzcan estrés o urgencia innecesaria.
*   **Dinámicas de Contrarreloj y Competencia:** Eliminar temporizadores de cuenta regresiva o tablas de clasificación que disparen la frustración.

---

## 3. Patrones que Adaptaremos a AMIKO Niño

### A. Estructura de Foco Único (Inmersivo)
*   **Flujo en Pantalla Completa:** Al iniciar el Modo Niño se ocultará el 100% de la barra de navegación lateral y cabeceras complejas.
*   **Navegación de Tarjeta Única:** Visualización de un solo paso por pantalla con paginación lineal limpia (ej: *Paso 1 de 4*).

### B. Funciones de Accesibilidad y Control
*   **Botón Altavoz (TTS):** Botón de reproducción de audio al lado de cada paso adaptado que lee la instrucción mediante síntesis de voz nativa.
*   **Puerta Parental de Seguridad:** Restringir la salida del Modo Niño requiriendo mantener presionado un botón por 3 segundos o resolver una suma simple (ej: *5 + 3*).

### C. Regulación y Apoyo Emocional
*   **Lienzo de Respiración y Toque:** Al pulsar *"Me frustré"*, la app iniciará una animación circular suave de respiración acompañada de un lienzo táctil de trazos que se desvanecen.

---

## 4. Patrones que NO Encajan con AMIKO
*   **Red Social Abierta:** Chats grupales, descubrimiento de perfiles o solicitudes de amigos. AMIKO es una burbuja privada y segura.
*   **Cobros e Indicadores Comerciales:** Paywalls o avisos de suscripción premium. El flujo de aprendizaje debe estar libre de transacciones.
*   **Micro-Administración Administrativa:** Edición de roles, configuración de voz de la IA o gestión de permisos en la vista infantil.

---

## 5. Ideas Accionables para el MVP

1.  **Pantalla de Anticipación (Primero - Entonces / First-Then):**
    *   *Primero:* Completar la tarea escolar adaptada.
    *   *Entonces:* Obtener un premio o pausa de juego configurada por el adulto.
2.  **Tablero de Asistencia Escolar Simplificado:**
    *   Un panel de 3 botones permanentes de gran tamaño en la parte inferior:
        *   `[ 🔊 Leer Paso ]`
        *   `[ ⏳ Pausa / Descanso ]`
        *   `[ 🙋 Ayuda / No Entiendo ]`
3.  **Registro Silencioso de Ayudas:**
    *   Al tocar *"Ayuda"*, enviar una notificación silenciosa al dashboard del adulto y registrarlo en el progreso, sin interrumpir con sonidos de alarma.

---

## 6. Preguntas Abiertas para Validar con Niños y Padres
*   *¿La escala de 5 emojis de energía es fácil de comprender para el niño o prefiere ilustraciones más pedagógicas de estados físicos?*
*   *¿Qué tiempo de animación de respiración (30 segundos, 1 minuto) mantiene el foco del niño antes de querer reanudar la tarea?*
*   *¿La presencia del botón "Me frustré" le da seguridad al niño o su uso frecuente interrumpe demasiado la dinámica escolar?*
*   *¿Prefieren los padres configurar los avatares con emojis o con ilustraciones temáticas más detalladas?*
