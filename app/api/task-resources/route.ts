import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let taskText: string;
  let type: "hints" | "questions";
  let count: number;

  try {
    const body = await request.json();
    taskText = (body.taskText ?? "").trim();
    type = body.type === "questions" ? "questions" : "hints";
    count = typeof body.count === "number" ? Math.min(Math.max(body.count, 1), 5) : 3;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!taskText) {
    return NextResponse.json({ error: "taskText is required" }, { status: 400 });
  }

  const prompt =
    type === "hints"
      ? `Eres Amiko, asistente pedagógico para niños con TEA. Genera exactamente ${count} pistas progresivas (de menos a más específicas) para ayudar a un estudiante a empezar la siguiente tarea. Sé breve y concreto. Responde ÚNICAMENTE con JSON válido sin markdown: {"hints": ["pista 1", "pista 2", ...]}\n\nTarea: "${taskText}"`
      : `Eres Amiko, asistente pedagógico para niños con TEA. Genera exactamente ${count} preguntas cortas de comprensión sobre la siguiente tarea. Para cada pregunta incluye una respuesta corta. Responde ÚNICAMENTE con JSON válido sin markdown: {"questions": [{"q": "pregunta", "a": "respuesta"}, ...]}\n\nTarea: "${taskText}"`;

  let result = "";
  let success = false;

  if (!success && process.env.GEMINI_API_KEY) {
    try {
      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const res = await model.generateContent(prompt);
      result = res.response.text().trim();
      success = true;
    } catch (err) {
      console.error("[task-resources] Gemini error:", err);
    }
  }

  if (!success && process.env.DEEPSEEK_API_KEY) {
    try {
      const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}` },
        body: JSON.stringify({ model: "deepseek-chat", messages: [{ role: "user", content: prompt }], temperature: 0.3 }),
      });
      const data = await res.json();
      result = data.choices?.[0]?.message?.content?.trim() ?? "";
      if (result) success = true;
    } catch (err) {
      console.error("[task-resources] DeepSeek error:", err);
    }
  }

  if (!success && process.env.NVIDIA_API_KEY) {
    try {
      const res = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.NVIDIA_API_KEY}` },
        body: JSON.stringify({
          model: "meta/llama-3.1-70b-instruct",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3,
        }),
      });
      const data = await res.json();
      result = data.choices?.[0]?.message?.content?.trim() ?? "";
      if (result) success = true;
    } catch (err) {
      console.error("[task-resources] NVIDIA error:", err);
    }
  }

  try {
    const jsonStart = result.indexOf("{");
    const jsonEnd = result.lastIndexOf("}");
    if (jsonStart !== -1 && jsonEnd !== -1) {
      const parsed = JSON.parse(result.slice(jsonStart, jsonEnd + 1));
      if (type === "hints" && Array.isArray(parsed.hints)) {
        return NextResponse.json({ hints: parsed.hints.slice(0, count) });
      }
      if (type === "questions" && Array.isArray(parsed.questions)) {
        return NextResponse.json({ questions: parsed.questions.slice(0, count) });
      }
    }
  } catch (err) {
    console.error("[task-resources] Parse error:", err);
  }

  if (type === "hints") {
    return NextResponse.json({
      hints: [
        "Primero, lee la instrucción con calma.",
        "Identifica qué pide hacer la tarea.",
        "Empieza por la parte que te parezca más fácil.",
      ].slice(0, count),
    });
  }
  return NextResponse.json({
    questions: [
      { q: "¿Qué pide hacer la tarea?", a: "Revisa la instrucción principal." },
      { q: "¿Cuántas partes tiene?", a: "Cuenta los puntos o pasos." },
      { q: "¿Qué materiales necesitas?", a: "Busca lo que hace falta para empezar." },
    ].slice(0, count),
  });
}
