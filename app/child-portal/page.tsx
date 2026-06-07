"use client";

import { useState, useCallback } from "react";
import {
  childStudent,
  childTasks,
  getGreeting,
  emotionOptions,
} from "@/lib/child-mock-data";
import {
  shouldShowCheckin,
  markCheckinDone,
  saveProgressEvent,
} from "@/lib/local-progress";
import { ChildAdventure } from "@/components/child-adventure";

function EmotionalCheckin({ onComplete }: { onComplete: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-amiko-navy/60 backdrop-blur-sm">
      <div className="mx-5 w-full max-w-sm rounded-3xl bg-white p-7 shadow-soft">
        <p className="text-center text-lg font-black text-amiko-ink">
          {childStudent.avatar}
        </p>
        <h2 className="mt-2 text-center text-2xl font-black text-amiko-ink">
          ¿Cómo te sientes hoy?
        </h2>
        <p className="mt-2 text-center text-sm text-amiko-muted">
          Toca la carita que mejor te represente
        </p>
        <div className="mt-6 flex justify-center gap-3">
          {emotionOptions.map((emotion) => (
            <button
              key={emotion.value}
              type="button"
              onClick={() => {
                saveProgressEvent(
                  "emotion_checkin",
                  "general",
                  undefined,
                  emotion.value,
                );
                markCheckinDone();
                onComplete();
              }}
              className="flex flex-col items-center gap-2 rounded-2xl p-3 transition hover:bg-amiko-sky active:scale-95"
            >
              <span className="text-4xl">{emotion.emoji}</span>
              <span className="text-[10px] font-black text-amiko-muted">
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
  task: (typeof childTasks)[0];
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex w-full items-center gap-4 rounded-2xl bg-white p-4 shadow-card transition hover:shadow-soft active:scale-[0.98]"
    >
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-amiko-mint text-3xl">
        {task.emoji}
      </div>
      <div className="min-w-0 flex-1 text-left">
        <h3 className="text-lg font-black leading-6 text-amiko-ink">
          {task.title}
        </h3>
        <p className="mt-1 text-sm font-bold text-amiko-muted">
          {task.subject}
        </p>
      </div>
      <div className="shrink-0 text-2xl">▶️</div>
    </button>
  );
}

export default function ChildHomePage() {
  const [showCheckin, setShowCheckin] = useState(shouldShowCheckin);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  const handleCloseCheckin = useCallback(() => setShowCheckin(false), []);
  const handleCloseAdventure = useCallback(() => setActiveTaskId(null), []);

  const activeTask = activeTaskId
    ? childTasks.find((t) => t.id === activeTaskId) ?? null
    : null;

  if (activeTask) {
    return (
      <ChildAdventure task={activeTask} onExit={handleCloseAdventure} />
    );
  }

  return (
    <>
      {showCheckin && <EmotionalCheckin onComplete={handleCloseCheckin} />}

      {/* Greeting */}
      <section className="mb-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amiko-mint text-4xl shadow-card">
            {childStudent.avatar}
          </div>
          <div>
            <h1 className="text-2xl font-black text-amiko-ink">
              {getGreeting()}, {childStudent.name}!
            </h1>
            <p className="mt-1 text-sm font-bold text-amiko-muted">
              ¿Qué hacemos hoy?
            </p>
          </div>
        </div>
      </section>

      {/* Amiko assistant card */}
      <section className="mb-6">
        <button
          type="button"
          className="flex w-full items-center gap-4 rounded-2xl border-2 border-amiko-green bg-gradient-to-r from-amiko-sky to-amiko-mint p-4 shadow-card transition hover:shadow-soft active:scale-[0.98]"
        >
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-2xl shadow-card">
            🤖
          </div>
          <div className="text-left">
            <h2 className="text-lg font-black text-amiko-ink">
              Hablar con Amiko
            </h2>
            <p className="text-sm font-bold text-amiko-muted">
              Cuéntame tu tarea 🎤
            </p>
          </div>
        </button>
      </section>

      {/* Tasks for today */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <span className="text-xl">📋</span>
          <h2 className="text-xl font-black text-amiko-green">
            Mis Tareas de Hoy
          </h2>
        </div>
        <div className="space-y-3">
          {childTasks.map((task) => (
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
