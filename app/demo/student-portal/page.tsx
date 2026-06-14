"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AmikoIcon } from "@/components/amiko-icon";
import { StudentPortalIcon, AmikoMark } from "@/components/student-portal-icons";
import { StudentTaskWorkspace } from "@/components/student-task-workspace";
import { TaskWorkspaceOwn } from "@/components/task-workspace-own";
import { StudentButton } from "@/components/student-button";
import {
  emotionOptions,
  getGreeting,
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
import { createClient } from "@/lib/supabase/client";

type RealAdaptedTask = {
  task_id: string;
  title: string;
  subject: string | null;
  simple_summary: string;
};

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
          {emotionOptions.map((emotion) => {
            let iconUrl = "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Smiling%20face%20with%20smiling%20eyes/3D/smiling_face_with_smiling_eyes_3d.png";
            let animationClass = "group-hover:-translate-y-1 group-hover:scale-110";
            switch (emotion.value) {
              case "muy_bien":
                iconUrl = "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Star-struck/3D/star-struck_3d.png";
                animationClass = "group-hover:-translate-y-1.5 group-hover:scale-110 group-hover:rotate-6";
                break;
              case "bien":
                iconUrl = "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Smiling%20face%20with%20smiling%20eyes/3D/smiling_face_with_smiling_eyes_3d.png";
                animationClass = "group-hover:-translate-y-1 group-hover:scale-110";
                break;
              case "regular":
                iconUrl = "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Neutral%20face/3D/neutral_face_3d.png";
                animationClass = "group-hover:scale-105 group-hover:rotate-[-6deg]";
                break;
              case "cansado":
                iconUrl = "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Tired%20face/3D/tired_face_3d.png";
                animationClass = "group-hover:scale-95 group-hover:opacity-80";
                break;
              case "triste":
                iconUrl = "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Pensive%20face/3D/pensive_face_3d.png";
                animationClass = "group-hover:translate-y-1 group-hover:scale-95";
                break;
            }

            return (
              <button
                key={emotion.value}
                type="button"
                onClick={() => {
                  saveProgressEvent("emotion_checkin", "general", undefined, emotion.value);
                  markCheckinDone();
                  onComplete();
                }}
                className="group focus-ring flex min-h-20 flex-col items-center justify-center gap-2 rounded-2xl border border-slate-100 bg-slate-50 px-1 py-2 text-center transition-all duration-300 hover:bg-white hover:shadow-sm hover:border-slate-200 active:scale-95"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={iconUrl}
                  alt={emotion.label}
                  className={`h-8 w-8 object-contain transition-all duration-300 ${animationClass}`}
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.style.display = "none"; }}
                />
                <span className="text-[10px] font-black leading-tight text-amiko-muted group-hover:text-amiko-ink transition-colors">
                  {emotion.label}
                </span>
              </button>
            );
          })}
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
        iconUrl: "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Abacus/3D/abacus_3d.png",
      };
    case "reading":
      return {
        bg: "bg-blue-50/40 border-blue-100/60 hover:border-blue-200/80",
        iconBg: "bg-blue-100 text-blue-600",
        barColor: "from-blue-400 to-indigo-400",
        iconUrl: "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Open%20book/3D/open_book_3d.png",
      };
    case "science":
      return {
        bg: "bg-purple-50/40 border-purple-100/60 hover:border-purple-200/80",
        iconBg: "bg-purple-100 text-purple-600",
        barColor: "from-purple-400 to-pink-400",
        iconUrl: "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Test%20tube/3D/test_tube_3d.png",
      };
    default:
      return {
        bg: "bg-amber-50/40 border-amber-100/60 hover:border-amber-200/80",
        iconBg: "bg-amber-100 text-amber-600",
        barColor: "from-amber-400 to-orange-400",
        iconUrl: "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Open%20book/3D/open_book_3d.png",
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
        actionVariant: "secondary" as const,
        actionIcon: "play" as const,
        emojiUrl: "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Rocket/3D/rocket_3d.png",
        message: "¡Vas muy bien!",
      };
    case "ayuda_solicitada":
      return {
        label: "Pedir ayuda",
        badgeBg: "bg-amber-100 text-amber-700",
        dotColor: "bg-amber-500",
        actionLabel: "Revisar",
        actionVariant: "amber" as const,
        actionIcon: "help" as const,
        emojiUrl: "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Light%20bulb/3D/light_bulb_3d.png",
        message: "Revisemos juntos.",
      };
    case "terminada":
      return {
        label: "Terminada",
        badgeBg: "bg-emerald-100 text-emerald-700",
        dotColor: "bg-emerald-500",
        actionLabel: "Repasar",
        actionVariant: "tertiary" as const,
        actionIcon: "check" as const,
        emojiUrl: "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Trophy/3D/trophy_3d.png",
        message: "¡Lo lograste!",
      };
    case "por_empezar":
    default:
      return {
        label: "Por empezar",
        badgeBg: "bg-slate-100 text-slate-600",
        dotColor: "bg-slate-400",
        actionLabel: "Vamos",
        actionVariant: "primary" as const,
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
      className={`group focus-ring w-[260px] shrink-0 snap-start rounded-[22px] border-2 ${subjectStyles.bg} bg-white p-4 text-left shadow-card transition-all duration-200 active:scale-[0.97] flex flex-col gap-3`}
    >
      {/* Icon + subject + status emoji */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] shadow-sm ${subjectStyles.iconBg} bg-white/70 p-1`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={subjectStyles.iconUrl} alt={task.subject} className="h-9 w-9 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.style.display = "none"; }} />
          </span>
          <div className="min-w-0">
            <span className="block text-[9px] font-black uppercase tracking-[0.14em] text-amiko-muted">{task.subject}</span>
            <span className="block mt-0.5 text-sm font-black leading-snug text-amiko-ink line-clamp-2">{task.title}</span>
          </div>
        </div>
        <div className="shrink-0 flex h-9 w-9 items-center justify-center rounded-xl bg-white/80 border border-slate-100/40 p-0.5 shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={config.emojiUrl} alt={config.label} className="h-7 w-7 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.style.display = "none"; }} />
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
        <StudentButton as="span" variant={config.actionVariant} isGroupChild className="min-h-9 px-4 text-xs">
          {config.actionLabel}
          <AmikoIcon name={config.actionIcon} className="h-3.5 w-3.5" />
        </StudentButton>
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
              src="https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Trophy/3D/trophy_3d.png"
              alt=""
              className="h-7 w-7 object-contain"
              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.style.display = "none"; }}
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
              src="https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Clipboard/3D/clipboard_3d.png"
              alt=""
              className="h-16 w-16 object-contain opacity-50"
              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.style.display = "none"; }}
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
                    <img src={subjectStyles.iconUrl} alt={task.subject} className="h-9 w-9 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.style.display = "none"; }} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="block text-[9px] font-black uppercase tracking-[0.14em] text-amiko-muted">{task.subject}</span>
                    <span className="block mt-0.5 text-sm font-black leading-snug text-amiko-ink line-clamp-2">{task.title}</span>
                    <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-black text-emerald-700">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      Completada
                    </span>
                  </div>
                  <StudentButton
                    type="button"
                    onClick={() => onRepeat(task)}
                    className="shrink-0 min-h-10 text-xs px-4"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Counterclockwise%20arrows%20button/3D/counterclockwise_arrows_button_3d.png" alt="" className="h-4 w-4 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.style.display = "none"; }} />
                    Repetir
                  </StudentButton>
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
  const [showCheckin, setShowCheckin] = useState(false);
  const [view, setView] = useState<StudentView>("home");
  const [selectedTask, setSelectedTask] = useState<StudentPortalTask | null>(null);
  const [taskProgressMap, setTaskProgressMap] = useState<
    Record<string, { progress: number; status: TaskStatus }>
  >({});

  const [realStudentName, setRealStudentName] = useState<string | null>(null);
  const [realTasks, setRealTasks] = useState<RealAdaptedTask[]>([]);

  const handleCloseCheckin = useCallback(() => setShowCheckin(false), []);

  // Fetch first registered student name and real adapted tasks from Supabase
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;

      const [studentRes, tasksRes] = await Promise.all([
        supabase
          .from("student_profiles")
          .select("name")
          .eq("user_id", user.id)
          .order("created_at", { ascending: true })
          .limit(1)
          .maybeSingle(),
        supabase
          .from("adapted_tasks")
          .select("task_id, simple_summary, tasks(title, subject)")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(8),
      ]);

      if (studentRes.data?.name) setRealStudentName(studentRes.data.name);

      if (tasksRes.data) {
        setRealTasks(
          tasksRes.data.map((d) => ({
            task_id: d.task_id,
            simple_summary: d.simple_summary,
            title: (d.tasks as unknown as { title: string; subject: string | null })?.title ?? "Tarea",
            subject: (d.tasks as unknown as { title: string; subject: string | null })?.subject ?? null,
          })),
        );
      }
    });
  }, []);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setShowCheckin(shouldShowCheckin());
    }, 0);

    return () => window.clearTimeout(handle);
  }, []);

  useEffect(() => {
    const handle = window.setTimeout(() => {
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
    }, 0);

    return () => window.clearTimeout(handle);
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
        studentName={realStudentName}
      />
    );
  }

  if (view === "task-own") {
    return <TaskWorkspaceOwn onExit={() => setView("home")} />;
  }

  const displayName = realStudentName;

  return (
    <>
      {showCheckin && <EmotionalCheckin onComplete={handleCloseCheckin} />}

      <section className="mb-5">
        <h1 className="text-2xl font-black text-amiko-green">
          {displayName ? `${getGreeting()}, ${displayName}.` : "Bienvenido."}
        </h1>
      </section>

      {/* ── Tareas nuevas ──────────────────────────────────────────────── */}
      {realTasks.length > 0 && (
        <section className="mb-7">
          <div className="mb-3 flex items-center gap-2">
            <h2 className="text-lg font-black text-amiko-ink">Tareas nuevas</h2>
            <span className="rounded-full bg-amiko-green/10 px-3 py-1 text-xs font-black text-amiko-green">
              de tu adulto
            </span>
          </div>
          <div className="-mx-4 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex gap-3 px-4 snap-x snap-mandatory">
              {realTasks.map((t) => (
                <Link
                  key={t.task_id}
                  href={`${basePath}/aventura/${t.task_id}`}
                  className="group focus-ring w-[260px] shrink-0 snap-start rounded-[22px] border-2 border-amiko-green/20 bg-white p-4 shadow-card transition-all duration-200 active:scale-[0.97] flex flex-col gap-3 hover:border-amiko-green/40"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-amiko-mint">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Open%20book/3D/open_book_3d.png"
                        alt=""
                        className="h-9 w-9 object-contain"
                        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.style.display = "none"; }}
                      />
                    </span>
                    <div className="min-w-0 flex-1">
                      {t.subject && (
                        <span className="block text-[9px] font-black uppercase tracking-[0.14em] text-amiko-muted">
                          {t.subject}
                        </span>
                      )}
                      <span className="mt-0.5 block text-sm font-black leading-snug text-amiko-ink line-clamp-2">
                        {t.title}
                      </span>
                    </div>
                  </div>
                  <p className="line-clamp-2 text-xs font-bold leading-5 text-amiko-muted">
                    {t.simple_summary}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amiko-sky px-2.5 py-1 text-[10px] font-black text-amiko-blue">
                      <span className="h-2 w-2 rounded-full bg-amiko-blue" />
                      Por empezar
                    </span>
                    <StudentButton as="span" variant="primary" isGroupChild className="min-h-9 px-4 text-xs">
                      Vamos
                      <AmikoIcon name="play" className="h-3.5 w-3.5" />
                    </StudentButton>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Mis tareas asignadas ───────────────────────────────────────── */}
      <section className="mb-7">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-black text-amiko-ink">Tareas asignadas</h2>
          <button
            type="button"
            onClick={() => setView("history")}
            className="focus-ring flex items-center gap-1.5 rounded-full px-2 py-1 text-[11px] font-black text-slate-400 hover:bg-slate-100 hover:text-amiko-ink transition"
            aria-label="Ver historial"
          >
            <AmikoIcon name="clock" className="h-4 w-4" />
            <span>Historial</span>
            {(() => {
              const doneCount = studentPortalTasks.filter(
                (t) => taskProgressMap[t.id]?.status === "terminada"
              ).length;
              if (doneCount > 0) {
                return (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-200 text-[9px] font-black text-amiko-ink">
                    {doneCount}
                  </span>
                );
              }
              return null;
            })()}
          </button>
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
          </div>
        </div>
        {/* "Ver más" link shown when all visible tasks are done */}
        {studentPortalTasks.every((t) => taskProgressMap[t.id]?.status === "terminada") && (
          <div className="flex flex-col items-center justify-center gap-3 py-6 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Party%20popper/3D/party_popper_3d.png" alt="" className="h-12 w-12 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.style.display = "none"; }} />
            <p className="text-sm font-bold text-amiko-muted">¡Completaste todas las tareas!</p>
            <button
              type="button"
              onClick={() => setView("history")}
              className="focus-ring text-xs font-black text-amiko-blue hover:underline"
            >
              Ir al historial
            </button>
          </div>
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
          <StudentButton
            type="button"
            onClick={() => {
              if (soundSettings.canPlay()) playSound("tap");
              setView("task-own");
            }}
            className="min-h-11 text-sm px-5"
          >
            <AmikoIcon name="plus" className="h-4 w-4" />
            Crear un estudio
          </StudentButton>
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

      {/* Spacer so floating button doesn't cover last element */}
      <div className="h-20" />
    </>
  );
}
