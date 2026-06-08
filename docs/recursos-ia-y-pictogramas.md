# Guía de Recursos: Pictogramas (ARASAAC) y Cadena de Modelos IA (Fallbacks)

Este documento detalla la integración de recursos externos y la arquitectura de contingencia (fallback) de modelos de Inteligencia Artificial en **AMIKO**.

---

## 1. Integración de Pictogramas (ARASAAC + IA)

Para ofrecer apoyos visuales a los estudiantes con TEA sin incurrir en costes innecesarios de generación de imágenes por cada paso, AMIKO utiliza una solución híbrida: **Pictogramas oficiales de ARASAAC** con un **salvavidas generativo (Pollinations AI)**.

### Flujo de Funcionamiento
El componente encargado de esta lógica es `components/arasaac-pictogram.tsx`.

1. **Extracción de Palabras Clave (`extractKeyword`):** 
   Limpia el texto descriptivo generado por la IA (ej. *"dibujo de un niño lavándose las manos"*) eliminando artículos, conectores comunes en español e introducciones, extrayendo la palabra clave principal (ej. *"manos"*).
2. **Búsqueda en la API de ARASAAC:**
   Realiza una petición `fetch` del lado del cliente (sin necesidad de API keys o proxy de servidor) a:
   `https://api.arasaac.org/api/pictograms/es/search/{palabra_clave}`
3. **Renderizado del Pictograma:**
   - **Coincidencia encontrada:** Si ARASAAC devuelve un ID de pictograma (ej. `7141`), se carga directamente la imagen estática oficial:
     `https://static.arasaac.org/pictograms/{id}/{id}_300.png`
     Muestra una pequeña insignia que indica **ARASAAC** (color verde).
   - **Sin coincidencia / Error de red:** Si no hay resultados o la API no responde, el componente conmuta automáticamente a **Pollinations AI** para generar una ilustración a partir del texto completo:
     `https://image.pollinations.ai/prompt/{texto_completo}?width=300&height=300&nologo=true`
     Muestra una pequeña insignia que indica **IA** (color coral).

---

## 2. Cadena de Fallbacks de Modelos de IA

Para asegurar que la funcionalidad crítica de **Adaptación de Tareas** esté siempre disponible (incluso si la API de Gemini sufre una sobrecarga o caída de servicio), la API de backend `/api/adapt-task` implementa una cadena secuencial de contingencias.

### Proveedores Soportados y Orden de Ejecución

1. **Google Gemini** (`gemini-2.0-flash`):
   - **Estado:** Proveedor principal.
   - **Requisito:** `GEMINI_API_KEY` en variables de entorno.
2. **DeepSeek (Modelo Chino)** (`deepseek-chat`):
   - **Estado:** Primer fallback. Altamente eficiente, de razonamiento avanzado y con costes extremadamente bajos.
   - **Requisito:** `DEEPSEEK_API_KEY` en variables de entorno.
   - **API Endpoint:** `https://api.deepseek.com/v1/chat/completions`
3. **NVIDIA NIM** (`meta/llama-3.1-70b-instruct`):
   - **Estado:** Segundo fallback. Ideal para usar créditos de desarrollador de NVIDIA o infraestructura de baja latencia.
   - **Requisito:** `NVIDIA_API_KEY` en variables de entorno.
   - **API Endpoint:** `https://integrate.api.nvidia.com/v1/chat/completions`
4. **OpenAI** (`gpt-4o-mini`):
   - **Estado:** Tercer fallback.
   - **Requisito:** `OPENAI_API_KEY` en variables de entorno.
   - **API Endpoint:** `https://api.openai.com/v1/chat/completions`
5. **Mock Fallback** (Algoritmo local por reglas):
   - **Estado:** Último recurso. Si todas las APIs fallan o no hay conexión a internet, genera una adaptación estructurada básica a partir del texto ingresado para garantizar que la app nunca muestre un error crítico al usuario.

---

## 3. Variables de Entorno (.env.local)

Para habilitar o deshabilitar cualquiera de los proveedores en local o en producción (Vercel), simplemente configura sus respectivas API Keys en tu archivo `.env.local` o panel de variables de entorno:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJ...

# --- Proveedores de IA (Amiko intentará usarlos en este orden) ---

# 1. Google Gemini (Principal)
GEMINI_API_KEY=tu_clave_de_gemini

# 2. DeepSeek (Primer Fallback)
DEEPSEEK_API_KEY=tu_clave_de_deepseek

# 3. NVIDIA NIM (Segundo Fallback)
NVIDIA_API_KEY=tu_clave_de_nvidia

# 4. OpenAI (Tercer Fallback)
OPENAI_API_KEY=tu_clave_de_openai
```

---

## 4. Estructura de la Base de Datos

Cada tarea adaptada con éxito guarda de forma automática en la tabla `adapted_tasks` el nombre del modelo que procesó la solicitud en la columna `model`. Esto permite:
* Medir la tasa de éxito de cada API.
* Analizar qué modelos ofrecen mejores adaptaciones en la práctica.
* Conocer cuándo se activó el generador local de respaldo.
