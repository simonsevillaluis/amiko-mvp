"use client";

import { useEffect, useRef, useState } from "react";
import { AmikoIcon } from "@/components/amiko-icon";
import { soundSettings } from "@/lib/student-sound-settings";

export function StudentCardActions({ studentName }: { studentName: string }) {
  const [open, setOpen] = useState(false);
  const [tutorSound, setTutorSound] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTutorSound(soundSettings.getTutorEnabled());
  }, [open]);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  function toggleTutorSound() {
    const next = !tutorSound;
    soundSettings.setTutorEnabled(next);
    setTutorSound(next);
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="focus-ring flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm transition hover:bg-amiko-sky"
        aria-label={`Ajustes de ${studentName}`}
        aria-expanded={open}
      >
        <AmikoIcon name="settings" className="h-4 w-4 text-amiko-muted" />
      </button>

      {open && (
        <div className="absolute right-0 top-10 z-20 w-64 rounded-2xl border border-slate-100 bg-white p-4 shadow-soft">
          <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-amiko-muted">
            Ajustes de {studentName}
          </p>

          {/* Sound toggle */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1">
              <p className="text-sm font-black text-amiko-ink">Sonidos del estudiante</p>
              <p className="mt-0.5 text-xs font-bold text-amiko-muted">
                Botones, recompensas y logros.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={tutorSound}
              onClick={toggleTutorSound}
              className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                tutorSound ? "bg-amiko-green" : "bg-slate-200"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                  tutorSound ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>

          <p className="mt-3 rounded-xl bg-amiko-sky/50 px-3 py-2 text-xs font-bold leading-5 text-amiko-navy">
            El estudiante también puede apagarlos desde sus ajustes.
          </p>
        </div>
      )}
    </div>
  );
}
