"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useState } from "react";
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
  markCheckinDone,
  saveProgressEvent,
  shouldShowCheckin,
} from "@/lib/local-progress";

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

function TaskCard({
  task,
  onSelect,
}: {
  task: StudentPortalTask;
  onSelect: () => void;
}) {
  const accent =
    task.icon === "math"
      ? "border-l-amiko-green bg-amiko-mint/20 text-amiko-green"
      : task.icon === "reading"
        ? "border-l-amiko-blue bg-amiko-sky/40 text-amiko-blue"
        : "border-l-[#B266FF] bg-purple-50 text-purple-500";

  return (
    <button
      type="button"
      onClick={onSelect}
      className="focus-ring flex w-full items-center gap-4 rounded-2xl border border-slate-100/60 border-l-4 bg-white p-4 text-left shadow-card transition active:scale-[0.98]"
    >
      <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${accent}`}>
        <StudentPortalIcon name={task.icon} className="h-8 w-8" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-base font-black leading-snug text-amiko-ink">
          {task.title}
        </span>
        <span className="mt-0.5 block text-sm font-bold text-amiko-muted">
          {task.subject}
        </span>
        <span className="mt-1.5 flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-slate-300" />
          <span className="text-[11px] font-black text-amiko-muted">Por empezar</span>
        </span>
      </span>
      <span className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full bg-amiko-green px-4 text-xs font-black text-white shadow-sm">
        Vamos
        <AmikoIcon name="play" className="h-3.5 w-3.5" />
      </span>
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

  const handleCloseCheckin = useCallback(() => setShowCheckin(false), []);

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

      <section className="mb-6">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-amiko-green">
          Modo estudiante
        </p>
        <h1 className="mt-1 text-2xl font-black text-amiko-ink">
          {getGreeting()}, {studentPortalStudent.name}.
        </h1>
        <p className="mt-1 text-sm font-bold text-amiko-muted">
          Estas son tus tareas de hoy.
        </p>
      </section>

      <section className="space-y-3">
        {studentPortalTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onSelect={() => {
              setSelectedTask(task);
              setView("task-assigned");
            }}
          />
        ))}

        <button
          type="button"
          onClick={() => setView("task-own")}
          className="focus-ring flex min-h-14 w-full items-center justify-center gap-2 rounded-full border-2 border-dashed border-slate-200 bg-white px-5 text-sm font-black text-amiko-muted transition active:scale-[0.98]"
        >
          <AmikoIcon name="plus" className="h-5 w-5" />
          Crear mi tarea
        </button>
      </section>

      <section className="mt-6">
        <Link
          href={`${basePath}/amiko`}
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
