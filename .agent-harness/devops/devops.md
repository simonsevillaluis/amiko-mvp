# 🚀 Guía del Track DevOps y Despliegue - AMIKO

Esta guía define las pautas para asegurar la compilación, verificación de configuración y el despliegue exitoso de AMIKO en Vercel.

## 1. Integridad del Repositorio y Secretos
* **Exclusión de Archivos Sensibles:** Verifica que `.gitignore` incluya correctamente `.env`, `.env.local`, `.env.development.local`, `.env.test.local`, `.env.production.local` y carpetas de build temporales.
* **Cero Credenciales en Código:** El código del repositorio no debe incluir contraseñas de bases de datos, tokens de Gemini o llaves de Supabase hardcodeadas. Cualquier detección de este tipo debe considerarse un fallo crítico de seguridad.

## 2. Compilación (Build) y Compatibilidad
* **Verificación de Compilación:** Antes de proponer un despliegue o merge, ejecuta la compilación en local utilizando:
  ```powershell
  npm run build
  ```
  Esto asegura que no haya errores de tipado de TypeScript o problemas en la generación de páginas estáticas de Next.js.
* **Configuración de Next.js:** Asegúrate de que `next.config.mjs` no contenga configuraciones que rompan la compatibilidad en Vercel.

## 3. Checklist de Despliegue en Vercel
Para cada despliegue, verifica la existencia y configuración de las siguientes variables de entorno requeridas en el dashboard de Vercel:

| Variable de Entorno | Propósito | Entorno |
|---------------------|-----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL pública del proyecto Supabase | Cliente y Servidor |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Llave anónima pública de Supabase | Cliente y Servidor |
| `SUPABASE_SERVICE_ROLE_KEY` | Llave de rol de servicio (solo lectura/escritura administrativa) | Servidor únicamente |
| `GEMINI_API_KEY` | Token de autenticación de Gemini | Servidor únicamente |

## 4. Políticas de Modificación
* **Enfoque DevOps:** Como agente DevOps, tienes prohibido modificar la lógica del negocio, diseño visual, estilos de Tailwind o comportamiento de los componentes React, a menos que sea estrictamente indispensable para resolver un error que impida el build o deploy del proyecto.
