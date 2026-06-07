"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { AmikoMark } from "@/components/student-portal-icons";
import { AmikoIcon } from "@/components/amiko-icon";

type Message = {
  id: string;
  role: "amiko" | "user";
  text: string;
  options?: string[];
};

export default function AmikoPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m1",
      role: "amiko",
      text: "Hola. Soy Amiko. Puedo ayudarte a entender una tarea paso a paso.",
      options: [
        "No entiendo esta tarea",
        "Quiero ir paso a paso",
        "Necesito pedir ayuda",
      ],
    },
  ]);
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const handleOptionClick = useCallback((optionText: string) => {
    // 1. Add user message
    const userMsgId = `u_${Date.now()}`;
    setMessages((prev) => [
      ...prev.map((m) => ({ ...m, options: undefined })), // Remove previous options
      { id: userMsgId, role: "user", text: optionText },
    ]);
    setTyping(true);

    // 2. Simulate typing and add reply
    setTimeout(() => {
      setTyping(false);
      let replyText = "";
      let newOptions: string[] | undefined;

      if (optionText === "No entiendo esta tarea") {
        replyText = "¡No te preocupes! Vamos a dividirla en partes más pequeñas. Cuéntame, ¿de qué materia es tu tarea?";
        newOptions = ["Matemáticas 🔢", "Lectura 📖", "Ciencias 🔬"];
      } else if (optionText === "Matemáticas 🔢") {
        replyText = "¡Súper! Las matemáticas son divertidas paso a paso. He preparado tus sumas y restas en la lista de hoy. Ve a Inicio 📋 y tócala para comenzar.";
      } else if (optionText === "Lectura 📖") {
        replyText = "¡Excelente! Leer nos lleva a mundos mágicos. He dividido la historia en partes cortas. Ve a Inicio 📋 y selecciona la lectura.";
      } else if (optionText === "Ciencias 🔬") {
        replyText = "¡Perfecto! Vamos a descubrir cosas asombrosas sobre la naturaleza. Los pasos ya están listos. Ve a Inicio 📋 y empecemos.";
      } else if (optionText === "Quiero ir paso a paso") {
        replyText = "¡Me encanta esa idea! Ir paso a paso es la mejor forma de avanzar. Ve a la sección de Inicio 📋 y toca la tarea de hoy para empezar tu aventura.";
      } else if (optionText === "Necesito pedir ayuda") {
        replyText = "He enviado un aviso a tu tutor para que venga a acompañarte. Todo va a estar bien. ¡Quédate tranquilo! 🤝";
      } else {
        replyText = "¡Entendido! Si necesitas otra cosa, toca una opción o avísame.";
        newOptions = ["No entiendo esta tarea", "Quiero ir paso a paso", "Necesito pedir ayuda"];
      }

      setMessages((prev) => [
        ...prev,
        { id: `a_${Date.now()}`, role: "amiko", text: replyText, options: newOptions },
      ]);
    }, 1200);
  }, []);

  const latestMessage = messages[messages.length - 1];
  const currentOptions = latestMessage?.role === "amiko" && !typing ? latestMessage.options : undefined;

  return (
    <>
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EBF4FF] text-amiko-green shadow-sm">
          <AmikoIcon name="chat" className="h-5 w-5 text-amiko-green" />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-amiko-green leading-none">
            ASISTENTE
          </p>
          <h1 className="mt-1 text-2xl font-black text-amiko-ink">
            Amiko
          </h1>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.role === "user" ? "flex-row-reverse" : ""
            }`}
          >
            {msg.role === "amiko" && (
              <AmikoMark className="h-9 w-9 shrink-0 text-base" />
            )}
            <div
              className={`max-w-[82%] rounded-2xl px-4 py-3 shadow-sm ${
                msg.role === "user"
                  ? "rounded-tr-none bg-amiko-blue text-white"
                  : "rounded-tl-none bg-white text-amiko-ink"
              }`}
            >
              <p className="whitespace-pre-wrap text-base font-bold leading-7">
                {msg.text}
              </p>
            </div>
          </div>
        ))}

        {typing && (
          <div className="flex items-start gap-3">
            <AmikoMark className="h-9 w-9 shrink-0 text-base" />
            <div className="rounded-2xl rounded-tl-none bg-white px-4 py-3 shadow-sm">
              <div className="flex gap-1.5 py-1">
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

      {/* Options Stack */}
      {currentOptions && currentOptions.length > 0 && (
        <div className="mt-6 space-y-3">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-400">
            Toca una opcion:
          </p>
          <div className="flex flex-col gap-3">
            {currentOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => handleOptionClick(opt)}
                className="flex w-full items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-card hover:border-amiko-blue/20 hover:shadow-soft active:scale-[0.98] transition text-left"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amiko-sky text-amiko-blue">
                  <AmikoIcon name="chat" className="h-5 w-5" />
                </div>
                <span className="text-base font-black text-amiko-ink">
                  {opt}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Footer input simulation */}
      <div className="mt-8 flex items-center gap-3 rounded-2xl bg-white p-3 shadow-card border border-slate-100/60">
        <div className="flex-1 rounded-xl bg-slate-50 border border-slate-100 px-4 py-3 text-sm font-bold text-slate-400">
          Entrada guiada proximamente
        </div>
        <button
          type="button"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amiko-green text-white shadow-card transition hover:brightness-95 active:scale-90"
          aria-label="Micrófono (próximamente)"
        >
          <AmikoIcon name="mic" className="h-6 w-6" />
        </button>
        <button
          type="button"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amiko-blue text-white shadow-card transition hover:brightness-95 active:scale-90"
          aria-label="Cámara (próximamente)"
        >
          <AmikoIcon name="camera" className="h-6 w-6" />
        </button>
      </div>
    </>
  );
}
