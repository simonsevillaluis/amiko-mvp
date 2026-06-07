"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { AmikoIcon, type AmikoIconName } from "@/components/amiko-icon";
import { DetailShell } from "@/components/detail-shell";
import { createClient } from "@/lib/supabase/client";

const filters = ["Todo", "Tareas", "Registros", "Pausas", "Logros"] as const;
type Filter = (typeof filters)[number];

interface Activity {
  id: string;
  title: string;
  detail: string;
  status: string;
  href: string;
  icon: AmikoIconName;
  tone: string;
  type: Filter;
  createdAt: Date;
}

type ProgressEventRow = {
  id: string;
  event_type: string;
  notes?: string | null;
  created_at: string;
  tasks?: { title?: string | null } | null;
};

function formatRelativeDate(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  
  // Normalize dates to midnight for accurate day difference
  const dMidnight = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const diffTime = nowMidnight.getTime() - dMidnight.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return "Hoy";
  } else if (diffDays === 1) {
    return "Ayer";
  } else if (diffDays < 7) {
    return `Hace ${diffDays} días`;
  } else {
    return d.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
  }
}

export default function HistoryPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>("Todo");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      try {
        const supabase = createClient();

        // 1. Fetch tasks (optimized list fields only)
        const { data: tasks, error: tasksError } = await supabase
          .from("tasks")
          .select("id, title, subject, status, created_at")
          .order("created_at", { ascending: false });

        if (tasksError) throw tasksError;

        // 2. Fetch progress events (optimized list fields only)
        const { data: events, error: eventsError } = await supabase
          .from("progress_events")
          .select(`
            id,
            event_type,
            notes,
            created_at,
            tasks (
              title
            )
          `)
          .order("created_at", { ascending: false });

        if (eventsError) throw eventsError;

        // Map tasks to Activity structure
        const mappedTasks: Activity[] = (tasks || []).map((t) => ({
          id: t.id,
          title: t.title,
          detail: t.subject ? `Materia: ${t.subject}` : "Tarea adaptada",
          status: formatRelativeDate(t.created_at),
          href: `/tasks/${t.id}`,
          icon: "task",
          tone: "bg-amiko-sky text-amiko-blue",
          type: "Tareas",
          createdAt: new Date(t.created_at),
        }));

        // Map events to Activity structure
        const mappedEvents: Activity[] = ((events || []) as ProgressEventRow[]).map((e) => {
          const taskTitle = e.tasks?.title || "Tarea";
          let type: Filter = "Registros";
          let title = "Registro de tarea";
          let icon: AmikoIconName = "journal";
          let tone = "bg-amiko-mint text-green-800";
          let href = "/progress";

          if (e.event_type === "step_completed") {
            type = "Logros";
            title = "Paso completado";
            icon = "award";
            tone = "bg-amiko-cream text-amiko-navy";
            href = "/progress";
          } else if (e.event_type === "help_requested") {
            type = "Registros";
            title = "Pidió ayuda";
            icon = "help";
            tone = "bg-amiko-sky text-amiko-blue";
            href = "/mi-dia";
          } else if (e.event_type === "frustration_reported") {
            type = "Pausas";
            title = "Pausa que ayudó";
            icon = "pause";
            tone = "bg-amiko-cream text-amiko-navy";
            href = "/mi-dia";
          }

          return {
            id: e.id,
            title,
            detail: e.notes ? `${taskTitle}: ${e.notes}` : `En la tarea: ${taskTitle}`,
            status: formatRelativeDate(e.created_at),
            href,
            icon,
            tone,
            type,
            createdAt: new Date(e.created_at),
          };
        });

        // Combine and sort chronologically (newest first)
        const combined = [...mappedTasks, ...mappedEvents].sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        );

        setActivities(combined);
      } catch (err) {
        console.error("Error loading history:", err);
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, []);

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
        {loading ? (
          <p className="rounded-2xl bg-slate-50 px-4 py-6 text-center text-sm font-bold text-amiko-muted">
            Cargando historial…
          </p>
        ) : filtered.length > 0 ? (
          filtered.map((activity) => (
            <Link
              key={activity.id}
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
          ))
        ) : (
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
