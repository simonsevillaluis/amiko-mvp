"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AmikoMark } from "@/components/student-portal-icons";
import { AmikoIcon } from "@/components/amiko-icon";
import { childStudent } from "@/lib/student-mock-data";

// ─── Types ────────────────────────────────────────────────────────────────────

type OptionCard = {
  /** Text sent to the API as the user's message */
  apiText: string;
  /** Short label shown in the UI bubble and card */
  label: string;
  emoji: string;
  sub?: string;
  /** Tailwind left-border color class */
  accent: string;
};

type Message = {
  id: string;
  role: "amiko" | "user";
  text: string;
  options?: OptionCard[];
};

// ─── Initial data ─────────────────────────────────────────────────────────────

const WELCOME_OPTIONS: OptionCard[] = [
  {
    apiText: "No entiendo mi tarea. Necesito ayuda para entenderla.",
    label: "No entendí esto",
    emoji: "🤔",
    sub: "Cuéntame y lo vemos juntos",
    accent: "border-l-amber-400",
  },
  {
    apiText: "Quiero hacer mi tarea yendo de a poquito, paso a paso.",
    label: "Vamos de a poquito",
    emoji: "🐢",
    sub: "Te guío paso por paso",
    accent: "border-l-amiko-green",
  },
  {
    apiText: "Necesito que avises a un adulto para que me ayude con algo.",
    label: "Quiero pedir ayuda",
    emoji: "🙋",
    sub: "Aviso a un adulto por ti",
    accent: "border-l-amiko-blue",
  },
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: "welcome",
    role: "amiko",
    text: `¡Hola! 👋 Soy Amiko. Estoy aquí para ayudarte. ¿Qué necesitas hoy?`,
    options: WELCOME_OPTIONS,
  },
];

// ─── TTS helper (module-level, pure — never called during render) ──────────────

