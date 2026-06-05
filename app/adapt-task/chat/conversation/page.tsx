"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AmikoIcon } from "@/components/amiko-icon";
import { student } from "@/lib/mock-data";

const MAX_MESSAGES = 10;

type Message = {
  id: string;
  role: "user" | "model";
  text: string;
};

type ModeKey = "tareas" | "calma" | "registro" | "mensajes";

const modeKeys: ModeKey[] = ["tareas", "calma", "registro", "mensajes"];

const modeFallbacks: Record<ModeKey, string> = {
  tareas: "No sabe empezar",
  calma: "Se frustró",
  registro: "Completó un paso",
  mensajes: "Para docente",
};

function getUserPrompt(mode: ModeKey, need: string) {
  if (mode === "calma") return `Necesito ayuda para acompañar con calma: ${need}.`;
  if (mode === "registro") return `Quiero registrar esto de hoy: ${need}.`;
  if (mode === "mensajes") return `Quiero preparar un mensaje: ${need}.`;
  return `La tarea necesita apoyo: ${need}.`;
}

const contextOptions = [
  { title: `Perfil de ${student.name}`, description: "Preferencias de apoyo y forma de presentar los pasos." },
  { title: "Tarea compartida", description: "La consigna o imagen que agregues en esta conversación." },
  { title: "Registros recientes", description: "Solo para recordar qué apoyos funcionaron antes." },
];

