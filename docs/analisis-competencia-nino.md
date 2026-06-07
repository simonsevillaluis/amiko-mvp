# AMIKO Niño - Análisis De Competencia

Este documento recopila el análisis de referencias visuales y funcionales de aplicaciones de la competencia o productos similares. El objetivo es extraer aprendizajes para el diseño del **Modo Niño** de AMIKO, cuidando de mantener nuestra identidad de marca: cálida, clara, inclusiva, tranquila y no clínica.

---

## Registro de Lotes Analizados

### Lote 1: Registro, Preferencias de Comunicación y Selección de Comunidad
*Fecha de análisis: 6 de junio de 2026*
*Origen: Imagen 1 (5 capturas de pantalla de onboarding de una app de neurodiversidad)*

#### 1. Capturas de Pantalla Observadas
La imagen compartida muestra un flujo de registro/onboarding estructurado en tres pantallas principales (con variantes de estado):
- **Pantalla 1 y 2 ("¡Cuéntanos sobre ti!")**: Formulario tradicional de registro con campos de texto para nombre, fecha de nacimiento, género (chips), dirección, país y teléfono.
- **Pantalla 3 y 5 ("Preferencias de comunicación")**: Selección de qué hacer y qué no hacer al interactuar con el usuario (ej. *"Habla despacio"*, *"No me apures"*), usando botones tipo chips. La pantalla 5 muestra la selección activa con un color verde.
- **Pantalla 4 ("Tus Comunidades")**: Listado de etiquetas/chips con diferentes condiciones y comunidades neurodivergentes (ej. *Autismo, TDAH, Dislexia, TOC*).

---

#### 2. Hallazgos del Análisis

##### A. ¿Qué funciona para una experiencia infantil o de apoyo?
*   **Selección por Chips (Pills):** Las etiquetas o chips de selección rápida son ideales. En lugar de escribir texto, el usuario solo debe tocar opciones predefinidas. Esto reduce drásticamente la carga cognitiva y motriz.
*   **Estructura Concreta y Clasificada:** La categorización de preferencias en **"Qué sí hacer ✓"** (positivo/de ayuda) y **"Qué no hacer ✗"** (disparadores/evitar) es sumamente clara y predecible. Para un niño con TEA, este tipo de lógica binaria y estructurada resulta muy comprensible.
*   **Indicadores Visuales de Selección:** El cambio de color de borde y fondo (gris neutro a morado o verde) da una confirmación visual clara de lo que está seleccionado.

##### B. ¿Qué NO conviene copiar en AMIKO?
*   **Formularios con demasiados campos de texto:** La pantalla de datos personales es densa, aburrida y requiere escribir mucho (nombre, dirección, país, teléfono). Esto genera rechazo inmediato en niños y fatiga en los padres. AMIKO debe pedir el mínimo de datos posibles.
*   **Sobrecarga y Etiquetado Clínico:** La pantalla que lista comunidades neurodivergentes (*Autismo, TDAH, Dispraxia, Tourette, TOC, TLP, etc.*) es muy clínica. AMIKO busca ser una herramienta de apoyo pedagógico, por lo que **debemos evitar etiquetas clínicas masivas o forzar al niño a identificarse con diagnósticos médicos** en su interfaz diaria.
*   **Tipografías secundarias con bajo contraste:** Textos de guía como *"Es muy fácil"* o *"Ayuda a otros a entender..."* usan un tono gris muy claro sobre fondo blanco, lo que incumple con las pautas de accesibilidad de contraste de texto.

##### C. Diferenciación de Patrones: Niños vs. Adultos

| Patrón Observado | Diseñado para Adultos | Adaptación para Niños (AMIKO) |
| :--- | :--- | :--- |
| **Ingreso de datos** | Formularios con teclado y cajas de texto. | Selección visual mediante pictogramas, avatares o botones grandes. |
| **Identificación** | Listado de diagnósticos clínicos y médicos. | Selección de preferencias de apoyo (ej. *"Me gustan los dibujos"*, *"Prefiero escuchar"*). |
| **Textos instructivos** | Subtítulos largos en letra pequeña y gris claro. | Instrucciones muy cortas, alto contraste, apoyadas por iconos legibles. |
| **Acciones de navegación** | Botones de texto pequeños o enlaces discretos. | Botones de acción muy grandes con colores consistentes (ej. *Continuar* en verde/azul). |

---

#### 3. Traducción a Decisiones para AMIKO

1.  **Cero formularios de texto para el estudiante:** En el **Modo Niño**, toda interacción debe realizarse mediante toques sencillos sobre botones o tarjetas. No se le pedirá escribir nada.
2.  **Foco en Apoyo, no en Diagnóstico:** En lugar de preguntarle al niño con qué condición se identifica, le preguntaremos cómo prefiere recibir la información (ej. con dibujos, con audio, paso a paso muy corto).
3.  **Mantener una paleta tranquila y accesible:** Evitaremos colores demasiado intensos o con poco contraste. Usaremos la paleta principal de azul y verde de AMIKO con altos contrastes para asegurar legibilidad.
4.  **Botones de Acción Claros y Simples:** Copiaremos la idea de un botón de acción principal destacado al fondo (como el botón *"Continuar"*), pero adaptándolo con iconos y textos de confirmación directos en el Modo Niño (ej. *"¡Lo logré!"* o *"Necesito ayuda"*).

---

### Lote 2: Chat del Asistente (Aura), Ajustes de Accesibilidad y Panel de Herramientas
*Fecha de análisis: 6 de junio de 2026*
*Origen: Imágenes 2 y 3 (4 capturas de pantalla de la app "AutistaAI")*

#### 1. Capturas de Pantalla Observadas
- **Pantalla 1 ("Aura IA")**: Una interfaz de chat conversacional con un avatar robótico llamado Aura. Muestra botones horizontales para cambiar de modo (Chat, Diario, Tareas, Relajación), accesos rápidos a preguntas (ej. *"Estoy abrumado - ayúdame a calmarme"*) y una barra de entrada de mensaje con opción de dictado por voz (icono de micrófono).
- **Pantalla 2 ("Discapacidades sensoriales")**: Formulario de configuración que pregunta por discapacidad auditiva o visual, y ofrece tres interruptores (switches) para preferencias de accesibilidad: *Movimiento Reducido*, *Texto más grande* y *Alto Contraste*.
- **Pantalla 3 ("Contacto de Emergencia")**: Formulario para agregar nombre, número telefónico y relación (Padre/Madre, Terapeuta, Cuidador, etc.) con opción de omitir.
- **Pantalla 4 ("Herramientas / Inicio")**: Un dashboard dirigido a cuidadores. Contiene una tarjeta superior para gestionar el "Círculo de Cuidado" y una cuadrícula de 8 tarjetas de colores pastel suaves con iconos simples para herramientas como: *Asesor de IA, Autocuidado, Citas, Entendiendo el Autismo, Guía de Comunicación, Guía de Crisis, IEP y Escuela, Medicamentos*.

---

#### 2. Hallazgos del Análisis

##### A. ¿Qué funciona para una experiencia infantil o de apoyo?
*   **Acciones Rápidas Emocionales/Cognitivas (Sugerencias):** Los botones como *"Estoy abrumado - ayúdame a calmarme"* o *"Desglosa una tarea"* son sumamente valiosos. Identifican estados de frustración o bloqueo y ofrecen una salida inmediata con un solo toque.
*   **Entrada de Voz (Micrófono destacado):** El dictado por voz facilita la interacción para niños que aún no desarrollan lectoescritura fluida o que se frustran escribiendo en pantallas móviles.
*   **Cuadrícula de Colores Pastel y Iconografía Simple:** El uso de tonos pastel muy suaves y desaturados (verde claro, celeste, lila, rosa) para categorizar herramientas transmite calma y evita la sobrecarga sensorial. Los iconos de trazo simple y amigable ayudan a identificar de qué trata cada tarjeta a primer golpe de vista.
*   **Interruptores de Accesibilidad Físicos:** Permitir activar *Texto más grande*, *Alto Contraste* y *Movimiento Reducido* es clave. En autismo, los estímulos visuales dinámicos (animaciones) pueden sobreestimular, por lo que el "Movimiento Reducido" es un gran acierto.

