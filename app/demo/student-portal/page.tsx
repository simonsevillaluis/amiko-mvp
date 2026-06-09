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
  saveProgressEvent,
  shouldShowCheckin,
} from "@/lib/local-progress";
import { playSound } from "@/lib/sounds";
import { soundSettings } from "@/lib/student-sound-settings";

type StudentView = "home" | "task-assigned" | "task-own";

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

  const getStatusConfig = () => {
    switch (status) {
      case "en_progreso":
        return {
          label: "En progreso",
          badgeBg: "bg-blue-100 text-blue-800 border border-blue-200/50",
          dotColor: "bg-blue-500 animate-pulse",
          actionLabel: "Continuar",
          actionBg: "bg-blue-600 hover:bg-blue-700 text-white active:scale-95 shadow-sm hover:shadow",
          actionIcon: "play" as const,
          emojiUrl: "https://img.icons8.com/3d-fluency/94/rocket.png",
          message: "¡Vas muy bien! Continuemos."
        };
      case "ayuda_solicitada":
        return {
          label: "Necesito ayuda",
          badgeBg: "bg-amber-100 text-amber-800 border border-amber-200/50",
          dotColor: "bg-amber-500",
          actionLabel: "Revisar",
          actionBg: "bg-amber-500 hover:bg-amber-600 text-white active:scale-95 shadow-sm hover:shadow",
          actionIcon: "help" as const,
          emojiUrl: "https://img.icons8.com/3d-fluency/94/idea.png",
          message: "Pediste ayuda. Revisemos juntos."
        };
      case "terminada":
        return {
          label: "Terminada",
          badgeBg: "bg-emerald-100 text-emerald-800 border border-emerald-200/50",
          dotColor: "bg-emerald-500",
          actionLabel: "Repasar",
          actionBg: "bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-95 shadow-sm",
          actionIcon: "check" as const,
          emojiUrl: "https://img.icons8.com/3d-fluency/94/trophy.png",
          message: "¡Lo lograste! Excelente trabajo."
        };
      case "por_empezar":
      default:
        return {
          label: "Por empezar",
          badgeBg: "bg-slate-100 text-slate-700 border border-slate-200/50",
          dotColor: "bg-slate-400",
          actionLabel: "Vamos",
          actionBg: "bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95 shadow-sm hover:shadow",
          actionIcon: "play" as const,
          emojiUrl: "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Chequered%20flag/3D/chequered_flag_3d.png",
          message: "¡Empecemos juntos!"
        };
    }
  };

  const config = getStatusConfig();

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`focus-ring w-full rounded-[24px] border-2 ${subjectStyles.bg} p-5 text-left shadow-card transition-all duration-300 hover:scale-[1.01] hover:shadow-soft active:scale-[0.99] bg-white flex flex-col gap-4`}
    >
      {/* Fila Superior: Icono de Materia, Título de la tarea y 3D Emoji */}
      <div className="flex items-start justify-between w-full gap-2">
        <div className="flex items-center gap-4 min-w-0">
          <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] shadow-sm ${subjectStyles.iconBg} bg-white/70 p-1.5`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={subjectStyles.iconUrl} alt={task.subject} className="h-10 w-10 object-contain" />
          </span>
          <div className="min-w-0">
            <span className="block text-[10px] font-black uppercase tracking-[0.14em] text-amiko-muted">
              {task.subject}
            </span>
            <span className="block mt-0.5 text-lg font-black leading-tight text-amiko-ink truncate">
              {task.title}
            </span>
          </div>
        </div>
        
        {/* 3D Emoji Container */}
        <div className="h-12 w-12 shrink-0 flex items-center justify-center select-none bg-white/80 rounded-2xl p-1 shadow-sm border border-slate-100/40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={config.emojiUrl}
            alt={config.label}
            className="h-10 w-10 object-contain"
          />
        </div>
      </div>

      {/* Fila Media: Barra de Progreso y Mensaje Motivador */}
      <div className="w-full space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500">
          <span className="text-amiko-muted">{config.message}</span>
          <span className="font-black text-amiko-ink bg-slate-100 px-2 py-0.5 rounded-md">{progress}%</span>
        </div>
        <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden shadow-inner p-[2px]">
          <div
            className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${subjectStyles.barColor}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Fila Inferior: Badge de Estado y Botón de Acción */}
      <div className="flex items-center justify-between w-full pt-1">
        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-black ${config.badgeBg}`}>
          <span className={`h-2.5 w-2.5 rounded-full ${config.dotColor}`} />
          {config.label}
        </span>
        
        <span className={`inline-flex min-h-11 items-center gap-1.5 rounded-full px-6 text-sm font-black shadow-md transition-all duration-200 ${config.actionBg}`}>
          {config.actionLabel}
          <AmikoIcon name={config.actionIcon} className="h-4 w-4" />
        </span>
      </div>
    </button>
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
        <div className="space-y-4">
          {studentPortalTasks.map((task) => {
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
        </div>
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
