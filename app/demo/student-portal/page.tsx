"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AmikoIcon } from "@/components/amiko-icon";
import { StudentPortalIcon, AmikoMark } from "@/components/student-portal-icons";
import { StudentTaskWorkspace } from "@/components/student-task-workspace";
import { TaskWorkspaceOwn } from "@/components/task-workspace-own";
import {
  emotionOptions,
  getGreeting,
  studentPortalStudent,
  studentPortalTasks,
  type StudentPortalTask,
} from "@/lib/student-mock-data";
import {
  getProgressEvents,
  markCheckinDone,
  resetTaskProgress,
  saveProgressEvent,
  shouldShowCheckin,
} from "@/lib/local-progress";
import { playSound } from "@/lib/sounds";
import { soundSettings } from "@/lib/student-sound-settings";

type StudentView = "home" | "task-assigned" | "task-own" | "history";

function EmotionalCheckin({ onComplete }: { onComplete: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-amiko-navy/55 px-4 backdrop-blur-sm sm:left-1/2 sm:right-auto sm:w-full sm:max-w-[430px] sm:-translate-x-1/2">
      <div className="w-full rounded-[30px] bg-white p-5 shadow-soft">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-amiko-mint text-amiko-green">
          <StudentPortalIcon name="smile" className="h-9 w-9" />
        </div>
        <h2 className="mt-4 text-center text-2xl font-black leading-tight text-amiko-ink">
          Como vas hoy?
        </h2>
        <p className="mt-2 text-center text-sm font-bold text-amiko-muted">
          Elige una opcion. No hay respuesta mala.
        </p>

        <div className="mt-5 grid grid-cols-5 gap-2">
          {emotionOptions.map((emotion) => (
            <button
              key={emotion.value}
              type="button"
              onClick={() => {
                saveProgressEvent("emotion_checkin", "general", undefined, emotion.value);
                markCheckinDone();
                onComplete();
              }}
              className="focus-ring flex min-h-20 flex-col items-center justify-center gap-2 rounded-2xl border border-slate-100 bg-slate-50 px-1 py-2 text-center transition active:scale-95"
            >
              <StudentPortalIcon name={emotion.icon} className="h-7 w-7 text-amiko-blue" />
              <span className="text-[10px] font-black leading-tight text-amiko-muted">
                {emotion.label}
              </span>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onComplete}
          className="focus-ring mt-4 min-h-11 w-full rounded-full bg-slate-100 text-sm font-black text-amiko-muted"
        >
          Ahora no
        </button>
      </div>
    </div>
  );
}

type TaskStatus = "por_empezar" | "en_progreso" | "ayuda_solicitada" | "terminada";

const getSubjectStyles = (icon: string) => {
  switch (icon) {
    case "math":
      return {
        bg: "bg-emerald-50/40 border-emerald-100/60 hover:border-emerald-200/80",
        iconBg: "bg-emerald-100 text-emerald-600",
        barColor: "from-emerald-400 to-teal-400",
        iconUrl: "https://img.icons8.com/3d-fluency/94/calculator.png",
      };
    case "reading":
      return {
        bg: "bg-blue-50/40 border-blue-100/60 hover:border-blue-200/80",
        iconBg: "bg-blue-100 text-blue-600",
        barColor: "from-blue-400 to-indigo-400",
        iconUrl: "https://img.icons8.com/3d-fluency/94/book.png",
      };
    case "science":
      return {
        bg: "bg-purple-50/40 border-purple-100/60 hover:border-purple-200/80",
        iconBg: "bg-purple-100 text-purple-600",
        barColor: "from-purple-400 to-pink-400",
        iconUrl: "https://img.icons8.com/3d-fluency/94/test-tube.png",
      };
    default:
      return {
        bg: "bg-amber-50/40 border-amber-100/60 hover:border-amber-200/80",
        iconBg: "bg-amber-100 text-amber-600",
        barColor: "from-amber-400 to-orange-400",
        iconUrl: "https://img.icons8.com/3d-fluency/94/book.png",
      };
  }
};

function getStatusConfig(status: TaskStatus) {
  switch (status) {
    case "en_progreso":
      return {
        label: "En progreso",
        badgeBg: "bg-blue-100 text-blue-700",
        dotColor: "bg-blue-500 animate-pulse",
        actionLabel: "Continuar",
        actionBg: "bg-blue-600 text-white shadow-sm",
        actionIcon: "play" as const,
        emojiUrl: "https://img.icons8.com/3d-fluency/94/rocket.png",
        message: "¡Vas muy bien!",
      };
    case "ayuda_solicitada":
      return {
        label: "Pedir ayuda",
        badgeBg: "bg-amber-100 text-amber-700",
        dotColor: "bg-amber-500",
        actionLabel: "Revisar",
        actionBg: "bg-amber-500 text-white shadow-sm",
        actionIcon: "help" as const,
        emojiUrl: "https://img.icons8.com/3d-fluency/94/idea.png",
        message: "Revisemos juntos.",
      };
    case "terminada":
      return {
        label: "Terminada",
        badgeBg: "bg-emerald-100 text-emerald-700",
        dotColor: "bg-emerald-500",
        actionLabel: "Repasar",
        actionBg: "bg-slate-100 text-slate-600",
        actionIcon: "check" as const,
        emojiUrl: "https://img.icons8.com/3d-fluency/94/trophy.png",
        message: "¡Lo lograste!",
      };
    case "por_empezar":
    default:
      return {
        label: "Por empezar",
        badgeBg: "bg-slate-100 text-slate-600",
        dotColor: "bg-slate-400",
        actionLabel: "Vamos",
        actionBg: "bg-amiko-green text-white shadow-sm",
        actionIcon: "play" as const,
        emojiUrl: "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Chequered%20flag/3D/chequered_flag_3d.png",
        message: "¡Empecemos!",
      };
  }
}

function TaskCard({
  task,
  progress = 0,
  status = "por_empezar",
  onSelect,
}: {
  task: StudentPortalTask;
  progress?: number;
  status?: TaskStatus;
  onSelect: () => void;
}) {
  const subjectStyles = getSubjectStyles(task.icon);
  const config = getStatusConfig(status);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`focus-ring w-[260px] shrink-0 snap-start rounded-[22px] border-2 ${subjectStyles.bg} bg-white p-4 text-left shadow-card transition-all duration-200 active:scale-[0.97] flex flex-col gap-3`}
    >
      {/* Icon + subject + status emoji */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] shadow-sm ${subjectStyles.iconBg} bg-white/70 p-1`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={subjectStyles.iconUrl} alt={task.subject} className="h-9 w-9 object-contain" />
          </span>
          <div className="min-w-0">
            <span className="block text-[9px] font-black uppercase tracking-[0.14em] text-amiko-muted">{task.subject}</span>
            <span className="block mt-0.5 text-sm font-black leading-snug text-amiko-ink line-clamp-2">{task.title}</span>
          </div>
        </div>
        <div className="shrink-0 flex h-9 w-9 items-center justify-center rounded-xl bg-white/80 border border-slate-100/40 p-0.5 shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={config.emojiUrl} alt={config.label} className="h-7 w-7 object-contain" />
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-amiko-muted">{config.message}</span>
          <span className="text-[10px] font-black text-amiko-ink bg-slate-100 px-1.5 py-0.5 rounded">{progress}%</span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 shadow-inner">
          <div
            className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${subjectStyles.barColor}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Status badge + action */}
      <div className="flex items-center justify-between gap-2">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black ${config.badgeBg}`}>
          <span className={`h-2 w-2 rounded-full ${config.dotColor}`} />
          {config.label}
        </span>
        <span className={`inline-flex min-h-9 items-center gap-1 rounded-full px-4 text-xs font-black transition-all duration-200 ${config.actionBg}`}>
          {config.actionLabel}
          <AmikoIcon name={config.actionIcon} className="h-3.5 w-3.5" />
        </span>
      </div>
    </button>
  );
}

