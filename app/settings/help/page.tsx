import Link from "next/link";
import { AmikoIcon } from "@/components/amiko-icon";
import { DetailShell } from "@/components/detail-shell";
import { TrustNote } from "@/components/settings-ui";

const helpItems = [
  {
    title: "¿Qué hace AMIKO?",
    body: "Ayuda a padres, madres y cuidadores a convertir tareas escolares en pasos más claros para acompañar al estudiante.",
    icon: "sparkles" as const,
    tone: "bg-amiko-sky text-amiko-blue",
  },
  {
    title: "¿Cómo adapto una tarea?",
    body: "Puedes escribir o pegar la consigna. AMIKO la organiza en una explicación simple, pasos breves y sugerencias para acompañar.",
    icon: "task" as const,
    tone: "bg-amiko-blue text-white",
  },
  {
    title: "¿Cómo registro avances?",
    body: "Usa Mi Día o Historial para guardar qué funcionó, qué costó y qué apoyo ayudó. No busca juzgar el día.",
    icon: "journal" as const,
    tone: "bg-amiko-mint text-green-800",
  },
  {
    title: "¿Qué pasa si la IA se equivoca?",
    body: "Toma la respuesta como una guía inicial. Revísala, ajusta el lenguaje y acompaña al estudiante con calma. Si hay riesgo o angustia intensa, busca apoyo profesional.",
    icon: "help" as const,
    tone: "bg-amiko-cream text-amiko-navy",
  },
  {
    title: "¿AMIKO diagnostica?",
    body: "No. AMIKO es apoyo pedagógico. No reemplaza a docentes, terapeutas, médicos ni psicólogos.",
    icon: "shield" as const,
    tone: "bg-amiko-navy text-white",
  },
];

export default function HelpSettingsPage() {
  return (
    <DetailShell title="Centro de ayuda" backHref="/settings" fallbackHref="/settings">
      <TrustNote title="Ayuda para acompañar mejor" icon="resources">
        Este centro reúne respuestas cortas para usar AMIKO sin perder el foco: tareas más claras, adulto más tranquilo y datos mínimos.
      </TrustNote>

      <div className="mb-5 space-y-3">
        {helpItems.map((item) => (
          <article key={item.title} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-card">
            <div className="flex items-start gap-3">
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${item.tone}`}>
                <AmikoIcon name={item.icon} className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="font-black leading-tight text-amiko-ink">{item.title}</h2>
                <p className="mt-1.5 text-sm font-bold leading-6 text-amiko-muted">{item.body}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <section className="mb-5 rounded-2xl border border-slate-100 bg-white p-4 shadow-card">
        <h2 className="text-lg font-black text-amiko-ink">Cuando algo no funciona</h2>
        <p className="mt-2 text-sm font-bold leading-6 text-amiko-muted">
          Si la IA no responde, intenta de nuevo con una consigna más corta. Si el problema sigue, conserva la tarea y vuelve más tarde.
        </p>
        <p className="mt-3 rounded-2xl bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-amiko-muted">
          Reportar errores o contactar soporte estará disponible cuando exista un canal real de atención.
        </p>
      </section>

      <div className="grid gap-3">
        <Link
          href="/adapt-task"
          className="focus-ring flex min-h-12 items-center justify-center rounded-full bg-amiko-blue px-5 text-sm font-black text-white shadow-card transition hover:bg-amiko-navy"
        >
          Adaptar una tarea
        </Link>
        <Link
          href="/faq"
          className="focus-ring flex min-h-12 items-center justify-center rounded-full border border-amiko-blue bg-white px-5 text-sm font-black text-amiko-blue"
        >
          Ver preguntas frecuentes
        </Link>
      </div>
    </DetailShell>
  );
}
