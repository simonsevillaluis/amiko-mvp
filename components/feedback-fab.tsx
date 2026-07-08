"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { AmikoIcon } from "@/components/amiko-icon";
import { FEEDBACK_STORAGE_KEY, type FeedbackEntry } from "@/lib/feedback-storage";

type FeedbackKind = "idea" | "bug" | "otro";

const options: Array<{ value: FeedbackKind; label: string }> = [
  { value: "idea", label: "Idea" },
  { value: "bug", label: "Bug" },
  { value: "otro", label: "Otro" },
];

function readStoredFeedback() {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(FEEDBACK_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function FeedbackFab({ offsetClassName = "bottom-[9.5rem] right-4" }: { offsetClassName?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [kind, setKind] = useState<FeedbackKind>("idea");
  const [message, setMessage] = useState("");
  const [storedCount, setStoredCount] = useState(() => readStoredFeedback().length);

  useEffect(() => {
    if (!open) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const trimmedMessage = message.trim();
  const canSubmit = trimmedMessage.length >= 4;

  const title = useMemo(() => {
    if (submitted) return "Gracias";
    return "Enviar feedback";
  }, [submitted]);

  function closePanel() {
    setOpen(false);
    setSubmitted(false);
  }

  function resetForm() {
    setKind("idea");
    setMessage("");
    setSubmitted(false);
  }

  function handleSubmit() {
    if (!canSubmit) return;

    const nextEntry: FeedbackEntry = {
      id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}`,
      kind,
      message: trimmedMessage,
      pathname,
      createdAt: new Date().toISOString(),
    };

    const current = readStoredFeedback();
    const next = [nextEntry, ...current].slice(0, 50);
    window.localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(next));
    setStoredCount(next.length);
    setSubmitted(true);
    setMessage("");
  }

  return (
    <>
      {open ? (
        <div
          className="fixed inset-0 z-[95] bg-[#162236]/35 backdrop-blur-[2px]"
          onClick={closePanel}
          aria-hidden="true"
        />
      ) : null}

      {open ? (
        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby="amiko-feedback-title"
          className="fixed bottom-[12.75rem] left-4 right-4 z-[100] mx-auto w-auto max-w-[398px] rounded-[28px] border border-slate-100 bg-white p-5 shadow-[0_18px_50px_rgba(22,34,54,0.22)] sm:left-1/2 sm:right-auto sm:-translate-x-1/2"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id="amiko-feedback-title" className="text-xl font-black text-amiko-ink">
                {title}
              </h2>
              <p className="mt-1 text-sm font-bold leading-6 text-amiko-muted">
                {submitted
                  ? "Tu feedback se guardo en este navegador para no perder la idea."
                  : "Cuentanos ideas, bugs o cualquier detalle que te gustaria mejorar."}
              </p>
            </div>
            <button
              type="button"
              onClick={closePanel}
              className="focus-ring flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-amiko-ink"
              aria-label="Cerrar feedback"
            >
              <AmikoIcon name="close" className="h-5 w-5" />
            </button>
          </div>

          {submitted ? (
            <div className="mt-5 space-y-4">
              <div className="rounded-2xl bg-[#F6FAFF] px-4 py-4">
                <p className="text-sm font-bold leading-6 text-amiko-muted">
                  Ya queda listo para conectarlo luego a backend o exportarlo a otro canal.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="focus-ring flex min-h-12 flex-1 items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-sm font-black text-amiko-ink transition hover:bg-slate-50"
                >
                  Enviar otro
                </button>
                <button
                  type="button"
                  onClick={closePanel}
                  className="focus-ring flex min-h-12 flex-1 items-center justify-center rounded-full bg-[#172236] px-4 text-sm font-black text-white transition hover:brightness-95"
                >
                  Cerrar
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mt-5 flex flex-wrap gap-2">
                {options.map((option) => {
                  const active = option.value === kind;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setKind(option.value)}
                      className={`focus-ring rounded-full border px-4 py-2 text-sm font-black transition ${
                        active
                          ? "border-[#172236] bg-[#172236] text-white"
                          : "border-slate-200 bg-white text-amiko-ink hover:bg-slate-50"
                      }`}
                      aria-pressed={active}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>

              <label className="mt-4 block">
                <span className="sr-only">Mensaje de feedback</span>
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Cuentanos cualquier cosa: un bug, una idea, lo que sea..."
                  rows={5}
                  className="focus-ring w-full resize-none rounded-[22px] border border-slate-200 bg-white px-4 py-3 text-base font-bold leading-7 text-amiko-ink outline-none placeholder:text-slate-400"
                />
              </label>

              <div className="mt-4 flex items-center justify-between gap-4">
                <p className="text-xs font-bold leading-5 text-amiko-muted">
                  Ruta actual: <span className="font-black text-amiko-ink">{pathname}</span>
                </p>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className={`focus-ring flex min-h-12 shrink-0 items-center justify-center rounded-full px-6 text-sm font-black transition ${
                    canSubmit
                      ? "bg-amiko-blue text-white shadow-card hover:brightness-95"
                      : "cursor-not-allowed bg-slate-200 text-slate-500"
                  }`}
                >
                  Enviar
                </button>
              </div>
            </>
          )}
        </section>
      ) : null}

      <div className={`fixed z-[90] ${offsetClassName} sm:left-1/2 sm:right-auto sm:w-full sm:max-w-[430px] sm:-translate-x-1/2`}>
        <div className="pointer-events-none mx-auto flex max-w-[430px] justify-start px-0 sm:px-4">
          <button
            type="button"
            onClick={() => {
              setOpen(true);
              setSubmitted(false);
            }}
            className="pointer-events-auto focus-ring inline-flex min-h-14 items-center gap-2 rounded-full bg-[#172236] px-5 text-sm font-black text-white shadow-[0_12px_28px_rgba(23,34,54,0.28)] transition hover:brightness-95"
            aria-label="Abrir feedback"
          >
            <AmikoIcon name="chat" className="h-5 w-5" />
            <span>Feedback</span>
            {storedCount > 0 ? (
              <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-white/14 px-2 text-[11px] font-black">
                {storedCount}
              </span>
            ) : null}
          </button>
        </div>
      </div>
    </>
  );
}