const HISTORY_OVERLAY =
  "fixed inset-0 z-[60] flex flex-col overflow-hidden bg-white sm:left-1/2 sm:right-auto sm:w-full sm:max-w-[430px] sm:-translate-x-1/2 sm:shadow-[0_24px_80px_rgba(9,54,124,0.24)]";

function TaskHistoryView({
  tasks,
  progressMap,
  onRepeat,
  onBack,
}: {
  tasks: StudentPortalTask[];
  progressMap: Record<string, { progress: number; status: TaskStatus }>;
  onRepeat: (task: StudentPortalTask) => void;
  onBack: () => void;
}) {
  const completedTasks = tasks.filter((t) => progressMap[t.id]?.status === "terminada");

  return (
    <div className={HISTORY_OVERLAY}>
      {/* Header */}
      <header className="shrink-0 border-b border-slate-100 bg-white px-4 py-3">
        <div className="grid grid-cols-[40px_1fr_40px] items-center gap-3">
          <button
            type="button"
            aria-label="Volver"
            onClick={onBack}
            className="focus-ring flex h-10 w-10 items-center justify-center rounded-full text-amiko-navy transition hover:bg-amiko-sky"
          >
            <AmikoIcon name="back" className="h-6 w-6" />
          </button>
          <div className="flex items-center justify-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://img.icons8.com/3d-fluency/94/trophy.png"
              alt=""
              className="h-7 w-7 object-contain"
            />
            <h1 className="text-lg font-black text-amiko-navy">Historial</h1>
          </div>
          <div />
        </div>
      </header>

      {/* Content */}
      <section className="flex-1 overflow-y-auto px-4 py-5">
        {completedTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://img.icons8.com/3d-fluency/94/checklist.png"
              alt=""
              className="h-16 w-16 object-contain opacity-50"
            />
            <p className="text-base font-black text-amiko-muted">Todavía no hay tareas completadas.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="mb-4 text-sm font-bold text-amiko-muted">
              {completedTasks.length} tarea{completedTasks.length > 1 ? "s" : ""} completada{completedTasks.length > 1 ? "s" : ""} — podés repetirlas cuando quieras.
            </p>
            {completedTasks.map((task) => {
              const subjectStyles = getSubjectStyles(task.icon);
              return (
                <div
                  key={task.id}
                  className={`flex items-center gap-4 rounded-[22px] border-2 ${subjectStyles.bg} bg-white p-4 shadow-card`}
                >
                  <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] shadow-sm ${subjectStyles.iconBg} bg-white/70 p-1`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={subjectStyles.iconUrl} alt={task.subject} className="h-9 w-9 object-contain" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="block text-[9px] font-black uppercase tracking-[0.14em] text-amiko-muted">{task.subject}</span>
                    <span className="block mt-0.5 text-sm font-black leading-snug text-amiko-ink line-clamp-2">{task.title}</span>
                    <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-black text-emerald-700">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      Completada
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRepeat(task)}
                    className="focus-ring flex shrink-0 min-h-10 items-center gap-1.5 rounded-full bg-amiko-green px-4 text-xs font-black text-white shadow-sm transition active:scale-95"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="https://img.icons8.com/3d-fluency/94/recurring-appointment.png" alt="" className="h-4 w-4 object-contain" />
                    Repetir
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default function DemoStudentPortalPage() {
  const pathname = usePathname();
  const basePath = pathname.startsWith("/student-portal")
    ? "/student-portal"
    : "/demo/student-portal";
  const [showCheckin, setShowCheckin] = useState(shouldShowCheckin);
  const [view, setView] = useState<StudentView>("home");
  const [selectedTask, setSelectedTask] = useState<StudentPortalTask | null>(null);
  const [taskProgressMap, setTaskProgressMap] = useState<
    Record<string, { progress: number; status: TaskStatus }>
  >({});

  const handleCloseCheckin = useCallback(() => setShowCheckin(false), []);

  useEffect(() => {
    // Load local progress events dynamically
    const events = getProgressEvents();
    const map: Record<string, { progress: number; status: TaskStatus }> = {};

    studentPortalTasks.forEach((task) => {
      const taskEvents = events.filter((e) => e.taskId === task.id);
      const hasCompleted = taskEvents.some((e) => e.eventType === "task_completed");

      if (hasCompleted) {
        map[task.id] = { progress: 100, status: "terminada" };
      } else {
        const stepEvents = taskEvents.filter((e) => e.eventType === "step_completed");
        // Count unique step completions
        const uniqueSteps = new Set(stepEvents.map((e) => e.stepNumber));
        const totalSteps = task.mathExercises?.length || task.steps.length || 1;
        const progress = Math.min(Math.round((uniqueSteps.size / totalSteps) * 100), 99);

        let status: TaskStatus = "por_empezar";
        if (progress > 0 || taskEvents.length > 0) {
          status = "en_progreso";
          // If the most recent event is a help request, mark status as help requested
          const sortedEvents = [...taskEvents].sort(
            (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );
          const lastEvent = sortedEvents[sortedEvents.length - 1];
          if (lastEvent?.eventType === "help_requested") {
            status = "ayuda_solicitada";
          }
        }

        map[task.id] = { progress, status };
      }
    });

    setTaskProgressMap(map);
  }, [view]);

  const handleRepeatTask = useCallback((task: StudentPortalTask) => {
    resetTaskProgress(task.id);
    setTaskProgressMap((prev) => {
      const next = { ...prev };
      delete next[task.id];
      return next;
    });
    if (soundSettings.canPlay()) playSound("tap");
    setSelectedTask(task);
    setView("task-assigned");
  }, []);

  if (view === "history") {
    return (
      <TaskHistoryView
        tasks={studentPortalTasks}
        progressMap={taskProgressMap}
        onRepeat={handleRepeatTask}
        onBack={() => setView("home")}
      />
    );
  }

  if (view === "task-assigned" && selectedTask) {
    return (
      <StudentTaskWorkspace
        task={selectedTask}
        onExit={() => {
          setView("home");
          setSelectedTask(null);
        }}
        demoMode
      />
    );
  }

  if (view === "task-own") {
    return <TaskWorkspaceOwn onExit={() => setView("home")} />;
  }

  return (
    <>
      {showCheckin && <EmotionalCheckin onComplete={handleCloseCheckin} />}

      <section className="mb-5">
        <h1 className="text-2xl font-black text-amiko-ink">
          {getGreeting()}, {studentPortalStudent.name}.
        </h1>
      </section>

      {/* ── Mis tareas (asignadas por tutor) ─────────────────────────────── */}
      <section className="mb-7">
        <div className="mb-3 flex items-center gap-2">
          <h2 className="text-lg font-black text-amiko-ink">Mis tareas</h2>
          <span className="rounded-full bg-amiko-sky px-3 py-1 text-xs font-black text-amiko-blue">
            de tu tutor
          </span>
        </div>
        {/* Horizontal snap scroll — hides completed tasks */}
        <div className="-mx-4 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex gap-3 px-4 snap-x snap-mandatory">
            {studentPortalTasks
              .filter((task) => (taskProgressMap[task.id]?.status ?? "por_empezar") !== "terminada")
              .map((task) => {
                const statusInfo = taskProgressMap[task.id] || { progress: 0, status: "por_empezar" as const };
                return (
                  <TaskCard
                    key={task.id}
                    task={task}
                    progress={statusInfo.progress}
                    status={statusInfo.status}
                    onSelect={() => {
                      if (soundSettings.canPlay()) playSound("tap");
                      setSelectedTask(task);
                      setView("task-assigned");
                    }}
                  />
                );
              })}
            {/* Completed tasks peek card */}
            {(() => {
              const doneCount = studentPortalTasks.filter(
                (t) => taskProgressMap[t.id]?.status === "terminada"
              ).length;
              return doneCount > 0 ? (
                <button
                  type="button"
                  onClick={() => setView("history")}
                  className="focus-ring w-[160px] shrink-0 snap-start flex flex-col items-center justify-center gap-2 rounded-[22px] border-2 border-dashed border-emerald-200 bg-emerald-50/40 p-4 text-center transition active:scale-95 hover:border-emerald-300 hover:bg-emerald-50"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://img.icons8.com/3d-fluency/94/trophy.png"
                    alt=""
                    className="h-12 w-12 object-contain"
                  />
                  <p className="text-xs font-black text-amiko-ink">{doneCount} terminada{doneCount > 1 ? "s" : ""}</p>
                  <p className="text-[10px] font-bold text-amiko-green leading-snug">Ver historial →</p>
                </button>
              ) : null;
            })()}
          </div>
        </div>
        {/* "Ver más" link shown when all visible tasks are done */}
        {studentPortalTasks.every((t) => taskProgressMap[t.id]?.status === "terminada") && (
          <button
            type="button"
            onClick={() => setView("history")}
            className="focus-ring mt-2 flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 py-3 text-xs font-black text-amiko-green transition hover:bg-emerald-100 active:scale-95"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Party%20popper/3D/party_popper_3d.png" alt="" className="h-5 w-5 object-contain" />
            ¡Completaste todo! Ver historial
          </button>
        )}
      </section>

      {/* ── Mis estudios (creados por el estudiante) ──────────────────────── */}
      <section className="mb-6">
        <div className="mb-3 flex items-center gap-2">
          <h2 className="text-lg font-black text-amiko-ink">Mis estudios</h2>
          <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-black text-purple-500">
            creados por mí
          </span>
        </div>
        <div className="rounded-[24px] border-2 border-dashed border-slate-200 bg-white p-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-500">
            <AmikoIcon name="sparkles" className="h-8 w-8" />
          </div>
          <p className="mb-1 text-base font-black text-amiko-ink">Tu espacio de estudio</p>
          <p className="mb-4 text-sm font-bold leading-5 text-amiko-muted">
            Subí una foto, pegá texto o grabá audio. Amiko te ayuda a entenderlo.
          </p>
          <button
            type="button"
            onClick={() => {
              if (soundSettings.canPlay()) playSound("tap");
              setView("task-own");
            }}
            className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-full bg-amiko-green px-5 text-sm font-black text-white shadow-card transition active:scale-95"
          >
            <AmikoIcon name="plus" className="h-4 w-4" />
            Crear un estudio
          </button>
        </div>
      </section>

      <section className="mt-6">
        <Link
          href={`${basePath}/amiko`}
          onClick={() => {
            if (soundSettings.canPlay()) playSound("tap");
          }}
          className="focus-ring flex w-full items-center gap-4 rounded-2xl border border-amiko-green/30 bg-gradient-to-r from-amiko-sky to-amiko-mint p-4 shadow-card transition active:scale-[0.98]"
        >
          <AmikoMark className="h-14 w-14 shrink-0" />
          <span className="min-w-0 flex-1 text-left">
            <span className="block text-[10px] font-black uppercase tracking-[0.14em] text-amiko-green">
              Asistente
            </span>
            <span className="mt-0.5 block text-base font-black text-amiko-ink">
              Hablar con Amiko
            </span>
            <span className="block text-xs font-bold text-amiko-muted">
              Dime que necesitas hacer.
            </span>
          </span>
          <AmikoIcon name="chevron" className="h-5 w-5 shrink-0 text-amiko-green" />
        </Link>
      </section>
    </>
  );
}
