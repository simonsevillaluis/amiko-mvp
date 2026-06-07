# 🚀 Auditoría de Configuración de Build y Checklist de Despliegue en Vercel - AMIKO

*Este reporte fue generado y entregado por el track de DevOps y Despliegue tras auditar la compilación de Next.js, seguridad de secretos y preparación para Vercel.*

---

## 1. Auditoría de Seguridad e Integridad del Repositorio

> [!NOTE]
> Se verificó el estado de las variables de entorno y los archivos de configuración para asegurar la integridad de las credenciales del proyecto.

### Exclusión de Archivos Sensibles (`.gitignore`)
Se revisó el archivo `.gitignore` ubicado en la raíz del proyecto. El archivo cumple con los estándares de seguridad requeridos, excluyendo de forma efectiva cualquier archivo de configuración local o temporal:
- **Variables de entorno locales:** Excluye correctamente `.env`, `.env.local` y cualquier patrón dinámico mediante `.env.*.local` (cubriendo `.env.development.local`, `.env.test.local`, `.env.production.local`).
- **Directorios temporales:** Excluye `.next`, `out`, `dist` y `.vercel`.
- **Logs de depuración:** Excluye `npm-debug.log*`, `yarn-debug.log*` y `yarn-error.log*`.

### Exposición de Credenciales (Cero Secretos en Código)
Se realizó un análisis estático en todo el código fuente del proyecto buscando asignaciones directas de llaves API, tokens o credenciales:
- **Resultado:** No se detectó ninguna credencial sensible expuesta en el código.
- **Localización de variables:** Las conexiones con Supabase y las llamadas al modelo de IA recuperan los tokens exclusivamente a través del objeto `process.env`.
- **Archivo de desarrollo local:** Se verificó la existencia de `.env.local`, el cual contiene las llaves locales del entorno de desarrollo de Supabase y la clave de Gemini. Este archivo está gitignorado adecuadamente y no se subirá al repositorio.

---

## 2. Auditoría de Configuración de Build de Next.js

Se analizaron de forma estática los archivos que gobiernan el proceso de build de Next.js en el repositorio:

1. **`next.config.mjs`:** 
   - Configuración limpia y estándar (`nextConfig = {}`).
   - No introduce redirecciones complejas, reescrituras de rutas o módulos experimentales que puedan provocar comportamientos fallidos durante el build nativo de Vercel.
2. **`package.json`:**
   - Define correctamente el script `"build": "next build"`.
   - Utiliza Next.js versión `^16.2.6` y React versión `^19.2.6`.
   - Dependencias clave instaladas: `@google/generative-ai` y `@supabase/ssr`.
3. **`tsconfig.json`:**
   - Habilita `"strict": true` para asegurar robustez en el tipado de TypeScript.
   - Habilita `"skipLibCheck": true` para optimizar y acelerar el tiempo de build al omitir el chequeo detallado de tipos en `node_modules`.
   - Usa resolución de módulos `"bundler"`.
   - Incluye correctamente los alias `@/*` apuntando a la raíz del proyecto.

> [!WARNING]
> Debido a que la ejecución remota de comandos de shell (`npm run build`) no recibió confirmación por tiempo de espera en la consola local, se solicita que el desarrollador humano valide la compilación local ejecutando el comando de manera manual en su consola para asegurar que no existan errores latentes de tipado de TypeScript.
> 
> ```powershell
> npm run build
> ```

---

## 3. Checklist de Variables de Entorno en Vercel

Durante el análisis del código, se identificó que las APIs del proyecto se integran con **Gemini API** a través del SDK `@google/generative-ai`. Esto difiere de la sugerencia inicial de usar la API de OpenAI, por lo que el checklist de Vercel debe adecuarse para incluir `GEMINI_API_KEY`.

A continuación, se presenta la tabla definitiva de variables de entorno que deben configurarse en el dashboard del proyecto en Vercel:

| Variable de Entorno | Propósito | Ámbito | Requerida / Opcional |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL de la API del proyecto de Supabase. | Cliente y Servidor | **Requerida** |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Llave anónima pública de Supabase para inicialización del cliente. | Cliente y Servidor | **Requerida** (Actúa como fallback de `NEXT_PUBLIC_SUPABASE_ANON_KEY`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Llave anónima pública de Supabase. | Cliente y Servidor | **Opcional** (Soportada como alternativa a `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`) |
| `GEMINI_API_KEY` | Token de autenticación para los servicios de inteligencia artificial de Gemini (`gemini-2.0-flash` y `gemini-flash-latest`). | Servidor Únicamente | **Requerida** (El endpoint de chat fallará con error 500 si no se configura. La adaptación tiene un fallback mockeado si esta clave no está presente). |
| `SUPABASE_SERVICE_ROLE_KEY` | Llave de rol de servicio con permisos administrativos elevados. | Servidor Únicamente | **Opcional** (Requerida solo para operaciones administrativas sin pasar por políticas RLS). |

---

## 4. Checklist de Pasos para el Despliegue en Vercel

Sigue estos pasos detallados para realizar el despliegue inicial en Vercel:

### Paso 1: Conectar el Repositorio a Vercel
1. Ingresa al dashboard de Vercel.
2. Selecciona **"Add New..."** -> **"Project"**.
3. Importa el repositorio Git de AMIKO (`simonsevillaluis/amiko-mvp`).

### Paso 2: Configurar las Opciones del Proyecto
- **Framework Preset:** Selecciona automáticamente `Next.js`.
- **Root Directory:** `./` (raíz).
- **Build Command:** `npm run build` (por defecto).
- **Output Directory:** `.next` (por defecto).
- **Install Command:** `npm install` (por defecto).

### Paso 3: Cargar las Variables de Entorno
Añade una por una las siguientes variables de la sección 3 en la pestaña **Environment Variables** del formulario de creación:
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- [ ] `GEMINI_API_KEY`

### Paso 4: Desplegar y Validar
1. Haz clic en **"Deploy"**.
2. Espera a que finalicen las etapas de `Queued`, `Building` y `Completing`.
3. Una vez finalizado el despliegue con éxito, visita la URL pública asignada para verificar:
   - Que la pantalla de Login cargue correctamente.
   - Que no existan errores de redirección 500 causados por el middleware/proxy de sesión.
   - Que las solicitudes al endpoint de adaptación de tareas (`/api/adapt-task`) respondan correctamente (validando la conexión de la API Key de Gemini).