##### B. ¿Qué NO conviene copiar en AMIKO?
*   **Chat abierto para niños:** Un chat de texto libre requiere alta capacidad de redacción y comprensión verbal. Para el Modo Niño de AMIKO, un chat abierto es demasiado complejo, requiere supervisión y puede desviar el foco de la tarea escolar.
*   **Exceso de elementos de control en la cabecera (Header Clutter):** La pantalla de chat tiene 6 iconos arriba (silenciar, candado, historial, llamada, avatar, nombre). Esto genera distracción y ruido visual innecesario para un estudiante con TEA.
*   **Doble barra de navegación:** Tener un menú de "Modos" arriba de las sugerencias y una barra de navegación con 5 iconos abajo fragmenta la experiencia y confunde sobre dónde hacer clic.

##### C. Diferenciación de Patrones: Niños vs. Adultos

| Patrón Observado | Diseñado para Adultos / Cuidadores | Adaptación para Niños (AMIKO) |
| :--- | :--- | :--- |
| **Interfaz conversacional** | Chat abierto de texto con entrada libre. | Flujo lineal, guiado paso a paso con botones de opciones cerradas (ej. *"Lo hice"*, *"Ayuda"*). |
| **Organización de Herramientas** | Cuadrícula con 8+ categorías complejas (Medicamentos, Citas, IEP). | Interfaz de foco único (una sola tarea a la vez en pantalla), sin navegación multitarea. |
| **Configuración de Accesibilidad** | Menús de ajustes del sistema o del perfil del cuidador. | Activación automática en el Modo Niño basada en las preferencias guardadas por el adulto. |

---

#### 3. Traducción a Decisiones para AMIKO

1.  **Dashboard del Adulto basado en Tarjetas Pastel:** La estructura de la cuadrícula de herramientas con colores suaves y descriptivos es excelente para el Dashboard de padres/docentes. Podemos usar tarjetas similares para *"Crear Perfil"*, *"Historial de Tareas"*, *"Reporte de Progreso"*, y *"Ajustes de Accesibilidad"*.
2.  **Configuración de Accesibilidad en el Perfil:** Implementaremos las opciones de *Texto más grande*, *Alto Contraste* y *Movimiento Reducido* en el perfil del estudiante (gestionado por el adulto). Al iniciar el Modo Niño, la app cargará automáticamente estos estilos según la preferencia del perfil.
3.  **Botón de Calma / Regulación:** La sugerencia *"Estoy abrumado"* nos inspira a integrar un botón de apoyo emocional (ej. *"Me frustré"* o *"Necesito una pausa"*) en el Modo Niño. Al presionarlo, la app puede ofrecer una micro-actividad de regulación (como respiración guiada similar a *"Autocuidado"* en la captura).
4.  **Eliminación de barras de navegación en Modo Niño:** Cuando el estudiante entre al Modo Niño, se ocultará toda cabecera compleja y la barra inferior de navegación para asegurar el 100% de enfoque en la instrucción de la tarea.

---

### Lote 3: Estados de Selección, Selector de Avatar con Emojis y Círculo de Cuidado
*Fecha de análisis: 6 de junio de 2026*
*Origen: Imagen 4 (5 capturas de pantalla de la app "AutistaAI")*

#### 1. Capturas de Pantalla Observadas
- **Pantalla 1 ("Preferencias de comunicación - Seleccionado")**: Muestra la pantalla de preferencias con los chips de *"Qué sí hacer"* seleccionados con contorno y texto verde, y los chips de *"Qué no hacer"* seleccionados con contorno, fondo y texto en color rojo suave/alerta.
- **Pantalla 2 y 3 ("¡Bienvenido, Angel Oropeza!")**: Pantalla de éxito de onboarding que celebra la creación del perfil con un emoji de cono de confeti, mostrando una tarjeta que resume el nombre y el tipo de perfil (*Neurodivergente*).
- **Pantalla 4 ("Tu avatar")**: Interfaz para personalizar la foto del perfil. Ofrece pestañas para subir foto/emoji o generarlo con IA. Presenta accesos directos a cámara y galería, y una cuadrícula de emojis comunes (personas, animales, naturaleza, objetos) para elegir como avatar.
- **Pantalla 5 ("Círculo de Cuidado")**: Pantalla para gestionar permisos de visualización. Permite invitar a un cuidador mediante correo y lista a los cuidadores activos (ej. *Luis - Adulto 18+*), ofreciendo controles de privacidad (icono de candado).

---

#### 2. Hallazgos del Análisis

##### A. ¿Qué funciona para una experiencia infantil o de apoyo?
*   **Selector de Avatar Basado en Emojis:** Permitir que el estudiante elija un emoji como su avatar (en lugar de obligar a subir una foto real) es una excelente práctica de privacidad y gamificación. Es interactivo, rápido y muy familiar para los niños.
*   **Código Semántico de Colores (Verde/Rojo):** Usar verde para las selecciones afirmativas (*"Qué sí hacer"*) y rojo para las de advertencia/evitación (*"Qué no hacer"*) facilita la lectura visual rápida. Los niños asocian rápidamente el verde con el éxito/avance y el rojo con el alto/pausa.
*   **Pantalla de Celebración de Onboarding:** El uso de emojis festivos y un diseño limpio y espaciado para dar la bienvenida refuerza positivamente el proceso de configuración y genera una sensación de logro.

##### B. ¿Qué NO conviene copiar en AMIKO?
*   **Complejidad en la Gestión de Permisos (Candados e Invitaciones):** La pantalla de "Círculo de Cuidado" contiene demasiada lógica administrativa y de seguridad (roles de adulto, botones de información, candados de visibilidad y envío de correos). Esto debe quedar 100% oculto para el estudiante.
*   **Generador de Avatar con IA para Menores:** Incluir un botón de "Generar con IA" para la foto de perfil en una app infantil introduce latencia, complejidad visual y posibles problemas de seguridad o moderación que un MVP debe evitar.
*   **Cuadrícula de Emojis muy Densos:** Los emojis en el selector están muy juntos y son pequeños. Para estudiantes con TEA que presenten dificultades en la motricidad fina, esto puede causar pulsaciones accidentales frustrantes.

##### C. Diferenciación de Patrones: Niños vs. Adultos

| Patrón Observado | Diseñado para Adultos / Cuidadores | Adaptación para Niños (AMIKO) |
| :--- | :--- | :--- |
| **Personalización del perfil** | Generación de avatar con IA o subida de archivos locales. | Selección directa de un emoji grande o personaje ilustrado en una cuadrícula espaciada. |
| **Gestión de roles y accesos** | Invitaciones por correo, niveles de privacidad y administración del círculo. | Gestión centralizada por el adulto en su propio dashboard; el niño no ve esta lógica. |
| **Feedback de Selección** | Texto explicativo o cambios sutiles de borde. | Colores semánticos muy claros (verde para positivo, rojo para bloqueo o frustración). |

---

#### 3. Traducción a Decisiones para AMIKO

1.  **Avatar de Emoji en Perfil del Estudiante:** En la pantalla de creación de perfil del estudiante (gestionada por el adulto), permitiremos elegir un avatar de emoji (caras, animales u objetos con temática pedagógica). Este avatar se usará para personalizar la experiencia visual del Modo Niño.
2.  **Uso Semántico de Verde y Rojo en Modo Niño:** 
    *   El botón *"Lo hice"* usará tonos verdes (calmos y de avance).
    *   El botón *"Me frustré"* o *"Necesito una pausa"* utilizará tonos cálidos/rojos suaves (no de error o castigo, sino de alerta y contención).
3.  **Círculo de Cuidado en Vista de Adultos:** La capacidad de invitar a otros adultos (como docentes) a ver el progreso del estudiante es una gran funcionalidad para P1 o P2 (basado en la *Vista Docente Básica* del backlog), pero debe ser exclusiva del panel del padre/madre/cuidador.
4.  **Botones de Selección con Espaciado Generoso:** Si implementamos selecciones múltiples para el niño, utilizaremos chips o tarjetas con márgenes amplios (mínimo de 12px de separación y altura de botón de al menos 48px) para evitar errores de toque.

---

### Lote 4: Check-in de Energía, Cuadrícula de Herramientas Completa y Notificaciones
*Fecha de análisis: 6 de junio de 2026*
*Origen: Imagen 5 (5 capturas de pantalla de la app "AutistaAI")*

