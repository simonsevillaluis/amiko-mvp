import { NextResponse } from "next/server";

// Prompt para adultos (padres/cuidadores) — modo por defecto
const SYSTEM_PROMPT = `Eres Amiko, un asistente pedagógico inclusivo especializado en acompañar a niños y niñas con Trastorno del Espectro Autista (TEA).

Tu rol es ayudar a padres, madres y cuidadores a:
- Adaptar tareas escolares en pasos simples, cortos y claros
- Sugerir apoyos visuales y estrategias concretas
- Dar orientación para momentos de frustración o bloqueo
- Registrar lo que funcionó y lo que no

Reglas importantes:
- Responde SIEMPRE en español, con tono cálido, tranquilo y práctico
- Cada respuesta máximo 3-4 oraciones o una lista de pasos cortos
- Si adaptas una tarea, usa pasos numerados (máximo 5 pasos)
- Sugiere un apoyo visual concreto cuando sea útil (dibujo, imagen, gesto)
- Si el adulto pide una imagen, dibujo o pictograma, incluye un enlace Markdown de Pollinations.ai con el prompt en inglés. Ejemplo: \`![rainbow](https://image.pollinations.ai/prompt/colorful+rainbow?width=400&height=400&nologo=true)\`
- Si el adulto pide una presentación, secuencia de diapositivas o slideshow (ej: "hazme una presentación de cómo lavar los dientes"), responde incluyendo un bloque de código "slides". Cada diapositiva separada por "---" y con un título iniciado por "#". Ejemplo:
\`\`\`slides
# Diapositiva 1
1. Paso uno.
2. Paso dos.
---
# Diapositiva 2
1. Paso tres.
\`\`\`
- Si el adulto pide un mapa mental, esquema, diagrama o infografía, responde con un bloque Mermaid. Ejemplo:
\`\`\`mermaid
mindmap
  root((Tarea))
    Paso 1
    Paso 2
    Paso 3
\`\`\`
- NUNCA diagnostiques ni reemplaces a profesionales de salud, terapeutas o docentes
- Si la situación requiere un profesional, dilo con amabilidad y claridad
- Usa frases de ánimo breves pero genuinas`;

// Prompt para niños/estudiantes — habla directamente con el niño
const STUDENT_SYSTEM_PROMPT = `Eres Amiko, el compañero de tareas de niños y niñas.
Hablas DIRECTAMENTE con el niño o la niña.

REGLA ABSOLUTA — nunca la rompas:
Máximo 2 frases cortas por respuesta. Máximo 30 palabras totales.
Una sola idea por mensaje. Una sola acción por mensaje.
NUNCA escribas párrafos ni expliques más de una cosa a la vez.

Cómo hablas:
- Frases muy cortas y simples
- Tono cálido y directo, sin exagerar ni ser dramático
- Solo 1 emoji por mensaje si ayuda de verdad
- Sin listas, sin párrafos

Si pide una imagen o dibujo:
- Responde con 1 frase corta. Ejemplo: "¡Aquí está! 🌈"
- Incluye el markdown de imagen con prompt en inglés, máximo 3 palabras
- Ejemplo: ![arcoiris](https://image.pollinations.ai/prompt/colorful+rainbow?width=400&height=400&nologo=true)
- El prompt en la URL SIEMPRE en inglés
- No expliques qué muestra la imagen

Si pide un mapa mental o esquema:
- Responde con 1 frase corta y un bloque Mermaid sencillo. Ejemplo:
\`\`\`mermaid
mindmap
  root((Tema))
    Idea 1
    Idea 2
\`\`\`

Si necesita ayuda con una tarea:
- Da 1 solo paso concreto para empezar ahora mismo
- Espera antes de dar más pasos

Si está frustrado o triste:
- 1 frase breve de apoyo. Nada más.

Responde siempre en español.
NUNCA menciones diagnósticos ni condiciones médicas.`;

// ─── Image helpers ─────────────────────────────────────────────────────────────

