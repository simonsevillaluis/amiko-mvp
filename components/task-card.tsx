"use client";

import { AmikoIcon } from "@/components/amiko-icon";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type TaskStatus = "draft" | "adapted" | "in_progress" | "completed";

export interface Task {
  id: string;
  title: string;
  subject?: string;
  original_text: string;
  status: TaskStatus;
  updated_at?: string;
  completed_steps?: number;
  total_steps?: number;
  simple_summary?: string;
  difficulty_level?: "bajo" | "medio" | "alto";
}

interface TaskCardProps {
  task: Task;
  onAdapt?: (taskId: string) => void;
  onStart?: (taskId: string) => void;
  onResume?: (taskId: string) => void;
  onViewDetails?: (taskId: string) => void;
  // Permite opcionalmente inyectar clases de contenedor adicionales
  className?: string;
}

export function TaskCard({
  task,
  onAdapt,
  onStart,
  onResume,
  onViewDetails,
  className = "",
}: TaskCardProps) {
  const {
    id,
    title,
    subject,
    original_text,
    status,
    completed_steps = 0,
    total_steps = 0,
    simple_summary,
    difficulty_level,
  } = task;
  const pathname = usePathname();
  const safeFrom = pathname.startsWith("/") ? pathname : "/dashboard";
  const taskDetailHref = `/tasks/${id}?from=${encodeURIComponent(safeFrom)}`;
  const studentModeHref = `/student-mode/${id}?from=${encodeURIComponent(safeFrom)}`;

  // Renderizar la sección superior común a todos los estados (materia y dificultad si aplica)
  const renderHeader = () => {
    if (!subject && !difficulty_level) return null;
    return (
      <div className="flex flex-wrap items-center gap-2 mb-2">
        {subject && (
          <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-black text-slate-600">
            {subject}
          </span>
        )}
        {difficulty_level && status !== "draft" && (
          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-black ${
            difficulty_level === "bajo"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
              : difficulty_level === "medio"
              ? "bg-amber-50 text-amber-700 border border-amber-100"
              : "bg-rose-50 text-rose-700 border border-rose-100"
          }`}>
            Dificultad {difficulty_level}
          </span>
        )}
      </div>
    );
  };

  // Renderizado según estado actual
  switch (status) {
    case "draft":
      return (
        <article
          className={`focus-ring rounded-3xl border border-slate-200 bg-white p-5 shadow-card transition-all hover:border-slate-300 hover:shadow-soft ${className}`}
          aria-label={`Tarea borrador: ${title}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              {renderHeader()}
              <h3 className="text-lg font-black leading-snug text-amiko-ink">
                {title}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm font-bold leading-relaxed text-amiko-muted">
                {original_text}
              </p>
            </div>
            <span className="flex h-9 shrink-0 items-center gap-1 rounded-full bg-slate-100 px-3 text-[11px] font-black text-slate-700">
              <AmikoIcon name="clock" className="h-3.5 w-3.5" />
              Borrador
            </span>
          </div>

          <div className="mt-5 flex flex-wrap gap-2 items-center justify-end border-t border-slate-50 pt-4">
            {onAdapt ? (
              <button
                type="button"
                onClick={() => onAdapt(id)}
                className="focus-ring flex min-h-10 items-center justify-center gap-2 rounded-full bg-amiko-blue px-5 text-sm font-black text-white shadow-sm transition hover:bg-amiko-navy active:scale-[0.98]"
              >
                <AmikoIcon name="sparkles" className="h-4 w-4" />
                Adaptar con Amiko
              </button>
            ) : (
              <Link
                href={`/adapt-task?taskId=${id}`}
                className="focus-ring flex min-h-10 items-center justify-center gap-2 rounded-full bg-amiko-blue px-5 text-sm font-black text-white shadow-sm transition hover:bg-amiko-navy active:scale-[0.98]"
              >
                <AmikoIcon name="sparkles" className="h-4 w-4" />
                Adaptar con Amiko
              </Link>
            )}
          </div>
        </article>
      );

    case "adapted":
      return (
        <article
          className={`focus-ring rounded-3xl border border-amiko-green/20 bg-white p-5 shadow-card transition-all hover:border-amiko-green/30 hover:shadow-soft ${className}`}
          aria-label={`Tarea adaptada: ${title}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              {renderHeader()}
              <h3 className="text-lg font-black leading-snug text-amiko-ink">
                {title}
              </h3>
              {simple_summary && (
                <p className="mt-2 line-clamp-2 text-sm font-bold leading-relaxed text-slate-700 bg-amiko-sky/40 rounded-xl p-3">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-amiko-navy mb-1">Resumen simple</span>
                  {simple_summary}
                </p>
              )}
            </div>
            <span className="flex h-9 shrink-0 items-center gap-1 rounded-full bg-amiko-mint px-3 text-[11px] font-black text-green-800">
              <AmikoIcon name="sparkles" className="h-3.5 w-3.5" />
              Adaptada
            </span>
          </div>

          <div className="mt-5 flex flex-wrap gap-2 items-center justify-end border-t border-slate-50 pt-4">
            {onViewDetails && (
              <button
                type="button"
                onClick={() => onViewDetails(id)}
                className="focus-ring flex min-h-10 items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-sm font-black text-amiko-ink hover:bg-slate-50 active:scale-[0.98]"
              >
                Ver adaptación
              </button>
            )}
            {onStart ? (
              <button
                type="button"
                onClick={() => onStart(id)}
                className="focus-ring flex min-h-10 items-center justify-center gap-2 rounded-full bg-amiko-green px-5 text-sm font-black text-white shadow-sm transition hover:brightness-95 active:scale-[0.98]"
              >
                <AmikoIcon name="play" className="h-4 w-4" />
                Iniciar paso a paso
              </button>
            ) : (
              <Link
                href={studentModeHref}
                className="focus-ring flex min-h-10 items-center justify-center gap-2 rounded-full bg-amiko-green px-5 text-sm font-black text-white shadow-sm transition hover:brightness-95 active:scale-[0.98]"
              >
                <AmikoIcon name="play" className="h-4 w-4" />
                Iniciar paso a paso
              </Link>
            )}
          </div>
        </article>
      );

    case "in_progress":
      const progressPercent = total_steps > 0 ? Math.round((completed_steps / total_steps) * 100) : 0;
      return (
        <article
          className={`focus-ring rounded-3xl border border-amiko-blue/20 bg-white p-5 shadow-card transition-all hover:border-amiko-blue/30 hover:shadow-soft ${className}`}
          aria-label={`Tarea en progreso: ${title}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              {renderHeader()}
              <h3 className="text-lg font-black leading-snug text-amiko-ink">
                {title}
              </h3>
            </div>
            <span className="flex h-9 shrink-0 items-center gap-1 rounded-full bg-amiko-sky px-3 text-[11px] font-black text-amiko-navy">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amiko-blue opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amiko-blue"></span>
              </span>
              En progreso
            </span>
          </div>

          <div className="mt-4 bg-slate-50 border border-slate-100 rounded-2xl p-4">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-black text-amiko-ink">Pasos completados</span>
              <span className="text-xs font-black text-amiko-blue bg-amiko-sky px-2 py-0.5 rounded-md">
                {completed_steps} de {total_steps} ({progressPercent}%)
              </span>
            </div>
            {/* Barra de progreso */}
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-amiko-blue to-amiko-green h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2 items-center justify-end border-t border-slate-50 pt-4">
            {onViewDetails && (
              <button
                type="button"
                onClick={() => onViewDetails(id)}
                className="focus-ring flex min-h-10 items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-sm font-black text-amiko-ink hover:bg-slate-50 active:scale-[0.98]"
              >
                Ver detalles
              </button>
            )}
            {onResume ? (
              <button
                type="button"
                onClick={() => onResume(id)}
                className="focus-ring flex min-h-10 items-center justify-center gap-2 rounded-full bg-amiko-blue px-5 text-sm font-black text-white shadow-sm transition hover:bg-amiko-navy active:scale-[0.98]"
              >
                Continuar tarea
              </button>
            ) : (
              <Link
                href={studentModeHref}
                className="focus-ring flex min-h-10 items-center justify-center gap-2 rounded-full bg-amiko-blue px-5 text-sm font-black text-white shadow-sm transition hover:bg-amiko-navy active:scale-[0.98]"
              >
                Continuar tarea
              </Link>
            )}
          </div>
        </article>
      );

    case "completed":
      return (
        <article
          className={`focus-ring rounded-3xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/20 p-5 shadow-card transition-all hover:border-emerald-200 hover:shadow-soft ${className}`}
          aria-label={`Tarea completada: ${title}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              {renderHeader()}
              <h3 className="text-lg font-black leading-snug text-amiko-ink line-through decoration-slate-300">
                {title}
              </h3>
              <p className="mt-1 text-xs font-bold text-emerald-800 flex items-center gap-1">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
                  <AmikoIcon name="check" className="h-3 w-3" />
                </span>
                ¡Completado con éxito!
              </p>
            </div>
            <span className="flex h-9 shrink-0 items-center gap-1 rounded-full bg-emerald-100 px-3 text-[11px] font-black text-emerald-800">
              <AmikoIcon name="check" className="h-3.5 w-3.5" />
              Completado
            </span>
          </div>

          <div className="mt-5 flex flex-wrap gap-2 items-center justify-end border-t border-slate-50 pt-4">
            {onViewDetails ? (
              <button
                type="button"
                onClick={() => onViewDetails(id)}
                className="focus-ring flex min-h-10 items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 text-sm font-black text-amiko-ink hover:bg-slate-50 active:scale-[0.98]"
              >
                Ver resumen
              </button>
            ) : (
              <Link
                href={taskDetailHref}
                className="focus-ring flex min-h-10 items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 text-sm font-black text-amiko-ink hover:bg-slate-50 active:scale-[0.98]"
              >
                Ver resumen
              </Link>
            )}
            
            <Link
              href={`/mi-dia?taskId=${id}`}
              className="focus-ring flex min-h-10 items-center justify-center gap-1.5 rounded-full bg-emerald-600 px-4 text-sm font-black text-white shadow-sm transition hover:bg-emerald-700 active:scale-[0.98]"
            >
              <AmikoIcon name="journal" className="h-4 w-4" />
              Registrar cómo fue
            </Link>
          </div>
        </article>
      );

    default:
      return null;
  }
}