#### 1. Capturas de Pantalla Observadas
- **Pantalla 1 y 3 ("Inicio - Dashboard")**: Pantalla principal del usuario. Muestra un saludo temporal (*"Buenas Noches..."*), el avatar del usuario, un botón de *"Mi Tarjeta"*, y una pregunta interactiva: *"¿Cómo está tu energía hoy?"* con una escala de 5 emojis seleccionables: *Muy Bajo (😴), Bajo (🙁), Regular (😐), Bien (😊), Excelente (😍)*. Abajo se muestra una tarjeta para *"Llamar a Aura"* por teléfono y una cuadrícula de herramientas (*Comunicación, Regulación, Organización, Social, Zona de Juegos, Círculo de Cuidado*). Destaca un botón rojo de alerta flotante con un triángulo de advertencia.
- **Pantalla 2 ("Aura IA - Conversación")**: Muestra el chat interactivo donde ocurre un error en la respuesta de la IA: *"Estoy teniendo un momento - ¿podrías intentar de nuevo?"*.
- **Pantalla 5 ("Notificaciones / Alertas")**: Bandeja de entrada dividida en pestañas (*Hoy, Próximas, Social*). Muestra una notificación de sistema: *"New Caregiver Request - Luis wants to be your caregiver"*.

---

#### 2. Hallazgos del Análisis

##### A. ¿Qué funciona para una experiencia infantil o de apoyo?
*   **Mood/Energy Check-in Visual:** Evaluar el estado de energía o ánimo diario usando una escala de 5 emojis claros es un patrón sobresaliente. Permite al niño expresar cómo se siente de manera no verbal antes de iniciar cualquier tarea, lo cual es de gran utilidad clínica y pedagógica para regular las expectativas de la sesión.
*   **Saludos Dinámicos / Temporales:** El saludo de *"Buenas Noches"* u *"Hola"* basado en el momento del día ayuda al estudiante a orientarse temporalmente.
*   **Categorización Directa ("Zona de Juegos", "Regulación"):** Incluir herramientas lúdicas y de calma como parte de la rutina principal es positivo. Los nombres simples como *"Regulación"* (calma y enfoque) y *"Organización"* (tareas y rutinas) son muy comprensibles.

##### B. ¿Qué NO conviene copiar en AMIKO?
*   **Botón de Alerta / Pánico Rojo Flotante:** El botón flotante de color rojo intenso con un icono de advertencia (`!`) puede inducir estrés, ansiedad o urgencia innecesaria en un estudiante con TEA. Los elementos que simulan "peligro" o "emergencia" deben ser tratados con extrema sutileza.
*   **Errores Conversacionales de la IA:** El mensaje *"Estoy teniendo un momento..."* interrumpe la experiencia y puede frustrar al niño si depende de la IA para avanzar. Para tareas escolares, la navegación debe ser 100% predecible e inmune a caídas del servidor de IA.
*   **Notificaciones administrativas mezcladas:** Recibir solicitudes técnicas o de configuración (*"Luis wants to be your caregiver"*) en el feed de un perfil infantil satura y distrae de las tareas cotidianas.

##### C. Diferenciación de Patrones: Niños vs. Adultos

| Patrón Observado | Diseñado para Adultos | Adaptación para Niños (AMIKO) |
| :--- | :--- | :--- |
| **Check-in emocional** | Escribir un diario de emociones o bitácora de texto. | Selección con un solo toque usando caras de emojis representativas y grandes. |
| **Soporte de contingencia** | Notificaciones técnicas de error o chats libres. | Caminos claros de fallback (ej. si la IA falla, mostrar una adaptación genérica estructurada sin error). |
| **Notificaciones** | Aprobación de cuidadores, alertas del sistema y sincronización. | El niño no recibe alertas administrativas; solo notificaciones de felicitación o recordatorios visuales. |

---

#### 3. Traducción a Decisiones para AMIKO

1.  **Check-in Emocional Pre-Tarea en Modo Niño:** Evaluaremos la viabilidad de agregar un check-in de energía/ánimo muy breve antes de comenzar el paso a paso de una tarea. Esto nos permitirá:
    *   Registrar el estado de ánimo inicial en el panel de progreso del adulto (ej. *"Comenzó la tarea con energía Baja"*).
    *   Adaptar sutilmente el tono de los mensajes del Modo Niño (dar más ánimos o proponer pausas si su energía es baja).
2.  **Robustez y Predictibilidad del Modo Niño:** El paso a paso de la tarea adaptada por AMIKO debe ser completamente estático y local (cargado desde la base de datos). No dependeremos de llamadas a la IA en tiempo real durante la ejecución del estudiante, evitando pantallas de carga largas o errores conversacionales.
3.  **Evitar Colores de Alarma:** No utilizaremos botones flotantes rojos o señales de advertencia gráficas en la pantalla del estudiante. Cualquier llamado de atención o reporte de frustración (ej. *"Me frustré"*) se diseñará con un tono amigable, neutro y seguro.
4.  **Bandeja de Notificaciones Exclusiva de Adultos:** Las solicitudes de vinculación docente-padre, los cambios en los perfiles y el registro de progreso se informarán únicamente en el panel del adulto (Dashboard o Progress).

---

### Lote 5: Afirmaciones con Lectura por Voz, Catálogo de Herramientas y Zona de Juegos
*Fecha de análisis: 6 de junio de 2026*
*Origen: Imagen 6 (5 capturas de pantalla de la app "AutistaAI")*

#### 1. Capturas de Pantalla Observadas
- **Pantalla 1 y 4 ("Afirmaciones")**: Una tarjeta central limpia que muestra una frase de refuerzo positivo (ej. *"Mis necesidades importan y merecen ser satisfechas"*). Incluye un botón para leer la frase en voz alta (*"Leer en voz alta"* / *"Detener"* con icono de altavoz) y flechas de navegación inferiores con paginación (`16 / 30`).
- **Pantalla 2 y 3 ("Herramientas - Completo")**: Lista extendida en cuadrícula de todas las utilidades de la aplicación (20 herramientas en total, incluyendo *Decodificador Social, Espacios Seguros, Inicia Tu Propio Negocio, Juego de Habla, Soporte de Crisis, Tarjetas de Identidad, Transición Universitaria*, etc.).
- **Pantalla 5 ("Zona de Juegos")**: Sección lúdica estructurada en pestañas (*Calma, Enfoque, Patrones*). Muestra una lista de tarjetas de juegos interactivos: *Casillas de memoria, Memoria Coincidente* (emparejar emociones) y *Clasificación de Colores*.

---

#### 2. Hallazgos del Análisis

##### A. ¿Qué funciona para una experiencia infantil o de apoyo?
*   **Lectura de Texto en Voz Alta (Text-to-Speech):** La opción de reproducir por voz la instrucción o frase (*"Leer en voz alta"*) y poder pausarla (*"Detener"*) es una herramienta de accesibilidad crítica. Para niños con dificultades de lectura, dislexia o baja capacidad de atención, escuchar la instrucción reduce drásticamente la barrera de comprensión.
*   **Paginación Sencilla con Flechas Grandes:** La navegación lineal tipo carrusel (`<` `16 / 30` `>`) con botones de flechas bien dimensionados es muy intuitiva para que un niño avance y retroceda a su propio ritmo.
*   **Juegos de Educación Emocional y Cognitiva:** Los juegos propuestos (*Memoria Coincidente* para emparejar emociones y *Clasificación de Colores*) no son solo distractores; tienen fines de aprendizaje socioemocional y atención visual. Son un excelente recurso de regulación.

##### B. ¿Qué NO conviene copiar en AMIKO?
*   **Herramientas para Adultos / Fuera de Foco:** Utilidades como *"Inicia tu propio negocio"* o *"Transición Universitaria"* están totalmente fuera del alcance de AMIKO (enfocado en tareas escolares infantiles). Debemos cuidar de no desviar el producto hacia la empleabilidad o la vida adulta en esta fase del MVP.
*   **Exceso de Texto Descriptivo en Juegos:** Las tarjetas de la Zona de Juegos son muy textuales. Para un niño, leer párrafos pequeños para saber de qué trata el juego es aburrido. Es preferible usar miniaturas visuales del juego (visual previews).
*   **Complejidad en Pestañas de Filtro:** Separar los juegos en múltiples categorías (*Todos, Calma, Enfoque, Patrones*) añade clics e interacciones innecesarias si el catálogo es pequeño.

