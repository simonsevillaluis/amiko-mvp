"use client";

import { useState } from "react";
import { AmikoIcon } from "@/components/amiko-icon";
import { MermaidDiagram } from "@/components/mermaid-diagram";
import { Slideshow } from "@/components/slideshow";
import { AmikoMark, StudentPortalIcon } from "@/components/student-portal-icons";
import { childStudent } from "@/lib/student-mock-data";

type Message = {
  id: string;
  role: "amiko" | "user";
  text: string;
};

const starters = [
  { label: "No entendi esto", icon: "help" as const },
  { label: "Vamos paso a paso", icon: "task" as const },
  { label: "Quiero pedir ayuda", icon: "users" as const },
];

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
      // Mermaid block
      parts.push(
        <span key={`${key}-m${i++}`} className="block">
          <MermaidDiagram code={match[1]} />
        </span>
      );
    } else if (match[2] !== undefined) {
      // Slides block
      parts.push(
        <span key={`${key}-s${i++}`} className="block">
          <Slideshow code={match[2]} />
        </span>
      );
    } else {
      // Image markdown
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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "amiko",
      text: `¡Hola, ${childStudent.name}! Soy Amiko. 😊 ¿En qué te puedo ayudar hoy?`,
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [plusOpen, setPlusOpen] = useState(false);

  async function send(text: string) {
    if (!text.trim() || loading) return;

    const userMsg: Message = { id: `u-${Date.now()}`, role: "user", text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputText("");
    setPlusOpen(false);
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
          ? "Ahora estoy ocupado. Intenta en unos segundos."
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
    <>
      {plusOpen ? (
        <div
          className="fixed inset-0 z-50 sm:left-1/2 sm:right-auto sm:w-full sm:max-w-[430px] sm:-translate-x-1/2"
          onClick={() => setPlusOpen(false)}
        >
          <div
            className="absolute bottom-24 left-4 w-60 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-soft"
            onClick={(event) => event.stopPropagation()}
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
                setPlusOpen(false);
              }}
              className="flex w-full items-center gap-3 px-4 py-3.5 text-sm font-black text-amiko-ink transition hover:bg-slate-50"
            >
              <AmikoIcon name="close" className="h-4 w-4 text-amiko-muted" />
              Reiniciar
            </button>
          </div>
        </div>
      ) : null}

      <section className="mb-5 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amiko-sky text-amiko-green shadow-sm">
          <AmikoIcon name="chat" className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-black uppercase leading-none tracking-[0.14em] text-amiko-green">
            Asistente
          </p>
          <h1 className="mt-1 text-2xl font-black text-amiko-ink">Amiko</h1>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amiko-sky text-amiko-blue shadow-sm">
          <AmikoIcon name="shield" className="h-5 w-5" />
        </div>
      </section>

      <section className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-end gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
          >
            {message.role === "amiko" ? <AmikoMark className="h-9 w-9 shrink-0" /> : null}
            <div
              className={`max-w-[82%] rounded-2xl px-4 py-3 shadow-sm ${
                message.role === "user"
                  ? "rounded-br-none bg-amiko-blue text-white"
                  : "rounded-bl-none bg-white text-amiko-ink"
              }`}
            >
              <div className="whitespace-pre-wrap text-base font-bold leading-7">
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
      </section>

      <section className="mt-5 space-y-2">
        <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
          Elige una ayuda
        </p>
        {starters.map((starter) => (
          <button
            key={starter.label}
            type="button"
            onClick={() => send(starter.label)}
            disabled={loading}
            className="focus-ring flex w-full items-center gap-3 rounded-2xl bg-white p-4 text-left shadow-sm transition active:scale-[0.98] disabled:opacity-50"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amiko-sky text-amiko-blue">
              <StudentPortalIcon name={starter.icon} className="h-6 w-6" />
            </span>
            <span className="flex-1 text-base font-black text-amiko-ink">
              {starter.label}
            </span>
            <AmikoIcon name="chevron" className="h-4 w-4 text-slate-300" />
          </button>
        ))}
      </section>

      <section className="mt-6 flex items-center gap-2 rounded-2xl border border-slate-100/60 bg-white p-2.5 shadow-card">
        <button
          type="button"
          onClick={() => setPlusOpen((value) => !value)}
          className="focus-ring flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100"
          aria-label="Mas opciones"
        >
          <AmikoIcon name="plus" className="h-5 w-5" />
        </button>
        <input
          type="text"
          value={inputText}
          onChange={(event) => setInputText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              send(inputText);
            }
          }}
          placeholder="Escribeme algo..."
          disabled={loading}
          className="min-w-0 flex-1 rounded-xl bg-slate-50 px-3 py-2.5 text-sm font-bold text-amiko-ink outline-none placeholder:text-slate-400 disabled:opacity-60"
        />
        <button
          type="button"
          onClick={() => send(inputText)}
          disabled={!inputText.trim() || loading}
          className="focus-ring flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amiko-blue text-white shadow-card transition active:scale-90 disabled:opacity-40"
          aria-label="Enviar mensaje"
        >
          <AmikoIcon name="send" className="h-5 w-5" />
        </button>
      </section>
    </>
  );
}
