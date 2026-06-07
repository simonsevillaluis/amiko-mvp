"use client";

import { useCallback, useMemo, useState } from "react";
import { AmikoIcon } from "@/components/amiko-icon";
import { StudentPortalIcon } from "@/components/student-portal-icons";
import { breakActivities, type StudentPortalTask } from "@/lib/student-mock-data";
import { saveProgressEvent } from "@/lib/local-progress";

type SaveFn = (...args: Parameters<typeof saveProgressEvent>) => void;
type Phase = "ready" | "steps" | "calming" | "done";

function CalmingCenter({
  taskId,
  onClose,
  save,
}: {
  taskId: string;
  onClose: () => void;
  save: SaveFn;
}) {
  const [selectedBreak, setSelectedBreak] = useState<string | null>(null);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-[#E8F4FD] to-[#ECF6D0] px-6">
      <div className="w-full max-w-sm rounded-[32px] bg-white p-6 shadow-soft">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amiko-mint text-amiko-green">
          <StudentPortalIcon name="calm" className="h-10 w-10" />
        </div>
        <h2 className="mt-5 text-center text-3xl font-black text-amiko-ink">
          Pausa breve
        </h2>
        <p className="mt-2 text-center text-base font-bold leading-7 text-amiko-muted">
          Esta bien parar un momento. Elige una ayuda.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          {breakActivities.slice(0, 4).map((activity) => {
            const active = selectedBreak === activity.label;

            return (
              <button
                key={activity.label}
                type="button"
                onClick={() => {
                  setSelectedBreak(activity.label);
                  save("calming_break", taskId, undefined, activity.label);
                }}
                className={`focus-ring flex min-h-24 flex-col items-center justify-center gap-2 rounded-2xl border p-3 transition active:scale-95 ${
                  active
                    ? "border-amiko-green bg-amiko-mint text-green-800"
                    : "border-amiko-blue/10 bg-amiko-sky/50 text-amiko-blue"
                }`}
              >
                <StudentPortalIcon name={activity.icon} className="h-8 w-8" />
                <span className="text-xs font-black text-amiko-ink">
                  {activity.label}
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => {
            save("help_requested", taskId, undefined, "adult_alert");
            setSelectedBreak("Avisar adulto");
          }}
          className="focus-ring mt-4 flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-amiko-cream px-5 text-base font-black text-amiko-ink"
        >
          <StudentPortalIcon name="users" className="h-6 w-6 text-amiko-coral" />
          Avisar a mi adulto
        </button>

        <button
          type="button"
          onClick={onClose}
          className="focus-ring mt-5 min-h-12 w-full rounded-full bg-amiko-navy px-6 text-base font-black text-white"
        >
          Volver a la tarea
        </button>
      </div>
    </div>
  );
}

const iconEmojiMap: Record<string, string> = {
  math: "🔢",
  reading: "📖",
  science: "🧪",
  calm: "🧘",
  draw: "🎨",
  water: "🥤",
  stretch: "🤸",
  eyes: "😌",
  music: "🎵",
  body: "🧘",
  check: "✅",
};

export function StudentAdventure({
  task,
  onExit,
  demoMode = false,
}: {
  task: StudentPortalTask;
  onExit: () => void;
  demoMode?: boolean;
}) {
  const save = useMemo<SaveFn>(
    () => (demoMode ? () => {} : saveProgressEvent),
    [demoMode],
  );

  const [phase, setPhase] = useState<Phase>("ready");
  const [currentStep, setCurrentStep] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const step = task.steps[currentStep];
  const isLastStep = currentStep === task.steps.length - 1;
  const progress = Math.round(((currentStep + 1) / task.steps.length) * 100);

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-ES";
    utterance.rate = 0.85;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, []);

  const handleComplete = useCallback(() => {
    save("step_completed", task.id, step.number);

    if (isLastStep) {
      save("task_completed", task.id);
      setPhase("done");
      return;
    }

    setCurrentStep((value) => value + 1);
  }, [isLastStep, save, step.number, task.id]);

  const handlePause = useCallback(() => {
    save("frustration_reported", task.id, step.number);
    setPhase("calming");
  }, [save, step.number, task.id]);

  const handleExit = useCallback(() => {
    save("task_paused", task.id, step.number);
    onExit();
  }, [onExit, save, step.number, task.id]);

  if (phase === "ready") {
    return (
      <div className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-gradient-to-b from-amiko-sky via-white to-amiko-mint px-6">
        <button
          type="button"
          onClick={handleExit}
          className="focus-ring absolute left-5 top-5 rounded-full bg-white/90 px-4 py-2 text-sm font-black text-amiko-muted shadow-card"
        >
          Salir
        </button>

        <p className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-amiko-green">
          Primero y despues
        </p>
        <h1 className="mb-8 text-3xl font-black text-amiko-ink">
          Empezamos con calma
        </h1>

        <div className="flex w-full max-w-xs flex-col gap-5">
          <div className="rounded-[28px] border-l-4 border-l-amiko-blue bg-white p-5 shadow-card text-left">
            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-amiko-blue">
              Primero
            </p>
            <div className="mt-3 flex items-center gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amiko-sky/40">
                <span className="text-3xl leading-none select-none">{iconEmojiMap[task.icon] || "📋"}</span>
              </span>
              <div>
                <p className="text-xl font-black text-amiko-ink">{task.title}</p>
                <p className="text-sm font-bold text-amiko-muted">
                  {task.steps.length} pasos
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border-l-4 border-l-amiko-green bg-[#FDFBF7] p-5 shadow-card text-left">
            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-amiko-green">
              Después
            </p>
            <div className="mt-3 flex items-center gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amiko-mint/20">
                <span className="text-3xl leading-none select-none">{iconEmojiMap[task.rewardIcon] || "🎁"}</span>
              </span>
              <div>
                <p className="text-xl font-black text-amiko-ink">{task.reward}</p>
                <p className="text-sm font-bold text-amiko-muted">
                  Pausa o premio
                </p>
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setPhase("steps")}
          className="focus-ring mt-10 min-h-16 w-full max-w-xs rounded-full bg-amiko-green px-8 py-4 text-2xl font-black text-white shadow-card transition active:scale-95"
        >
          Vamos
        </button>
      </div>
    );
  }

  if (phase === "calming") {
    return (
      <CalmingCenter
        taskId={task.id}
        onClose={() => setPhase("steps")}
        save={save}
      />
    );
  }

  if (phase === "done") {
    return (
      <div className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-gradient-to-b from-[#FFF8E8] via-[#ECF6D0] to-[#E8F4FD] px-6">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white text-amiko-green shadow-soft">
          <AmikoIcon name="check" className="h-12 w-12" />
        </div>
        <h1 className="mt-6 text-4xl font-black text-amiko-ink">
          Lo lograste
        </h1>
        <p className="mt-3 text-center text-lg font-bold text-amiko-muted">
          Terminaste todos los pasos.
        </p>
        <div className="mt-6 rounded-[28px] bg-amiko-cream p-6 shadow-card">
          <p className="text-sm font-black uppercase tracking-widest text-amiko-green">
            Ahora puedes
          </p>
          <div className="mt-2 flex items-center gap-3">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/80 text-amiko-green">
              <StudentPortalIcon name={task.rewardIcon} className="h-8 w-8" />
            </span>
            <p className="text-xl font-black text-amiko-ink">{task.reward}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onExit}
          className="focus-ring mt-10 rounded-full bg-amiko-navy px-8 py-4 text-xl font-black text-white shadow-card transition active:scale-95"
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-amiko-navy text-white">
      <header className="flex items-center gap-4 px-5 pt-5">
        <button
          type="button"
          onClick={handleExit}
          className="focus-ring rounded-2xl border border-white/25 px-4 py-3 font-black"
        >
          Salir
        </button>
        <div className="flex-1">
          <div className="h-3 overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-amiko-green transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-right text-sm font-black text-blue-200">
            Paso {step.number} de {task.steps.length}
          </p>
        </div>
      </header>

      <section className="flex flex-1 items-center px-5 py-6">
        <div className="w-full rounded-[32px] bg-white p-6 text-center text-amiko-ink shadow-soft">
          <p className="text-sm font-black uppercase tracking-widest text-amiko-green">
            Haz solo este paso
          </p>
          <div className="mx-auto mt-4 flex h-24 w-24 items-center justify-center rounded-[28px] bg-amiko-sky text-amiko-blue">
            <StudentPortalIcon name={step.icon} className="h-14 w-14" />
          </div>
          <h1 className="mx-auto mt-5 max-w-sm text-3xl font-black leading-tight">
            {step.instruction}
          </h1>
          <div className="mx-auto mt-5 max-w-xs rounded-2xl bg-amiko-sky p-4">
            <p className="text-sm font-black text-amiko-navy">
              {step.visualSupport}
            </p>
          </div>
          <button
            type="button"
            onClick={() => speak(step.instruction)}
            className={`focus-ring mx-auto mt-5 flex h-14 w-14 items-center justify-center rounded-full shadow-card transition active:scale-90 ${
              isSpeaking
                ? "bg-amiko-green text-white"
                : "bg-amiko-sky text-amiko-navy"
            }`}
            aria-label="Leer en voz alta"
          >
            <AmikoIcon name="mic" className="h-6 w-6" />
          </button>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 px-5 pb-5">
        <button
          type="button"
          onClick={handleComplete}
          className="focus-ring min-h-20 rounded-3xl bg-amiko-green px-5 py-4 text-xl font-black text-white shadow-card transition active:scale-95"
        >
          <span className="flex items-center justify-center gap-2">
            <AmikoIcon name="check" className="h-6 w-6" />
            Lo hice
          </span>
        </button>
        <button
          type="button"
          onClick={handlePause}
          className="focus-ring min-h-20 rounded-3xl bg-white px-5 py-4 text-xl font-black text-amiko-ink shadow-card transition active:scale-95"
        >
          <span className="flex items-center justify-center gap-2">
            <AmikoIcon name="pause" className="h-6 w-6" />
            Necesito pausa
          </span>
        </button>
      </div>
    </div>
  );
}
