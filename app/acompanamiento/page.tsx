import Link from "next/link";
import { AmikoIcon, type AmikoIconName } from "@/components/amiko-icon";
import { AppShell } from "@/components/app-shell";

const tools: Array<{
  title: string;
  description: string;
  href: string;
  icon: AmikoIconName;
  tone: string;
  badge?: string;
}> = [
  {
    title: "Adaptar tarea",
    description: "Convierte una consigna escolar en pasos simples y fáciles de acompañar.",
    href: "/adapt-task",
    icon: "task",
    tone: "bg-amiko-blue text-white",
  },
  {
    title: "Registro de tarea",
    description: "Guarda cómo fue la actividad de hoy, sin juzgar los días difíciles.",
    href: "/mi-dia",
    icon: "journal",
    tone: "bg-amiko-green text-white",
  },
  {
    title: "Historial de actividades",
    description: "Consulta tareas, registros, pausas y avances recientes.",
    href: "/historial",
    icon: "history",
    tone: "bg-amiko-navy text-white",
  },
  {
    title: "Bienestar",
    description: "Pausas breves, respiración y calma para acompañar mejor.",
    href: "/bienestar",
    icon: "calm",
    tone: "bg-amiko-coral text-white",
  },
  {
    title: "Logros",
    description: "Reconoce avances pequeños sin comparar ni exigir perfección.",
    href: "/logros",
    icon: "award",
    tone: "bg-amiko-cream text-amiko-navy",
  },
];

export default function RecursosPage() {
  return (
    <AppShell>
      <section className="mb-6">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-amiko-green">
          Herramientas
        </p>
        <h1 className="mt-2 text-3xl font-black leading-tight text-amiko-ink">Recursos</h1>
        <p className="mt-3 max-w-xl text-base font-bold leading-7 text-amiko-muted">
          Todo lo que necesitas para apoyar una tarea, registrar lo que pasó o cuidarte mientras acompañas.
        </p>
      </section>

      <section className="mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-amiko-mint via-white to-amiko-sky p-5 shadow-card">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-amiko-green shadow-sm">
            <AmikoIcon name="heart" className="h-7 w-7" />
          </span>
          <div>
            <h2 className="text-lg font-black text-amiko-ink">Hoy puedes empezar pequeño</h2>
            <p className="mt-1 text-sm font-bold leading-6 text-amiko-muted">
              Una instrucción clara o una pausa breve también son acompañamiento.
            </p>
          </div>
        </div>
      </section>

      {/* Tools */}
      <div className="mb-4 space-y-3">
        {tools.map((tool) => (
          <Link
            key={tool.title}
            href={tool.href}
            className="focus-ring flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-card transition hover:-translate-y-0.5"
          >
            <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${tool.tone}`}>
              <AmikoIcon name={tool.icon} className="h-6 w-6" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-black text-amiko-ink">{tool.title}</span>
              <span className="mt-1 block text-sm font-bold leading-5 text-amiko-muted">
                {tool.description}
              </span>
            </span>
            <AmikoIcon name="chevron" className="mt-1 h-5 w-5 shrink-0 text-slate-400" />
          </Link>
        ))}
      </div>

      {/* Material de apoyo — Próximamente */}
      <div className="rounded-2xl border border-dashed border-amiko-green/40 bg-amiko-mint/30 p-4">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amiko-mint text-amiko-green">
            <AmikoIcon name="play" className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-black text-amiko-ink">Material de apoyo</span>
              <span className="rounded-full border border-amiko-green/40 px-2 py-0.5 text-[10px] font-black text-amiko-green">
                Próximamente
              </span>
            </div>
            <p className="mt-1 text-sm font-bold leading-5 text-amiko-muted">
              Guías, videos y recursos para acompañar el aprendizaje de niños con TEA.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["Videos explicativos", "Guías descargables", "Cuentos adaptados"].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white px-3 py-1 text-xs font-black text-amiko-muted shadow-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