function speakText(text: string, onDone: () => void) {
  if (!("speechSynthesis" in window)) {
    onDone();
    return;
  }
  window.speechSynthesis.cancel();
  // Strip emojis so the voice doesn't read Unicode code names
  const clean = text
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
  const utt = new SpeechSynthesisUtterance(clean);
  utt.lang = "es-ES";
  utt.rate = 0.9;
  utt.pitch = 1.05;
  utt.onend = onDone;
  utt.onerror = onDone;
  window.speechSynthesis.speak(utt);
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DemoAmikoPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [typing, setTyping] = useState(false);
  const [inputText, setInputText] = useState("");
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [plusOpen, setPlusOpen] = useState(false);

  // Ref so stable callbacks can always read the latest messages without
  // needing them as a dep (avoids recreating handlers on every keystroke).
  const messagesRef = useRef<Message[]>(INITIAL_MESSAGES);
  useEffect(() => { messagesRef.current = messages; }, [messages]);

  // Auto-scroll to the bottom on new messages or typing indicator
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  // ── API call ────────────────────────────────────────────────────────────────

  const callApi = useCallback(
    async (userText: string, prevMessages: Message[]): Promise<string> => {
      const chatHistory = prevMessages
        .slice(1) // skip the initial welcome message
        .map((m) => ({ role: m.role === "amiko" ? "model" : "user", text: m.text }));

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: userText,
            history: chatHistory,
            studentName: childStudent.name,
            mode: "student",
          }),
        });
        const json = (await res.json()) as { text?: string; error?: string };
        return json.text ?? "¡Ups! Algo salió mal. ¿Lo intentamos de nuevo? 🙏";
      } catch {
        return "No pude conectarme ahora. ¿Lo intentamos de nuevo? 🙏";
      }
    },
    [],
  );

  // ── Append Amiko reply ──────────────────────────────────────────────────────

  const appendAmikoReply = useCallback((replyText: string) => {
    const msgId = `a_${Date.now()}`;
    setTyping(false);
    setMessages((prev) => [
      ...prev,
      { id: msgId, role: "amiko" as const, text: replyText },
    ]);
  }, []);

  // ── Option card clicked ─────────────────────────────────────────────────────

  const handleOptionClick = useCallback(
    (option: OptionCard) => {
      const history = messagesRef.current;
      const msgId = `u_${Date.now()}`;

      setMessages((prev) => [
        ...prev.map((m) => ({ ...m, options: undefined })),
        { id: msgId, role: "user" as const, text: option.label },
      ]);
      setTyping(true);
      callApi(option.apiText, history).then(appendAmikoReply);
    },
    [callApi, appendAmikoReply],
  );

  // ── Free-text send ──────────────────────────────────────────────────────────

  const handleSend = useCallback(() => {
    const text = inputText.trim();
    if (!text || typing) return;

    const history = messagesRef.current;
    const msgId = `u_${Date.now()}`;

    setMessages((prev) => [
      ...prev.map((m) => ({ ...m, options: undefined })),
      { id: msgId, role: "user" as const, text },
    ]);
    setInputText("");
    setTyping(true);
    callApi(text, history).then(appendAmikoReply);
  }, [inputText, typing, callApi, appendAmikoReply]);

  // ── Text-to-speech ──────────────────────────────────────────────────────────

  const handleSpeak = useCallback(
    (id: string, text: string) => {
      if (speakingId === id) {
        window.speechSynthesis?.cancel();
        setSpeakingId(null);
        return;
      }
      setSpeakingId(id);
      speakText(text, () => setSpeakingId(null));
    },
    [speakingId],
  );

  // ── Reset conversation ──────────────────────────────────────────────────────

  const handleReset = useCallback(() => {
    window.speechSynthesis?.cancel();
    setSpeakingId(null);
    setMessages(INITIAL_MESSAGES);
    setInputText("");
    setTyping(false);
    setPlusOpen(false);
  }, []);

  // ── Derived state ───────────────────────────────────────────────────────────

  const latestMsg = messages[messages.length - 1];
  const currentOptions =
    !typing && latestMsg?.role === "amiko" ? latestMsg.options : undefined;

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Plus action sheet */}
      {plusOpen && (
        <div className="fixed inset-0 z-50" onClick={() => setPlusOpen(false)}>
          <div
            className="absolute bottom-24 left-4 w-56 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-soft"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={handleReset}
              className="flex w-full items-center gap-3 px-4 py-3.5 text-sm font-black text-amiko-ink transition hover:bg-slate-50"
            >
              <AmikoIcon name="close" className="h-4 w-4 text-amiko-muted" />
              Reiniciar conversación
            </button>
            <div className="h-px bg-slate-100" />
            <button
              type="button"
              onClick={() => {
                setPlusOpen(false);
                router.push("/demo/student-portal");
              }}
              className="flex w-full items-center gap-3 px-4 py-3.5 text-sm font-black text-amiko-ink transition hover:bg-slate-50"
            >
              <AmikoIcon name="home" className="h-4 w-4 text-amiko-muted" />
              Volver al inicio
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EBF4FF] shadow-sm">
          <AmikoIcon name="chat" className="h-5 w-5 text-amiko-green" />
        </div>
        <div className="flex-1">
          <p className="text-[10px] font-black uppercase leading-none tracking-[0.14em] text-amiko-green">
            ASISTENTE
          </p>
          <h1 className="mt-1 text-2xl font-black text-amiko-ink">Amiko</h1>
        </div>
        <button
          type="button"
          onClick={() => router.push("/demo/student-portal/recursos")}
          className="focus-ring flex h-10 w-10 items-center justify-center rounded-full bg-amiko-sky text-amiko-blue shadow-sm transition hover:brightness-95"
          aria-label="Recursos y seguridad"
        >
          <AmikoIcon name="shield" className="h-5 w-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-end gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            {msg.role === "amiko" && <AmikoMark className="h-9 w-9 shrink-0" />}

            <div
              className={`flex max-w-[82%] flex-col gap-1 ${
                msg.role === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`rounded-2xl px-4 py-3 shadow-sm ${
                  msg.role === "user"
                    ? "rounded-br-none bg-amiko-blue text-white"
                    : "rounded-bl-none bg-white text-amiko-ink"
                }`}
              >
                <p className="whitespace-pre-wrap text-base font-bold leading-7">{msg.text}</p>
              </div>

              {/* TTS button below each Amiko message */}
              {msg.role === "amiko" && (
                <button
                  type="button"
                  onClick={() => handleSpeak(msg.id, msg.text)}
                  className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-black transition ${
                    speakingId === msg.id
                      ? "text-amiko-green"
                      : "text-slate-400 hover:text-amiko-blue"
                  }`}
                  aria-label={speakingId === msg.id ? "Detener audio" : "Escuchar mensaje"}
                >
                  <SpeakerIcon active={speakingId === msg.id} />
                  {speakingId === msg.id ? "Detener" : "Escuchar"}
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {typing && (
          <div className="flex items-end gap-3">
            <AmikoMark className="h-9 w-9 shrink-0" />
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

      {/* Option cards */}
      {currentOptions && currentOptions.length > 0 && (
        <div className="mt-5 space-y-2">
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
            Toca una opción:
          </p>
          <div className="flex flex-col gap-2.5">
            {currentOptions.map((opt) => (
              <button
                key={opt.apiText}
                type="button"
                onClick={() => handleOptionClick(opt)}
                className={`flex w-full items-center gap-4 rounded-2xl border-l-4 bg-white p-4 text-left shadow-sm transition hover:shadow-card active:scale-[0.98] ${opt.accent}`}
              >
                <span className="text-3xl leading-none">{opt.emoji}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-base font-black text-amiko-ink">{opt.label}</span>
                  {opt.sub && (
                    <span className="mt-0.5 block text-xs font-bold text-amiko-muted">
                      {opt.sub}
                    </span>
                  )}
                </span>
                <AmikoIcon name="chevron" className="h-4 w-4 shrink-0 text-slate-300" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Footer input bar */}
      <div className="mt-6 flex items-center gap-2 rounded-2xl border border-slate-100/60 bg-white p-2.5 shadow-card">
        <button
          type="button"
          onClick={() => setPlusOpen((v) => !v)}
          className="focus-ring flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 active:scale-90"
          aria-label="Más opciones"
        >
          <AmikoIcon name="plus" className="h-5 w-5" />
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Escríbeme algo…"
          disabled={typing}
          className="min-w-0 flex-1 rounded-xl bg-slate-50 px-3 py-2.5 text-sm font-bold text-amiko-ink outline-none placeholder:text-slate-400 disabled:opacity-60"
        />

        <button
          type="button"
          className="focus-ring flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amiko-green/10 text-amiko-green transition hover:bg-amiko-green/20 active:scale-90"
          aria-label="Micrófono (próximamente)"
        >
          <AmikoIcon name="mic" className="h-5 w-5" />
        </button>

        {inputText.trim() ? (
          <button
            type="button"
            onClick={handleSend}
            disabled={typing}
            className="focus-ring flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amiko-blue text-white shadow-card transition hover:brightness-95 active:scale-90 disabled:opacity-60"
            aria-label="Enviar mensaje"
          >
            <AmikoIcon name="send" className="h-5 w-5" />
          </button>
        ) : null}
      </div>
    </>
  );
}

// ─── Speaker icon ─────────────────────────────────────────────────────────────

function SpeakerIcon({ active }: { active: boolean }) {
  return (
    <svg
      className="h-3.5 w-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      {active && <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />}
    </svg>
  );
}
