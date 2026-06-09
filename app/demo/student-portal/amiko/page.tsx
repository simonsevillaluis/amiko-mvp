"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AmikoIcon } from "@/components/amiko-icon";
import { AmikoMark } from "@/components/student-portal-icons";
import { MermaidDiagram } from "@/components/mermaid-diagram";
import { Slideshow } from "@/components/slideshow";
import { childStudent } from "@/lib/student-mock-data";

type Message = {
  id: string;
  role: "amiko" | "user";
  text: string;
};

const STARTERS = [
  {
    id: "no-entendi",
    label: "No entendí esto",
    iconUrl: "https://img.icons8.com/3d-fluency/94/question-mark.png",
  },
  {
    id: "paso-a-paso",
    label: "Paso a paso",
    iconUrl: "https://img.icons8.com/3d-fluency/94/staircase.png",
  },
  {
    id: "pedir-ayuda",
    label: "Quiero pedir ayuda",
    iconUrl: "https://img.icons8.com/3d-fluency/94/hand.png",
  },
  {
    id: "mapa-mental",
    label: "Hacer un mapa mental",
    iconUrl: "https://img.icons8.com/3d-fluency/94/mind-map.png",
  },
];

// z-[60] > StudentShell nav (z-40) — covers fixed bottom nav
const OVERLAY =
  "fixed inset-0 z-[60] flex flex-col overflow-hidden bg-[#EDF4FF] text-amiko-ink sm:left-1/2 sm:right-auto sm:w-full sm:max-w-[430px] sm:-translate-x-1/2 sm:shadow-[0_24px_80px_rgba(9,54,124,0.24)]";

function renderMessageContent(text: string, key: string) {
  const parts: React.ReactNode[] = [];
  const blockRegex = /```mermaid\n([\s\S]*?)```|```slides\n([\s\S]*?)```|!\[(.*?)\]\((.*?)\)/g;
  let lastIndex = 0;
  let match;
  let i = 0;

  while ((match = blockRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<span key={`${key}-t${i++}`}>{text.substring(lastIndex, match.index)}</span>);
    }
    if (match[1] !== undefined) {
      parts.push(
        <span key={`${key}-m${i++}`} className="block">
          <MermaidDiagram code={match[1]} />
        </span>
      );
    } else if (match[2] !== undefined) {
      parts.push(
        <span key={`${key}-s${i++}`} className="block">
          <Slideshow code={match[2]} />
        </span>
      );
    } else {
      const alt = match[3];
      const src = match[4];
      parts.push(
        <span key={`${key}-img${i++}`} className="block my-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="w-full max-w-[240px] h-auto rounded-2xl border border-slate-100 bg-white p-1 shadow-sm"
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
        </span>
      );
    }
    lastIndex = blockRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(<span key={`${key}-t${i}`}>{text.substring(lastIndex)}</span>);
  }

  return parts.length > 0 ? parts : [<span key={`${key}-full`}>{text}</span>];
}