##### C. Diferenciación de Patrones: Niños vs. Adultos

| Patrón Observado | Diseñado para Adultos | Adaptación para Niños (AMIKO) |
| :--- | :--- | :--- |
| **Lectura de Instrucciones** | Solo lectura textual silenciosa. | Botón de reproducción de audio TTS integrado y visible en cada instrucción. |
| **Avance de Flujo** | Desplazamiento vertical infinito (scroll). | Navegación horizontal estricta paso a paso (tarjeta por pantalla con flechas gigantes). |
| **Actividades Auxiliares** | Planificadores de negocio, notas de texto y agendas de citas. | Mini-juegos de emparejamiento, clasificación o respiración para pausas activas. |

---

#### 3. Traducción a Decisiones para AMIKO

1.  **Botón de Audio (TTS) en Modo Niño:** En el **Modo Niño**, colocaremos un botón de altavoz visible al lado de la instrucción simple. Al presionarlo, la app leerá el paso escolar utilizando la síntesis de voz nativa del navegador.
2.  **Paginación Lineal en Modo Niño:** Adoptaremos el diseño de tarjeta central limpia con flechas laterales gigantes y seguras para avanzar o retroceder de paso (ej. `Paso 2 de 5`), asegurando que el estudiante solo vea una instrucción a la vez en pantalla sin distracciones.
3.  **Refuerzo Positivo al Finalizar:** Al completar el último paso de la tarea, en lugar de solo mostrar un check, presentaremos una pantalla de celebración limpia (con confeti) y una frase de afirmación positiva amigable (ej. *"¡Hiciste un gran esfuerzo hoy!"*), ofreciendo también la opción de reproducirla por voz.
4.  **No Mezclar Herramientas de Adultos:** Nos mantendremos estrictamente apegados al backlog de tareas escolares y progreso. No agregaremos utilidades de vida independiente o laboral.

---

### Lote 6: Herramientas de Regulación, Animación de Enfoque Visual y Escaneo Corporal
*Fecha de análisis: 6 de junio de 2026*
*Origen: Imagen 7 (5 capturas de pantalla de la app "AutistaAI")*

#### 1. Capturas de Pantalla Observadas
- **Pantalla 1 ("Regulación - Catálogo")**: Lista de utilidades para calmar y reenfocar: *Guía de stimming, Preparación para dormir, Respiración de ola, Respiración de color, Temporizador de descanso, Espacio tranquilo, Enfoque visual*.
- **Pantalla 2 ("Enfoque Visual - Interfaz")**: Herramienta interactiva con una animación circular concéntrica central (*Anillos Expandibles*) que se expande/contrae para guiar la respiración o la fijación visual. Permite desactivar voz, regular velocidad (*Lento, Normal, Rápido*), cambiar patrones (*Formas Flotantes, Cuadrado de Respiración, Lava Lamp, etc.*) y elegir temas de color.
- **Pantalla 3 y 4 ("Escaneo Corporal")**: Ejercicio de meditación guiado por texto. Lo que destaca es la fila de emojis que representa partes del cuerpo humano (cara 😌, hombros 🤷, manos 👐, pulmones 🫁, pecho ⭕, piernas 🦵, pies 👣) para guiar la atención.
- **Pantalla 5 ("Aura IA - Soporte Emocional")**: Conversación de chat donde el usuario expresa: *"Me siento triste"*. La respuesta de la IA es empática y validadora: *"Lamento que estés pasando por esto. La tristeza es válida y está bien sentirla..."*, preguntando además por la intensidad del sentimiento.

---

#### 2. Hallazgos del Análisis

##### A. ¿Qué funciona para una experiencia infantil o de apoyo?
*   **Animaciones de Respiración Visuales (Visual Stim):** Las figuras concéntricas que se expanden de forma fluida (*Enfoque visual*) son extraordinarias para la regulación sensorial. Ayudan a que el niño sincronice su respiración o fije su atención de forma hipnótica y relajante.
*   **Escaneo Corporal Asistido por Emojis:** Los niños con TEA suelen presentar dificultades en la *interocepción* (reconocimiento de sensaciones internas del cuerpo). Usar una secuencia de emojis visibles y claros (cara -> hombros -> manos -> pulmones -> pies) es un recurso excelente para guiar la atención física de forma no verbal.
*   **Validación y Contención Emocional:** Mensajes como *"La tristeza es válida y está bien sentirla"* reflejan un tono humano, comprensivo y de aceptación, clave para rebajar la frustración sin parecer un regaño o un diagnóstico clínico.

##### B. ¿Qué NO conviene copiar en AMIKO?
*   **Saturación de Configuración Bajo la Animación:** La pantalla de "Enfoque Visual" tiene demasiadas opciones técnicas (cambiar patrones, velocidades, temas de color, interruptores de voz). Para un niño estresado, configurar esto resulta abrumador. La animación debe iniciarse directamente en un modo preestablecido y calmado.
*   **Preguntas Conversacionales Complejas sobre Emociones:** Preguntar *"¿Hay algo específico que esté contribuyendo a tu tristeza?"* exige una alta capacidad de introspección verbal. Un niño con TEA bajo frustración o desregulación emocional puede presentar mutismo selectivo o incapacidad de explicar el "por qué". Las opciones de salida deben ser cerradas y simples.

##### C. Diferenciación de Patrones: Nionos vs. Adultos

| Patrón Observado | Diseñado para Adultos | Adaptación para Niños (AMIKO) |
| :--- | :--- | :--- |
| **Ejercicios de Calma** | Meditación textual larga con temporizadores de minutos. | Animación visual interactiva corta (30s) que guía la respiración de forma táctil y visual. |
| **Reconocimiento Corporal** | Instrucciones anatómicas detalladas por audio. | Secuencia gráfica paso a paso guiada por pictogramas o emojis sencillos del cuerpo. |
| **Respuestas a Frustración** | Cuestionarios reflexivos sobre la causa del malestar. | Validación inmediata del sentimiento y oferta directa de una pausa activa (ej. *"Respira con el círculo"*). |

---

#### 3. Traducción a Decisiones para AMIKO

1.  **Pantalla de Calma Inmediata tras "Me Frustré":** Si el niño presiona el botón *"Me frustré"* en el Modo Niño, no abriremos un chat de soporte ni un formulario de texto. Mostraremos directamente una pantalla con una animación circular suave de respiración (ej. un círculo concéntrico expandiéndose al ritmo de *"Inhala... Exhala"* por 30 segundos) para inducir regulación biológica.
2.  **Mensajes Cortos de Aceptación:** El texto de la pantalla de calma será de validación simple: *"Está bien equivocarse o sentirse cansado. Vamos a respirar juntos con el círculo."*
3.  **Visuales Limpios, sin Opciones Técnicas:** En el Modo Niño, las herramientas de respiración o calma no tendrán selectores de velocidad ni temas complejos. Se cargarán directamente usando colores relajantes (azul y verde de AMIKO) y velocidad pausada por defecto.
4.  **Uso de Emojis/Pictogramas de Apoyo Físico:** En caso de que una tarea física requiera preparación corporal, utilizaremos una secuencia de pictogramas sencilla (ej. manos escribiendo, ojos mirando) inspirada en el formato visual del escaneo corporal analizado.

---

### Lote 7: Menús de Configuración, Suscripción Premium y Ayudas de Regulación
*Fecha de análisis: 6 de junio de 2026*
*Origen: Imágenes 8 y 9 (5 capturas de pantalla de la app "AutistaAI")*

