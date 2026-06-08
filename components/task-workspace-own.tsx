"use client";

import { useState } from "react";
import { AmikoIcon, type AmikoIconName } from "@/components/amiko-icon";
// z-[60] > StudentShell nav z-40
const studentFixedSurface =
  "fixed inset-0 z-[60] flex flex-col overflow-hidden bg-white text-amiko-ink sm:left-1/2 sm:right-auto sm:w-full sm:max-w-[430px] sm:-translate-x-1/2 sm:shadow-[0_24px_80px_rgba(9,54,124,0.24)] sm:ring-1 sm:ring-white/70";

type SourceItem = {
  id: string;
  type: "foto" | "audio" | "texto";
  label: string;
  preview: string;
};

type UploadOption = {
  key: SourceItem["type"];
  icon: AmikoIconName;
  label: string;
  sublabel: string;
};

const uploadOptions: UploadOption[] = [
  {
    key: "foto",
    icon: "camera",
    label: "Tomar foto",
    sublabel: "Foto de la tarea o pizarra",
  },
  {
    key: "foto",
    icon: "image",
    label: "Subir imagen",
    sublabel: "Desde tu galeria",
  },
  {
    key: "texto",
    icon: "task",
    label: "Pegar texto",
    sublabel: "Copia la consigna aqui",
  },
  {
    key: "audio",
    icon: "mic",
    label: "Grabar audio",
    sublabel: "Cuenta la tarea en voz alta",
  },
];

const helpChips = [
  "No entiendo por donde empezar",
  "Quiero pasos cortos",
  "Necesito explicarlo distinto",
  "Quiero pedir ayuda",
];

export function TaskWorkspaceOwn({ onExit }: { onExit: () => void }) {
  const [sources, setSources] = useState<SourceItem[]>([]);
  const [showUpload, setShowUpload] = useState(false);

  function addSource(option: UploadOption) {
    setSources((current) => [
      ...current,
      {
        id: `${option.key}-${Date.now()}`,
        type: option.key,
        label: option.label,
        preview: option.sublabel,
      },
    ]);
    setShowUpload(false);
  }

  return (
    <div className={`${studentFixedSurface} bg-white`}>
      <header className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-white px-4 py-3 shadow-sm">
        <button
          type="button"
          onClick={onExit}
          className="focus-ring flex h-10 w-10 items-center justify-center rounded-full text-amiko-navy transition hover:bg-amiko-sky"
          aria-label="Volver"
        >
          <AmikoIcon name="back" className="h-5 w-5" />
        </button>

        <div className="flex-1 px-3 text-center">
          <p className="text-base font-black text-amiko-ink">Mi tarea</p>
          <p className="text-[10px] font-bold text-amiko-muted">
            Materiales y ayuda de Amiko
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amiko-mint text-amiko-green">
          <AmikoIcon name="task" className="h-5 w-5" />
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
        <section className="rounded-[28px] bg-amiko-sky/40 p-5">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-amiko-green">
            Comparte la tarea
          </p>
          <h1 className="mt-2 text-2xl font-black leading-tight text-amiko-ink">
            Agrega una foto, audio o texto.
          </h1>
          <p className="mt-2 text-sm font-bold leading-6 text-amiko-muted">
            Amiko te ayuda a ordenar lo que hay que hacer.
          </p>
        </section>

        <section className="mt-5">
          {sources.length === 0 && !showUpload ? (
            <div className="rounded-[26px] border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-amiko-blue shadow-sm">
                <AmikoIcon name="clip" className="h-8 w-8" />
              </div>
              <p className="mt-3 text-sm font-black text-amiko-muted">
                Todavia no agregaste nada.
              </p>
            </div>
          ) : null}

          {sources.length > 0 ? (
            <div className="space-y-2">
              {sources.map((source) => (
                <div
                  key={source.id}
                  className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amiko-sky text-amiko-blue">
                    <AmikoIcon
                      name={source.type === "foto" ? "image" : source.type === "audio" ? "mic" : "task"}
                      className="h-5 w-5"
                    />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-black text-amiko-ink">{source.label}</span>
                    <span className="block truncate text-xs font-bold text-amiko-muted">
                      {source.preview}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setSources((current) => current.filter((item) => item.id !== source.id))}
                    className="focus-ring flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-amiko-muted transition hover:bg-red-50 hover:text-red-400"
                    aria-label="Eliminar material"
                  >
                    <AmikoIcon name="close" className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : null}

          {showUpload ? (
            <div className="mt-4 rounded-[26px] border border-blue-100 bg-amiko-sky/30 p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-black text-amiko-ink">Como quieres agregar?</p>
                <button
                  type="button"
                  onClick={() => setShowUpload(false)}
                  className="focus-ring flex h-8 w-8 items-center justify-center rounded-full bg-white text-amiko-muted"
                  aria-label="Cerrar opciones"
                >
                  <AmikoIcon name="close" className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-2">
                {uploadOptions.map((option) => (
                  <button
                    key={`${option.label}-${option.icon}`}
                    type="button"
                    onClick={() => addSource(option)}
                    className="focus-ring flex w-full items-center gap-3 rounded-2xl bg-white px-4 py-3 text-left shadow-sm transition active:scale-[0.98]"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amiko-sky text-amiko-blue">
                      <AmikoIcon name={option.icon} className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block text-sm font-black text-amiko-ink">
                        {option.label}
                      </span>
                      <span className="block text-xs font-bold text-amiko-muted">
                        {option.sublabel}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowUpload(true)}
              className="focus-ring mt-4 flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-amiko-green px-5 text-sm font-black text-white shadow-card transition active:scale-[0.98]"
            >
              <AmikoIcon name="plus" className="h-5 w-5" />
              Anadir material
            </button>
          )}
        </section>

        <section className="mt-6">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-amiko-muted">
            Amiko puede ayudarte con
          </p>
          <div className="flex flex-wrap gap-2">
            {helpChips.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-blue-100 bg-white px-3 py-2 text-xs font-black text-amiko-blue shadow-sm"
              >
                {chip}
              </span>
            ))}
          </div>
        </section>

        <p className="mt-6 text-center text-xs font-bold leading-5 text-amiko-muted">
          Demo visual. El analisis real de archivos se conectara mas adelante.
        </p>
      </main>
    </div>
  );
}
