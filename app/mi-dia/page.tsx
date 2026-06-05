"use client";

import { useState } from "react";
import { AmikoIcon } from "@/components/amiko-icon";
import { DetailShell } from "@/components/detail-shell";
import { student } from "@/lib/mock-data";

// Groups 0 and 1 are single-select (one emotional/difficulty state at a time).
// Group 2 is multi-select (multiple supports can be used simultaneously).
const groups = [
  {
    title: "Antes de empezar",
    hint: "¿Cómo estaba Ángel al iniciar?",
    multi: false,
    options: ["Tranquilo", "Cansado", "Frustrado", "Motivado", "No quiso empezar"],
  },
  {
    title: "¿Cómo se sintió la tarea?",
    hint: "Una sola opción",
    multi: false,
    options: ["Muy difícil", "Difícil", "Regular", "Fácil", "Con autonomía"],
  },
  {
    title: "Apoyos que usaron",
    hint: "Puedes elegir varios",
    multi: true,
    options: ["Pasos cortos", "Apoyo visual", "Lectura en voz alta", "Pausa", "Ayuda adulta"],
  },
];

export default function TaskLogPage() {
  const [selections, setSelections] = useState<string[][]>([[], [], []]);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  function toggle(groupIndex: number, option: string) {
    setSelections((prev) => {
      const group = prev[groupIndex];
      const isMulti = groups[groupIndex].multi;

      let next: string[];
      if (isMulti) {
        next = group.includes(option)
          ? group.filter((o) => o !== option)
          : [...group, option];
      } else {
        next = group.includes(option) ? [] : [option];
      }

      const updated = [...prev];
      updated[groupIndex] = next;
      return updated;
    });
  }

  function handleSave() {
    setSaved(true);
  }

  return (
    <DetailShell
      title="Registro de tarea"
      fallbackHref="/acompanamiento"
      rightAction={
        <button
          type="button"
          className="focus-ring flex h-10 w-10 items-center justify-center rounded-full text-amiko-navy transition hover:bg-amiko-sky"
          aria-label="Ver registros anteriores"
        >
          <AmikoIcon name="history" className="h-5 w-5" />
        </button>
      }
    >
      <section className="mb-5">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-amiko-green">
          Acompañamiento
        </p>
        <h2 className="mt-1 text-2xl font-black leading-tight text-amiko-ink">
          Registro de tarea
        </h2>
        <p className="mt-2 text-sm font-bold leading-6 text-amiko-muted">
          Guarda lo que pasó hoy para entender mejor qué ayuda a {student.name}.
        </p>
      </section>

      <p className="mb-5 rounded-2xl bg-amiko-sky px-4 py-3 text-sm font-bold leading-6 text-amiko-navy">
        Registrar un día difícil también ayuda. Aquí no hay respuestas correctas.
      </p>

      {saved ? (
        <div className="rounded-3xl bg-gradient-to-br from-amiko-mint to-white p-6 text-center shadow-card">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amiko-green text-white shadow-card">
            <AmikoIcon name="check" className="h-7 w-7" />
          </span>
          <h3 className="mt-4 text-xl font-black text-amiko-ink">Registro guardado</h3>
          <p className="mt-2 text-sm font-bold leading-6 text-amiko-muted">
            Gracias por registrar. Esto ayuda a entender los patrones de {student.name}.
          </p>
          <button
            type="button"
            onClick={() => { setSaved(false); setSelections([[], [], []]); setNote(""); }}
            className="focus-ring mt-4 rounded-full border border-amiko-green px-5 py-2.5 text-sm font-black text-amiko-green transition hover:bg-amiko-mint"
          >
            Nuevo registro
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {groups.map((group, groupIndex) => (
              <section key={group.title} className="rounded-3xl border border-slate-100 bg-white p-5 shadow-card">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <h2 className="text-base font-black text-amiko-ink">{group.title}</h2>
                  <span className="text-xs font-bold text-amiko-muted">{group.hint}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.options.map((option) => {
                    const active = selections[groupIndex].includes(option);
                    return (
                      <button
                        key={option}
                        type="button"
                        aria-pressed={active}
                        onClick={() => toggle(groupIndex, option)}
                        className={`focus-ring rounded-full border px-4 py-2 text-sm font-black transition ${
                          active
                            ? "border-amiko-green bg-amiko-green text-white shadow-sm"
                            : "border-slate-200 bg-white text-amiko-muted hover:border-amiko-green/40 hover:bg-amiko-mint"
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>

          <section className="mt-4 rounded-3xl border border-slate-100 bg-white p-5 shadow-card">
            <label htmlFor="note" className="text-base font-black text-amiko-ink">
              Algo que quieras recordar
            </label>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="focus-ring mt-3 min-h-28 w-full resize-none rounded-2xl border border-blue-100 bg-amiko-sky/30 px-4 py-3 text-sm font-bold leading-6 text-amiko-ink outline-none placeholder:text-slate-400"
              placeholder="Un logro, un desafío o algo que funcionó mejor de lo esperado..."
            />
            <button
              type="button"
              onClick={handleSave}
              className="focus-ring mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-amiko-green px-5 text-sm font-black text-white shadow-card transition hover:brightness-95"
            >
              <AmikoIcon name="check" className="h-5 w-5" />
              Guardar registro
            </button>
          </section>
        </>
      )}
    </DetailShell>
  );
}
