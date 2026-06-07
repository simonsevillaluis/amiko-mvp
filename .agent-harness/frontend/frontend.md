# 🎨 Guía del Track Frontend - AMIKO

Esta guía orienta el desarrollo de componentes de interfaz, páginas y layouts dentro de AMIKO.

## 1. Reglas de Inicio
* **Revisión de Componentes Existentes:** Antes de crear cualquier botón, tarjeta, input o modal, revisa los directorios `components/` y la configuración de estilos en `tailwind.config.ts`. Reutiliza la lógica y estética ya definidas en el proyecto.
* **No Rediseñar la Marca:** Mantén la paleta de colores (verdes y azules), tipografía, e ilustraciones de marca existentes. Cualquier cambio radical de estilo está prohibido.

## 2. Prioridad de Implementación
* **Foco Adulto:** Diseña las páginas de dashboard, perfiles y adaptaciones pensando en la claridad para el adulto.
* **Responsive y Accesibilidad (a11y):** Asegura que las vistas se rendericen perfectamente en dispositivos móviles (la mayoría de padres y cuidadores utilizará el móvil) y que los botones tengan estados accesibles de teclado, focus, hover y `aria-labels`.

## 3. Guías del Componente `TaskCard`
Si el flujo de tareas requiere un componente de tarjeta de tarea (`TaskCard`), implementa los siguientes estados visuales específicos basados en su estado actual:
* **`draft` (Borrador):** Tarea ingresada pero no adaptada. Tono visual neutral, opción destacada para "Adaptar".
* **`adapted` (Adaptada):** Tarea procesada por IA. Muestra resumen simple y un botón llamativo para iniciar.
* **`in_progress` (En Progreso):** Tarea que el estudiante está realizando. Muestra una barra de progreso simple o indicador de pasos completados.
* **`completed` (Completada):** Tarea finalizada. Visualización relajante, iconos de check verde suave y fecha de finalización.

## 4. Estándares Técnicos
* **Props Tipadas:** Todo componente React debe usar TypeScript para definir explícitamente sus Props. Evita usar firmas dinámicas sin tipar.
* **Validaciones Visuales en Formularios:** Asegúrate de implementar los criterios de auditoría de formularios de `shared/ux-rules.md`.
