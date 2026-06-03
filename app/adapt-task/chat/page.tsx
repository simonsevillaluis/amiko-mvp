import Link from "next/link";
import { adaptedTask, student } from "@/lib/mock-data";

function BackIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} viewBox="0 0 24 24">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24">
      <rect x="9" y="2" width="6" height="11" rx="3" />
      <path d="M19 10a7 7 0 0 1-14 0" />
      <path d="M12 19v3" />
      <path d="M8 22h8" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24">
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

function AmikoBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amiko-mint text-base">
        🤖
      </div>
      <div className="max-w-[78%] rounded-2xl rounded-tl-none bg-white px-4 py-3 shadow-sm">
        {children}
      </div>
    </div>
  );
}

function UserBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[78%] rounded-2xl rounded-tr-none bg-white px-4 py-3 shadow-sm">
        {children}
      </div>
    </div>
  );
}

export default function ChatIAPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#EBF0FA]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-100 bg-white">
        <div className="mx-auto flex max-w-[411px] items-center justify-between px-4 py-3">
          <Link
            href="/adapt-task"
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-amiko-sky"
            aria-label="Volver"
          >
            <BackIcon />
          </Link>
          <h1 className="text-base font-black text-amiko-ink">Chat IA</h1>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-amiko-sky"
            aria-label="Menú"
          >
            <MenuIcon />
          </button>
        </div>
      </header>

      {/* Chat messages */}
      <div className="flex-1 space-y-4 px-4 py-5">
        {/* AMIKO greeting */}
        <AmikoBubble>
          <p className="text-sm leading-6 text-amiko-ink">
            ¡Hola! 😊 Soy Amiko, estoy aquí para ayudarte con tus tareas.
          </p>
        </AmikoBubble>

        {/* User sent photos */}
        <div className="flex justify-end">
          <div className="grid w-48 grid-cols-2 gap-1 overflow-hidden rounded-2xl rounded-tr-none">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="aspect-square bg-slate-200 flex items-center justify-center text-2xl">
                📄
              </div>
            ))}
          </div>
        </div>

        {/* User text */}
        <UserBubble>
          <p className="text-sm leading-6 text-amiko-ink">
            Hola... no entiendo esta tarea 🤔 Me puedes ayudar?
          </p>
        </UserBubble>

        {/* AMIKO processing */}
        <AmikoBubble>
          <p className="text-sm text-amiko-muted">Procesando tarea...</p>
        </AmikoBubble>

        {/* AMIKO result */}
        <AmikoBubble>
          <p className="font-black text-amiko-ink">
            ¡Listo! Aquí están los pasos para {student.name}:
          </p>
          <div className="mt-3 rounded-xl bg-amiko-sky p-3">
            <p className="text-xs font-black uppercase tracking-wide text-amiko-navy">
              En palabras simples
            </p>
            <p className="mt-1.5 text-sm leading-5 text-amiko-ink">
              {adaptedTask.simpleSummary}
            </p>
          </div>
          <div className="mt-3 space-y-2">
            {adaptedTask.steps.slice(0, 3).map((step) => (
              <div key={step.number} className="flex items-center gap-2 rounded-xl border border-slate-100 bg-white p-2.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amiko-navy text-xs font-black text-white">
                  {step.number}
                </span>
                <p className="text-sm font-bold text-amiko-ink">{step.instruction}</p>
              </div>
            ))}
            {adaptedTask.steps.length > 3 && (
              <p className="pl-1 text-xs text-amiko-muted">+ {adaptedTask.steps.length - 3} pasos más…</p>
            )}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/tasks/task-1"
              className="inline-flex items-center rounded-full bg-amiko-navy px-4 py-2 text-sm font-black text-white shadow-card"
            >
              Ver tarea completa
            </Link>
            <Link
              href="/child-mode/task-1"
              className="inline-flex items-center rounded-full border border-amiko-green bg-amiko-mint px-4 py-2 text-sm font-black text-green-800"
            >
              Modo niño
            </Link>
          </div>
        </AmikoBubble>
      </div>

      {/* Input bar */}
      <div className="sticky bottom-0 border-t border-slate-100 bg-white px-3 py-3">
        <div className="mx-auto flex max-w-[411px] items-center gap-2">
          <button
            type="button"
            aria-label="Adjuntar"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-amiko-muted hover:bg-amiko-sky"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
          <div className="flex flex-1 items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2">
            <span className="text-sm text-slate-400">Pregunta a Amiko</span>
          </div>
          <button type="button" aria-label="Micrófono" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-amiko-muted hover:bg-amiko-sky">
            <MicIcon />
          </button>
          <button type="button" aria-label="Enviar" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amiko-navy text-white shadow-card">
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
