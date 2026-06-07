"use client";

import { useCallback, useRef, useState } from "react";

type Message = {
  id: string;
  from: "amiko" | "user";
  text: string;
};

const initialMessages: Message[] = [
  {
    id: "m1",
    from: "amiko",
    text: "¡Hola! Soy Amiko 🤖 Cuéntame tu tarea y te ayudo a entenderla paso a paso.",
  },
];

export default function AmikoPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const counterRef = useRef(0);

  const handleQuickReply = useCallback((text: string) => {
    const id = ++counterRef.current;
    const userMsg: Message = { id: `u_${id}`, from: "user", text };
    const amikoReply: Message = {
      id: `a_${id}`,
      from: "amiko",
      text: "¡Entendido! Voy a dividir esa tarea en pasos más sencillos para ti. Ve a Inicio y toca la tarea para empezar tu aventura. 🚀",
    };
    setMessages((prev) => [...prev, userMsg, amikoReply]);
  }, []);

  return (
    <>
      <div className="mb-4 flex items-center gap-2">
        <span className="text-xl">💬</span>
        <h1 className="text-2xl font-black text-amiko-ink">Amiko</h1>
      </div>

      {/* Chat messages */}
      <div className="space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.from === "amiko" && (
              <div className="mr-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amiko-mint text-base">
                🤖
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-base font-bold leading-7 shadow-sm ${
                msg.from === "user"
                  ? "rounded-tr-none bg-amiko-blue text-white"
                  : "rounded-tl-none bg-white text-amiko-ink"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Quick replies */}
      <div className="mt-6 space-y-3">
        <p className="text-sm font-black text-amiko-muted">Toca para decir:</p>
        {[
          "No entiendo mi tarea de matemáticas",
          "Tengo que leer un cuento",
          "Necesito ayuda con ciencias",
        ].map((reply) => (
          <button
            key={reply}
            type="button"
            onClick={() => handleQuickReply(reply)}
            className="flex w-full items-center gap-3 rounded-2xl bg-white p-4 text-left shadow-card transition active:scale-[0.98]"
          >
            <span className="text-lg">💬</span>
            <span className="font-bold text-amiko-ink">{reply}</span>
          </button>
        ))}
      </div>

      {/* Input bar (decorative with mic icon) */}
      <div className="mt-6 flex items-center gap-3 rounded-2xl bg-white p-3 shadow-card">
        <div className="flex-1 rounded-xl bg-amiko-sky px-4 py-3 text-sm text-amiko-muted">
          Escribe o habla con Amiko...
        </div>
        <button
          type="button"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amiko-green text-xl shadow-card transition active:scale-90"
          aria-label="Micrófono (próximamente)"
        >
          🎤
        </button>
        <button
          type="button"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amiko-blue text-xl shadow-card transition active:scale-90"
          aria-label="Cámara (próximamente)"
        >
          📷
        </button>
      </div>
    </>
  );
}
