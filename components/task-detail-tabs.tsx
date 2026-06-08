"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AmikoIcon } from "@/components/amiko-icon";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "materiales" | "amiko" | "apoyos";

export interface TaskForTabs {
  id: string;
  title: string;
  original_text: string;
  status: string;
  subject?: string | null;
  adult_notes?: string | null;
}

export interface AdaptationForTabs {
  simple_summary: string;
  steps: {
    number: number;
    instruction: string;
    visual_support: string;
    adult_support: string;
  }[];
  emotional_support: string | null;
  difficulty_level: string;
}

interface Props {
  task: TaskForTabs;
  adaptation?: AdaptationForTabs;
  studentName: string;
}

type Message = { id: string; role: "amiko" | "user"; text: string };

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_MAP: Record<string, { label: string; tone: string }> = {
  draft:       { label: "Por adaptar",        tone: "bg-slate-100 text-slate-500" },
  adapted:     { label: "Lista para empezar", tone: "bg-amiko-mint text-green-800" },
  in_progress: { label: "En progreso",        tone: "bg-amiko-sky text-amiko-blue" },
  completed:   { label: "Terminada",          tone: "bg-green-50 text-green-700" },
};

const CHIPS = [
  { label: "¿Cómo lo acompaño?",     api: "¿Cómo puedo acompañar mejor a mi estudiante durante esta tarea?" },
  { label: "Simplificar un paso",    api: "¿Puedes simplificar alguno de los pasos para que sea más fácil de entender?" },
  { label: "Necesita una pausa",     api: "Mi estudiante necesita una pausa. ¿Qué puedo hacer para ayudarle a volver?" },
  { label: "Ajustar la dificultad",  api: "¿Puedes proponer cómo ajustar el nivel de esta tarea?" },
];