#### 1. Capturas de Pantalla Observadas
- **Pantalla 1, 4 y 5 ("Configuración / Ajustes")**: Interfaz administrativa del perfil. Muestra detalles del usuario (*Angel Oropeza*), su correo y plan (*Gratis*). Contiene secciones de *Suscripción* (Pasar a Premium, Usage & Limits), *Preferencias* (Idioma, Apariencia, Accesibilidad, Guía de Voz, Personalidad de Aura, Voz de llamada de Aura, Memoria de Aura), *Notificaciones*, *Cuenta* (Cambiar contraseña, Privacidad y datos), *Soporte y Legal* (Términos de servicio, Ayuda y FAQ, etc.) y botones de acción crítica en rojo (*Cerrar Sesión, Eliminar Cuenta*).
- **Pantalla 2 ("Regulación - Catálogo Ampliado")**: Muestra un botón superior destacado en morado: *"Ayúdame a elegir"*. Lista herramientas como *Sonidos calmantes* (mezclador de ruido de fondo), *Respiración profunda, Afirmaciones, Toque Fluido* (dibujo libre), *Enraizamiento, Escaneo corporal, Escáner Sensorial, Relajación progresiva*.

---

#### 2. Hallazgos del Análisis

##### A. ¿Qué funciona para una experiencia infantil o de apoyo?
*   **El Botón "Ayúdame a elegir" (Decisional Aid):** Cuando un estudiante experimenta una sobrecarga sensorial o emocional, pierde capacidad de tomar decisiones complejas (parálisis por análisis). Un botón de llamada a la acción único y destacado en la parte superior que elija o recomiende la mejor herramienta por él es una solución cognitiva excepcional.
*   **Herramientas Táctiles de Regulación ("Toque Fluido"):** Actividades táctiles pasivas como dibujar libremente sobre la pantalla con trazos suaves de color es una técnica de autorregulación (visual stimming) muy efectiva, intuitiva y autogestionada para niños pequeños.
*   **Controladores de Sonidos Calmantes:** Mezclar sonidos de la naturaleza (lluvia, mar, ruido blanco) para aislarse de ruidos ambientales del hogar o escuela que generan irritabilidad en niños hipersensibles.

##### B. ¿Qué NO conviene copiar en AMIKO?
*   **Paywalls y Elementos de Cobro ("Pasar a Premium"):** Elementos comerciales, límites de uso y llamadas a suscripciones pagas nunca deben estar al alcance del estudiante en la interfaz. El alcance del MVP de AMIKO excluye expresamente los pagos.
*   **Exposición de Opciones de Cuenta Críticas:** Tener botones directos como *"Cerrar Sesión"* o *"Eliminar Cuenta"* en rojo al final de los menús normales sin protección. Un niño interactuando con la app podría borrarlos o cerrar la sesión del adulto accidentalmente.
*   **Complejidad en la Configuración de la IA:** Configurar cómo habla la IA ("Voz de llamada", "Personalidad") añade pasos e interfaces de gestión innecesarias.

##### C. Diferenciación de Patrones: Niños vs. Adultos

| Patrón Observado | Diseñado para Adultos | Adaptación para Niños (AMIKO) |
| :--- | :--- | :--- |
| **Acceso a Ajustes** | Menú abierto con opciones de cuenta, contraseñas y legal. | Bloqueado por una puerta parental (ej. un problema matemático simple o botón pulsado 3s). |
| **Ayuda a la Decisión** | Explorar un catálogo extenso de 8+ opciones detalladas. | Botón único de recomendación automatizada (ej. *"¿Hacemos una pausa?"*). |
| **Monetización** | Pantallas de pago, planes premium y contadores de límite de uso. | Interfaz 100% limpia de anuncios y transacciones (foco social/pedagógico). |

---

#### 3. Traducción a Decisiones para AMIKO

1.  **Puerta Parental para Salir del Modo Niño:** El Modo Niño de AMIKO no tendrá barra inferior de ajustes ni acceso a la cuenta. Para salir de este modo y volver al Dashboard de adultos, implementaremos una puerta parental (ej. mantener pulsado el botón *"Salir"* por 3 segundos o resolver una suma básica como 6+2). Esto evita que el niño se salga del flujo de la tarea o desconfigure la app.
2.  **Soporte Táctil ("Toque de Calma"):** Si el niño presiona *"Me frustré"*, además de la respiración guiada, podemos ofrecerle un lienzo de dibujo libre y suave ("Toque de Calma") con trazos de colores relajantes que se desvanezcan, sirviendo como estimulación visual táctil y descompresión.
3.  **Herramientas Simplificadas en el MVP:** Para la adaptación de tareas, evitaremos sonidos complejos configurables o IA parametrizables en el cliente. La IA tendrá una voz y tono predefinidos, cálidos y consistentes.
4.  **Cero Contenido Comercial:** Todo el flujo del estudiante y del adulto estará libre de llamadas a premium o límites de uso en esta fase experimental.

---

### Lote 8: Juegos de Destreza, Círculo Perfecto y Notificaciones Sociales
*Fecha de análisis: 6 de junio de 2026*
*Origen: Imagen 10 (5 capturas de pantalla de la app "AutistaAI")*

#### 1. Capturas de Pantalla Observadas
- **Pantalla 1 y 2 ("Zona de Juegos - Lista")**: Lista inicial de juegos (Memoria, Coincidencia, Colores).
- **Pantalla 3 ("Matemáticas Locas - Entrada")**: Pantalla de inicio del minijuego de aritmética. Muestra un icono numérico, instrucciones (*"Responde 20 preguntas lo más rápido que puedas... Tu tiempo se guarda en la tabla de líderes"*), tarjetas informativas (*20 preguntas, cada vez más difícil, vence al reloj*) y una tabla de clasificación de *"Jugadores más rápidos"* (ej. *Dominique Dixon, Evelyn*).
- **Pantalla 4 ("Zona de Juegos - Extensión")**: Muestra juegos adicionales: *Círculo Perfecto* (dibujar un círculo en pantalla y obtener puntaje de precisión táctil), *Escenarios Sociales* (historias interactivas sobre habilidades sociales) y *Práctica de Habla* (reconocimiento de voz). Incluye un pie de página clave titulado **"Acerca de Estos Juegos"** que indica: *"Todos los juegos están diseñados con principios amigables para el autismo: instrucciones claras, resultados predecibles, sin presión de tiempo..."*.
- **Pantalla 5 ("Notificaciones - Pestaña Social")**: Vista de notificaciones vacías bajo la categoría "Social" con el mensaje: *"Sin actividad social - Los mensajes, solicitudes de amistad y actualizaciones de grupos aparecerán aquí"*.

---

#### 2. Hallazgos del Análisis

##### A. ¿Qué funciona para una experiencia infantil o de apoyo?
*   **Juego Táctil de Calma ("Círculo Perfecto"):** Es un minijuego excelente. Requiere trazar un círculo con el dedo y entrega retroalimentación instantánea de precisión. No tiene límites de tiempo ni sonidos estresantes, promoviendo el control motor y la concentración visual de forma lúdica y solitaria.
*   **Historias Sociales Interactivas ("Escenarios Sociales"):** Las historias sociales son un estándar de oro pedagógico en la terapia de autismo para enseñar normas de comportamiento, manejo de transiciones o interacciones cotidianas de manera estructurada y predecible.
*   **Los Declarados "Principios Amigables para el Autismo":** Los tres pilares indicados en el pie de página de la Zona de Juegos son directrices de diseño perfectas:
    1.  *Instrucciones claras.*
    2.  *Resultados predecibles* (sin sorpresas gráficas ni sobresaltos).
    3.  *Sin presión de tiempo.*

##### B. ¿Qué NO conviene copiar en AMIKO?
*   **Presión de Tiempo y Competencia ("Vence al reloj" y "Tabla de Líderes"):** El juego de *Matemáticas Locas* contradice el propio principio de "sin presión de tiempo" al exigir responder *"lo más rápido posible"* y competir en una tabla de posiciones pública. La competencia bajo reloj genera una inmensa ansiedad y bloqueo cognitivo en muchos niños neurodivergentes, frustrando la experiencia de estudio.
*   **Red Social Integrada (Solicitudes de Amistad y Grupos):** El MVP de AMIKO excluye expresamente comunidades, foros o chats sociales grupales por motivos de seguridad infantil, moderación de contenido y foco del producto.

##### C. Diferenciación de Patrones: Niños vs. Adultos

