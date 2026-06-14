"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AmikoIcon, type AmikoIconName } from "@/components/amiko-icon";
import { AppShell } from "@/components/app-shell";
import { CHAT_HOME_PATH } from "@/lib/chat-navigation";

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
    description: "Sube una fuente, pega la consigna o cuéntame qué necesita tu estudiante.",
    chips: ["No sabe empezar", "La consigna es larga", "Necesita pasos cortos", "Mejor con apoyo visual"],
    placeholder: "Ej: La tarea pide resolver varias instrucciones y no sabe cuál hacer primero.",
    helper: "Amiko preparará un primer paso claro, apoyos visuales y una forma sencilla de acompañar.",
    cta: "Preparar ayuda con Amiko",
  },
  calma: {
    eyebrow: "Calma para acompañar",
    title: "Primero cuidamos el tono",
    description: "Pensado para ti, como adulto: Amiko te ayuda a sostener la calma y retomar con tu estudiante.",
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

// ─── Source options (bottom sheet) ────────────────────────────────────────────

type SourceKey = "pdf" | "audio" | "imagen" | "web" | "youtube" | "texto";

const SOURCE_OPTIONS: Array<{
  key: SourceKey;
  label: string;
  sublabel: string;
  icon: AmikoIconName;
  premium: boolean;
}> = [
  { key: "pdf",     label: "PDF",          sublabel: "Documento de texto o guía",   icon: "resources", premium: true  },
  { key: "audio",   label: "Audio",        sublabel: "Grabación o nota de voz",      icon: "mic",       premium: true  },
  { key: "imagen",  label: "Foto / Captura", sublabel: "Foto de la tarea o pizarrón", icon: "camera",   premium: true  },
  { key: "web",     label: "Sitio web",    sublabel: "Enlace o página de internet",  icon: "task",      premium: true  },
  { key: "youtube", label: "YouTube",      sublabel: "Video o explicación en línea", icon: "play",      premium: true  },
  { key: "texto",   label: "Texto copiado", sublabel: "Pega la consigna directamente", icon: "journal", premium: false },
];


// ─── Component ────────────────────────────────────────────────────────────────

const UPCOMING_SOURCE_COPY: Record<string, { title: string; subtitle: string; benefits: string[] }> = {
  pdf:     { title: "PDFs en desarrollo",    subtitle: "Pronto podras compartir documentos de forma clara y segura.", benefits: ["Pedir permiso antes de subir", "Mostrar que se guardara", "Mantener el foco pedagogico"] },
  audio:   { title: "Audio en desarrollo",   subtitle: "La grabacion de notas de voz todavia no esta activa en este MVP.", benefits: ["Control del adulto", "Transcripcion clara", "Privacidad desde el inicio"] },
  imagen:  { title: "Fotos en desarrollo",   subtitle: "La camara y los archivos se activaran mas adelante.", benefits: ["Permiso explicito", "Uso solo cuando tu eliges", "Sin prometer analisis clinico"] },
  web:     { title: "Enlaces en desarrollo", subtitle: "Mas adelante AMIKO podra ayudarte a revisar enlaces compartidos.", benefits: ["Fuentes visibles", "Resumen pedagogico", "Sin salir del flujo principal"] },
  youtube: { title: "Videos en desarrollo",  subtitle: "El analisis de videos todavia no forma parte del MVP.", benefits: ["Resumen claro", "Uso con acompanamiento adulto", "Sin sobrecargar la experiencia"] },
};

export default function AmikoIAPage() {
  const [selectedMode, setSelectedMode] = useState<ModeKey>("tareas");
  const [selectedChoices, setSelectedChoices] = useState<Record<ModeKey, string[]>>({
    tareas:   [modePanels.tareas.chips[0]],
    calma:    [modePanels.calma.chips[0]],
    registro: [modePanels.registro.chips[0]],
    mensajes: [modePanels.mensajes.chips[0]],
  });
  const [contextNote, setContextNote] = useState("");
  const [selectedSource, setSelectedSource] = useState<SourceKey | null>(null);

  // Bottom sheet
  const [showSheet, setShowSheet] = useState(false);

  // Premium modal
  const [premiumSource, setPremiumSource] = useState<SourceKey | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const selectedModeMeta = modes.find((m) => m.key === selectedMode) ?? modes[0];
  const selectedPanel = modePanels[selectedMode];
  const activeChips = selectedChoices[selectedMode];

  const conversationParams = new URLSearchParams({ mode: selectedMode, need: activeChips.join(",") });
  conversationParams.set("from", CHAT_HOME_PATH);
  if (contextNote.trim()) conversationParams.set("note", contextNote.trim());
  if (selectedSource && selectedSource !== "texto") conversationParams.set("attachment", selectedSource);
  const conversationHref = `/adapt-task/chat/conversation?${conversationParams.toString()}`;
  const hasContext = contextNote.trim().length > 0;

  // Lock body scroll when a sheet/modal is open
  useEffect(() => {
    const isOpen = showSheet || premiumSource !== null;
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [showSheet, premiumSource]);

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

  function handleSourceSelect(key: SourceKey) {
    if (key === "texto") {
      setSelectedSource("texto");
      setShowSheet(false);
      setTimeout(() => textareaRef.current?.focus(), 300);
      return;
    }
    setShowSheet(false);
    setPremiumSource(key);
  }

  function closePremium() {
    setPremiumSource(null);
    setSelectedSource(null);
  }

  const sourceLabel = selectedSource
    ? SOURCE_OPTIONS.find((s) => s.key === selectedSource)?.label ?? null
    : null;

  return (
    <>
      <AppShell>
        <section className="mb-5">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-amiko-green">
            Asistente guiado
          </p>
          <h1 className="mt-2 text-3xl font-black leading-tight text-amiko-ink">Amiko IA</h1>
          <p className="mt-2 text-base font-bold leading-7 text-amiko-muted">
            Elige qué necesitas ahora. Amiko usará el perfil de tu estudiante para ayudarte con más claridad.
          </p>
        </section>

        {/* Quick-start */}
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

          {/* Chips */}
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

          {/* Subir fuente + Tomar foto — solo en modo tareas */}
          {selectedMode === "tareas" && (
            <div className="mt-4 flex items-stretch gap-2">
              {/* Subir fuente (clip) */}
              <button
                type="button"
                onClick={() => setShowSheet(true)}
                className={`focus-ring flex flex-1 items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition ${
                  selectedSource
                    ? "border-amiko-green bg-amiko-mint"
                    : "border-blue-100 bg-slate-50 hover:border-amiko-blue/40 hover:bg-amiko-sky"
                }`}
              >
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                  selectedSource ? "bg-amiko-green text-white" : "bg-white text-amiko-blue shadow-sm"
                }`}>
                  <AmikoIcon name="clip" className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className={`block text-sm font-black ${selectedSource ? "text-green-800" : "text-amiko-blue"}`}>
                    {selectedSource ? `${sourceLabel} ✓` : "Subir fuente"}
                  </span>
                  <span className="block text-[11px] font-bold text-amiko-muted">
                    {selectedSource ? "Toca para cambiar" : "PDF, audio, web, YouTube…"}
                  </span>
                </span>
                <AmikoIcon name="chevron" className={`h-4 w-4 shrink-0 ${selectedSource ? "text-amiko-green" : "text-slate-400"}`} />
              </button>

              {/* Tomar foto */}
              <button
                type="button"
                onClick={() => { setShowSheet(false); setPremiumSource("imagen"); }}
                className="focus-ring flex shrink-0 flex-col items-center justify-center gap-1 rounded-2xl border border-blue-100 bg-slate-50 px-3.5 py-2 transition hover:border-amiko-blue/40 hover:bg-amiko-sky"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-amiko-blue shadow-sm">
                  <AmikoIcon name="camera" className="h-5 w-5" />
                </span>
                <span className="text-[10px] font-black leading-tight text-amiko-muted">
                  Tomar foto
                </span>
              </button>
            </div>
          )}

          {/* Context note */}
          <label className="mt-4 block">
            <span className="text-sm font-black text-amiko-ink">Cuéntame un poco</span>
            <textarea
              ref={textareaRef}
              rows={4}
              value={contextNote}
              onChange={(e) => setContextNote(e.target.value)}
              placeholder={selectedSource === "texto" ? "Pega aquí la instrucción o consigna de la tarea…" : selectedPanel.placeholder}
              className="focus-ring mt-2 w-full resize-none rounded-2xl border border-blue-100 bg-slate-50 px-4 py-3 text-sm font-bold leading-6 text-amiko-ink placeholder:text-slate-400"
            />
          </label>

          <div className="mt-3 rounded-2xl bg-amiko-sky px-4 py-3">
            <p className="text-xs font-bold leading-5 text-amiko-navy">{selectedPanel.helper}</p>
          </div>

          {hasContext ? (
            <Link
              href={conversationHref}
              className="focus-ring mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-amiko-blue px-5 text-sm font-black text-white shadow-card transition hover:brightness-95"
            >
              {selectedPanel.cta}
              <AmikoIcon name="chevron" className="h-5 w-5" />
            </Link>
          ) : (
            <div className="mt-4 space-y-2">
              <div
                aria-disabled="true"
                className="flex min-h-12 w-full cursor-not-allowed items-center justify-center gap-2 rounded-full bg-slate-200 px-5 text-sm font-black text-slate-400"
              >
                {selectedPanel.cta}
                <AmikoIcon name="chevron" className="h-5 w-5" />
              </div>
              <p className="text-center text-xs font-bold text-amiko-muted">
                Escribe una nota o selecciona una fuente para continuar.
              </p>
            </div>
          )}
        </section>
      </AppShell>

      {/* ── Bottom sheet overlay ── */}
      {showSheet && (
        <div
          className="fixed inset-0 z-[90] bg-amiko-navy/50 backdrop-blur-sm"
          onClick={() => setShowSheet(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Bottom sheet ── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Subir fuente"
        className={`fixed inset-x-0 bottom-0 z-[95] rounded-t-3xl bg-white shadow-soft transition-transform duration-300 ease-out ${
          showSheet ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Handle */}
        <div className="flex justify-center pb-1 pt-3">
          <div className="h-1 w-10 rounded-full bg-slate-200" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3">
          <h2 className="text-lg font-black text-amiko-ink">Subir fuente</h2>
          <button
            type="button"
            onClick={() => setShowSheet(false)}
            aria-label="Cerrar"
            className="focus-ring flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-amiko-muted transition hover:bg-slate-200"
          >
            <AmikoIcon name="close" className="h-5 w-5" />
          </button>
        </div>

        {/* Options */}
        <div className="px-4 pb-10">
          {SOURCE_OPTIONS.map((opt, i) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => handleSourceSelect(opt.key)}
              className={`flex w-full items-center gap-4 px-2 py-3.5 text-left transition hover:bg-slate-50 ${
                i < SOURCE_OPTIONS.length - 1 ? "border-b border-slate-100" : ""
              }`}
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amiko-sky text-amiko-blue">
                <AmikoIcon name={opt.icon} className="h-6 w-6" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-black text-amiko-ink">{opt.label}</span>
                <span className="block text-xs font-bold text-amiko-muted">{opt.sublabel}</span>
              </span>
              {opt.premium && (
                <span className="shrink-0 rounded-full bg-amiko-cream px-2.5 py-0.5 text-[10px] font-black text-amiko-navy">
                  Pronto
                </span>
              )}
              <AmikoIcon name="chevron" className="h-5 w-5 shrink-0 text-slate-300" />
            </button>
          ))}
        </div>
      </div>

      {/* ── Premium modal ── */}
      {premiumSource && (() => {
        const copy = UPCOMING_SOURCE_COPY[premiumSource];
        const opt  = SOURCE_OPTIONS.find((s) => s.key === premiumSource)!;
        return (
          <div
            className="fixed inset-0 z-[100] flex touch-none items-center justify-center overflow-hidden overscroll-none bg-[#161616]/85 px-5 py-4 backdrop-blur-[2px]"
            role="dialog"
            aria-modal="true"
          >
            <div className="w-full max-w-[330px] overflow-hidden rounded-3xl bg-white shadow-soft">
              <div className="bg-gradient-to-br from-amiko-navy to-[#082A61] px-5 py-5 text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                  <AmikoIcon name={opt.icon} className="h-6 w-6 text-white" />
                </span>
                <h2 className="mt-3 text-lg font-black text-white">{copy.title}</h2>
                <p className="mt-1.5 text-sm font-bold leading-5 text-blue-200">{copy.subtitle}</p>
              </div>
              <div className="px-5 py-4">
                <div className="space-y-2">
                  {copy.benefits.map((b) => (
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
                    href="/settings/permissions"
                    className="focus-ring flex min-h-11 items-center justify-center rounded-full bg-amiko-green px-4 text-sm font-black text-white shadow-card"
                  >
                    Ver permisos
                  </Link>
                  <button
                    type="button"
                    onClick={closePremium}
                    className="focus-ring min-h-11 rounded-full border-2 border-amiko-navy px-4 text-sm font-black text-amiko-navy"
                  >
                    Ahora no
                  </button>
                </div>
                <p className="mt-2 text-center text-xs font-bold text-amiko-muted">
                  Esta opcion todavia no esta activa en el MVP.
                </p>
              </div>
            </div>
          </div>
        );
      })()}
    </>
  );
}