const ES_EN: Record<string, string> = {
  "arcoiris": "colorful rainbow", "arco iris": "colorful rainbow",
  "gato": "cat", "gatito": "cute kitten", "perro": "dog", "perrito": "cute puppy",
  "sol": "bright sun", "luna": "full moon", "estrella": "star", "nube": "cloud", "lluvia": "rain",
  "casa": "house", "escuela": "school", "aula": "classroom",
  "arbol": "tree", "árbol": "tree", "flor": "flower", "hierba": "grass",
  "manzana": "apple", "naranja": "orange fruit", "platano": "banana", "uva": "grapes",
  "auto": "car", "carro": "car", "bicicleta": "bicycle", "avion": "airplane",
  "pelota": "ball", "globo": "colorful balloon", "juguete": "toy",
  "niño": "boy child", "niña": "girl child", "familia": "family", "amigo": "friend",
  "felicidad": "happiness joy", "feliz": "happy smiling", "triste": "sad", "enojado": "angry",
  "libro": "book", "lapiz": "pencil", "cuaderno": "notebook", "mochila": "backpack",
  "computadora": "computer", "telefono": "phone",
  "dinosaurio": "dinosaur", "dragon": "dragon", "unicornio": "unicorn",
  "mar": "sea ocean", "rio": "river", "montaña": "mountain", "bosque": "forest",
  "verano": "summer", "invierno": "winter", "primavera": "spring", "otoño": "autumn",
};

function toEnglishPrompt(spanish: string): string {
  const low = spanish.toLowerCase().trim();
  if (ES_EN[low]) return ES_EN[low];
  const firstWord = low.split(/\s+/)[0];
  return ES_EN[firstWord] ?? spanish;
}

function buildPollinationsUrl(subject: string): string {
  const englishPrompt = toEnglishPrompt(subject);
  const encoded = englishPrompt.trim().replace(/\s+/g, "+");
  return `https://image.pollinations.ai/prompt/${encoded}?width=400&height=400&nologo=true`;
}

// ─── ARASAAC helpers ───────────────────────────────────────────────────────────

async function searchArasaac(keyword: string, signal: AbortSignal): Promise<string | null> {
  try {
    const res = await fetch(
      `https://api.arasaac.org/api/pictograms/es/search/${encodeURIComponent(keyword)}`,
      { signal }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0 && data[0]?._id) {
      return String(data[0]._id);
    }
  } catch (err) {
    if ((err as Error).name !== "AbortError") console.error("ARASAAC search error:", err);
  }
  return null;
}

async function resolveTermToArasaac(term: string, signal: AbortSignal): Promise<string | null> {
  const cleanTerm = term.trim().toLowerCase().replace(/\barcoiris\b/g, "arco iris");
  if (!cleanTerm) return null;

  let id = await searchArasaac(cleanTerm, signal);
  if (id) return id;

  const stopWords = new Set([
    "el", "la", "los", "las", "un", "una", "unos", "unas", "de", "del", "con", "en", "para", "por", "sobre",
    "y", "o", "a", "al", "se", "donde", "entienda", "dibujo", "imagen", "foto", "pictograma", "represente",
    "muestra", "mostrar", "crea", "crear", "dibuja", "dibujar", "como", "esta", "este", "estos", "estas",
  ]);
  const words = cleanTerm.split(/[\s_-]+/).filter(w => w.length > 1 && !stopWords.has(w));
  for (const word of words) {
    id = await searchArasaac(word, signal);
    if (id) return id;
  }
  return null;
}

// ─── Image post-processing ─────────────────────────────────────────────────────

function processImageMarkdownAndFallback(text: string): string {
  return text.replace(
    /!\[(.*?)\]\((https?:\/\/(?:loremflickr\.com|placehold\.co)[^)]*)\)/g,
    (_, alt) => `![${alt}](${buildPollinationsUrl(alt.trim() || "illustration")})`
  );
}