export default function ConversationPage() {
  const [showContext, setShowContext] = useState(false);
  const [showPremiumImage, setShowPremiumImage] = useState(false);
  const [enabledContext, setEnabledContext] = useState([true, true, false]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [userMessageCount, setUserMessageCount] = useState(0);
  const [mode, setMode] = useState<ModeKey>("tareas");
  const bottomRef = useRef<HTMLDivElement>(null);

  const limitReached = userMessageCount >= MAX_MESSAGES;

  // Parse URL params and show only greeting
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const modeParam = params.get("mode");
    const resolvedMode = modeKeys.includes(modeParam as ModeKey)
      ? (modeParam as ModeKey)
      : "tareas";

    setMode(resolvedMode);

    const greetings: Record<ModeKey, string> = {
      tareas: `Hola, Luis. Cuéntame qué necesita ${student.name} y buscamos juntos un primer paso.`,
      calma: `Hola, Luis. ¿Cómo estás? Cuéntame qué está pasando y buscamos una forma de retomar con calma.`,
      registro: `Hola, Luis. ¿Cómo fue la actividad de hoy? Cuéntame y lo organizamos juntos.`,
      mensajes: `Hola, Luis. ¿A quién necesitas escribirle? Cuéntame y preparamos el mensaje juntos.`,
    };

    setMessages([{
      id: "greeting",
      role: "model",
      text: greetings[resolvedMode],
    }]);
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Disable body scroll when context panel is open
  useEffect(() => {
    if (!showContext) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [showContext]);

  async function sendToGemini(text: string, history: Message[]) {
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: history
            .filter((m) => m.id !== "greeting")
            .map((m) => ({ role: m.role, text: m.text })),
          studentName: student.name,
          mode,
        }),
      });

      const data = await res.json();

      if (data.error) {
        // Mensaje amigable al estilo Amiko para cuotas, caídas o errores de API
        const amikoFriendlyError = "¡Uy! En este momento mi cabecita está procesando muchas cosas a la vez y me cansé un poquito. 🧠✨ ¿Podrías intentar enviarme tu mensaje de nuevo en unos segundos? ¡Aquí te espero con gusto!";
        
        setMessages((prev) => [
          ...prev,
          { id: Date.now().toString(), role: "model", text: amikoFriendlyError },
        ]);
        return;
      }

      const replyText = data.text ?? "No pude procesar tu mensaje.";

      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: "model", text: replyText },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: "model", text: "¡Uy! Parece que hubo un pequeño problema de conexión. ¿Volvemos a intentarlo en unos segundos?" },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSend() {
    const text = input.trim();
    if (!text || loading || limitReached) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", text };
    const newCount = userMessageCount + 1;

    setInput("");
    setUserMessageCount(newCount);
    setMessages((prev) => [...prev, userMsg]);

    if (newCount >= MAX_MESSAGES) {
      setMessages((prev) => [...prev, userMsg]);
      return;
    }

    await sendToGemini(text, [...messages, userMsg]);
  }

  function toggleContext(index: number) {
    setEnabledContext((prev) =>
      prev.map((v, i) => (i === index ? !v : v))
    );
  }

  return (
    <main className="min-h-dvh bg-slate-100">
      <div className="mx-auto flex min-h-dvh max-w-[430px] flex-col bg-[#EDF4FF] shadow-soft">

        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-blue-100 bg-white/95 px-4 py-3 backdrop-blur-xl">
          <div className="grid grid-cols-[40px_1fr_40px] items-center gap-3">
            <Link
              href="/adapt-task/chat"
              aria-label="Volver"
              className="focus-ring flex h-10 w-10 items-center justify-center rounded-full text-amiko-navy transition hover:bg-amiko-sky"
            >
              <AmikoIcon name="back" className="h-6 w-6" />
            </Link>
            <div className="text-center">
              <h1 className="text-lg font-black text-amiko-navy">Amiko IA</h1>
              {userMessageCount > 0 && (
                <p className="text-[10px] font-bold text-amiko-muted">
                  {MAX_MESSAGES - userMessageCount} mensajes restantes
                </p>
              )}
            </div>
            <button
              type="button"
              aria-label="Ver contexto"
              aria-expanded={showContext}
              onClick={() => setShowContext((v) => !v)}
              className={`focus-ring flex h-10 w-10 items-center justify-center rounded-full transition ${
                showContext ? "bg-amiko-mint text-green-800" : "text-amiko-navy hover:bg-amiko-sky"
              }`}
            >
              <AmikoIcon name="shield" className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Messages */}
        <section className="flex-1 space-y-4 overflow-y-auto px-4 py-5 pb-24">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              {msg.role === "model" && (
                <Image
                  src="/amiko-character/amiko-icon.svg"
                  alt=""
                  width={36}
                  height={36}
                  className="mt-1 h-9 w-9 shrink-0 object-contain"
                />
              )}
              <div
                className={`max-w-[82%] rounded-2xl px-4 py-3 shadow-sm ${
                  msg.role === "user"
                    ? "rounded-tr-sm bg-amiko-navy text-white"
                    : "rounded-tl-sm bg-white text-amiko-ink"
                }`}
              >
                <p className="whitespace-pre-wrap text-sm font-bold leading-6">{msg.text}</p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-start gap-3">
              <Image
                src="/amiko-character/amiko-icon.svg"
                alt=""
                width={36}
                height={36}
                className="mt-1 h-9 w-9 shrink-0 object-contain"
              />
              <div className="rounded-2xl rounded-tl-sm bg-white px-4 py-3 shadow-sm">
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="h-2 w-2 animate-bounce rounded-full bg-amiko-blue"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Limit reached card — shown in chat area */}
          {limitReached && (
            <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-amiko-navy to-[#082A61] p-5 text-white shadow-soft">
              <div className="mb-3 flex items-center gap-3">
                <Image
                  src="/amiko-character/amiko-icon.svg"
                  alt=""
                  width={40}
                  height={40}
                  className="h-10 w-10 shrink-0 object-contain"
                />
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-blue-200">
                    Créditos de hoy
                  </p>
                  <h3 className="mt-0.5 text-lg font-black leading-tight">
                    Agotaste tus mensajes de hoy
                  </h3>
                </div>
              </div>
              <p className="mb-4 text-sm font-bold leading-6 text-blue-100">
                Vuelve mañana con créditos renovados, o accede a <strong className="text-white">Amiko Premium</strong> para conversaciones sin límite.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/settings"
                  className="focus-ring flex min-h-11 items-center justify-center rounded-full bg-amiko-green px-4 text-sm font-black text-white shadow-card transition hover:brightness-95"
                >
                  Ver Premium
                </Link>
                <Link
                  href="/adapt-task/chat"
                  className="focus-ring flex min-h-11 items-center justify-center rounded-full border-2 border-white/30 bg-white/10 px-4 text-sm font-black text-white transition hover:bg-white/20"
                >
                  Volver mañana
                </Link>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </section>

        {/* Input */}
        <footer className="fixed bottom-0 left-1/2 z-20 w-full max-w-[430px] -translate-x-1/2 border-t border-blue-100 bg-white/95 px-3 pb-4 pt-3 backdrop-blur-xl">
          {limitReached ? (
            <div className="rounded-2xl bg-gradient-to-r from-amiko-navy/10 to-amiko-blue/10 px-4 py-3 text-center">
              <p className="text-xs font-black text-amiko-navy">
                Créditos de hoy agotados · <Link href="/settings" className="text-amiko-green underline">Ver Premium</Link>
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Adjuntar"
                onClick={() => setShowPremiumImage(true)}
                className="focus-ring flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-blue-100 bg-white text-amiko-blue transition hover:bg-amiko-sky"
              >
                <AmikoIcon name="plus" className="h-5 w-5" />
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Escribe una tarea o cuéntame qué pasó..."
                className="min-w-0 flex-1 rounded-full border border-blue-100 bg-slate-50 px-4 py-3 text-sm font-bold text-amiko-ink placeholder:text-slate-400 outline-none focus:border-amiko-blue"
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={!input.trim() || loading}
                aria-label="Enviar"
                className="focus-ring flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amiko-green text-white shadow-card transition disabled:opacity-40"
              >
                <AmikoIcon name="send" className="h-5 w-5" />
              </button>
            </div>
          )}
        </footer>
      </div>

      {/* Premium image modal */}
      {showPremiumImage && (
        <div
          className="fixed inset-0 z-[100] flex touch-none items-center justify-center overflow-hidden overscroll-none bg-[#161616]/85 px-5 py-4 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          onClick={() => setShowPremiumImage(false)}
        >
          <div
            className="w-full max-w-[330px] overflow-hidden rounded-3xl bg-white shadow-soft"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header gradient */}
            <div className="bg-gradient-to-br from-amiko-navy to-[#082A61] px-5 py-6 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
                <AmikoIcon name="camera" className="h-7 w-7 text-white" />
              </span>
              <h2 className="mt-3 text-xl font-black text-white">
                Sube al Plan Premium
              </h2>
              <p className="mt-1.5 text-sm font-bold leading-5 text-blue-200">
                Sube fotos de tareas y obtén un análisis visual detallado con Amiko.
              </p>
            </div>

            {/* Benefits */}
            <div className="px-5 py-4">
              <div className="space-y-2.5">
                {[
                  "Fotos y archivos ilimitados",
                  "Conversaciones sin límite de mensajes",
                  "Análisis visual de tareas escolares",
                  "Historial completo de adaptaciones",
                ].map((benefit) => (
                  <div key={benefit} className="flex items-center gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amiko-mint text-amiko-green">
                      <AmikoIcon name="check" className="h-3 w-3" />
                    </span>
                    <span className="text-sm font-bold text-amiko-ink">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <Link
                  href="/settings"
                  className="focus-ring flex min-h-11 items-center justify-center rounded-full bg-amiko-green px-4 text-sm font-black text-white shadow-card transition hover:brightness-95"
                >
                  Ver Premium
                </Link>
                <button
                  type="button"
                  onClick={() => setShowPremiumImage(false)}
                  className="focus-ring min-h-11 rounded-full border-2 border-amiko-navy px-4 text-sm font-black text-amiko-navy transition hover:bg-amiko-sky"
                >
                  Ahora no
                </button>
              </div>
              <p className="mt-3 text-center text-xs font-bold text-amiko-muted">
                Próximamente disponible
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Context panel */}
      {showContext && (
        <div
          className="fixed inset-0 z-[100] flex touch-none items-start justify-center overflow-hidden overscroll-none bg-[#161616]/70 px-4 pt-[68px] backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          onClick={() => setShowContext(false)}
        >
          <section
            className="w-full max-w-[400px] rounded-3xl bg-white p-5 shadow-soft"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amiko-sky text-amiko-blue">
                <AmikoIcon name="shield" className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="font-black text-amiko-ink">Información que Amiko puede usar</h2>
                <p className="mt-1 text-xs font-bold leading-5 text-amiko-muted">
                  Tú decides qué contexto ayuda. No pedimos datos clínicos.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowContext(false)}
                className="focus-ring flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-amiko-muted"
              >
                <AmikoIcon name="close" className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2">
              {contextOptions.map((opt, i) => (
                <button
                  key={opt.title}
                  type="button"
                  aria-pressed={enabledContext[i]}
                  onClick={() => toggleContext(i)}
                  className="focus-ring flex w-full items-center gap-3 rounded-2xl bg-slate-50 px-3 py-3 text-left transition hover:bg-amiko-sky/40"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-black text-amiko-ink">{opt.title}</span>
                    <span className="mt-0.5 block text-xs font-bold leading-5 text-amiko-muted">{opt.description}</span>
                  </span>
                  <span className={`relative h-7 w-12 shrink-0 rounded-full transition ${enabledContext[i] ? "bg-amiko-green" : "bg-slate-300"}`}>
                    <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-all ${enabledContext[i] ? "left-6" : "left-1"}`} />
                  </span>
                </button>
              ))}
            </div>
            <p className="mt-3 text-center text-xs font-bold text-amiko-muted">Toca fuera para cerrar</p>
          </section>
        </div>
      )}
    </main>
  );
}
