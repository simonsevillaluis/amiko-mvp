"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type { ChildTask } from "@/lib/child-mock-data";
import { breakActivities } from "@/lib/child-mock-data";
import { saveProgressEvent } from "@/lib/local-progress";

/* ─── Calming Center ─── */
function CalmingCenter({
  taskId,
  onClose,
}: {
  taskId: string;
  onClose: () => void;
}) {
  const [mode, setMode] = useState<"menu" | "breathe" | "break">("menu");
  const [breatheSeconds, setBreatheSeconds] = useState(30);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (mode !== "breathe") return;

    if (breatheSeconds <= 0) {
      const handle = setTimeout(() => {
        saveProgressEvent("calming_breathing", taskId);
        setMode("menu");
        setBreatheSeconds(30);
      }, 0);
      return () => clearTimeout(handle);
    }

    timerRef.current = setInterval(
      () => setBreatheSeconds((s) => s - 1),
      1000,
    );
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [mode, breatheSeconds, taskId]);

  if (mode === "breathe") {
    const phase = breatheSeconds % 8 >= 4 ? "Inhala" : "Exhala";
    const scale = phase === "Inhala" ? "scale-100" : "scale-75";
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-[#E8F4FD] to-[#D4F0D4]">
        <p className="mb-8 text-2xl font-black text-amiko-blue">{phase}...</p>
        <div
          className={`flex h-48 w-48 items-center justify-center rounded-full bg-gradient-to-br from-amiko-sky to-amiko-mint shadow-soft transition-transform duration-[2000ms] ease-in-out ${scale}`}
        >
          <span className="text-5xl font-black text-amiko-blue">
            {breatheSeconds}
          </span>
        </div>
        <p className="mt-8 text-lg font-black text-amiko-muted">
          Respira conmigo...
        </p>
        <button
          type="button"
          onClick={() => {
            setMode("menu");
            setBreatheSeconds(30);
          }}
          className="mt-6 rounded-full bg-white px-8 py-3 font-black text-amiko-ink shadow-card"
        >
          Volver
        </button>
      </div>
    );
  }

  if (mode === "break") {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-[#FFF8E8] to-[#F0F8E8] px-6">
        <h2 className="mb-6 text-2xl font-black text-amiko-ink">
          ¿Qué quieres hacer?
        </h2>
        <div className="grid w-full max-w-xs grid-cols-2 gap-3">
          {breakActivities.map((activity) => (
            <button
              key={activity.label}
              type="button"
              onClick={() => {
                saveProgressEvent(
                  "calming_break",
                  taskId,
                  undefined,
                  activity.label,
                );
              }}
              className="flex flex-col items-center gap-2 rounded-2xl bg-white p-5 shadow-card transition active:scale-95"
            >
              <span className="text-4xl">{activity.emoji}</span>
              <span className="text-sm font-black text-amiko-ink">
                {activity.label}
              </span>
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setMode("menu")}
          className="mt-6 rounded-full bg-white px-8 py-3 font-black text-amiko-ink shadow-card"
        >
          Volver
        </button>
      </div>
    );
  }

  // Menu
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-[#E8F4FD] to-[#ECF6D0] px-6">
      <h2 className="mb-2 text-3xl font-black text-amiko-ink">
        Mi Espacio Tranquilo
      </h2>
      <p className="mb-8 text-center text-base font-bold text-amiko-muted">
        Está bien hacer una pausa. Elige qué te ayuda.
      </p>
      <div className="flex w-full max-w-xs flex-col gap-4">
        <button
          type="button"
          onClick={() => setMode("breathe")}
          className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-card transition active:scale-95"
        >
          <span className="text-4xl">🌊</span>
          <div className="text-left">
            <p className="text-lg font-black text-amiko-ink">Respirar</p>
            <p className="text-sm text-amiko-muted">30 segundos de calma</p>
          </div>
        </button>
        <button
          type="button"
          onClick={() => setMode("break")}
          className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-card transition active:scale-95"
        >
          <span className="text-4xl">🤸</span>
          <div className="text-left">
            <p className="text-lg font-black text-amiko-ink">Actividad</p>
            <p className="text-sm text-amiko-muted">Elige un descanso</p>
          </div>
        </button>
        <button
          type="button"
          onClick={() => {
            saveProgressEvent(
              "help_requested",
              taskId,
              undefined,
              "tutor_alert",
            );
          }}
          className="flex items-center gap-4 rounded-2xl bg-amiko-cream p-5 shadow-card transition active:scale-95"
        >
          <span className="text-4xl">🤝</span>
          <div className="text-left">
            <p className="text-lg font-black text-amiko-ink">Llamar a mi tutor</p>
            <p className="text-sm text-amiko-muted">
              Ya sabe que necesitas ayuda
            </p>
          </div>
        </button>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="mt-8 rounded-full bg-amiko-navy px-8 py-3 text-lg font-black text-white shadow-card"
      >
        Volver a mi tarea
      </button>
    </div>
  );
}

/* ─── Phases ─── */
type Phase = "ready" | "steps" | "calming" | "done";

export function ChildAdventure({
  task,
  onExit,
}: {
  task: ChildTask;
  onExit: () => void;
}) {
  const [phase, setPhase] = useState<Phase>("ready");
  const [currentStep, setCurrentStep] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const step = task.steps[currentStep];
  const isLastStep = currentStep === task.steps.length - 1;
  const progress = Math.round(
    ((currentStep + 1) / task.steps.length) * 100,
  );

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
    saveProgressEvent("step_completed", task.id, step.number);
    if (isLastStep) {
      saveProgressEvent("task_completed", task.id);
      setPhase("done");
    } else {
      setCurrentStep((s) => s + 1);
    }
  }, [task.id, step, isLastStep]);

  const handlePause = useCallback(() => {
    saveProgressEvent("frustration_reported", task.id, step.number);
    setPhase("calming");
  }, [task.id, step]);

  const handleExit = useCallback(() => {
    saveProgressEvent("task_paused", task.id, step?.number);
    onExit();
  }, [task.id, step, onExit]);

  /* ── ¿Empezamos? ── */
  if (phase === "ready") {
    return (
      <div className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-gradient-to-b from-amiko-sky via-white to-amiko-mint px-6">
        <button
          type="button"
          onClick={handleExit}
          className="absolute left-5 top-5 rounded-full bg-white/80 px-4 py-2 text-sm font-black text-amiko-muted shadow-card"
        >
          ← Salir
        </button>
        <h1 className="mb-8 text-3xl font-black text-amiko-ink">
          ¿Empezamos?
        </h1>

        <div className="flex w-full max-w-xs flex-col gap-6">
          {/* Primero */}
          <div className="rounded-2xl bg-white p-6 shadow-card">
            <p className="text-sm font-black uppercase tracking-widest text-amiko-blue">
              Primero
            </p>
            <div className="mt-3 flex items-center gap-3">
              <span className="text-4xl">{task.emoji}</span>
              <p className="text-xl font-black text-amiko-ink">{task.title}</p>
            </div>
            <p className="mt-2 text-sm text-amiko-muted">
              {task.steps.length} pasos · {task.subject}
            </p>
          </div>

          {/* Entonces */}
          <div className="rounded-2xl bg-amiko-cream p-6 shadow-card">
            <p className="text-sm font-black uppercase tracking-widest text-amiko-green">
              Entonces
            </p>
            <div className="mt-3 flex items-center gap-3">
              <span className="text-4xl">{task.rewardEmoji}</span>
              <p className="text-xl font-black text-amiko-ink">{task.reward}</p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setPhase("steps")}
          className="mt-10 min-h-16 w-full max-w-xs rounded-full bg-amiko-green px-8 py-4 text-2xl font-black text-white shadow-card transition active:scale-95"
        >
          ¡Vamos! 🚀
        </button>
      </div>
    );
  }

  /* ── Calming Center ── */
  if (phase === "calming") {
    return (
      <CalmingCenter
        taskId={task.id}
        onClose={() => setPhase("steps")}
      />
    );
  }

  /* ── ¡Lo Logré! ── */
  if (phase === "done") {
    return (
      <div className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-gradient-to-b from-[#FFF8E8] via-[#ECF6D0] to-[#E8F4FD] px-6">
        <div className="animate-bounce text-8xl">🌟</div>
        <h1 className="mt-6 text-4xl font-black text-amiko-ink">
          ¡Lo Logré!
        </h1>
        <p className="mt-3 text-center text-lg font-bold text-amiko-muted">
          Terminaste todos los pasos. ¡Muy bien!
        </p>
        <div className="mt-6 rounded-2xl bg-amiko-cream p-6 shadow-card">
          <p className="text-sm font-black uppercase tracking-widest text-amiko-green">
            Tu recompensa
          </p>
          <div className="mt-2 flex items-center gap-3">
            <span className="text-4xl">{task.rewardEmoji}</span>
            <p className="text-xl font-black text-amiko-ink">{task.reward}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onExit}
          className="mt-10 rounded-full bg-amiko-navy px-8 py-4 text-xl font-black text-white shadow-card transition active:scale-95"
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  /* ── Mi Aventura (Paso a Paso) ── */
  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-amiko-navy text-white">
      {/* Header */}
      <header className="flex items-center gap-4 px-5 pt-5">
        <button
          type="button"
          onClick={handleExit}
          className="rounded-2xl border border-white/25 px-4 py-3 font-black"
        >
          ← Salir
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

      {/* Step card */}
      <section className="flex flex-1 items-center px-5 py-6">
        <div className="w-full rounded-3xl bg-white p-6 text-center text-amiko-ink shadow-soft">
          <p className="text-sm font-black uppercase tracking-widest text-amiko-green">
            Ahora haz esto
          </p>
          <div className="mx-auto mt-4 text-6xl">{step.pictogram}</div>
          <h1 className="mx-auto mt-5 max-w-sm text-3xl font-black leading-tight">
            {step.instruction}
          </h1>
          <div className="mx-auto mt-5 max-w-xs rounded-2xl bg-amiko-sky p-4">
            <p className="text-sm font-black text-amiko-navy">
              {step.visualSupport}
            </p>
          </div>
          {/* TTS Button */}
          <button
            type="button"
            onClick={() => speak(step.instruction)}
            className={`mx-auto mt-5 flex h-14 w-14 items-center justify-center rounded-full shadow-card transition active:scale-90 ${
              isSpeaking
                ? "bg-amiko-green text-white"
                : "bg-amiko-sky text-amiko-navy"
            }`}
            aria-label="Leer en voz alta"
          >
            <span className="text-2xl">🔊</span>
          </button>
        </div>
      </section>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-3 px-5 pb-5">
        <button
          type="button"
          onClick={handleComplete}
          className="min-h-20 rounded-3xl bg-amiko-green px-5 py-4 text-xl font-black text-white shadow-card transition active:scale-95"
        >
          Lo hice ✅
        </button>
        <button
          type="button"
          onClick={handlePause}
          className="min-h-20 rounded-3xl bg-white px-5 py-4 text-xl font-black text-amiko-ink shadow-card transition active:scale-95"
        >
          Necesito pausa 😮‍💨
        </button>
      </div>
    </div>
  );
}
