"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AmikoIcon } from "@/components/amiko-icon";
import { DetailShell } from "@/components/detail-shell";
import { CHAT_HOME_PATH, withChatFrom } from "@/lib/chat-navigation";

const faqs = [
  {
    q: "¿Cómo funciona Amiko?",
    a: "Amiko es un asistente pedagógico con IA que ayuda a cuidadores y padres a acompañar tareas escolares de niños con TEA. Puedes subir una foto de la tarea, describirla o escribir una pregunta, y Amiko la convierte en pasos claros y fáciles de acompañar.",
  },
  {
    q: "¿Puedo subir una foto de la tarea?",
    a: "Sí. En la sección Chat IA puedes seleccionar una foto desde tu cámara o galería. Amiko analizará la imagen y te ayudará a dividir la tarea en pasos cortos adaptados al estudiante.",
  },
  {
    q: "¿Necesito conexión a internet?",
    a: "Sí, Amiko requiere conexión para procesar la IA y sincronizar el perfil del estudiante. Los registros de tarea se guardan localmente y se sincronizan cuando hay conexión.",
  },
  {
    q: "¿Cómo veo el progreso del estudiante?",
    a: 'En la sección "Logros" puedes ver los avances de la semana, las habilidades en camino y los logros recientes. Los datos se actualizan automáticamente con cada tarea que acompañas.',
  },
  {
    q: "¿Es segura la información del estudiante?",
    a: "Sí. La información del perfil del estudiante solo es visible para las personas que tú invites a su red de apoyo. Amiko no comparte datos sin tu confirmación.",
  },
  {
    q: "¿Amiko puede diagnosticar?",
    a: "No. Amiko es apoyo pedagógico. No diagnostica condiciones ni reemplaza a docentes, terapeutas o profesionales de salud. Su función es ayudar a acompañar mejor el aprendizaje.",
  },
  {
    q: "¿Cómo invito a otra persona a la red de apoyo?",
    a: 'En la sección Comunidad encontrarás la opción "Invitar persona". Puedes elegir qué información puede ver cada miembro de la red.',
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="focus-ring flex w-full items-center gap-3 px-4 py-4 text-left transition hover:bg-slate-50"
        aria-expanded={open}
      >
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition ${
            open ? "border-amiko-green bg-amiko-green text-white" : "border-slate-200 text-slate-400"
          }`}
        >
          <AmikoIcon name={open ? "check" : "plus"} className="h-3.5 w-3.5" />
        </span>
        <span className="flex-1 text-sm font-black leading-5 text-amiko-ink">{q}</span>
      </button>
      {open ? (
        <div className="border-t border-slate-100 px-4 pb-4 pt-3">
          <p className="text-sm font-bold leading-6 text-amiko-muted">{a}</p>
        </div>
      ) : null}
    </div>
  );
}

export default function FAQPage() {
  return (
    <DetailShell title="Preguntas frecuentes" fallbackHref="/settings">
      <div className="mb-5 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amiko-mint text-amiko-green">
          <AmikoIcon name="help" className="h-5 w-5" />
        </span>
        <h2 className="text-2xl font-black text-amiko-green">Preguntas frecuentes</h2>
      </div>

      <div className="space-y-3">
        {faqs.map((faq) => (
          <FAQItem key={faq.q} q={faq.q} a={faq.a} />
        ))}
      </div>

      {/* CTA Preguntar a Amiko */}
      <Link
        href={withChatFrom(CHAT_HOME_PATH, "/faq")}
        className="focus-ring mt-6 flex items-center gap-4 rounded-2xl border-2 border-amiko-green bg-gradient-to-r from-amiko-mint/60 to-white p-4 shadow-card transition hover:-translate-y-0.5"
      >
        <Image
          src="/amiko-character/amiko-icon.svg"
          alt="Amiko"
          width={52}
          height={52}
          className="shrink-0 object-contain"
        />
        <div className="min-w-0 flex-1">
          <p className="font-black text-amiko-navy">Preguntar a Amiko</p>
          <p className="mt-0.5 text-xs font-bold leading-4 text-amiko-muted">
            Usa el chat con Amiko o accede a la sección de <strong>ayuda</strong> dentro de tu perfil.
          </p>
        </div>
        <AmikoIcon name="chevron" className="h-5 w-5 shrink-0 text-amiko-green" />
      </Link>
    </DetailShell>
  );
}
