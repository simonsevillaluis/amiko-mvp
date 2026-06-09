# AMIKO — Diseño del Modo Estudiante

Documento de decisiones de diseño UX/UI para el modo estudiante de AMIKO.
Última actualización: 2026-06-09.

---

## 1. Filosofía de Diseño

El modo estudiante de AMIKO debe seguir una lógica de UX/UI pensada para
niños y adolescentes neurodivergentes. Debe ser más visual, cálido, claro
y motivador que el modo tutor.

Principios:
- Colores pasteles y gradientes suaves. Priorizar verde (amiko-green) y azul (amiko-blue) como tonos principales con acentos cálidos.
- Iconografía clara y presente. Los íconos refuerzan el texto, no lo reemplazan.
- Barras de progreso visibles en cada tarea.
- Una acción principal por pantalla cuando es posible.
- Botones grandes con mínimo 44px de altura (min-h-11).
- Alto contraste. Texto font-black sobre fondos claros.
- Respeto sensorial: sin animaciones intrusivas, sin sonidos obligatorios.
- Mobile-first. Diseño pensado para pantalla de 390px de ancho.
- Sin saturación visual. Menos es más.

---

## 2. Mis Tareas vs Mis Estudios

El modo estudiante diferencia claramente dos tipos de experiencias:

### 2.1 Mis Tareas (origin: "assigned_by_tutor")

Actividades que el padre, madre, cuidador o docente preparó para que
el estudiante las realice.

- El estudiante ejecuta y avanza. No investiga ni sube materiales.
- El workspace interno usa tabs: **Pasos / Amiko / Recursos**.
- "Pasos" muestra el progreso dentro de la tarea (ejercicios completados, pendientes, descripción).
- "Fuentes" NO aparece porque el estudiante no necesita gestionar materiales de investigación.
- Si hay material del tutor, aparece integrado en "Pasos" como card secundaria.
- Identificadas con el badge visual "de tu tutor" en el home.

### 2.2 Mis Estudios (origin: "created_by_student")

Espacios de estudio o investigación que el propio estudiante crea.

- El estudiante sube materiales: fotos, texto copiado, audios.
- El workspace interno usa tabs: **Materiales / Amiko / Recursos**.
- "Materiales" reemplaza a "Fuentes" porque es más claro para niños y adolescentes.
- Amiko analiza los materiales subidos y ayuda al estudiante a entenderlos.
- Identificados con el badge visual "creados por mí" en el home.
- El workspace de estudios propios está en `components/task-workspace-own.tsx`.

### 2.3 Separación en la UI

En la pantalla home del estudiante (`app/demo/student-portal/page.tsx`):
- Sección "Mis tareas" con badge "de tu tutor".
- Sección "Mis estudios" con badge "creados por mí" y empty state invitando a crear.
- No mezclar ambas experiencias bajo una sola lista.

---

## 3. Tabs por Tipo de Workspace

| Tipo de contenido        | Tab 1      | Tab 2 | Tab 3    |
|--------------------------|------------|-------|----------|
| Tarea asignada por tutor | Pasos      | Amiko | Recursos |
| Estudio del estudiante   | Materiales | Amiko | Recursos |

Implementado en:
- `components/student-task-workspace.tsx` → usa "Pasos"
- `components/task-workspace-own.tsx` → usa "Materiales" (en el header, navegación futura)

---

## 4. Chat con Amiko en Modo Estudiante

El chat del estudiante (`app/demo/student-portal/amiko/page.tsx`) combina:
- Caja de texto libre para escribir mensajes.
- Botón de envío.
- Ayudas rápidas predefinidas: "No entendí esto", "Vamos paso a paso", "Quiero pedir ayuda".
- Menú "+" para adjuntar foto de tarea o reiniciar conversación.
- Indicador de "typing" con puntos animados.

Reglas para respuestas de Amiko en modo estudiante:
- Máximo 1 a 3 frases cortas por mensaje.
- Una idea por mensaje.
- Una acción principal sugerida.
- Sin párrafos largos.
- Tono cálido pero no infantilizado.
- Sin lenguaje clínico ni condescendiente.

Implementado vía la API `/api/chat` con `mode: "student"` en el body.

---

## 5. Sonidos — Accesibilidad Sensorial

Los sonidos en modo estudiante son completamente opcionales.

