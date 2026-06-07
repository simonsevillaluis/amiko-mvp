import Image from "next/image";
import Link from "next/link";
import { AmikoIcon, type AmikoIconName } from "@/components/amiko-icon";
import { DetailShell } from "@/components/detail-shell";
import { CHAT_CONVERSATION_PATH, withChatFrom } from "@/lib/chat-navigation";

const wellnessSections: Array<{
  title: string;
  items: Array<{
    title: string;
    description: string;
    duration: string;
    icon: AmikoIconName;
    tone: string;
  }>;
}> = [
  {
    title: "Respiración guiada",
    items: [
      {
        title: "Respiración 4-7-8",
        description: "Inhala 4, sostén 7 y suelta 8. Útil antes de volver a explicar.",
        duration: "5 min",
        icon: "calm",
        tone: "bg-amiko-sky text-amiko-blue",
      },
      {
        title: "Respiración cuadrada",
        description: "Inhala, sostén, exhala y pausa en cuatro tiempos iguales.",
        duration: "4 min",
        icon: "clock",
        tone: "bg-amiko-mint text-green-800",
      },
    ],
  },
  {
    title: "Calmar frustración",
    items: [
      {
        title: "Soltar tensión",
        description: "Relaja hombros, manos y mandíbula antes de retomar la tarea.",
        duration: "3 min",
        icon: "heart",
        tone: "bg-amiko-cream text-amiko-navy",
      },
      {
        title: "Frase de regreso",
        description: "Prepara una frase corta para acompañar al estudiante sin presionar.",
        duration: "2 min",
        icon: "sparkles",
        tone: "bg-blue-50 text-amiko-blue",
      },
    ],
  },
];

const quickNeeds = [
  "Necesito calmarme",
  "Quiero retomar sin presión",
  "No sé qué decir",
  "La tarea se puso difícil",
];

function getWellnessChatHref(need: string) {
  const params = new URLSearchParams({ mode: "calma", need });
  return withChatFrom(`${CHAT_CONVERSATION_PATH}?${params.toString()}`, "/bienestar");
}

export default function BienestarPage() {
  return (
    <DetailShell title="Bienestar" fallbackHref="/acompanamiento">
      <section className="mb-6">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-amiko-green">
          Herramienta de bienestar
        </p>
        <h1 className="mt-2 text-3xl font-black leading-tight text-amiko-ink">
          Pausas para acompañar mejor
        </h1>
        <p className="mt-3 text-base font-bold leading-7 text-amiko-muted">
          Técnicas breves para recuperar calma, ordenar la situación y volver con un paso más pequeño.
        </p>
      </section>

      <section className="mb-6 overflow-hidden rounded-[28px] border border-blue-100 bg-gradient-to-br from-amiko-sky via-white to-amiko-mint p-5 shadow-card">
        <div className="flex items-center gap-4">
          <Image
            src="/amiko-character/amiko-icon.svg"
            alt=""
            width={74}
            height={74}
            className="shrink-0 object-contain"
            priority
          />
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-amiko-green">
              Un minuto también cuenta
            </p>
            <h2 className="mt-1 text-xl font-black leading-tight text-amiko-navy">
              Pausar no es rendirse
            </h2>
            <p className="mt-2 text-sm font-bold leading-6 text-amiko-muted">
              Si una tarea se bloquea, primero bajamos la carga. Después elegimos un siguiente paso.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="mb-3 text-xl font-black text-amiko-ink">¿Qué necesitas ahora?</h2>
        <div className="flex flex-wrap gap-2">
          {quickNeeds.map((need, index) => (
            <Link
              key={need}
              href={getWellnessChatHref(need)}
              className={`focus-ring rounded-full border px-4 py-2 text-sm font-black transition ${
                index === 0
                  ? "border-amiko-green bg-amiko-green text-white shadow-sm"
                  : "border-slate-200 bg-white text-amiko-muted hover:border-amiko-green/40 hover:bg-amiko-mint"
              }`}
            >
              {need}
            </Link>
          ))}
        </div>
      </section>

      {wellnessSections.map((section) => (
        <section key={section.title} className="mb-6">
          <h2 className="mb-3 text-xl font-black text-amiko-ink">{section.title}</h2>
          <div className="space-y-3">
            {section.items.map((exercise) => (
              <article
                key={exercise.title}
                className="rounded-[22px] border border-blue-100 bg-white p-4 shadow-card"
              >
                <div className="flex items-start gap-4">
                  <span
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${exercise.tone}`}
                  >
                    <AmikoIcon name={exercise.icon} className="h-7 w-7" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-black leading-tight text-amiko-ink">
                      {exercise.title}
                    </h3>
                    <p className="mt-1 text-sm font-bold leading-5 text-amiko-muted">
                      {exercise.description}
                    </p>
                    <div className="mt-3 flex items-center justify-between gap-3 border-t border-blue-100 pt-3">
                      <span className="flex items-center gap-1 text-xs font-black text-amiko-muted">
                        <AmikoIcon name="clock" className="h-4 w-4 text-amiko-green" />
                        {exercise.duration}
                      </span>
                      <button
                        type="button"
                        className="focus-ring inline-flex items-center gap-2 rounded-full bg-amiko-green px-4 py-2 text-xs font-black text-white shadow-sm transition hover:brightness-95"
                      >
                        <AmikoIcon name="play" className="h-4 w-4" />
                        Comenzar
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}

      <section className="rounded-[24px] bg-amiko-sky px-4 py-4">
        <p className="text-sm font-bold leading-6 text-amiko-navy">
          Estas pausas son apoyo cotidiano para el cuidador. Amiko no reemplaza orientación profesional
          cuando una situación requiere acompañamiento especializado.
        </p>
      </section>
    </DetailShell>
  );
}
