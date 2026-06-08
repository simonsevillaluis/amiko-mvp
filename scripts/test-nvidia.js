const fs = require('fs');
const path = require('path');

// System prompt for Amiko adaptations
const ADAPT_SYSTEM_PROMPT = `Eres Amiko, un asistente pedagógico inclusivo para niños con Trastorno del Espectro Autista (TEA).
Tu tarea es adaptar la consigna escolar que recibirás en instrucciones simples, claras y paso a paso.
Reglas:
- Usa español claro y sencillo, sin lenguaje clínico.
- Divide la tarea en pasos cortos y concretos (máximo 5 pasos).
- No diagnostiques ni inventes una tarea diferente a la ingresada.
- Mantén un tono cálido, positivo y tranquilo.
- Responde ÚNICAMENTE con JSON válido, sin markdown, sin texto adicional.

El JSON debe tener exactamente esta estructura:
{
  "simple_summary": "Resumen de la tarea en 1-2 oraciones simples",
  "steps": [
    {
      "number": 1,
      "instruction": "Instrucción corta y concreta",
      "visual_support": "Descripción breve del apoyo visual sugerido",
      "adult_support": "Sugerencia breve para el adulto que acompaña"
    }
  ],
  "emotional_support": "Mensaje breve de regulación emocional",
  "difficulty_level": "bajo"
}

difficulty_level debe ser "bajo", "medio" o "alto".`;

function loadEnvKey(keyName) {
  // Try system env first
  if (process.env[keyName]) return process.env[keyName];

  // Try parsing .env.local
  try {
    const envPath = path.join(__dirname, '..', '.env.local');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      const lines = content.split('\n');
      for (const line of lines) {
        const match = line.match(new RegExp(`^\\s*${keyName}\\s*=\\s*(.+)`));
        if (match) {
          return match[1].trim().replace(/^["']|["']$/g, '');
        }
      }
    }
  } catch (err) {
    console.error('Error reading .env.local:', err.message);
  }
  return null;
}

async function testNvidia() {
  const apiKey = loadEnvKey('NVIDIA_API_KEY');

  if (!apiKey) {
    console.error('\n❌ Error: No se encontró la variable NVIDIA_API_KEY.');
    console.log('Por favor, agrega la siguiente línea a tu archivo .env.local en la raíz del proyecto:\n');
    console.log('NVIDIA_API_KEY=tu_api_key_de_nvidia\n');
    process.exit(1);
  }

  console.log('🔑 API Key detectada. Iniciando prueba con NVIDIA NIM...');

  const sampleTask = "Escribe una carta de 3 párrafos sobre tus vacaciones de verano, describiendo el lugar que visitaste, las actividades que realizaste y lo que más te gustó.";
  console.log(`\n📝 Tarea de prueba:\n"${sampleTask}"\n`);

  try {
    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'meta/llama-3.1-70b-instruct',
        messages: [
          { role: 'system', content: ADAPT_SYSTEM_PROMPT },
          { role: 'user', content: `Adapta esta tarea escolar:\n\n"${sampleTask}"` }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.2
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Error en la API (${response.status}): ${errText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('La respuesta de la API no contiene el formato esperado.');
    }

    console.log('✅ Respuesta recibida exitosamente de NVIDIA NIM!\n');
    console.log('--- JSON Adaptado ---');
    console.log(JSON.stringify(JSON.parse(content), null, 2));
    console.log('---------------------');
  } catch (err) {
    console.error('\n❌ Falló la conexión con la API de NVIDIA NIM:');
    console.error(err.message);
  }
}

testNvidia();
