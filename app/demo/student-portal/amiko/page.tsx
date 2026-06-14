"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AmikoIcon, type AmikoIconName } from "@/components/amiko-icon";
import { AmikoMark } from "@/components/student-portal-icons";

type Message = {
  id: string;
  role: "amiko" | "user";
  text: string;
};

type Starter = {
  id: string;
  label: string;
  prompt: string;
  icon: AmikoIconName;
};

const STARTERS: Starter[] = [
  {
    id: "paso",
    label: "No entendi el paso",
    prompt: "No entendi este paso. Ayudame con una cosa a la vez.",
    icon: "help",
  },
  {
    id: "ordenar",
    label: "Vamos paso a paso",
    prompt: "Ayudame a ordenar esta tarea paso a paso.",
    icon: "task",
  },
  {
    id: "adulto",
    label: "Avisar a mi adulto",
    prompt: "Quiero pedir ayuda a mi adulto para esta tarea.",
    icon: "users",
  },
  {
    id: "pausa",
    label: "Necesito una pausa",
    prompt: "Necesito una pausa corta antes de seguir.",
    icon: "calm",
  },
];

const OVERLAY =
  "fixed inset-0 z-[60] flex flex-col overflow-hidden bg-[#EDF4FF] text-amiko-ink sm:left-1/2 sm:right-auto sm:w-full sm:max-w-[430px] sm:-translate-x-1/2 sm:shadow-[0_24px_80px_rgba(9,54,124,0.24)]";

function getDemoReply(text: string) {
  const normalized = text.toLowerCase();

  if (normalized.includes("pausa") || normalized.includes("calma")) {
    return "Hagamos una pausa corta. Respira lento tres veces. Luego decides con tu adulto si sigues.";
  }

  if (normalized.includes("adulto") || normalized.includes("ayuda")) {
    return "Puedo ayudarte a pedir apoyo. Di: necesito que revisemos este paso juntos.";
  }

  if (normalized.includes("paso") || normalized.includes("ordenar")) {
    return "Vamos con una sola cosa: lee la primera instruccion. Despues dime que palabra no entiendes.";
  }

  return "Estoy contigo. Cuentame que parte se trabo y buscamos un primer paso claro.";
}

