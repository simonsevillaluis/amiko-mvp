# Plantilla De Revision

Usa esta plantilla cuando un agente revise cambios de otro agente.

## Resumen Del Cambio

Describe en 2-4 lineas que cambio y que objetivo tenia.

## Hallazgos

Ordena por severidad:

- Critico: rompe seguridad, datos, build o flujo principal.
- Alto: bug probable o regresion importante.
- Medio: problema de UX, accesibilidad o mantenibilidad.
- Bajo: pulido o mejora menor.

Formato recomendado:

```text
[Severidad] Archivo:linea - Problema concreto.
Impacto: que podria pasar.
Sugerencia: cambio recomendado.
```

## Accesibilidad

- Focus visible.
- Labels correctos.
- Contraste.
- Texto sin desborde.
- Botones reales para acciones.

## Seguridad Y Privacidad

- No secretos.
- No datos sensibles innecesarios.
- RLS o filtros por usuario cuando aplique.
- IA sin diagnosticos ni promesas medicas.

## Pruebas Revisadas

- Comandos ejecutados.
- Resultado.
- Pruebas no ejecutadas y por que.

## Recomendacion

Elige una:

- Aprobar.
- Aprobar con ajustes menores.
- Pedir cambios.
- Bloquear hasta resolver seguridad/build/datos.
