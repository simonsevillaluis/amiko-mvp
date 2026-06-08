"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { adaptedTask } from "@/lib/mock-data";
import { AmikoIcon } from "@/components/amiko-icon";
import { StudentPhoneFrame } from "@/components/student-phone-frame";

const SESSION_SECONDS = 25 * 60;
const CHECK_IN_SECONDS = 20 * 60;
const LONG_WORK_SECONDS = 45 * 60;
const STOP_SECONDS = 60 * 60;

type SessionMessage = {
  tone: "soft" | "finish" | "pause" | "stop";
  title: string;
  body: string;
};

function formatTime(seconds: number) {
  const safeSeconds = Math.max(0, seconds);
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
}

function getInitialElapsed(searchParams: URLSearchParams) {
  if (process.env.NODE_ENV !== "development") return 0;

  const elapsed = Number(searchParams.get("elapsed"));
  if (!Number.isFinite(elapsed) || elapsed < 0) return 0;

  return Math.min(elapsed, STOP_SECONDS);
}

function getSessionMessage(params: {
  elapsedSeconds: number;
  currentIndex: number;
  totalSteps: number;
}): SessionMessage | null {
  const { elapsedSeconds, currentIndex, totalSteps } = params;
  const isPenultimateStep = totalSteps > 1 && currentIndex === totalSteps - 2;
  const isAtEightyPercent = elapsedSeconds >= SESSION_SECONDS * 0.8;

  if (elapsedSeconds >= STOP_SECONDS) {
    return {
      tone: "stop",
      title: "Toca parar un poco",
      body: "Llevas un buen rato trabajando. Ahora toca parar un poco. Avisaremos a tu adulto.",
    };
  }

  if (elapsedSeconds >= LONG_WORK_SECONDS) {
    return {
      tone: "pause",
      title: "Pausa recomendada",
      body: "Llevas un buen rato trabajando. Te recomendamos una pausa breve.",
    };
  }

  if (elapsedSeconds >= SESSION_SECONDS) {
    return {
      tone: "pause",
      title: "Pausa",
      body: "Quizás necesitas una pausa. Puedes descansar un momento. Después, un adulto te ayuda a decidir si seguimos.",
    };
  }

  if (elapsedSeconds >= CHECK_IN_SECONDS && elapsedSeconds < CHECK_IN_SECONDS + 60) {
    return {
      tone: "soft",
      title: "¿Cómo vas?",
      body: "¿Cómo vas? AMIKO está contigo. Haz solo este paso. Puedes pedir ayuda si la necesitas.",
    };
  }

  if (isAtEightyPercent || isPenultimateStep) {
    return {
      tone: "finish",
      title: "Ya falta poco",
      body: "Ya estamos terminando. Queda poco. Vamos con calma. No hace falta correr.",
    };
  }

  return null;
}

function messageClasses(tone: SessionMessage["tone"]) {
  if (tone === "stop") {
    return "border-amiko-coral/40 bg-rose-50 text-rose-950";
  }

  if (tone === "pause") {
    return "border-amber-200 bg-amiko-cream text-amber-950";
  }

  if (tone === "finish") {
    return "border-amiko-green/30 bg-amiko-mint text-green-950";
  }

  return "border-amiko-blue/20 bg-amiko-sky text-amiko-navy";
}

function AccessFromTaskOnly() {
  return (
    <StudentPhoneFrame>
    <main className="relative min-h-screen overflow-hidden bg-[#FBFBFB] text-amiko-ink flex flex-col justify-center items-center px-5 py-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(15,90,209,0.03)_0%,transparent_40%)]" />
      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-64px)] max-w-[430px] flex-col items-center justify-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amiko-sky/50 text-amiko-blue shadow-sm">
          <AmikoIcon name="task" className="h-10 w-10" />
        </div>
        <p className="mt-6 text-xs font-black uppercase tracking-[0.18em] text-amiko-blue">
          Modo estudiante
        </p>
        <h1 className="mt-3 text-3xl font-black leading-tight text-amiko-navy">
          Abre este modo desde una tarea
        </h1>
        <p className="mt-4 max-w-sm text-base font-bold leading-7 text-amiko-muted">
          Primero un adulto adapta o asigna la tarea. Después AMIKO la muestra paso a paso para el estudiante.
        </p>
        <Link
          href="/dashboard"
          className="focus-ring mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-amiko-green px-6 text-sm font-black text-white shadow-card transition hover:brightness-95 active:scale-[0.98]"
        >
          Volver al inicio adulto
        </Link>
      </section>
    </main>
    </StudentPhoneFrame>
  );
}

