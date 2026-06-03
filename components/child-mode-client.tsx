"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { adaptedTask } from "@/lib/mock-data";

export function ChildModeClient() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastAction, setLastAction] = useState<string>("Listo para empezar.");

  const currentStep = adaptedTask.steps[currentIndex];
  const isLastStep = currentIndex === adaptedTask.steps.length - 1;
  const progress = useMemo(
    () => Math.round(((currentIndex + 1) / adaptedTask.steps.length) * 100),
    [currentIndex],
  );

  function completeStep() {
    setLastAction("Muy bien. Marcamos este paso como hecho.");
    if (!isLastStep) {
      setCurrentIndex((value) => value + 1);
    }
  }

  function askHelp() {
    setLastAction("Registramos que necesitas ayuda. Un adulto puede acompañarte.");
  }

  function reportFrustration() {
    setLastAction("Hacemos una pausa. Respira y sigue cuando estés listo.");
  }

  return (
    <main className="min-h-screen bg-amiko-navy text-white">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-4 py-5 sm:px-8">
        <header className="flex items-center justify-between gap-4">
          <Link
            href="/tasks/task-1"
            className="focus-ring rounded-2xl border border-white/25 px-4 py-3 text-center font-black text-white"
          >
            Volver
          </Link>
          <div className="flex-1">
            <div className="h-4 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-amiko-green transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-2 text-right text-sm font-black text-blue-100">
              Paso {currentStep.number} de {adaptedTask.steps.length}
            </p>
          </div>
        </header>

        <section className="flex flex-1 items-center py-6">
          <div className="w-full rounded-2xl bg-white p-5 text-center text-amiko-ink shadow-soft sm:p-9">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-amiko-green">
              Ahora haz esto
            </p>
            <h1 className="mx-auto mt-6 max-w-2xl text-4xl font-black leading-tight sm:text-6xl">
              {currentStep.instruction}
            </h1>
            <div className="mx-auto mt-8 max-w-lg rounded-xl bg-amiko-sky p-6">
              <p className="text-sm font-black uppercase tracking-[0.16em] text-amiko-navy">
                Apoyo visual
              </p>
              <p className="mt-3 text-3xl font-black text-amiko-blue">{currentStep.visualSupport}</p>
            </div>
            <p className="mx-auto mt-6 max-w-xl rounded-3xl bg-amiko-cream px-5 py-4 text-lg font-bold leading-7 text-amiko-ink">
              {lastAction}
            </p>
          </div>
        </section>

        <div className="grid gap-3 pb-3 sm:grid-cols-3">
          <button
            type="button"
            onClick={completeStep}
            className="focus-ring min-h-20 rounded-3xl bg-amiko-green px-5 py-4 text-xl font-black text-white shadow-card hover:bg-green-700"
          >
            Lo hice
          </button>
          <button
            type="button"
            onClick={askHelp}
            className="focus-ring min-h-20 rounded-3xl bg-amiko-blue px-5 py-4 text-xl font-black text-white shadow-card hover:bg-blue-700"
          >
            Necesito ayuda
          </button>
          <button
            type="button"
            onClick={reportFrustration}
            className="focus-ring min-h-20 rounded-3xl bg-white px-5 py-4 text-xl font-black text-amiko-ink shadow-card hover:bg-amiko-cream"
          >
            Me frustré
          </button>
        </div>
      </div>
    </main>
  );
}
