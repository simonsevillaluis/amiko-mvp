# Seguridad Y Privacidad

AMIKO trabaja con informacion de menores. Todo cambio debe ser conservador.

## Datos

- Pedir solo datos necesarios para el MVP.
- No pedir diagnosticos clinicos detallados.
- No guardar informacion sensible innecesaria.
- No mostrar datos de un usuario a otro.
- Aplicar reglas de acceso por usuario en Supabase.

## Mensaje De Limite

La app debe dejar claro que AMIKO:

- Es apoyo pedagogico.
- No diagnostica.
- No reemplaza a docentes, terapeutas, medicos ni psicologos.
- Recomienda acompanamiento adulto cuando sea necesario.

## Secretos

Nunca subir ni mostrar:

- `.env.local`
- Llaves privadas de Supabase.
- `OPENAI_API_KEY`
- Tokens personales.
- Credenciales de base de datos.

## Cliente Vs Servidor

Solo pueden estar en cliente variables con prefijo `NEXT_PUBLIC_` y que realmente sean publicas.

Las llamadas que usen llaves privadas deben ejecutarse del lado servidor.

## IA

La IA debe:

- Usar espanol claro y sencillo.
- Devolver JSON estructurado.
- Evitar lenguaje clinico complejo.
- Mantener instrucciones concretas y accionables.
- Recomendar apoyo adulto ante frustracion, ambiguedad o riesgo.

Si una tarea no puede adaptarse con seguridad, debe devolver una respuesta estructurada explicando el limite y sugiriendo acompanamiento adulto.