| Patrón Observado | Diseñado para Adultos o Jóvenes | Adaptación para Niños (AMIKO) |
| :--- | :--- | :--- |
| **Dinámica de Juego** | Contrarreloj, competencia, velocidad y puntuaciones altas. | Actividades pausadas, exploración autónoma, dibujo libre y práctica verbal sin temporizadores. |
| **Socialización** | Red social de soporte (amigos, chats, foros). | Interfaz de uso individual y privado o compartida únicamente con padres y docentes vinculados. |
| **Feedback del Juego** | Tablas de clasificación comparativas con otros usuarios. | Auto-superación lúdica, refuerzo positivo verbal/visual personalizado. |

---

#### 3. Traducción a Decisiones para AMIKO

1.  **Cero Presión de Tiempo en Modo Niño:** En el **Modo Niño**, ninguna pantalla, instrucción, o actividad de regulación de AMIKO tendrá temporizadores regresivos visibles (*ticking clocks*) o advertencias de tiempo límite. El estudiante debe sentir un control total de su tiempo.
2.  **No Competencia:** Evitaremos tablas de posiciones, clasificaciones o métricas comparativas entre estudiantes. El refuerzo se basará en el progreso individual de las tareas del propio niño (ej. *"¡Completaste 3 pasos más que ayer!"*).
3.  **Uso de Historias Sociales Adaptativas:** Cuando la IA adapte una tarea compleja (en el servicio backend), le pediremos que traduzca las instrucciones difíciles bajo la estructura de una **Historia Social** (describiendo las acciones en tercera persona, explicando el contexto de forma predecible y validando los sentimientos del proceso).
4.  **Enfoque de Seguridad Infantil:** AMIKO mantendrá un perfil cerrado y seguro. La pantalla de notificaciones solo mostrará eventos de la tarea escolar asignada y nunca solicitudes de redes sociales externas.

---

### Lote 9: Consolidación de Pantallas de Ajustes y Catálogo de Juegos
*Fecha de análisis: 6 de junio de 2026*
*Origen: Imagen 11 (5 capturas de pantalla de la app "AutistaAI")*

#### 1. Capturas de Pantalla Observadas
Este lote consolida pantallas vistas en los lotes 7 y 8, permitiendo verificar la consistencia estructural del sistema:
- **Pantallas 1, 2 y 4 ("Ajustes / Configuración")**: Vistas repetidas de la sección de preferencias del usuario, mostrando la lista de opciones (Idioma, Apariencia, Accesibilidad, Guía de voz, Personalidad/Voz de Aura, Notificaciones, Privacidad, Cambiar contraseña).
- **Pantallas 3 y 5 ("Zona de Juegos")**: Vistas repetidas del catálogo de juegos, mostrando las tarjetas de *Casillas de memoria, Memoria Coincidente* y *Clasificación de Colores*.

---

#### 2. Hallazgos del Análisis

##### A. ¿Qué funciona para una experiencia infantil o de apoyo?
*   **Consistencia de Navegación (Bottom Tabs):** La barra inferior de navegación con sus 5 iconos (*Herramientas, Aura IA, Inicio, Alertas, Ajustes*) permanece fija y en la misma posición en todas las pantallas del panel general. Esto crea predictibilidad espacial, facilitando que el usuario aprenda dónde encontrar cada sección principal.
*   **Uniformidad de Estilo Visual:** Las tarjetas de juegos y las filas de la lista de configuración usan la misma elevación (shadows), colores de borde y espaciado de texto, lo que le da una identidad de producto sólida y profesional.

##### B. ¿Qué NO conviene copiar en AMIKO?
*   **Barra de Navegación Persistente en Modos Operativos:** Mantener la barra inferior de navegación (*Ajustes, Alertas, etc.*) visible cuando el estudiante está jugando o realizando una meditación de regulación visual. Esto permite que el niño abandone la actividad terapéutica o el juego a medias con un toque involuntario, reduciendo el efecto de calma. El modo de juego o regulación debería jugarse en "pantalla completa" con una salida clara pero resguardada.

##### C. Diferenciación de Patrones: Niños vs. Adultos

| Patrón Observado | Diseñado para Adultos | Adaptación para Niños (AMIKO) |
| :--- | :--- | :--- |
| **Navegación general** | Pestañas inferiores siempre visibles para multitarea rápida. | Ocultamiento de pestañas al entrar en actividades de foco (juego, respiración o tareas). |
| **Jerarquía visual** | Estructuras de lista larga para configuración de múltiples opciones. | Diseños de foco único con un máximo de 3-4 opciones grandes e ilustradas. |

---

#### 3. Traducción a Decisiones para AMIKO

1.  **Bloqueo de Interfaz en Modo Niño:** En AMIKO, una vez que el niño inicie el **Modo Niño** o entre a una actividad de regulación tras reportar frustración, la barra de navegación del AppShell se ocultará por completo. La única forma de salir será un botón específico controlado por la puerta parental.
2.  **Consistencia Estructural en Pantallas Adultas:** Seguiremos el patrón de diseño de barra de navegación lateral o inferior fija y predecible para el Dashboard de padres y la Vista Docente, asegurando que el adulto siempre sepa cómo volver al inicio o ver el progreso rápidamente.

---

### Lote 10: Práctica de Habla, Herramientas de Organización y Bloc de Notas
*Fecha de análisis: 6 de junio de 2026*
*Origen: Imagen 12 (5 capturas de pantalla de la app "AutistaAI")*

#### 1. Capturas de Pantalla Observadas
- **Pantalla 1 ("Práctica de Habla - Dificultad")**: Pantalla de selección de nivel para ejercicios de pronunciación. Muestra tres botones horizontales grandes coloreados semánticamente: *Fácil (verde - frases de 8-10 palabras)*, *Media (amarillo - frases de 18-22 palabras)* y *Difícil (rojo - párrafos de 30-40 palabras)*. Las instrucciones indican: *"se grabará tu voz y recibirás una puntuación"*.
- **Pantalla 2 ("Organización - Catálogo")**: Lista de utilidades de planificación: *Rutina diaria, Tareas, Recordatorios, Anticipaciones, Notas*, con un botón flotante morado de agregar (`+`).
- **Pantallas 3 y 4 ("Círculo de Cuidado" y "Notificaciones Sociales")**: Vistas repetidas analizadas previamente.
- **Pantalla 5 ("Notas - Bloc")**: Pantalla clásica de toma de notas con campo de búsqueda, barra de entrada rápida (*"Nota rápida..."*) y un estado vacío con el mensaje: *"Sin notas aún"*.

---

#### 2. Hallazgos del Análisis

##### A. ¿Qué funciona para una experiencia infantil o de apoyo?
*   **El concepto de "Anticipaciones":** Preparar al niño para eventos o cambios próximos es una técnica terapéutica fundamental en autismo. Facilita las transiciones (ej. pasar del tiempo libre a hacer la tarea) y reduce las crisis por cambios imprevistos mediante agendas visuales.
*   **"Rutina diaria" por bloques:** Estructurar el día en bloques predecibles ayuda a los niños a entender qué pasará después, bajando los niveles de ansiedad general.
*   **Categorización visual de dificultad:** Usar botones de tamaño generoso con colores semánticos (verde -> fácil, amarillo -> medio, rojo -> difícil) ayuda a identificar rápidamente el nivel de esfuerzo requerido de forma visual.

##### B. ¿Qué NO conviene copiar en AMIKO?
*   **Evaluación basada en puntuaciones ("recibirás una puntuación"):** Calificar la voz o el habla del niño con un puntaje numérico (ej. *70/100* o *estrella incompleta*) puede disparar la frustración y el sentimiento de fracaso en niños que presentan dificultades en el lenguaje o apraxia del habla. AMIKO debe dar feedback basado únicamente en la participación y el esfuerzo positivo, nunca con notas cuantitativas.
*   **Escribir notas de texto libre (Bloc de notas):** Un editor de texto tradicional para escribir notas es un patrón pensado 100% para adultos o adolescentes mayores. Para el Modo Niño de AMIKO, el ingreso de texto libre no tiene cabida.
*   **Micro-gestión en múltiples categorías:** Dividir la organización en Rutinas, Tareas, Recordatorios y Anticipaciones satura cognitivamente al menor. Para el estudiante, todo debe estar consolidado en una sola línea de tiempo diaria.

##### C. Diferenciación de Patrones: Niños vs. Adultos

