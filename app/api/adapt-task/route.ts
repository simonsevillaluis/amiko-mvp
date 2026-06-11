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

// Helper to call any OpenAI-compatible API using standard fetch
async function callOpenAiCompatibleAPI(
  apiUrl: string,
  modelName: string,
  apiKey: string,
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: modelName,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("Invalid API response format: choices[0].message.content is missing");
  }
  return content;
}

// Helper to extract and parse the adaptation JSON from AI raw response
function parseAdaptationJson(raw: string): Omit<AdaptationResult, "originalText"> | null {
  try {
    const jsonStart = raw.indexOf("{");
    const jsonEnd = raw.lastIndexOf("}");

    if (jsonStart !== -1 && jsonEnd !== -1) {
      const cleanJson = raw.slice(jsonStart, jsonEnd + 1);
      const parsed = JSON.parse(cleanJson);

      return {
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
    console.error("JSON parsing error:", err);
  }
  return null;
}

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

  const optionsNote =
    options.length > 0
      ? `\n\nConsideraciones del adulto: ${options.join(", ")}.`
      : "";

  let adaptation: AdaptationResult | null = null;
  let usedModelName = "mock-model";

  // 1. Try Google Gemini API
  if (process.env.GEMINI_API_KEY) {
    try {
      console.log("Trying Gemini API...");
      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        systemInstruction: ADAPT_SYSTEM_PROMPT,
      });

      const result = await model.generateContent(
        `Adapta esta tarea escolar:\n\n"${taskText}"${optionsNote}`,
      );

      const raw = result.response.text().trim();
      const parsed = parseAdaptationJson(raw);
      if (parsed) {
        adaptation = { originalText: taskText, ...parsed };
        usedModelName = "gemini-2.0-flash";
      }
    } catch (err) {
      console.error("Gemini adapt-task error, falling back...", err);
    }
  }

  // 2. Try DeepSeek API (highly efficient Chinese model)
  if (!adaptation && process.env.DEEPSEEK_API_KEY) {
    try {
      console.log("Trying DeepSeek API...");
      const raw = await callOpenAiCompatibleAPI(
        "https://api.deepseek.com/v1/chat/completions",
        "deepseek-chat",
        process.env.DEEPSEEK_API_KEY,
        ADAPT_SYSTEM_PROMPT,
        `Adapta esta tarea escolar:\n\n"${taskText}"${optionsNote}`
      );
      const parsed = parseAdaptationJson(raw);
      if (parsed) {
        adaptation = { originalText: taskText, ...parsed };
        usedModelName = "deepseek-chat";
      }
    } catch (err) {
      console.error("DeepSeek adapt-task error, falling back...", err);
    }
  }

  // 3. Try NVIDIA NIM API (hosting high-perf models like Llama 3 / DeepSeek)
  if (!adaptation && process.env.NVIDIA_API_KEY) {
    const nimModels = [
      "nvidia/nemotron-3-ultra-550b-a55b",
      "moonshotai/kimi-k2.6",
      "meta/llama-3.1-70b-instruct",
      "deepseek-ai/deepseek-v4-flash",
      "nvidia/llama-3.1-nemotron-70b-instruct"
    ];
    for (const nimModel of nimModels) {
      try {
        console.log(`Trying NVIDIA NIM API with model ${nimModel}...`);
        const raw = await callOpenAiCompatibleAPI(
          "https://integrate.api.nvidia.com/v1/chat/completions",
          nimModel,
          process.env.NVIDIA_API_KEY,
          ADAPT_SYSTEM_PROMPT,
          `Adapta esta tarea escolar:\n\n"${taskText}"${optionsNote}`
        );
        const parsed = parseAdaptationJson(raw);
        if (parsed) {
          adaptation = { originalText: taskText, ...parsed };
          usedModelName = nimModel;
          console.log(`NVIDIA NIM API success with model ${nimModel}`);
          break; // Exit loop on success
        }
      } catch (err) {
        console.error(`NVIDIA NIM adapt-task error with model ${nimModel}, trying next...`, err);
      }
    }
  }

  // 4. Try OpenAI API
  if (!adaptation && process.env.OPENAI_API_KEY) {
    try {
      console.log("Trying OpenAI API...");
      const raw = await callOpenAiCompatibleAPI(
        "https://api.openai.com/v1/chat/completions",
        "gpt-4o-mini",
        process.env.OPENAI_API_KEY,
        ADAPT_SYSTEM_PROMPT,
        `Adapta esta tarea escolar:\n\n"${taskText}"${optionsNote}`
      );
      const parsed = parseAdaptationJson(raw);
      if (parsed) {
        adaptation = { originalText: taskText, ...parsed };
        usedModelName = "gpt-4o-mini";
      }
    } catch (err) {
      console.error("OpenAI adapt-task error, falling back...", err);
    }
  }

  // 5. Hard fallback to Mock adaptation
  if (!adaptation) {
    console.log("All APIs failed. Using mock adaptation.");
    adaptation = generateMockAdaptation(taskText, options);
    usedModelName = "mock-model";
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
          model: usedModelName,
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