export default function DemoAmikoPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "amiko",
      text: `¡Hola, ${childStudent.name}! Soy Amiko. 😊 ¿En qué te puedo ayudar hoy?`,
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [showStarters, setShowStarters] = useState(true);
  const [plusOpen, setPlusOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    if (!text.trim() || loading) return;

    const userMsg: Message = { id: `u-${Date.now()}`, role: "user", text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputText("");
    setPlusOpen(false);
    setShowStarters(false);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: messages
            .filter((m) => m.id !== "welcome")
            .map((m) => ({ role: m.role === "amiko" ? "model" : "user", text: m.text })),
          studentName: childStudent.name,
          mode: "student",
        }),
      });

      const data = await res.json();
      let replyText: string;
      if (data.error) {
        const err = String(data.error);
        const isBusy = err.includes("503") || err.includes("429") || err.toLowerCase().includes("quota");
        replyText = isBusy
          ? "Ahora estoy ocupado. Intenta en unos segundos. 🙏"
          : "Algo falló. ¿Lo intentamos de nuevo?";
      } else {
        replyText = data.text ?? "No pude responder. ¿Lo intentamos?";
      }

      setMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, role: "amiko", text: replyText },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, role: "amiko", text: "Sin conexión. Intenta de nuevo. 🙏" },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={OVERLAY}>
      {/* Header */}
      <header className="shrink-0 border-b border-blue-100 bg-white/95 px-4 py-3 backdrop-blur-xl">
        <div className="grid grid-cols-[40px_1fr_40px] items-center gap-3">
          <button
            type="button"
            aria-label="Volver"
            onClick={() => router.back()}
            className="focus-ring flex h-10 w-10 items-center justify-center rounded-full text-amiko-navy transition hover:bg-amiko-sky"
          >
            <AmikoIcon name="back" className="h-6 w-6" />
          </button>
          <div className="flex items-center justify-center gap-2">
            <AmikoMark className="h-7 w-7 shrink-0" />
            <h1 className="text-lg font-black text-amiko-navy">Amiko</h1>
          </div>
          <button
            type="button"
            aria-label="Ayudas rápidas"
            aria-pressed={showStarters}
            onClick={() => setShowStarters((v) => !v)}
            className={`focus-ring flex h-10 w-10 items-center justify-center rounded-full transition ${
              showStarters ? "bg-amiko-mint text-amiko-green" : "text-amiko-navy hover:bg-amiko-sky"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://img.icons8.com/3d-fluency/94/idea.png"
              alt=""
              className="h-6 w-6 object-contain"
            />
          </button>
        </div>
      </header>

      {/* Messages */}
      <section className="flex-1 space-y-4 overflow-y-auto px-4 py-5">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-end gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
          >
            {message.role === "amiko" ? <AmikoMark className="h-9 w-9 shrink-0" /> : null}
            <div
              className={`max-w-[82%] rounded-2xl px-4 py-3 shadow-sm ${
                message.role === "user"
                  ? "rounded-br-none bg-amiko-navy text-white"
                  : "rounded-bl-none bg-white text-amiko-ink"
              }`}
            >
              <div className="whitespace-pre-wrap text-sm font-bold leading-6">
                {renderMessageContent(message.text, message.id)}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-end gap-3">
            <AmikoMark className="h-9 w-9 shrink-0" />
            <div className="rounded-2xl rounded-bl-none bg-white px-4 py-3 shadow-sm">
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-2.5 w-2.5 animate-bounce rounded-full bg-amiko-blue"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </section>

      {/* Quick starters panel */}
      {showStarters && (
        <div className="shrink-0 border-t border-slate-100 bg-white/90 px-4 py-3 backdrop-blur-sm">
          <p className="mb-2 text-[9px] font-black uppercase tracking-[0.14em] text-amiko-muted">
            Ayudas rápidas
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {STARTERS.map((starter) => (
              <button
                key={starter.id}
                type="button"
                onClick={() => send(starter.label)}
                disabled={loading}
                className="focus-ring flex shrink-0 items-center gap-2 rounded-full border border-amiko-blue/20 bg-amiko-sky px-3.5 py-2.5 text-xs font-black text-amiko-navy transition hover:bg-amiko-mint active:scale-95 disabled:opacity-50"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={starter.iconUrl} alt="" className="h-5 w-5 object-contain" />
                {starter.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input bar */}
      <footer className="shrink-0 border-t border-blue-100 bg-white/95 px-3 pb-4 pt-3 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Más opciones"
            onClick={() => setPlusOpen((v) => !v)}
            className="focus-ring flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-blue-100 bg-white text-amiko-blue transition hover:bg-amiko-sky"
          >
            <AmikoIcon name="plus" className="h-5 w-5" />
          </button>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                send(inputText);
              }
            }}
            placeholder="Escríbeme algo..."
            disabled={loading}
            className="min-w-0 flex-1 rounded-full border border-blue-100 bg-slate-50 px-4 py-3 text-sm font-bold text-amiko-ink placeholder:text-slate-400 outline-none focus:border-amiko-blue disabled:opacity-60"
          />
          <button
            type="button"
            onClick={() => send(inputText)}
            disabled={!inputText.trim() || loading}
            aria-label="Enviar mensaje"
            className="focus-ring flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amiko-green text-white shadow-card transition active:scale-90 disabled:opacity-40"
          >
            <AmikoIcon name="send" className="h-5 w-5" />
          </button>
        </div>
      </footer>

      {/* Plus menu popup */}
      {plusOpen && (
        <div
          className="fixed inset-0 z-[70] sm:left-1/2 sm:right-auto sm:w-full sm:max-w-[430px] sm:-translate-x-1/2"
          onClick={() => setPlusOpen(false)}
        >
          <div
            className="absolute bottom-20 left-4 w-56 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-soft"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => send("Tengo una foto de la tarea.")}
              className="flex w-full items-center gap-3 px-4 py-3.5 text-sm font-black text-amiko-ink transition hover:bg-slate-50"
            >
              <AmikoIcon name="image" className="h-4 w-4 text-amiko-blue" />
              Foto de la tarea
            </button>
            <div className="h-px bg-slate-100" />
            <button
              type="button"
              onClick={() => {
                setMessages([{
                  id: "welcome",
                  role: "amiko",
                  text: `¡Hola, ${childStudent.name}! Soy Amiko. 😊 ¿En qué te puedo ayudar hoy?`,
                }]);
                setShowStarters(true);
                setPlusOpen(false);
              }}
              className="flex w-full items-center gap-3 px-4 py-3.5 text-sm font-black text-amiko-ink transition hover:bg-slate-50"
            >
              <AmikoIcon name="close" className="h-4 w-4 text-amiko-muted" />
              Reiniciar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