export default function DemoAmikoPage() {
  const pathname = usePathname();
  const basePath = pathname.startsWith("/student-portal") ? "/student-portal" : "/demo/student-portal";
  const isDemo = basePath.startsWith("/demo");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "amiko",
      text: "Hola. Soy Amiko. Estoy aqui para ayudarte con la tarea.",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [showStarters, setShowStarters] = useState(true);
  const [plusOpen, setPlusOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    const cleanText = text.trim();
    if (!cleanText || loading) return;

    idRef.current += 1;
    const userMsg: Message = { id: `u-${idRef.current}`, role: "user", text: cleanText };
    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setPlusOpen(false);
    setShowStarters(false);
    setLoading(true);

    if (isDemo) {
      window.setTimeout(() => {
        idRef.current += 1;
        setMessages((prev) => [
          ...prev,
          { id: `a-${idRef.current}`, role: "amiko", text: getDemoReply(cleanText) },
        ]);
        setLoading(false);
      }, 450);
      return;
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: cleanText,
          history: messages
            .filter((m) => m.id !== "welcome")
            .map((m) => ({ role: m.role === "amiko" ? "model" : "user", text: m.text })),
          studentName: undefined,
          mode: "student",
        }),
      });

      const data = await res.json();
      const replyText = data.error
        ? "Ahora no pude responder bien. Intentemos de nuevo en un momento."
        : data.text ?? "No pude responder. Intentemos otra vez.";

      setMessages((prev) => [
        ...prev,
        { id: `a-${idRef.current + 1}`, role: "amiko", text: replyText },
      ]);
      idRef.current += 1;
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: `a-${idRef.current + 1}`, role: "amiko", text: "Sin conexion. Intentemos de nuevo." },
      ]);
      idRef.current += 1;
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={OVERLAY}>
      <header className="shrink-0 border-b border-blue-100 bg-white/95 px-4 py-3 backdrop-blur-xl">
        <div className="grid grid-cols-[40px_1fr_40px] items-center gap-3">
          <Link
            aria-label="Volver"
            href={basePath}
            className="focus-ring flex h-10 w-10 items-center justify-center rounded-full text-amiko-navy transition hover:bg-amiko-sky"
          >
            <AmikoIcon name="back" className="h-6 w-6" />
          </Link>
          <div className="flex items-center justify-center gap-2">
            <AmikoMark className="h-7 w-7 shrink-0" />
            <h1 className="text-lg font-black text-amiko-navy">Amiko IA</h1>
          </div>
          <button
            type="button"
            aria-label="Ver ayudas"
            aria-pressed={showStarters}
            onClick={() => setShowStarters((value) => !value)}
            className={`focus-ring flex h-10 w-10 items-center justify-center rounded-full transition ${
              showStarters ? "bg-amiko-navy text-white shadow-sm" : "bg-amiko-sky/70 text-amiko-blue hover:bg-amiko-sky"
            }`}
          >
            <AmikoIcon name="sparkles" className="h-5 w-5" />
          </button>
        </div>
      </header>

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
              <p className="whitespace-pre-wrap text-sm font-bold leading-6">{message.text}</p>
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

      {showStarters && (
        <div className="shrink-0 border-t border-slate-100 bg-white/90 px-4 py-3 backdrop-blur-sm">
          <p className="mb-2 text-[9px] font-black uppercase tracking-[0.14em] text-amiko-muted">
            Ayudas para esta conversacion
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {STARTERS.map((starter) => (
              <button
                key={starter.id}
                type="button"
                onClick={() => send(starter.prompt)}
                disabled={loading}
                className="focus-ring flex shrink-0 items-center gap-2 rounded-full border border-amiko-blue/20 bg-amiko-sky px-3.5 py-2.5 text-xs font-black text-amiko-navy transition hover:bg-amiko-mint active:scale-95 disabled:opacity-50"
              >
                <AmikoIcon name={starter.icon} className="h-4 w-4 text-amiko-blue" />
                {starter.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <footer className="shrink-0 border-t border-blue-100 bg-white/95 px-3 pb-4 pt-3 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Mas opciones"
            onClick={() => setPlusOpen((value) => !value)}
            className="focus-ring flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-blue-100 bg-white text-amiko-blue transition hover:bg-amiko-sky"
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

      {plusOpen && (
        <div
          className="fixed inset-0 z-[70] sm:left-1/2 sm:right-auto sm:w-full sm:max-w-[430px] sm:-translate-x-1/2"
          onClick={() => setPlusOpen(false)}
        >
          <div
            className="absolute bottom-20 left-4 w-60 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-soft"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => send("Tengo una foto de la tarea y necesito ayuda para empezar.")}
              className="flex w-full items-center gap-3 px-4 py-3.5 text-sm font-black text-amiko-ink transition hover:bg-slate-50"
            >
              <AmikoIcon name="image" className="h-4 w-4 text-amiko-blue" />
              Foto de la tarea
            </button>
            <div className="h-px bg-slate-100" />
            <button
              type="button"
              onClick={() => send("Quiero contar que parte de la tarea se me hizo dificil.")}
              className="flex w-full items-center gap-3 px-4 py-3.5 text-sm font-black text-amiko-ink transition hover:bg-slate-50"
            >
              <AmikoIcon name="chat" className="h-4 w-4 text-amiko-green" />
              Contar que paso
            </button>
            <div className="h-px bg-slate-100" />
            <button
              type="button"
              onClick={() => {
                setMessages([
                  {
                    id: "welcome",
                    role: "amiko",
                    text: "Hola. Soy Amiko. Estoy aqui para ayudarte con la tarea.",
                  },
                ]);
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
