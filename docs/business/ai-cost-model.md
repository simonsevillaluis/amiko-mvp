# AMIKO - Modelo de uso y costos de IA

Última actualización: 2026-06-18.

Este documento organiza la hipótesis técnica y económica del uso de IA. Los precios de proveedores cambian, así que cualquier cifra debe verificarse antes de tomar decisiones financieras.

## Principio

No todo debe pasar por el modelo más caro. AMIKO debe separar tareas de IA para controlar costo, calidad y seguridad.

## Flujo IA recomendado

1. Lectura de tarea
   - Entrada: foto o texto de tarea escolar.
   - Objetivo: entender contenido, materia e instrucciones originales.
   - Requiere buena precisión.

2. Adaptación pedagógica textual
   - Entrada: texto entendido, perfil básico del estudiante y notas del adulto.
   - Objetivo: generar JSON estructurado con resumen, pasos, apoyos visuales, apoyo adulto, regulación emocional y dificultad.
   - Puede usar un modelo de texto económico si mantiene calidad.

3. Apoyos visuales
   - Primero sugerir pictogramas, iconos o recursos de biblioteca.
   - Generar imagen nueva solo cuando aporte valor.

4. Generación de imagen
   - Usar modelo económico como motor diario si la calidad es suficiente.
   - Usar modelo más caro solo como fallback o para casos especiales.
   - Si falla calidad, usar biblioteca segura.

5. Revisión de seguridad visual
   - Evitar imágenes oscuras, inquietantes, deformes o fotorrealistas.
   - Durante beta, permitir aprobación del adulto antes de mostrar al estudiante.

## Proveedores/modelos mencionados como hipótesis

- Gemini Image: calidad alta, potencialmente caro para uso diario masivo.
- Ideogram: útil para imágenes con texto o láminas, potencialmente caro para uso diario.
- FLUX Schnell en fal.ai: candidato económico para generación diaria; debe validarse calidad.
- FLUX Dev en fal.ai: mejor calidad, posible fallback.
- Novita: muy barato, pero requiere validación fuerte de calidad y seguridad visual.

Estos nombres son hipótesis de exploración, no decisiones cerradas.

## Reglas visuales para imágenes generadas

- No usar estilo fotorrealista.
- Usar ilustración 2D educativa, amable, simple y clara.
- Colores suaves.
- Fondo limpio.
- Sin sombras dramáticas.
- Sin manos detalladas en primer plano.
- Sin texto dentro de la imagen; el texto lo coloca la interfaz de AMIKO.
- Evitar rostros exagerados o expresiones intensas.
- Evitar escenas oscuras, ambiguas o emocionalmente cargadas.
- Mantener coherencia con la marca AMIKO.

## Datos que debe registrar el sistema

- Usuario.
- Estudiante.
- Tarea.
- Tipo de operación IA: lectura, adaptación textual, imagen, revisión.
- Proveedor.
- Modelo.
- Tokens de entrada y salida, cuando aplique.
- Cantidad de imágenes generadas.
- Cantidad de regeneraciones.
- Resultado aprobado o rechazado.
- Motivo de rechazo, si existe.
- Costo estimado por operación.
- Costo acumulado por usuario.
- Fecha y hora.

## Límites iniciales a validar

- 3 imágenes generadas por día.
- Aproximadamente 90 imágenes al mes por usuario si se usa todos los días.
- Subida de tareas amplia, con política de uso justo.
- No vender uso ilimitado absoluto.

## Señales de alerta

- Costo IA mensual por usuario cercano al ingreso neto.
- Muchas regeneraciones de imagen.
- Baja aprobación parental de imágenes.
- Usuarios que consumen alto volumen sin progreso real.
- La función de imagen se vuelve más importante que el flujo pedagógico.
- El adulto percibe AMIKO como reemplazable por ChatGPT/Gemini.

## Requisitos técnicos derivados

- Límites configurables por variables de entorno o panel admin.
- Proveedores intercambiables sin reescribir el sistema.
- Separar servicios de lectura, texto e imagen.
- Fallback de imagen: modelo económico -> modelo mejor -> biblioteca segura.
- Logs de costo por operación.
- Dashboard interno de consumo durante beta.
- Apagado o reducción rápida de generación visual si el costo se dispara.
