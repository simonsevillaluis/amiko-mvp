# Reglas De Codigo

## Stack

- Next.js con App Router.
- React.
- TypeScript.
- Tailwind CSS.
- Supabase para autenticacion, base de datos y almacenamiento.
- Gemini API (SDK @google/generative-ai) para adaptacion de tareas y chat.
- Vercel para despliegue.

## Estilo General

- Usar TypeScript.
- Crear componentes pequenos y reutilizables.
- Preferir codigo simple y explicito durante el MVP.
- Mantener nombres descriptivos.
- Comentar solo cuando aporte claridad real.
- Revisar patrones existentes antes de crear nuevos.
- No redisenar la arquitectura sin necesidad.

## Separacion De Responsabilidades

- Componentes UI en `components/` cuando sean reutilizables.
- Rutas y pantallas en `app/`.
- Logica de IA en una capa de servicio.
- Llamadas Supabase en una capa de datos.
- Validaciones cerca del formulario o del boundary correspondiente.

## Variables De Entorno

Nunca hardcodear secretos.

Usar variables como:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GEMINI_API_KEY`

Las llaves privadas deben vivir solo del lado servidor.

## Formularios

Antes de considerar listo un formulario:

- Validar campos requeridos.
- Marcar visualmente campo y label cuando hay error.
- Poner el mensaje de error cerca del campo.
- Validar nombres reales con letras, acentos, espacios, guion, punto y apostrofe.
- Bloquear caracteres claramente accidentales en nombres.
- Confirmar contrasenas en registro.
- Hacer iconos interactivos como botones reales con `aria-label`.

## Supabase Y Pruebas

No ejecutar flujos automatizados de registro o inicio de sesion contra Supabase real. Esta regla evita rate limits en el plan gratuito.

Las pruebas de navegador pueden revisar UI publica o estados sin sesion. Login y registro con cuentas reales los valida manualmente el humano.

## Verificacion

Cuando aplique, correr:

```powershell
npm run lint
npm run build
```

Si no se puede correr una prueba, dejarlo claro en el handoff.
