import { NextResponse } from "next/server";
import { generateMockAdaptation, type AdaptationResult } from "@/lib/adapt-task";
import { getFirstStudent } from "@/lib/supabase/students";
import { saveAdaptedTask } from "@/lib/supabase/tasks";

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

export async function POST(request: Request) {
  let taskText: string;
  let options: string[];

  try {
    const body = await request.json();
    taskText = typeof body.taskText === "string" ? body.taskText.trim() : "";
    options = Array.isArray(body.options) ? body.options : [];
  } catch {
    return NextResponse.json({ error: "Cuerpo de solicitud inválido." }, { status: 400 });
  }

  if (!taskText) {
    return NextResponse.json({ error: "El texto de la tarea es requerido." }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  let adaptation: AdaptationResult | null = null;

  if (apiKey) {
    try {
      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        systemInstruction: ADAPT_SYSTEM_PROMPT,
      });

      const optionsNote =
        options.length > 0
          ? `\n\nConsideraciones del adulto: ${options.join(", ")}.`
          : "";

      const result = await model.generateContent(
        `Adapta esta tarea escolar:\n\n"${taskText}"${optionsNote}`,
      );

      const raw = result.response.text().trim();
      const jsonStart = raw.indexOf("{");
      const jsonEnd = raw.lastIndexOf("}");

      if (jsonStart !== -1 && jsonEnd !== -1) {
        const parsed = JSON.parse(raw.slice(jsonStart, jsonEnd + 1));

        adaptation = {
          originalText: taskText,
          simple_summary: String(parsed.simple_summary ?? ""),
          steps: Array.isArray(parsed.steps)
            ? parsed.steps.map(
                (s: { number?: number; instruction?: string; visual_support?: string; adult_support?: string }, i: number) => ({
                  number: Number(s.number ?? i + 1),
                  instruction: String(s.instruction ?? ""),
                  visual_support: String(s.visual_support ?? ""),
                  adult_support: String(s.adult_support ?? ""),
                }),
              )
            : [],
          emotional_support: String(parsed.emotional_support ?? ""),
          difficulty_level: ["bajo", "medio", "alto"].includes(parsed.difficulty_level)
            ? (parsed.difficulty_level as "bajo" | "medio" | "alto")
            : "medio",
        };
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("Gemini adapt-task error:", msg);
    }
  }

  // Fallback: mock adaptation derived from the actual task text if Gemini failed or is not configured
  if (!adaptation) {
    adaptation = generateMockAdaptation(taskText, options);
  }

  // Save to Supabase database if authenticated and has a student profile
  let taskId: string | null = null;
  try {
    const student = await getFirstStudent();
    if (student && adaptation) {
      // Generate a preview title
      let title = "Tarea adaptada";
      const cleanText = taskText.trim().replace(/[\n\r]+/g, " ");
      const words = cleanText.split(/\s+/);
      if (words.length > 0) {
        const preview = words.slice(0, 5).join(" ");
        title = preview.length > 50 ? preview.slice(0, 47) + "..." : preview;
      }

      const savedResult = await saveAdaptedTask({
        studentId: student.id,
        title,
        originalText: taskText,
        status: "adapted",
        adaptation: {
          simple_summary: adaptation.simple_summary,
          steps: adaptation.steps,
          emotional_support: adaptation.emotional_support,
          difficulty_level: adaptation.difficulty_level,
          model: apiKey ? "gemini-2.0-flash" : "mock-model",
        },
      });

      if (savedResult) {
        taskId = savedResult.taskId;
      }
    }
  } catch (dbErr) {
    console.error("Failed to save adapted task to db:", dbErr);
  }

  return NextResponse.json({
    ...adaptation,
    id: taskId,
  });
}