export function StudentModeClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // En desarrollo/demo, permitimos el acceso directo siempre para facilitar pruebas rápidas
  const validTaskOrigin = true;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(() => getInitialElapsed(searchParams));
  const [lastAction, setLastAction] = useState("Empecemos con un paso.");
  const [parentNotified, setParentNotified] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [pauseOpen, setPauseOpen] = useState(false);

  const currentStep = adaptedTask.steps[currentIndex];
  const totalSteps = adaptedTask.steps.length;
  const isLastStep = currentIndex === totalSteps - 1;
  const progress = Math.round(((currentIndex + 1) / totalSteps) * 100);
  const remainingSeconds = Math.max(0, SESSION_SECONDS - elapsedSeconds);
  const mustStop = elapsedSeconds >= STOP_SECONDS;
  const adultNoticeVisible = parentNotified || mustStop || Boolean(successMessage);
  const sessionMessage = useMemo(
    () => getSessionMessage({ elapsedSeconds, currentIndex, totalSteps }),
    [elapsedSeconds, currentIndex, totalSteps],
  );

  useEffect(() => {
    if (!validTaskOrigin || successMessage || mustStop) return;

    const timer = window.setInterval(() => {
      setElapsedSeconds((seconds) => Math.min(seconds + 1, STOP_SECONDS));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [mustStop, successMessage, validTaskOrigin]);

  if (!validTaskOrigin) {
    return <AccessFromTaskOnly />;
  }

  function completeStep() {
    if (mustStop) return;

    if (!isLastStep) {
      setCurrentIndex((value) => value + 1);
      setLastAction("Listo. Vamos con el siguiente paso.");
      return;
    }

    setSuccessMessage("Terminaste la tarea paso a paso.");
    setParentNotified(true);
  }

  function askHelp() {
    setLastAction("Pediste ayuda. Avisaremos a tu adulto para que te acompañe.");
    setParentNotified(true);
  }

  function requestPause() {
    setLastAction("Elegiste una pausa. Descansa un momento.");
    setPauseOpen(true);
  }

  return (
    <StudentPhoneFrame>
    <main className="relative min-h-screen overflow-hidden bg-[#FBFBFB] text-amiko-ink">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(15,90,209,0.04)_0%,transparent_45%)]" />

      <header className="sticky top-0 z-30 border-b border-slate-100/50 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto grid max-w-[430px] grid-cols-[64px_1fr_64px] items-center gap-2 px-4 py-3">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="focus-ring flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-amiko-navy hover:bg-slate-200 transition"
            aria-label="Volver al inicio adulto"
          >
            <AmikoIcon name="back" className="h-5 w-5" />
          </button>

          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-amiko-blue">
              Modo estudiante
            </p>
            <h1 className="text-lg font-black leading-tight text-amiko-ink">{adaptedTask.subject}</h1>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amiko-green text-white">
            <svg
              className="h-[55%] w-[55%] text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        </div>
      </header>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-64px)] max-w-[430px] flex-col px-4 py-5">
        <section className="rounded-[28px] border border-slate-100 bg-white p-4 shadow-soft">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-amiko-blue">
                Paso {currentStep.number} de {totalSteps}
              </p>
              <p className="mt-1 text-sm font-bold text-slate-500">
                Tiempo sugerido: 25 min
              </p>
            </div>
            <div className="rounded-2xl bg-amiko-sky/50 px-4 py-2 text-right text-amiko-navy">
              <p className="text-[10px] font-black uppercase tracking-[0.12em] text-amiko-blue">
                Queda
              </p>
              <p className="text-lg font-black">{formatTime(remainingSeconds)}</p>
            </div>
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-amiko-green transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </section>

        {sessionMessage ? (
          <section className={`mt-4 rounded-[24px] border p-4 shadow-card ${messageClasses(sessionMessage.tone)}`}>
            <p className="text-sm font-black">{sessionMessage.title}</p>
            <p className="mt-2 text-sm font-bold leading-6">{sessionMessage.body}</p>
            {mustStop ? (
              <p className="mt-3 rounded-2xl bg-white px-3 py-2 text-xs font-black text-amiko-navy shadow-sm">
                Adulto avisado. Espera un momento antes de seguir.
              </p>
            ) : null}
          </section>
        ) : null}

        <section className="flex flex-1 items-center py-5">
          {successMessage ? (
            <div className="w-full rounded-[32px] bg-white p-7 text-center text-amiko-ink shadow-soft border border-slate-100">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amiko-mint text-amiko-green">
                <AmikoIcon name="check" className="h-10 w-10" />
              </div>
              <h2 className="mt-5 text-3xl font-black leading-tight text-amiko-navy">{successMessage}</h2>
              <p className="mt-3 text-base font-bold leading-7 text-amiko-muted">
                Tu adulto podrá revisar el avance y decidir el siguiente paso.
              </p>
              <Link
                href="/dashboard"
                className="focus-ring mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-amiko-green px-6 text-sm font-black text-white hover:brightness-95 transition"
              >
                Volver al inicio adulto
              </Link>
            </div>
          ) : (
            <div className="w-full rounded-[32px] bg-white p-6 text-center text-amiko-ink shadow-soft border border-slate-100">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-amiko-green">
                Haz solo este paso
              </p>
              <h2 className="mx-auto mt-4 max-w-sm text-3xl font-black leading-tight text-amiko-navy">
                {currentStep.instruction}
              </h2>

              <div className="mx-auto mt-6 max-w-xs rounded-[24px] border border-amiko-blue/5 bg-amiko-sky/30 p-4">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-amiko-blue">
                  Puedes mirar esto
                </p>
                <p className="mt-2 text-xl font-black text-amiko-navy">{currentStep.visualSupport}</p>
              </div>

              <div className="mx-auto mt-5 max-w-sm rounded-[22px] bg-amiko-cream/50 px-4 py-3 text-sm font-bold leading-6 text-amiko-navy">
                {lastAction}
              </div>

              {adultNoticeVisible ? (
                <p className="mt-3 text-xs font-black text-amiko-green">
                  Avisaremos a tu adulto.
                </p>
              ) : null}
            </div>
          )}
        </section>

        {!successMessage ? (
          <section className="grid gap-3 pb-4">
            {mustStop ? (
              <div className="rounded-[24px] border border-slate-200 bg-white p-4 text-center text-sm font-bold leading-6 text-amiko-muted shadow-sm">
                AMIKO no seguirá la tarea como acción principal. Ahora toca parar y esperar a tu adulto.
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={completeStep}
                  className="focus-ring min-h-16 rounded-[24px] bg-amiko-green px-5 text-xl font-black text-white shadow-card hover:brightness-95 active:scale-[0.98] transition"
                >
                  Lo hice
                </button>
                <button
                  type="button"
                  onClick={askHelp}
                  className="focus-ring min-h-16 rounded-[24px] bg-amiko-blue px-5 text-xl font-black text-white shadow-card hover:bg-amiko-navy active:scale-[0.98] transition"
                >
                  Necesito ayuda
                </button>
                <button
                  type="button"
                  onClick={requestPause}
                  className="focus-ring min-h-16 rounded-[24px] border border-slate-200 bg-white px-5 text-xl font-black text-amiko-ink shadow-card hover:bg-slate-50 active:scale-[0.98] transition"
                >
                  Necesito pausa
                </button>
              </>
            )}
          </section>
        ) : null}
      </div>

      {pauseOpen && !mustStop ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/20 p-4 backdrop-blur-sm sm:left-1/2 sm:right-auto sm:w-full sm:max-w-[430px] sm:-translate-x-1/2">
          <div className="w-full max-w-sm rounded-[32px] bg-white p-6 text-center text-amiko-ink shadow-soft border border-slate-100">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amiko-mint text-amiko-green">
              <AmikoIcon name="calm" className="h-8 w-8" />
            </div>
            <h2 className="mt-4 text-2xl font-black text-amiko-navy">Pausa breve</h2>
            <p className="mt-3 text-base font-bold leading-7 text-amiko-muted">
              Descansa un momento. Respira lento. Tu adulto puede ayudarte a decidir si seguimos.
            </p>
            <button
              type="button"
              onClick={() => setPauseOpen(false)}
              className="focus-ring mt-6 min-h-12 w-full rounded-full bg-amiko-green px-6 text-sm font-black text-white hover:brightness-95 transition"
            >
              Entendido
            </button>
          </div>
        </div>
      ) : null}
    </main>
    </StudentPhoneFrame>
  );
}
