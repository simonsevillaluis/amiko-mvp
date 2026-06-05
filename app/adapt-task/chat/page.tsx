"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AmikoIcon, type AmikoIconName } from "@/components/amiko-icon";
import { AppShell } from "@/components/app-shell";
import { student } from "@/lib/mock-data";

type ModeKey = "tareas" | "calma" | "registro" | "mensajes";

const modes: Array<{ key: ModeKey; title: string; icon: AmikoIconName; tone: string }> = [
  { key: "tareas",   title: "Tareas",   icon: "task",    tone: "bg-amiko-blue text-white" },
  { key: "calma",    title: "Calma",    icon: "calm",    tone: "bg-amiko-mint text-green-800" },
  { key: "registro", title: "Registro", icon: "journal", tone: "bg-amiko-cream text-amiko-navy" },
  { key: "mensajes", title: "Mensajes", icon: "mail",    tone: "bg-amiko-sky text-amiko-blue" },
];

const modePanels: Record<ModeKey, {
  eyebrow: string; title: string; description: string;
  chips: string[]; placeholder: string; helper: string; cta: string;
}> = {
  tareas: {
    eyebrow: "Aclara la tarea",
    title: "Dime qué parte se trabó",
    description: `Sube una foto, pega la consigna o cuéntame qué necesita ${student.name}.`,
    chips: ["No sabe empezar", "La consigna es larga", "Necesita pasos cortos", "Mejor con apoyo visual"],
    placeholder: "Ej: La tarea pide resolver varias instrucciones y no sabe cuál hacer primero.",
    helper: "Amiko preparará un primer paso claro, apoyos visuales y una forma sencilla de acompañar.",
    cta: "Preparar ayuda con Amiko",
  },
  calma: {
    eyebrow: "Calma para acompañar",
    title: "Primero cuidamos el tono",
    description: `Pensado para ti, como adulto: Amiko te ayuda a sostener la calma y retomar con ${student.name}.`,
    chips: ["Se frustró", "Me estoy saturando", "Necesitamos pausa", "Volver a intentar"],
    placeholder: "Ej: Me cuesta saber qué decir cuando se bloquea con la tarea.",
    helper: "Amiko sugerirá una respuesta breve, una pausa posible y una forma tranquila de volver a la actividad.",
    cta: "Buscar una forma tranquila",
  },
  registro: {
    eyebrow: "Guardar lo importante",
    title: "Registra lo que funcionó",
    description: "Un registro corto ayuda a ver patrones sin convertir el día en un cuestionario.",
    chips: ["Completó un paso", "Pidió ayuda", "Usó una pausa", "Costó retomar"],
    placeholder: "Ej: Hoy logró leer la primera instrucción con apoyo visual.",
    helper: "Amiko organizará el registro para que luego puedas revisar avances y apoyos útiles.",
    cta: "Guardar y ordenar registro",
  },
  mensajes: {
    eyebrow: "Comunicar mejor",
    title: "Prepara una nota clara",
    description: "Para escribirle a un docente, familiar o cuidador sin sonar frío ni demasiado largo.",
    chips: ["Para docente", "Para familia", "Resumen breve", "Pedir un apoyo"],
    placeholder: "Ej: Quiero contarle a la maestra que hoy necesitó instrucciones más cortas.",
    helper: "Amiko puede ayudarte a redactar un mensaje amable, concreto y fácil de entender.",
    cta: "Redactar con Amiko",
  },
};

