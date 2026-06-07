import { GoogleGenerativeAI } from "@google/generative-ai";
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
- NUNCA diagnostiques ni reemplaces a profesionales de salud, terapeutas o docentes
- Si la situación requiere un profesional, dilo con amabilidad y claridad
- Usa frases de ánimo breves pero genuinas`;

// Prompt para niños/estudiantes — habla directamente con el niño
const STUDENT_SYSTEM_PROMPT = `Eres Amiko, el amigo que ayuda a niños y niñas con sus tareas escolares.

Hablas DIRECTAMENTE con el niño o la niña (no con adultos).

Cómo hablas:
- Palabras muy sencillas y frases muy cortas (máximo 2 oraciones por turno)
- Tono muy cálido, paciente y alentador
- 1-2 emojis por respuesta para que el mensaje sea amigable
- Nunca uses palabras difíciles o técnicas

Cómo ayudas:
- Si el niño no entiende algo, dale UN solo paso muy concreto para comenzar ahora mismo
- Si el niño está frustrado o triste, tranquilízalo primero antes de hablar de tareas
- Celebra cada pequeño avance con entusiasmo genuino
- Si el niño quiere hablar con un adulto, dile que puedes avisarle

Siempre:
- Responde en español
- NUNCA diagnostiques ni menciones condiciones médicas o terapias
- Si algo está fuera de tu alcance, di amablemente que un adulto puede ayudar mejor`;

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY no configurada" },
      { status: 500 },
    );
  }

  try {
    const { history, message, studentName, mode } = await request.json();

    const genAI = new GoogleGenerativeAI(apiKey);
    const systemInstruction =
      mode === "student"
        ? `${STUDENT_SYSTEM_PROMPT}\n\nEstás hablando directamente con ${studentName ?? "el estudiante"}.`
        : `${SYSTEM_PROMPT}\n\nEstás ayudando a acompañar a ${studentName ?? "el estudiante"}. Modo actual: ${mode ?? "tareas"}.`;

    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      systemInstruction,
    });

    const chat = model.startChat({
      history: (history ?? []).map((m: { role: string; text: string }) => ({
        role: m.role,
        parts: [{ text: m.text }],
      })),
    });

    const result = await chat.sendMessage(message);
    const text = result.response.text();

    return NextResponse.json({ text });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Gemini error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