const TABS: { id: Tab; label: string; icon: "resources" | "chat" | "sparkles" }[] = [
  { id: "materiales", label: "Materiales", icon: "resources" },
  { id: "amiko",      label: "Amiko",      icon: "chat"      },
  { id: "apoyos",     label: "Apoyos",     icon: "sparkles"  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function TaskDetailTabs({ task, adaptation, studentName }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>(adaptation ? "apoyos" : "materiales");

  const welcomeText = adaptation
    ? `Hola. Tengo lista la adaptación de "${task.title}" para ${studentName}. ¿En qué te puedo ayudar con esta tarea?`
    : `Hola. La tarea "${task.title}" aún no está adaptada. ¿Quieres que la trabajemos juntos para ${studentName}?`;

  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", role: "amiko", text: welcomeText },
  ]);
  const [inputText, setInputText] = useState("");
  const [typing, setTyping] = useState(false);
  const [chipsVisible, setChipsVisible] = useState(true);

  const messagesRef = useRef<Message[]>(messages);
  useEffect(() => { messagesRef.current = messages; }, [messages]);

  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (activeTab === "amiko") {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, typing, activeTab]);

  const status = STATUS_MAP[task.status] ?? STATUS_MAP.draft;

  // ── API call ──────────────────────────────────────────────────────────────

  const callApi = useCallback(async (userText: string, prev: Message[]): Promise<string> => {
    const history = prev
      .slice(1)
      .map((m) => ({ role: m.role === "amiko" ? "model" : "user", text: m.text }));

    const context = [
      `Tarea: "${task.title}"`,
      task.subject ? `Materia: ${task.subject}` : null,
      `Instrucción original: ${task.original_text}`,
      adaptation ? `Resumen adaptado: ${adaptation.simple_summary}` : "La tarea aún no está adaptada.",
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `[Contexto de la tarea]\n${context}\n\n[Pregunta del tutor]\n${userText}`,
          history,
          studentName,
          mode: "tareas",
        }),
      });
      const json = (await res.json()) as { text?: string; error?: string };
      return json.text ?? "Algo salió mal. ¿Lo intentamos de nuevo?";
    } catch {
      return "No pude conectarme ahora. Revisa tu conexión e intenta de nuevo.";
    }
  }, [task, adaptation, studentName]);

  const appendAmiko = useCallback((text: string) => {
    setTyping(false);
    setMessages((prev) => [...prev, { id: `a_${Date.now()}`, role: "amiko", text }]);
  }, []);

  const handleSend = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed || typing) return;
    const history = messagesRef.current;
    setMessages((prev) => [...prev, { id: `u_${Date.now()}`, role: "user", text: trimmed }]);
    setInputText("");
    setTyping(true);
    setChipsVisible(false);
    callApi(trimmed, history).then(appendAmiko);
  }, [typing, callApi, appendAmiko]);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex min-h-dvh flex-col bg-slate-50">

      {/* ── Header ── */}
      <header className="sticky top-0 z-30 border-b border-blue-100 bg-white/95 px-4 py-3 backdrop-blur-xl">
        <div className="mx-auto grid max-w-[430px] grid-cols-[40px_1fr_auto] items-center gap-2">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Volver"
            className="focus-ring flex h-10 w-10 items-center justify-center rounded-full text-amiko-navy transition hover:bg-amiko-sky"
          >
            <AmikoIcon name="back" className="h-6 w-6" />
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-base font-black text-amiko-navy">{task.title}</h1>
            <p className="text-[11px] font-bold text-amiko-muted">Para: {studentName}</p>
          </div>
          <span className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-black ${status.tone}`}>
            {status.label}
          </span>
        </div>
      </header>

      {/* ── Content ── */}
      <main className="mx-auto w-full max-w-[430px] flex-1 overflow-y-auto px-4 py-5 pb-28">

        {/* ═══ MATERIALES ═══ */}
        {activeTab === "materiales" && (
          <div className="space-y-4">
            <div>
              <p className="mb-3 text-[10px] font-black uppercase tracking-[0.16em] text-amiko-muted">
                Contenido de la tarea
              </p>
              <div className="rounded-3xl border border-blue-100 bg-white p-5 shadow-card">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-amiko-green">
                    Tarea original
                  </p>
                  <span className="shrink-0 rounded-full bg-amiko-mint px-3 py-0.5 text-[10px] font-black text-green-800">
                    Material oficial
                  </span>
                </div>
                <p className="text-base font-bold leading-7 text-amiko-ink">{task.original_text}</p>
                {task.subject && (
                  <p className="mt-3 text-[11px] font-bold text-amiko-muted">
                    Materia: {task.subject}
                  </p>
                )}
                <p className="mt-2 text-[10px] font-bold text-slate-400">
                  Subido por ti · No puede ser borrado por el estudiante
                </p>
              </div>
            </div>

            {task.adult_notes && (
              <div className="rounded-2xl bg-amiko-cream px-4 py-3">
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-amiko-navy">
                  Tus notas
                </p>
                <p className="mt-1.5 text-sm font-bold leading-6 text-amiko-ink">
                  {task.adult_notes}
                </p>
              </div>
            )}

            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-center">
              <AmikoIcon name="clip" className="mx-auto h-6 w-6 text-slate-300" />
              <p className="mt-2 text-sm font-black text-slate-400">
                Adjuntar más materiales
              </p>
              <p className="mt-0.5 text-xs font-bold text-slate-300">
                Foto, PDF o audio · Próximamente
              </p>
            </div>

            {!adaptation && (
              <button
                type="button"
                onClick={() => setActiveTab("amiko")}
                className="focus-ring flex w-full items-center justify-center gap-2 rounded-full bg-amiko-blue px-6 py-4 text-base font-black text-white shadow-card transition hover:brightness-95"
              >
                <AmikoIcon name="sparkles" className="h-5 w-5" />
                Adaptar esta tarea con Amiko
              </button>
            )}

            {adaptation && (
              <button
                type="button"
                onClick={() => setActiveTab("apoyos")}
                className="focus-ring flex w-full items-center justify-center gap-2 rounded-full bg-amiko-green px-6 py-4 text-base font-black text-white shadow-card transition hover:brightness-95"
              >
                <AmikoIcon name="sparkles" className="h-5 w-5" />
                Ver apoyos generados
              </button>
            )}
          </div>
        )}

        {/* ═══ AMIKO ═══ */}
        {activeTab === "amiko" && (
          <div className="flex flex-col gap-4">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  {msg.role === "amiko" && (
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amiko-blue shadow-sm">
                      <AmikoIcon name="chat" className="h-4 w-4 text-white" />
                    </span>
                  )}
                  <div
                    className={`max-w-[82%] rounded-2xl px-4 py-3 shadow-sm ${
                      msg.role === "user"
                        ? "rounded-br-none bg-amiko-blue text-white"
                        : "rounded-bl-none bg-white text-amiko-ink"
                    }`}
                  >
                    <p className="text-sm font-bold leading-6">{msg.text}</p>
                  </div>
                </div>
              ))}

              {typing && (
                <div className="flex items-end gap-2.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amiko-blue shadow-sm">
                    <AmikoIcon name="chat" className="h-4 w-4 text-white" />
                  </span>
                  <div className="rounded-2xl rounded-bl-none bg-white px-4 py-3.5 shadow-sm">
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="h-2 w-2 animate-bounce rounded-full bg-amiko-green"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>

            {chipsVisible && (
              <div>
                <p className="mb-2 text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                  Sugerencias rápidas
                </p>
                <div className="flex flex-wrap gap-2">
                  {CHIPS.map((chip) => (
                    <button
                      key={chip.label}
                      type="button"
                      onClick={() => handleSend(chip.api)}
                      disabled={typing}
                      className="focus-ring rounded-full border border-blue-100 bg-white px-3 py-2 text-xs font-black text-amiko-blue shadow-sm transition hover:bg-amiko-sky disabled:opacity-50"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 rounded-2xl border border-slate-100 bg-white p-2.5 shadow-card">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(inputText);
                  }
                }}
                placeholder="Pregunta algo sobre esta tarea…"
                disabled={typing}
                className="min-w-0 flex-1 rounded-xl bg-slate-50 px-3 py-2.5 text-sm font-bold text-amiko-ink outline-none placeholder:text-slate-400 disabled:opacity-60"
              />
              <button
                type="button"
                onClick={() => handleSend(inputText)}
                disabled={!inputText.trim() || typing}
                className="focus-ring flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amiko-blue text-white shadow-sm transition hover:brightness-95 disabled:opacity-40"
                aria-label="Enviar"
              >
                <AmikoIcon name="send" className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* ═══ APOYOS ═══ */}
        {activeTab === "apoyos" && (
          <div className="space-y-5">
            {adaptation ? (
              <>
                <div className="rounded-3xl bg-amiko-sky px-5 py-4 shadow-sm">
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-amiko-blue">
                    Resumen simple
                  </p>
                  <p className="mt-2 text-lg font-black leading-7 text-amiko-navy">
                    {adaptation.simple_summary}
                  </p>
                  <span className="mt-3 inline-block rounded-full bg-white px-3 py-1 text-[10px] font-black text-amiko-blue shadow-sm">
                    Dificultad {adaptation.difficulty_level}
                  </span>
                </div>

                <div>
                  <p className="mb-3 text-[10px] font-black uppercase tracking-[0.16em] text-amiko-muted">
                    Pasos para acompañar
                  </p>
                  <div className="space-y-3">
                    {adaptation.steps.map((step) => (
                      <article
                        key={step.number}
                        className="rounded-2xl border border-blue-100 bg-white p-4 shadow-card"
                      >
                        <div className="flex gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amiko-blue text-lg font-black text-white">
                            {step.number}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-black leading-6 text-amiko-ink">
                              {step.instruction}
                            </p>
                            <div className="mt-2.5 space-y-1.5">
                              <p className="rounded-xl bg-amiko-mint px-3 py-2 text-xs font-bold leading-5 text-green-900">
                                🖼️ {step.visual_support}
                              </p>
                              <p className="rounded-xl bg-amiko-cream px-3 py-2 text-xs font-bold leading-5 text-amiko-navy">
                                🤝 {step.adult_support}
                              </p>
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>

                {adaptation.emotional_support && (
                  <div className="rounded-2xl bg-amiko-green p-5 text-white">
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-green-100">
                      Para el momento difícil
                    </p>
                    <p className="mt-2 text-sm font-bold leading-6 text-green-50">
                      {adaptation.emotional_support}
                    </p>
                  </div>
                )}

                <div className="space-y-3 pt-1">
                  <Link
                    href={`/paso-a-paso/${task.id}`}
                    className="focus-ring flex w-full items-center justify-center gap-2 rounded-full bg-amiko-green px-6 py-4 text-base font-black text-white shadow-card transition hover:brightness-95"
                  >
                    <AmikoIcon name="play" className="h-5 w-5" />
                    Iniciar paso a paso
                  </Link>
                  <Link
                    href={`/mi-dia?taskId=${task.id}`}
                    className="focus-ring flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-4 text-base font-black text-amiko-navy shadow-sm transition hover:bg-slate-50"
                  >
                    <AmikoIcon name="journal" className="h-5 w-5" />
                    Registrar cómo fue
                  </Link>
                </div>
              </>
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center shadow-sm">
                <AmikoIcon name="sparkles" className="mx-auto h-10 w-10 text-slate-300" />
                <h3 className="mt-4 text-lg font-black text-amiko-ink">
                  Sin apoyos generados aún
                </h3>
                <p className="mt-2 text-sm font-bold leading-6 text-amiko-muted">
                  Habla con Amiko para adaptar esta tarea y generar los pasos de acompañamiento.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab("amiko")}
                  className="focus-ring mt-5 rounded-full bg-amiko-blue px-6 py-3 text-sm font-black text-white shadow-card transition hover:brightness-95"
                >
                  Ir a Amiko
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ── Bottom contextual tab bar ── */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-100 bg-white/95 shadow-[0_-4px_16px_rgba(23,32,46,0.07)] backdrop-blur-xl">
        <div className="mx-auto grid max-w-[430px] grid-cols-3 py-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              aria-current={activeTab === tab.id ? "page" : undefined}
              className="flex flex-col items-center gap-1 rounded-lg py-2"
            >
              <span
                className={`flex items-center justify-center rounded-full px-5 py-1.5 transition ${
                  activeTab === tab.id ? "bg-amiko-sky" : ""
                }`}
              >
                <AmikoIcon
                  name={tab.icon}
                  className={`h-6 w-6 transition ${
                    activeTab === tab.id ? "text-amiko-blue" : "text-slate-400"
                  }`}
                />
              </span>
              <span
                className={`text-[11px] font-black transition ${
                  activeTab === tab.id ? "text-amiko-blue" : "text-slate-400"
                }`}
              >
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