| Patrón Observado | Diseñado para Adultos | Adaptación para Niños (AMIKO) |
| :--- | :--- | :--- |
| **Feedback de ejecución** | Calificaciones cuantitativas, marcas de tiempo y scores de precisión. | Refuerzo positivo verbal y animaciones de festejo (ej. *"¡Excelente esfuerzo!"*). |
| **Planificación diaria** | Clasificación compleja (Notas, Tareas, Recordatorios independientes). | Agenda lineal y unificada de tipo "Primero-Entonces" (First-Then) muy simplificada. |
| **Ingreso de ideas** | Bloc de notas para tipear textos largos. | Grabadora de voz directa o selección de estados emocionales por pictogramas. |

---

#### 3. Traducción a Decisiones para AMIKO

1.  **Pantalla de Anticipación (Primero-Entonces / First-Then):** Antes de iniciar la tarea adaptada, el Modo Niño de AMIKO presentará una pantalla de anticipación muy sencilla: *"Primero haremos [Tarea] en X pasos sencillos, y Entonces podrás [Actividad de descanso]"*. Esto reduce la resistencia al trabajo escolar estructurando la recompensa.
2.  **Feedback no Punitivo en Respuestas:** Si en el futuro incorporamos reconocimiento de voz o interacciones del estudiante, el feedback será puramente motivacional (ej. *"¡Te escuché muy bien!"*, *"¡Buen intento!"*), eliminando puntuaciones competitivas o estrellas de rendimiento.
3.  **Consolidación en "Mi Día":** En lugar de abrumar al niño con menús de recordatorios, notas y rutinas, la app del estudiante tendrá una sola vista unificada de tareas asignadas para el día actual.
4.  **Uso de Botones de Dificultad para Adultos:** La configuración de dificultad de la tarea la realizará el adulto en el Dashboard (mediante el nivel de apoyo y configuración del perfil del estudiante), liberando al niño de tomar decisiones complejas sobre "qué tan difícil" debe ser la tarea.

---

### Lote 11: Tableros de Comunicación AAC (SAAC) y Apoyo en Crisis
*Fecha de análisis: 6 de junio de 2026*
*Origen: Imagen 13 (5 capturas de pantalla de la app "AutistaAI")*

#### 1. Capturas de Pantalla Observadas
Este lote analiza la herramienta de comunicación alternativa e interactiva de la aplicación:
- **Pantalla 1, 3, 4 y 5 ("Comunicación - Tablero AAC")**: Interfaz de comunicación aumentativa y alternativa (SAAC) tipo "Tap-to-Talk" (tocar para que hable por altavoz). Presenta categorías de tarjetas ilustradas con emojis de sistema:
  - *Necesidades:* Ayuda, Hambriento, Agua, Baño, Descanso, Silencio, Parar.
  - *Respuestas:* Sí (check), No (cruz), Tal vez, Por favor, Gracias, Lo siento, Hola, Adiós.
  - *Sentimientos:* Feliz, Triste, Enojado, Asustado, Calmado, Cansado.
  - *Actividades:* Jugar, Leer, Música, Caminar, Dormir, Comer, Dibujar, Relajarse.
- **Pantalla 2 ("Apoyo en Crisis")**: Pantalla para situaciones críticas. Contiene un botón rojo destacado (*"Alertar a mis Cuidadores"*), acceso a chat con IA, marcación rápida para el contacto de emergencia (*"Mama"*) y un directorio de líneas telefónicas de crisis nacionales (Servicios de emergencia 171, Línea 0800-VIDA).

---

#### 2. Hallazgos del Análisis

##### A. ¿Qué funciona para una experiencia infantil o de apoyo?
*   **Tableros de Comunicación Visuales (SAAC):** Los tableros AAC son el estándar mundial de oro para personas con autismo no verbales o con dificultades de comunicación verbal. Tocar una tarjeta para reproducir su sonido/audio (ej. presionar *"Agua"* para escuchar *"Quiero agua"*) es una herramienta de empoderamiento comunicativo fundamental.
*   **Agrupamiento por Necesidades Inmediatas:** Las tarjetas como *"Ayuda"*, *"Baño"* y *"Descanso"* resuelven las necesidades primarias del niño durante una sesión de estudio.
*   **Soporte de Emojis Clave para Respuestas Rápidas:** El uso de checks verdes para *"Sí"* y cruces rojas para *"No"* es intuitivo y universal.

##### B. ¿Qué NO conviene copiar en AMIKO?
*   **Uso de Emojis de Sistema Ambiguos:** Usar emojis nativos del sistema operativo puede ser confuso y cambia según el dispositivo. Por ejemplo, las manos juntas 🙏 para *"Por favor"* (que puede malinterpretarse como rezar o chocar las manos) o el emoticón de Zzz 😴 para *"Cansado"*. En autismo, los pictogramas deben ser lo más concretos y unívocos posibles.
*   **Directorio de Crisis en la Interfaz del Estudiante:** Tener acceso a llamadas telefónicas de emergencia nacionales (ej. 171) dentro del flujo del niño es riesgoso; puede causar marcaciones accidentales o pánico. Estos contactos pertenecen exclusivamente a la vista de adultos.
*   **Constructores de Frases Complejos:** Opciones como *"Formar frase"* aumentan la carga de interfaz y requieren destrezas sintácticas elevadas.

##### C. Diferenciación de Patrones: Niños vs. Adultos

| Patrón Observado | Diseñado para Adultos o Jóvenes | Adaptación para Niños (AMIKO) |
| :--- | :--- | :--- |
| **Diseño de Pictogramas** | Emojis estándar del teclado del teléfono. | Dibujos de trazo grueso, claros e inequívocos (ej. pictogramas educativos ARASAAC). |
| **Acceso a Emergencias** | Botón de pánico y marcación telefónica directa a autoridades. | Alerta discreta y silenciosa notificada al dashboard del padre/cuidador. |
| **Sintaxis** | Construcción de frases complejas uniendo chips gramaticales. | Expresión directa con toques simples de un solo botón de necesidad. |

---

#### 3. Traducción a Decisiones para AMIKO

1.  **Tablero de Asistencia Escolar en Modo Niño:** En lugar de un panel completo de comunicación con decenas de palabras, el Modo Niño de AMIKO integrará un **Tablero de Necesidades Básicas de Estudio** en la interfaz (dentro de los pasos de la tarea):
    *   *Necesito un descanso* (Pausa/Regulación).
    *   *No entiendo* (Ayuda cognitiva/Sugerencia para el adulto).
    *   *Terminé* (Progreso de la tarea).
2.  **Audio Confirmador en los Botones:** Al presionar los botones de ayuda o descanso, el dispositivo reproducirá un audio explicativo corto (ej. *"Necesito ayuda, por favor"* o *"Quiero un descanso"*) para dar retroalimentación auditiva inmediata al estudiante.
3.  **Evitar Emojis Ambiguos en Pictogramas:** Si el backend de IA o el cliente sugieren apoyos visuales, usaremos iconos concretos y vectoriales de la marca (ej. un vaso de agua para *"Agua"*, un inodoro para *"Baño"*, un lápiz para *"Escribir"*), alejándonos de los emojis de sistema de libre interpretación.
4.  **Botón de Alerta Silenciosa al Adulto:** Si el niño presiona *"Necesito ayuda"*, el sistema registrará silenciosamente un evento de progreso (*help_requested* en base de datos) y enviará una notificación discreta en el dashboard del adulto, evitando emitir alarmas sonoras de crisis que asusten al estudiante.

---

### Lote 12: Comunicación de Lugares y Salud, y Centro Social
*Fecha de análisis: 6 de junio de 2026*
*Origen: Imágenes 14 y 15 (5 capturas de pantalla de la app "AutistaAI")*

#### 1. Capturas de Pantalla Observadas
- **Pantalla 1 ("Comunicación - Lugares")**: Tarjetas AAC ilustradas para comunicar ubicaciones: *Casa, Escuela, Hospital, Tienda, Afuera, Baño, Dormitorio, Coche*.
- **Pantalla 2 ("Comunicación - Cuerpo y Salud")**: Tarjetas para comunicar estados físicos y malestares: *Estoy herido/a, Me siento enfermo/a, Tengo calor, Tengo frío, Me duele la cabeza, Me duele el estómago, Me siento mejor, Necesito medicina*.
- **Pantallas 3, 4 y 5 ("Centro Social")**: Interfaz para buscar y conectar con otros usuarios de la comunidad. Muestra un interruptor para activar/desactivar la visibilidad del perfil (*"Visible para otros"* / *"Oculto para otros"*) y dos botones principales: *Salas Sociales* (chats grupales con la comunidad) y *Amigos* (gestión de conexiones).

