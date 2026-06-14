"use client";

import { useEffect, useState } from "react";
import { AmikoIcon } from "@/components/amiko-icon";
import { soundSettings } from "@/lib/student-sound-settings";
import { playSound } from "@/lib/sounds";

export function StudentSettingsPanel({ onClose }: { onClose: () => void }) {
  const [studentSound, setStudentSound] = useState(true);
  const [tutorAllows, setTutorAllows] = useState(true);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setStudentSound(soundSettings.getStudentEnabled());
      setTutorAllows(soundSettings.getTutorEnabled());
    }, 0);

    return () => window.clearTimeout(handle);
  }, []);

  function toggleSound() {
    if (!tutorAllows) return;
    const next = !studentSound;
    soundSettings.setStudentEnabled(next);
    setStudentSound(next);
    if (next) playSound("tap");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:left-1/2 sm:right-auto sm:w-full sm:max-w-[430px] sm:-translate-x-1/2">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Cerrar ajustes"
        onClick={onClose}
        className="absolute inset-0 bg-amiko-navy/40 backdrop-blur-sm"
      />

      {/* Panel */}
      <div className="relative z-10 w-full rounded-t-[28px] bg-white px-5 pb-8 pt-4 shadow-[0_-8px_40px_rgba(9,54,124,0.18)]">
        {/* Handle */}
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-slate-200" />

        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-black text-amiko-navy">Ajustes</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="flex h-9 w-9 items-center justify-center rounded-full text-amiko-muted transition hover:bg-slate-100"
          >
            <AmikoIcon name="close" className="h-5 w-5" />
          </button>
        </div>

        {/* Sound row */}
        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-card">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-base font-black text-amiko-ink">Sonidos</p>
              <p className="mt-0.5 text-sm font-bold text-amiko-muted">
                {tutorAllows
                  ? "Puedes apagar los sonidos si te molestan."
                  : "Tu tutor ha desactivado los sonidos."}
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={studentSound && tutorAllows}
              disabled={!tutorAllows}
              onClick={toggleSound}
              className={`relative h-7 w-12 shrink-0 rounded-full transition-colors disabled:opacity-40 ${
                studentSound && tutorAllows ? "bg-amiko-green" : "bg-slate-200"
              }`}
            >
              <span
                className={`absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform ${
                  studentSound && tutorAllows ? "translate-x-[20px]" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Night mode row (coming soon) */}
        <div className="mt-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 opacity-60">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-base font-black text-slate-500">Modo nocturno</p>
                <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[9px] font-black uppercase text-slate-500">Próximamente</span>
              </div>
              <p className="mt-0.5 text-sm font-bold text-slate-400">
                Colores oscuros y menos brillo para descansar la vista.
              </p>
            </div>
            <div className="relative h-7 w-12 shrink-0 rounded-full bg-slate-200 opacity-60">
              <span className="absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-white shadow-sm" />
            </div>
          </div>
        </div>

        {/* Big letters row (coming soon) */}
        <div className="mt-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 opacity-60">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-base font-black text-slate-500">Letras grandes</p>
                <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[9px] font-black uppercase text-slate-500">Próximamente</span>
              </div>
              <p className="mt-0.5 text-sm font-bold text-slate-400">
                Aumenta el tamaño del texto para leer más fácil.
              </p>
            </div>
            <div className="relative h-7 w-12 shrink-0 rounded-full bg-slate-200 opacity-60">
              <span className="absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-white shadow-sm" />
            </div>
          </div>
        </div>

        {/* Less stimuli row (coming soon) */}
        <div className="mt-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 opacity-60">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-base font-black text-slate-500">Reducir estímulos</p>
                <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[9px] font-black uppercase text-slate-500">Próximamente</span>
              </div>
              <p className="mt-0.5 text-sm font-bold text-slate-400">
                Oculta animaciones y colores fuertes si hay sobrecarga.
              </p>
            </div>
            <div className="relative h-7 w-12 shrink-0 rounded-full bg-slate-200 opacity-60">
              <span className="absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-white shadow-sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