Reglas:
- El tutor puede activar o desactivar los sonidos desde la tarjeta del estudiante (`components/student-card-actions.tsx`).
- El estudiante también puede desactivarlos desde sus ajustes (`components/student-settings-panel.tsx`).
- Los sonidos solo se reproducen si AMBOS (tutor y estudiante) los tienen activados (lógica AND).
- No usar sonidos de castigo, alarma ni sonidos repetitivos molestos.
- La experiencia debe funcionar igual sin sonidos.

Tipos de sonido definidos en `lib/sounds.ts`:
- `tap` — toque de navegación sutil.
- `confirm` — respuesta correcta.
- `discover` — pista desbloqueada.
- `celebrate` — tarea completada.
- `achievement` — logro especial.

Preferencias almacenadas en localStorage (MVP) en `lib/student-sound-settings.ts`.

Deuda futura: migrar a columnas `sound_enabled_by_tutor` y `sound_enabled_by_student` en la tabla `student_profiles` de Supabase.

---

## 6. Uso de ARASAAC — Recurso Temporal de MVP/Demo

ARASAAC se usa en AMIKO únicamente como recurso temporal para MVP, prototipo y demo no comercial.

Reglas:
- ARASAAC requiere atribución correcta cuando se usa: "Pictogramas del ARASAAC (https://arasaac.org), del Centro Aragonés para la Comunicación Aumentativa y Alternativa (CACE), cedidos bajo licencia Creative Commons BY-NC-SA 4.0."
- ARASAAC NO debe considerarse un recurso definitivo para un producto comercial.
- Antes de lanzar AMIKO comercialmente, los pictogramas ARASAAC deberán:
  a) Reemplazarse por recursos propios de AMIKO, o
  b) Licenciarse correctamente para uso comercial, o
  c) Sustituirse por una biblioteca con licencia compatible con uso comercial.
- El componente `components/arasaac-pictogram.tsx` está marcado como dependencia temporal.
- Los pictogramas son apoyo visual secundario, no la propuesta de valor principal.

---

## 7. Paleta de Colores del Modo Estudiante

El modo estudiante usa la paleta principal de AMIKO con énfasis en tonos suaves:

| Token            | Uso principal                                    |
|------------------|--------------------------------------------------|
| amiko-green      | Acciones positivas, progreso, éxito              |
| amiko-blue       | Acciones secundarias, chat, info                 |
| amiko-sky        | Fondos de sección, hover, highlights suaves      |
| amiko-mint       | Fondos de éxito, secciones activas               |
| amiko-navy       | Texto principal fuerte, fondos de énfasis        |
| amiko-ink        | Texto general                                    |
| amiko-muted      | Texto secundario, labels                         |
| amiko-coral      | Alertas cálidas, errores suaves                  |
| purple-50/500    | Sección "Mis estudios" (diferenciación visual)   |

Gradientes recomendados para headers de sección: `from-amiko-sky to-amiko-mint`.

---

## 8. Accesibilidad

- Botones mínimo 44px de altura (`min-h-11` o `min-h-14`).
- Focus visible en todos los elementos interactivos (`focus-ring`).
- Labels descriptivos en botones icónicos (`aria-label`).
- Textos `font-black` para máximo contraste.
- No depender exclusivamente del color para comunicar estado.
- Íconos + texto siempre juntos (nunca solo ícono sin label cercana).

---

## 9. Navegación

Estructura de navegación del modo estudiante (NO modificar sin justificación):

```
/demo/student-portal          → Home (Mis tareas + Mis estudios)
/demo/student-portal/amiko    → Chat con Amiko
/demo/student-portal/recursos → Herramientas y pausas
/demo/student-portal/mi-red   → Personas de confianza
```

La navbar inferior (`components/student-shell.tsx`) y la barra superior son fijas y no deben modificarse.

---

## 10. Recomendaciones Futuras

- Migrar preferencias de sonido de localStorage a Supabase (`student_profiles`).
- Crear set visual propio de pictogramas para reemplazar ARASAAC en versión comercial.
- Implementar tabs reales "Materiales / Amiko / Recursos" en `task-workspace-own.tsx`.
- Sincronizar progreso de la demo con Supabase para usuarios autenticados.
- Añadir animaciones de celebración (confetti, stars) al completar tareas.
- Soporte para lectura en voz alta (TTS) de instrucciones para estudiantes con dificultades de lectura.
- Modo alto contraste opcional para usuarios con sensibilidad visual.