---

#### 2. Hallazgos del Análisis

##### A. ¿Qué funciona para una experiencia infantil o de apoyo?
*   **Comunicación de Necesidades Fisiológicas ("Cuerpo y Salud"):** Comunicar malestares físicos de forma simple es una de las utilidades más valiosas para niños con TEA. A menudo, las crisis de comportamiento o bloqueos con las tareas escolares se deben a malestares no expresados (ej. dolor de cabeza, hambre, calor). Las tarjetas visuales de malestar les dan una vía rápida de escape no verbal.
*   **Tarjetas de Contexto Espacial ("Lugares"):** Identificar el lugar en el que se encuentra o hacia dónde se dirige (casa, escuela, afuera) mediante iconos claros de edificios y entornos.

##### B. ¿Qué NO conviene copiar en AMIKO?
*   **Chats de Comunidad y Salas de Descubrimiento ("Salas Sociales"):** Interactuar con extraños en salas de chat grupales públicas expone al menor a riesgos de acoso y desinformación. De acuerdo a `PRODUCT_DECISIONS.md` (D-004), AMIKO mantendrá un ecosistema cerrado y privado sin comunidad externa en el MVP.
*   **Interruptor de Visibilidad Pública:** Permitir que el estudiante elija si su cuenta es visible o buscable por otros usuarios de internet es una mala práctica de privacidad infantil. Los perfiles de menores deben estar completamente blindados y ocultos de manera predeterminada.

##### C. Diferenciación de Patrones: Niños vs. Adultos

| Patrón Observado | Diseñado para Adultos o Jóvenes | Adaptación para Niños (AMIKO) |
| :--- | :--- | :--- |
| **Seguridad de Datos** | Toggles de visibilidad del perfil para ser buscado en red pública. | Privacidad absoluta y obligatoria. Ningún perfil infantil es público o buscable. |
| **Redes de Apoyo** | Chats públicos, salas temáticas de comunidad y solicitudes de amistad. | Cuidado cerrado coordinado únicamente entre el tutor principal, el docente y el alumno. |
| **Identificación de dolores** | Emojis genéricos del teclado (ej. cara verde con termómetro). | Pictogramas médicos muy claros y desprovistos de expresiones exageradas. |

---

#### 3. Traducción a Decisiones para AMIKO

1.  **Detección de Malestares Fisiológicos en Modo Niño:** Si el niño presiona *"Necesito ayuda"*, daremos la opción de indicar rápidamente si es por un factor físico (ej. *"Tengo sed"*, *"Tengo sueño"*, *"Tengo calor"*, o *"Baño"*). Esto permite al adulto tutor en el dashboard saber si la frustración escolar tiene un origen fisiológico inmediato antes de insistir con el estudio.
2.  **Blindaje de Privacidad Total (Cero Redes Sociales):** AMIKO no tendrá "Centro Social" o salas de chat grupal. La privacidad será absoluta por diseño: el perfil del estudiante solo se compartirá explícitamente entre el padre/madre (creador de la cuenta) y el docente invitado (mediante enlace cerrado de invitación), eliminando búsquedas públicas o descubrimientos.
3.  **Visuales Concretos para Necesidades Fisiológicas:** Si el Modo Niño incluye solicitudes físicas básicas, usaremos iconos de trazo vectorial minimalistas y descriptivos (ej. un vaso de agua para la sed) en lugar de emoticones de sistema.

---

### Lote 13: Gestión de Amigos y Salas de Chat Grupal (Salas Sociales)
*Fecha de análisis: 6 de junio de 2026*
*Origen: Imagen 16 (3 capturas de pantalla de la app "AutistaAI")*

#### 1. Capturas de Pantalla Observadas
Este lote analiza la funcionalidad de red social y comunicación entre pares de la aplicación:
- **Pantalla 1 y 3 ("Amigos")**: Interfaz que lista las conexiones directas del usuario (ej. *Luis*). Incluye un campo de búsqueda (*"Buscar por nombre..."*) y botones en la cabecera para descubrir nuevos usuarios (*"+ Descubrir"*) o administrar los existentes (*"Gestionar"*).
- **Pantalla 2 ("Salas sociales - Todos los Grupos")**: Muestra un listado de canales/grupos temáticos de chat público en los que el usuario puede participar:
  - *Generals:* Canal de charla general (352 miembros, requiere aprobación).
  - *Helping hands 🖐️:* Canal de ayuda mutua (222 miembros, requiere aprobación).
  - *New Age:* Canal de soporte (64 miembros, requiere aprobación).
  - *Teens talk:* Grupo dirigido a adolescentes (38 miembros, requiere aprobación).
  - Cada tarjeta tiene un botón destacado de *"Unirse"* en morado.

---

#### 2. Hallazgos del Análisis

##### A. ¿Qué funciona para una experiencia de apoyo?
*   **Grupos de Soporte Segmentados por Edad / Interés:** Ofrecer espacios específicos como *"Teens talk"* para adolescentes o canales de ayuda mutua es una buena práctica para reducir el aislamiento social de personas con autismo.
*   **Filtros de Aprobación Obligatorios ("Requiere aprobación"):** Condicionar el ingreso a los grupos a una aprobación previa ayuda a controlar el ingreso de bots, trolls o personas con intenciones dañinas, actuando como un filtro básico de seguridad.
*   **Tarjetas de Información Claras:** Mostrar la cantidad de miembros y el propósito de cada canal antes de unirse reduce la incertidumbre.

##### B. ¿Qué NO conviene copiar en AMIKO?
*   **Mensajería Privada entre Menores (Amigos y Chats directos):** Abrir chats directos privados entre perfiles infantiles requiere estrictos controles de moderación por IA, registro de denuncias y auditoría de seguridad para evitar ciberacoso. Para el MVP de AMIKO, esta funcionalidad debe quedar completamente excluida.
*   **Chats de Texto Masivos y Abiertos ("Generals"):** Los chats grupales con más de 300 personas generan hilos continuos y caóticos de mensajes a alta velocidad. Esto causa sobrecarga sensorial, ansiedad y dificultades para seguir el hilo conversacional en niños con TEA.
*   **Descubrimiento de usuarios libre ("Descubrir"):** Permitir buscar a cualquier persona por su nombre en una base de datos abierta es sumamente inseguro para un producto infantil.

##### C. Diferenciación de Patrones: Niños vs. Adultos

| Patrón Observado | Diseñado para Adultos o Jóvenes | Adaptación para Niños (AMIKO) |
| :--- | :--- | :--- |
| **Búsqueda de Personas** | Directorio de usuarios abierto con opciones de "descubrir". | Ninguna opción de búsqueda. El perfil es estrictamente privado y cerrado. |
| **Conversación con Docentes** | Chats de texto instantáneos informales y abiertos. | Bitácoras de progreso estructuradas asociadas a tareas escolares específicas. |
| **Espacios de comunidad** | Foros generales y salas de chat temáticas activas. | Foco individual en la realización autónoma de la tarea asignada. |

---

#### 3. Traducción a Decisiones para AMIKO

1.  **Exclusión de Chats Abiertos y Amigos:** Reafirmamos que AMIKO **no tendrá secciones de mensajería instantánea ni listas de amigos** para el estudiante.
2.  **Bitácora de Observaciones en lugar de Chat Abierto:** Para la vinculación entre padres, madres y docentes, en lugar de un chat informal, implementaremos una **Bitácora de Observación Estructurada** en cada tarea. El docente o tutor podrá agregar observaciones específicas de la tarea (ej: *"Luis se frustró en el paso 3 por el uso de restas"*), manteniendo la comunicación profesional, centrada en el estudiante y asíncrona.
3.  **Evitar Sobrecarga Sensorial Conversacional:** Si en fases futuras (P3 o post-MVP) se añade interacción social, esta se estructurará mediante dinámicas de turnos claros y predecibles, evitando flujos de chat en vivo y desordenados.












