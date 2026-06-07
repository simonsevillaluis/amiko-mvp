"use client";

import { useState, useCallback } from "react";
import {
  studentPortalStudent,
  studentPortalTasks,
  getGreeting,
  emotionOptions,
} from "@/lib/student-mock-data";
import type { StudentPortalTask } from "@/lib/student-mock-data";
import {
  shouldShowCheckin,
  markCheckinDone,
  saveProgressEvent,
} from "@/lib/local-progress";
import { StudentAdventure } from "@/components/student-adventure";
import { StudentPortalIcon } from "@/components/student-portal-icons";
import { AmikoIcon } from "@/components/amiko-icon";
import Link from "next/link";

function EmotionalCheckin({ onComplete }: { onComplete: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-amiko-navy/60 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-[380px] rounded-[32px] bg-white p-6 shadow-soft">
        <div className="flex justify-center text-6xl select-none">
          😊
        </div>
        <h2 className="mt-4 text-center text-2xl font-black text-amiko-ink leading-tight">
          ¿Cómo te sientes hoy?
        </h2>
        <p className="mt-2 text-center text-sm font-bold text-amiko-muted">
          Toca la carita que mejor te represente
        </p>
        <div className="mt-6 grid grid-cols-5 gap-1 justify-items-center w-full">
          {emotionOptions.map((emotion) => (
            <button
              key={emotion.value}
              type="button"
              onClick={() => {
                saveProgressEvent("emotion_checkin", "general", undefined, emotion.value);
                markCheckinDone();
                onComplete();
              }}
              className="flex w-full flex-col items-center gap-1.5 rounded-2xl py-3 px-0.5 transition hover:bg-amiko-sky/40 active:scale-95 text-center min-w-0"
            >
              <span className="text-3xl sm:text-4xl select-none leading-none">
                {emotion.emoji}
              </span>
              <span className="text-[10px] font-black text-amiko-muted leading-tight block truncate max-w-full">
                {emotion.label}
              </span>
            </button>
          ))}
        </div>
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
  const mapping: Record<string, { emoji: string; accent: string; bg: string }> = {
    math: { emoji: "🔢", accent: "border-l-amiko-green", bg: "bg-amiko-mint/20" },
    reading: { emoji: "📖", accent: "border-l-amiko-blue", bg: "bg-amiko-sky/30" },
    science: { emoji: "🧪", accent: "border-l-purple-400", bg: "bg-purple-50" },
  };

  const { emoji, accent, bg } = mapping[task.icon] || {
    emoji: "📋",
    accent: "border-l-slate-300",
    bg: "bg-slate-50",
  };

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full items-center gap-4 rounded-2xl border-l-4 bg-white p-4 text-left shadow-card transition hover:shadow-soft active:scale-[0.98] border border-slate-100/30 ${accent}`}
    >
      <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${bg}`}>
        <span className="text-3xl leading-none select-none">{emoji}</span>
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-lg font-black leading-snug text-amiko-ink">
          {task.title}
        </h3>
        <p className="mt-0.5 text-sm font-bold text-amiko-muted">
          {task.subject}
        </p>
      </div>
      <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-amiko-sky text-amiko-blue hover:bg-amiko-blue hover:text-white transition active:scale-95">
        <AmikoIcon name="play" className="h-5 w-5 fill-current" />
      </div>
    </button>
  );
}

export default function DemoStudentPortalPage() {
  const [showCheckin, setShowCheckin] = useState(shouldShowCheckin);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  const handleCloseCheckin = useCallback(() => setShowCheckin(false), []);
  const handleCloseAdventure = useCallback(() => setActiveTaskId(null), []);

  const activeTask = activeTaskId
    ? studentPortalTasks.find((t) => t.id === activeTaskId) ?? null
    : null;

  if (activeTask) {
    return <StudentAdventure task={activeTask} onExit={handleCloseAdventure} demoMode={false} />;
  }

  return (
    <>
      {showCheckin && <EmotionalCheckin onComplete={handleCloseCheckin} />}

      <section className="mb-6">
        <div>
          <h1 className="text-2xl font-black text-amiko-ink">
            {getGreeting()}, {studentPortalStudent.name}!
          </h1>
          <p className="mt-1 text-sm font-bold text-amiko-muted">
            ¿Qué hacemos hoy?
          </p>
        </div>
      </section>

      <section className="mb-6">
        <Link
          href="/demo/student-portal/amiko"
          className="flex w-full items-center gap-4 rounded-2xl border-2 border-amiko-green bg-gradient-to-r from-amiko-sky to-amiko-mint p-4 shadow-card transition hover:shadow-soft active:scale-[0.98]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/amiko-character/amiko-icon.svg"
            alt="Amiko"
            width={56}
            height={56}
            className="h-14 w-14 shrink-0 object-contain"
          />
          <div className="text-left">
            <h2 className="text-lg font-black text-amiko-ink">
              Hablar con Amiko
            </h2>
            <p className="text-sm font-bold text-amiko-muted">
              Cuéntame tu tarea
            </p>
          </div>
        </Link>
      </section>

      <section>
        <div className="mb-4 flex items-center gap-2">
          <span className="text-xl">📋</span>
          <h2 className="text-xl font-black text-amiko-green">
            Mis Tareas de Hoy
          </h2>
        </div>
        <div className="space-y-3">
          {studentPortalTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onSelect={() => setActiveTaskId(task.id)}
            />
          ))}
        </div>
      </section>
    </>
  );
}