async function detectAndAppendImage(
  userMessage: string,
  aiText: string,
  signal: AbortSignal
): Promise<string> {
  if (aiText.includes("![") && aiText.includes("](")) return aiText;

  const cleanUser = userMessage.toLowerCase();
  const imageKeywords = [
    "dibujame", "dibuja", "creame la imagen de", "creame la imagen", "crea la imagen de", "crea la imagen",
    "generame la imagen de", "generame la imagen", "genera la imagen de", "genera la imagen",
    "muestrame una imagen de", "muestrame una imagen", "muestrame un dibujo de", "muestrame un dibujo",
    "imagen de", "dibujo de", "pictograma de", "muestra un", "muestra una",
    "hazme una imagen de", "hazme una imagen", "hazme un dibujo de", "hazme un dibujo",
    "y con una imagen", "con una imagen",
    "hazme una imangen", "hazme una imangen de", "hazme una iamgen", "hazme una iamgen de",
    "y con una imangen", "con una imangen",
  ];

  const matchedKeyword = imageKeywords.find(k => cleanUser.includes(k));
  if (!matchedKeyword) return aiText;

  const index = cleanUser.indexOf(matchedKeyword);
  let rest = cleanUser.substring(index + matchedKeyword.length).trim();
  rest = rest.replace(/^(de|del|un|una|unos|unas|el|la|los|las|sobre|en\s+donde\s+se\s+entienda\s+la|en\s+donde\s+se\s+entienda|en\s+donde|que\s+represente|donde\s+se\s+vea|de\s+un|de\s+una)\s+/, "");
  rest = rest.replace(/[.,/#!$%^&*;:{}=_`~()?]/g, "").trim();

  const words = rest.split(/\s+/).filter(Boolean);
  if (!words.length) return aiText;

  const subject = words.slice(0, 3).join(" ");
  const arasaacId = await resolveTermToArasaac(subject, signal);
  const imgUrl = arasaacId
    ? `https://static.arasaac.org/pictograms/${arasaacId}/${arasaacId}_300.png`
    : buildPollinationsUrl(subject);

  return aiText + `\n\n![${subject}](${imgUrl})`;
}

// ─── LLM helpers ──────────────────────────────────────────────────────────────

// 12 seconds per provider — keeps total chain under Vercel's 60s function limit
const PROVIDER_TIMEOUT_MS = 12_000;

async function callOpenAiChatAPI(
  apiUrl: string,
  modelName: string,
  apiKey: string,
  systemPrompt: string,
  history: { role: string; text: string }[],
  message: string,
  parentSignal: AbortSignal
): Promise<string> {
  const messages = [
    { role: "system", content: systemPrompt },
    ...history.map((m) => ({
      role: m.role === "model" ? "assistant" : "user",
      content: m.text,
    })),
    { role: "user", content: message },
  ];

  // Combine per-provider timeout with parent (client disconnect) signal
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(new Error("Provider timeout")), PROVIDER_TIMEOUT_MS);
  const onParentAbort = () => controller.abort(parentSignal.reason);
  parentSignal.addEventListener("abort", onParentAbort, { once: true });

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      signal: controller.signal,
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
      body: JSON.stringify({ model: modelName, messages, temperature: 0.7 }),
    });

    if (!response.ok) {
      throw new Error(`API error (${response.status}): ${await response.text()}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error("Invalid API response: choices[0].message.content missing");
    return content;
  } finally {
    clearTimeout(timer);
    parentSignal.removeEventListener("abort", onParentAbort);
  }
}

function generateMockChatMessage(mode: string, studentName: string): string {
  const name = studentName || "el estudiante";
  if (mode === "calma") return `Para acompañar a ${name} con calma: respirá junto a él/ella por 30 segundos y ofrecé un vaso de agua. Retomen cuando esté más tranquilo/a. 💙`;
  if (mode === "registro") return `Anotado. Registrar qué funcionó hoy con ${name} ayuda a ajustar el apoyo mañana. ¿Querés que lo organicemos en pasos? 📝`;
  if (mode === "mensajes") return `Para escribirle al docente de ${name}: explicá qué paso costó más y sugerí un ajuste en el apoyo visual. ¿Quieres que preparemos el mensaje juntos? ✉️`;
  return `Para empezar la tarea con ${name}: lean las instrucciones en voz alta y hagan solo el primer paso. Si necesitás más ayuda, contame qué dice la tarea y la dividimos juntos. 🌟`;
}

// ─── Route handler ─────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  const clientSignal = request.signal;

  let history: { role: string; text: string }[] = [];
  let message = "";
  let studentName = "";
  let mode = "tareas";

  try {
    const body = await request.json();
    history = Array.isArray(body.history) ? body.history : [];
    message = typeof body.message === "string" ? body.message.trim() : "";
    studentName = typeof body.studentName === "string" ? body.studentName : "";
    mode = typeof body.mode === "string" ? body.mode : "tareas";
  } catch {
    return NextResponse.json({ error: "Cuerpo de solicitud inválido." }, { status: 400 });
  }

  if (!message) {
    return NextResponse.json({ error: "El mensaje es requerido." }, { status: 400 });
  }

  const systemInstruction =
    mode === "student"
      ? `${STUDENT_SYSTEM_PROMPT}\n\nEstás hablando directamente con ${studentName || "el estudiante"}.`
      : `${SYSTEM_PROMPT}\n\nEstás ayudando a acompañar a ${studentName || "el estudiante"}. Modo actual: ${mode || "tareas"}.`;

  let replyText = "";
  let success = false;

  // 1. Gemini
  if (!success && process.env.GEMINI_API_KEY) {
    try {
      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash", systemInstruction });
      const chat = model.startChat({
        history: history.map((m) => ({ role: m.role, parts: [{ text: m.text }] })),
      });

      // Gemini SDK doesn't accept AbortSignal directly — wrap in Promise.race with timeout
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Gemini timeout")), PROVIDER_TIMEOUT_MS)
      );
      const geminiPromise = chat.sendMessage(message);
      replyText = (await Promise.race([geminiPromise, timeoutPromise])).response.text();
      success = true;
    } catch (err) {
      console.error("[chat] Gemini failed:", (err as Error).message);
    }
  }

  // 2. DeepSeek
  if (!success && process.env.DEEPSEEK_API_KEY) {
    try {
      replyText = await callOpenAiChatAPI(
        "https://api.deepseek.com/v1/chat/completions",
        "deepseek-chat",
        process.env.DEEPSEEK_API_KEY,
        systemInstruction, history, message,
        clientSignal
      );
      success = true;
    } catch (err) {
      console.error("[chat] DeepSeek failed:", (err as Error).message);
    }
  }

  // 3. NVIDIA NIM — try reliable models in order, stop at first success
  if (!success && process.env.NVIDIA_API_KEY) {
    const nimModels = [
      "meta/llama-3.1-70b-instruct",
      "nvidia/llama-3.1-nemotron-70b-instruct",
      "meta/llama-3.3-70b-instruct",
    ];
    for (const nimModel of nimModels) {
      if (clientSignal.aborted) break;
      try {
        replyText = await callOpenAiChatAPI(
          "https://integrate.api.nvidia.com/v1/chat/completions",
          nimModel,
          process.env.NVIDIA_API_KEY,
          systemInstruction, history, message,
          clientSignal
        );
        success = true;
        break;
      } catch (err) {
        console.error(`[chat] NVIDIA NIM ${nimModel} failed:`, (err as Error).message);
      }
    }
  }

  // 4. Generic helpful fallback (never exposes API key status to users)
  if (!success) {
    console.warn("[chat] All providers failed — using generic fallback");
    replyText = generateMockChatMessage(mode, studentName);
  }

  // Post-process: fix bad image URLs, detect missing images
  try {
    replyText = processImageMarkdownAndFallback(replyText);
    replyText = await detectAndAppendImage(message, replyText, clientSignal);
  } catch (err) {
    if ((err as Error).name !== "AbortError") console.error("[chat] Image post-processing error:", err);
  }

  return NextResponse.json({ text: replyText });
}
