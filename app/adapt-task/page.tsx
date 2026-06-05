"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AmikoIcon } from "@/components/amiko-icon";
import { DetailShell } from "@/components/detail-shell";

const quickOptions = [
  "Pasos muy simples",
  "Necesita apoyo visual",
  "Puede causar frustración",
  "Tarea larga",
];

export default function AdaptTaskPage() {
  const router = useRouter();
  const [task, setTask] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>(["Pasos muy simples"]);
  const [error, setError] = useState("");

  function toggleOption(option: string) {
    setSelectedOptions((current) =>
      current.includes(option) ? current.filter((item) => item !== option) : [...current, option],
    );
  }

  function handleAdapt() {
    if (!task.trim()) {
      setError("Escribe o pega la tarea para que Amiko pueda adaptarla.");
      return;
    }

    setError("");
    router.push("/tasks/task-1");
  }

  return (
    <DetailShell title="Adaptar tarea" fallbackHref="/acompanamiento">
      <section className="mb-6">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-amiko-green">
          Acompañamiento
        </p>
        <h1 className="mt-2 text-3xl font-black leading-tight text-amiko-ink">Adaptar tarea</h1>
        <p className="mt-3 text-base font-bold leading-7 text-amiko-muted">
          Comparte la consigna como la recibiste. Amiko te ayudará a volverla más clara.
        </p>
      </section>

      <section className="mb-5 rounded-[24px] bg-gradient-to-br from-amiko-blue to-amiko-navy p-5 text-white shadow-soft">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white">
            <AmikoIcon name="sparkles" className="h-6 w-6" />
          </span>
          <div>
            <h2 className="font-black">No necesitas simplificarla antes</h2>
            <p className="mt-1 text-sm font-bold leading-6 text-blue-100">
              Escríbela tal como la envió el docente. Vamos paso a paso desde ahí.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-[24px] border border-slate-100 bg-white p-5 shadow-card">
        <label htmlFor="task" className="text-sm font-black text-amiko-ink">
          ¿Qué tarea necesita apoyo?
        </label>
        <textarea
          id="task"
          value={task}
          onChange={(event) => setTask(event.target.value)}
          placeholder="Ejemplo: Lee el texto sobre los animales y responde tres preguntas."
          className="focus-ring mt-3 min-h-40 w-full resize-none rounded-2xl border border-blue-100 bg-amiko-sky/30 px-4 py-4 text-base font-bold leading-7 text-amiko-ink outline-none placeholder:text-slate-400"
        />

        <div className="mt-5">
          <p className="text-sm font-black text-amiko-ink">¿Qué podría ayudar?</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {quickOptions.map((option) => {
              const active = selectedOptions.includes(option);

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleOption(option)}
                  className={`focus-ring rounded-full border px-4 py-2 text-sm font-black transition ${
                    active
                      ? "border-amiko-green bg-amiko-mint text-green-900"
                      : "border-slate-200 bg-white text-amiko-muted"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        {error ? (
          <p className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
            {error}
          </p>
        ) : null}

        <button
          type="button"
          onClick={handleAdapt}
          className="focus-ring mt-6 flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-amiko-green px-6 text-base font-black text-white shadow-card transition hover:brightness-95"
        >
          <AmikoIcon name="sparkles" className="h-5 w-5" />
          Adaptar con Amiko
        </button>

        <button
          type="button"
          className="focus-ring mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 text-sm font-black text-amiko-muted"
        >
          <AmikoIcon name="image" className="h-5 w-5" />
          Subir foto de la tarea
          <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-black text-slate-500">
            Próximamente
          </span>
        </button>
      </section>
    </DetailShell>
  );
}
