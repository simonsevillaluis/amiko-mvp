"use client";

import Link from "next/link";
import { useState } from "react";
import { AmikoIcon, type AmikoIconName } from "@/components/amiko-icon";
import { DetailShell } from "@/components/detail-shell";

const filters = ["Todo", "Tareas", "Registros", "Pausas", "Logros"] as const;
type Filter = (typeof filters)[number];

const activities: Array<{
  title: string;
  detail: string;
  status: string;
  href: string;
  icon: AmikoIconName;
  tone: string;
  type: Filter;
}> = [
  {
    title: "Lectura sobre animales",
    detail: "Tarea adaptada",
    status: "Hoy",
    href: "/tasks/task-1",
    icon: "task",
    tone: "bg-amiko-sky text-amiko-blue",
    type: "Tareas",
  },
  {
    title: "Terminó con ayuda",
    detail: "Registro de tarea",
    status: "Ayer",
    href: "/mi-dia",
    icon: "journal",
    tone: "bg-amiko-mint text-green-800",
    type: "Registros",
  },
  {
    title: "Respiración de 60 segundos",
    detail: "Pausa para el cuidador",
    status: "Esta semana",
    href: "/bienestar",
    icon: "pause",
    tone: "bg-amiko-cream text-amiko-navy",
    type: "Pausas",
  },
  {
    title: "Volvió a intentarlo",
    detail: "Logro registrado",
    status: "Esta semana",
    href: "/progress",
    icon: "award",
    tone: "bg-amiko-cream text-amiko-navy",
    type: "Logros",
  },
];

function FilterButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      className="focus-ring flex h-10 w-10 items-center justify-center rounded-full text-amiko-navy transition hover:bg-amiko-sky"
      aria-label="Filtrar actividades"
    >
      {children}
    </button>
  );
}

export default function HistoryPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>("Todo");

  const filtered = activeFilter === "Todo"
    ? activities
    : activities.filter((a) => a.type === activeFilter);

  return (
    <DetailShell
      title="Historial"
      fallbackHref="/acompanamiento"
      rightAction={
        <button
          type="button"
          className="focus-ring flex h-10 w-10 items-center justify-center rounded-full text-amiko-navy transition hover:bg-amiko-sky"
          aria-label="Filtrar"
        >
          <AmikoIcon name="settings" className="h-5 w-5" />
        </button>
      }
    >
      <section className="mb-5">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-amiko-green">
          Acompañamiento
        </p>
        <h2 className="mt-1 text-2xl font-black leading-tight text-amiko-ink">
          Historial de actividades
        </h2>
        <p className="mt-2 text-sm font-bold leading-6 text-amiko-muted">
          Tareas, registros y pausas recientes sin perderte en reportes.
        </p>
      </section>

      {/* Filter chips */}
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            className={`focus-ring shrink-0 rounded-full px-4 py-2 text-sm font-black transition ${
              activeFilter === filter
                ? "bg-amiko-green text-white"
                : "bg-white text-amiko-muted shadow-sm hover:bg-amiko-mint"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Activity list */}
      <div className="space-y-3">
        {filtered.map((activity) => (
          <Link
            key={activity.title}
            href={activity.href}
            className="focus-ring flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-card transition hover:-translate-y-0.5"
          >
            <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${activity.tone}`}>
              <AmikoIcon name={activity.icon} className="h-6 w-6" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-black text-amiko-ink">{activity.title}</span>
              <span className="mt-0.5 block text-xs font-bold text-amiko-muted">{activity.detail}</span>
            </span>
            <div className="flex flex-col items-end gap-1">
              <span className="text-xs font-black text-amiko-green">{activity.status}</span>
              <AmikoIcon name="chevron" className="h-4 w-4 text-slate-300" />
            </div>
          </Link>
        ))}

        {filtered.length === 0 && (
          <p className="rounded-2xl bg-slate-50 px-4 py-6 text-center text-sm font-bold text-amiko-muted">
            No hay actividades de este tipo aún.
          </p>
        )}
      </div>

      <p className="mt-5 rounded-2xl bg-amiko-sky px-4 py-3 text-sm font-bold leading-6 text-amiko-navy">
        Aquí aparecerá lo que realmente ayuda: tareas adaptadas, registros, pausas y logros.
      </p>
    </DetailShell>
  );
}
