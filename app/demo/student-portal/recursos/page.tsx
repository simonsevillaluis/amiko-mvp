"use client";

import { AmikoIcon } from "@/components/amiko-icon";
import { StudentPortalIcon } from "@/components/student-portal-icons";
import { breakActivities } from "@/lib/student-mock-data";

const tools = [
  {
    icon: "calm" as const,
    title: "Zona de calma",
    description: "Respira un momento",
    color: "bg-amiko-sky text-amiko-blue",
  },
  {
    icon: "task" as const,
    title: "Pasos",
    description: "Ver una cosa a la vez",
    color: "bg-amiko-mint text-amiko-green",
  },
  {
    icon: "users" as const,
    title: "Pedir ayuda",
    description: "Avisar a tu adulto",
    color: "bg-amiko-cream text-amiko-coral",
  },
  {
    icon: "draw" as const,
    title: "Dibujar",
    description: "Expresar una idea",
    color: "bg-purple-50 text-purple-500",
  },
];

export default function DemoRecursosPage() {
  return (
    <>
      <section className="mb-5 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amiko-sky text-amiko-green shadow-sm">
          <AmikoIcon name="resources" className="h-5 w-5" />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-amiko-green">
            Herramientas
          </p>
          <h1 className="mt-1 text-2xl font-black text-amiko-ink">Recursos</h1>
        </div>
      </section>

      <p className="mb-5 text-sm font-bold leading-6 text-amiko-muted">
        Usa una ayuda cuando necesites retomar con calma.
      </p>

      <section className="grid grid-cols-2 gap-3">
        {tools.map((tool) => (
          <button
            key={tool.title}
            type="button"
            className="focus-ring flex min-h-36 flex-col items-center justify-center gap-3 rounded-3xl border border-slate-100 bg-white p-4 text-center shadow-card transition active:scale-95"
          >
            <span className={`flex h-14 w-14 items-center justify-center rounded-2xl ${tool.color}`}>
              <StudentPortalIcon name={tool.icon} className="h-8 w-8" />
            </span>
            <span>
              <span className="block text-base font-black text-amiko-ink">
                {tool.title}
              </span>
              <span className="mt-1 block text-xs font-bold leading-5 text-amiko-muted">
                {tool.description}
              </span>
            </span>
          </button>
        ))}
      </section>

      <section className="mt-8">
        <div className="mb-3 flex items-center gap-2">
          <AmikoIcon name="pause" className="h-5 w-5 text-amiko-green" />
          <h2 className="text-lg font-black text-amiko-green">Pausas rapidas</h2>
        </div>
        <div className="space-y-2">
          {breakActivities.slice(0, 5).map((activity) => (
            <button
              key={activity.label}
              type="button"
              className="focus-ring flex min-h-14 w-full items-center gap-3 rounded-2xl border border-slate-100 bg-white px-4 text-left shadow-sm transition active:scale-[0.98]"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amiko-sky text-amiko-blue">
                <StudentPortalIcon name={activity.icon} className="h-5 w-5" />
              </span>
              <span className="text-sm font-black text-amiko-ink">{activity.label}</span>
            </button>
          ))}
        </div>
      </section>
    </>
  );
}