export default function AmikoIAPage() {
  const [showCameraPermission, setShowCameraPermission] = useState(false);
  const [showFilePermission, setShowFilePermission] = useState(false);
  const [selectedMode, setSelectedMode] = useState<ModeKey>("tareas");
  // Multi-select per mode (except mensajes which is single-select)
  const [selectedChoices, setSelectedChoices] = useState<Record<ModeKey, string[]>>({
    tareas:   [modePanels.tareas.chips[0]],
    calma:    [modePanels.calma.chips[0]],
    registro: [modePanels.registro.chips[0]],
    mensajes: [modePanels.mensajes.chips[0]],
  });
  const [contextNote, setContextNote] = useState("");
  const [attachmentChoice, setAttachmentChoice] = useState<"foto" | "archivo" | null>(null);

  const selectedModeMeta = modes.find((m) => m.key === selectedMode) ?? modes[0];
  const selectedPanel = modePanels[selectedMode];
  const activeChips = selectedChoices[selectedMode];

  const conversationParams = new URLSearchParams({ mode: selectedMode, need: activeChips.join(",") });
  if (contextNote.trim()) conversationParams.set("note", contextNote.trim());
  if (attachmentChoice) conversationParams.set("attachment", attachmentChoice);
  const conversationHref = `/adapt-task/chat/conversation?${conversationParams.toString()}`;

  useEffect(() => {
    const isOpen = showCameraPermission || showFilePermission;
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [showCameraPermission, showFilePermission]);

  function toggleChip(chip: string) {
    if (selectedMode === "mensajes") {
      setSelectedChoices((c) => ({ ...c, [selectedMode]: [chip] }));
      return;
    }
    setSelectedChoices((c) => {
      const current = c[selectedMode];
      const next = current.includes(chip)
        ? current.filter((x) => x !== chip)
        : [...current, chip];
      return { ...c, [selectedMode]: next.length === 0 ? [chip] : next };
    });
  }

  return (
    <>
      <AppShell>
        <section className="mb-5">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-amiko-green">
            Asistente guiado
          </p>
          <h1 className="mt-2 text-3xl font-black leading-tight text-amiko-ink">Amiko IA</h1>
          <p className="mt-2 text-base font-bold leading-7 text-amiko-muted">
            Elige qué necesitas ahora. Amiko usará el perfil de {student.name} para ayudarte con más claridad.
          </p>
        </section>

        {/* Quick-start: go straight to chat */}
        <Link
          href={conversationHref}
          className="focus-ring mb-6 flex items-center gap-4 rounded-2xl border-2 border-amiko-green bg-amiko-sky px-4 py-4 shadow-card transition hover:-translate-y-0.5"
        >
          <Image
            src="/amiko-character/amiko-icon.svg"
            alt=""
            width={56}
            height={56}
            className="shrink-0 object-contain"
            priority
          />
          <span className="min-w-0 flex-1">
            <span className="block text-base font-black leading-tight text-amiko-navy">
              Hablar con el asistente IA
            </span>
            <span className="mt-1 block text-sm font-bold leading-5 text-amiko-muted">
              Cuéntame una duda sobre cualquier tarea.
            </span>
          </span>
          <AmikoIcon name="chevron" className="h-5 w-5 shrink-0 text-amiko-green" />
        </Link>

        {/* Mode tabs */}
        <section className="mb-4">
          <h2 className="text-xl font-black text-amiko-ink">¿Cómo quieres que te ayude?</h2>
          <p className="mt-1 text-sm font-bold leading-6 text-amiko-muted">
            Elige un camino y deja una pista. Así el chat empieza con contexto.
          </p>
          <div className="mt-3 grid grid-cols-4 gap-1 rounded-3xl border border-blue-100 bg-white p-1 shadow-card">
            {modes.map((mode) => {
              const isActive = selectedMode === mode.key;
              return (
                <button
                  key={mode.key}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setSelectedMode(mode.key)}
                  className={`focus-ring flex min-h-12 flex-col items-center justify-center gap-1 rounded-[20px] px-1.5 py-2 text-center transition ${
                    isActive ? "bg-amiko-green text-white shadow-sm" : "text-amiko-muted hover:bg-amiko-sky"
                  }`}
                >
                  <AmikoIcon name={mode.icon} className="h-4 w-4" />
                  <span className="block text-[10px] font-black leading-none">{mode.title}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Mode panel */}
        <section className="rounded-3xl border border-blue-100 bg-white p-4 shadow-soft">
          {/* Panel header */}
          <div className="flex items-start gap-3">
            <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${selectedModeMeta.tone}`}>
              <AmikoIcon name={selectedModeMeta.icon} className="h-6 w-6" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-amiko-green">
                {selectedPanel.eyebrow}
              </p>
              <h3 className="mt-1 text-xl font-black leading-tight text-amiko-ink">
                {selectedPanel.title}
              </h3>
              <p className="mt-1.5 text-sm font-bold leading-6 text-amiko-muted">
                {selectedPanel.description}
              </p>
            </div>
          </div>

          {/* Chips — multi-select (except mensajes) */}
          <div className="mt-3 border-t border-slate-100 pt-3">
            <div className="flex flex-wrap gap-2.5">
              {selectedPanel.chips.map((chip) => {
                const active = activeChips.includes(chip);
                return (
                  <button
                    key={chip}
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggleChip(chip)}
                    className={`focus-ring shrink-0 rounded-full border px-3 py-2 text-xs font-black transition ${
                      active
                        ? "border-amiko-green bg-amiko-green text-white shadow-sm"
                        : "border-slate-200 bg-white text-amiko-muted hover:border-amiko-green/40 hover:bg-amiko-mint"
                    }`}
                  >
                    {chip}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Attachment buttons — only in tareas mode */}
          {selectedMode === "tareas" ? (
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => { setAttachmentChoice("foto"); setShowCameraPermission(true); }}
                className={`focus-ring flex min-h-14 flex-col items-center justify-center gap-1.5 rounded-2xl border px-3 py-2 text-xs font-black transition ${
                  attachmentChoice === "foto"
                    ? "border-amiko-green bg-amiko-mint text-green-800"
                    : "border-blue-100 bg-slate-50 text-amiko-blue hover:border-amiko-blue/40 hover:bg-amiko-sky"
                }`}
              >
                <AmikoIcon name="camera" className="h-5 w-5" />
                Subir foto
                <span className="text-[10px] font-bold text-amiko-muted leading-none">
                  {attachmentChoice === "foto" ? "Seleccionado ✓" : "Cámara o galería"}
                </span>
              </button>
              <button
                type="button"
                onClick={() => { setAttachmentChoice("archivo"); setShowFilePermission(true); }}
                className={`focus-ring flex min-h-14 flex-col items-center justify-center gap-1.5 rounded-2xl border px-3 py-2 text-xs font-black transition ${
                  attachmentChoice === "archivo"
                    ? "border-amiko-green bg-amiko-mint text-green-800"
                    : "border-blue-100 bg-slate-50 text-amiko-blue hover:border-amiko-blue/40 hover:bg-amiko-sky"
                }`}
              >
                <AmikoIcon name="clip" className="h-5 w-5" />
                Adjuntar archivo
                <span className="text-[10px] font-bold text-amiko-muted leading-none">
                  {attachmentChoice === "archivo" ? "Seleccionado ✓" : "PDF, imagen, doc"}
                </span>
              </button>
            </div>
          ) : null}

          {/* Context note */}
          <label className="mt-4 block">
            <span className="text-sm font-black text-amiko-ink">Cuéntame un poco</span>
            <textarea
              rows={4}
              value={contextNote}
              onChange={(e) => setContextNote(e.target.value)}
              placeholder={selectedPanel.placeholder}
              className="focus-ring mt-2 w-full resize-none rounded-2xl border border-blue-100 bg-slate-50 px-4 py-3 text-sm font-bold leading-6 text-amiko-ink placeholder:text-slate-400"
            />
          </label>

          <div className="mt-3 rounded-2xl bg-amiko-sky px-4 py-3">
            <p className="text-xs font-bold leading-5 text-amiko-navy">{selectedPanel.helper}</p>
          </div>

          <Link
            href={conversationHref}
            className="focus-ring mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-amiko-blue px-5 text-sm font-black text-white shadow-card transition hover:brightness-95"
          >
            {selectedPanel.cta}
            <AmikoIcon name="chevron" className="h-5 w-5" />
          </Link>
        </section>
      </AppShell>

      {/* Premium modal — foto */}
      {showCameraPermission ? (
        <div
          className="fixed inset-0 z-[100] flex touch-none items-center justify-center overflow-hidden overscroll-none bg-[#161616]/85 px-5 py-4 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex w-full max-w-[330px] flex-col items-center">
            <Image
              src="/amiko-character/amiko-character-secondary.svg"
              alt="Amiko"
              width={100}
              height={100}
              className="mb-2 object-contain drop-shadow-lg"
              priority
            />
            <div className="w-full overflow-hidden rounded-3xl bg-white shadow-soft">
              <div className="bg-gradient-to-br from-amiko-navy to-[#082A61] px-5 py-4 text-center">
                <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                  <AmikoIcon name="camera" className="h-5 w-5 text-white" />
                </span>
                <h2 className="mt-2 text-lg font-black text-white">Sube fotos con Premium</h2>
                <p className="mt-1 text-xs font-bold leading-4 text-blue-200">
                  Sube la foto de la tarea y Amiko la analiza visualmente por ti.
                </p>
              </div>
              <div className="px-5 py-4">
                <div className="space-y-2">
                  {["Fotos y archivos ilimitados", "Análisis visual de tareas", "Sin límite de mensajes"].map((b) => (
                    <div key={b} className="flex items-center gap-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amiko-mint text-amiko-green">
                        <AmikoIcon name="check" className="h-3 w-3" />
                      </span>
                      <span className="text-sm font-bold text-amiko-ink">{b}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Link
                    href="/settings"
                    className="focus-ring flex min-h-11 items-center justify-center rounded-full bg-amiko-green px-4 text-sm font-black text-white shadow-card"
                  >
                    Ver Premium
                  </Link>
                  <button
                    type="button"
                    onClick={() => { setShowCameraPermission(false); setAttachmentChoice(null); }}
                    className="focus-ring min-h-11 rounded-full border-2 border-amiko-navy px-4 text-sm font-black text-amiko-navy"
                  >
                    Ahora no
                  </button>
                </div>
                <p className="mt-2 text-center text-xs font-bold text-amiko-muted">Próximamente disponible</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Premium modal — archivo */}
      {showFilePermission ? (
        <div
          className="fixed inset-0 z-[100] flex touch-none items-center justify-center overflow-hidden overscroll-none bg-[#161616]/85 px-5 py-4 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-[330px] overflow-hidden rounded-3xl bg-white shadow-soft">
            <div className="bg-gradient-to-br from-amiko-navy to-[#082A61] px-5 py-5 text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                <AmikoIcon name="clip" className="h-6 w-6 text-white" />
              </span>
              <h2 className="mt-3 text-lg font-black text-white">Adjunta archivos con Premium</h2>
              <p className="mt-1.5 text-sm font-bold leading-5 text-blue-200">
                Comparte PDFs, documentos e imágenes para que Amiko los analice contigo.
              </p>
            </div>
            <div className="px-5 py-4">
              <div className="space-y-2">
                {["PDFs, imágenes y documentos", "Análisis detallado del contenido", "Sin límite de archivos"].map((b) => (
                  <div key={b} className="flex items-center gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amiko-mint text-amiko-green">
                      <AmikoIcon name="check" className="h-3 w-3" />
                    </span>
                    <span className="text-sm font-bold text-amiko-ink">{b}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Link
                  href="/settings"
                  className="focus-ring flex min-h-11 items-center justify-center rounded-full bg-amiko-green px-4 text-sm font-black text-white shadow-card"
                >
                  Ver Premium
                </Link>
                <button
                  type="button"
                  onClick={() => { setShowFilePermission(false); setAttachmentChoice(null); }}
                  className="focus-ring min-h-11 rounded-full border-2 border-amiko-navy px-4 text-sm font-black text-amiko-navy"
                >
                  Ahora no
                </button>
              </div>
              <p className="mt-2 text-center text-xs font-bold text-amiko-muted">Próximamente disponible</p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
