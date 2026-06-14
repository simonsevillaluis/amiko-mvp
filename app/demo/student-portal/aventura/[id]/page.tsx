"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { AmikoIcon } from "@/components/amiko-icon";
import { StudentButton } from "@/components/student-button";
import { AmikoMark } from "@/components/student-portal-icons";
import { studentPortalTasks } from "@/lib/student-mock-data";
import { StudentAdventure } from "@/components/student-adventure";
import { createClient } from "@/lib/supabase/client";

type AdaptedStep = {
  number: number;
  instruction: string;
  visual_support: string;
  adult_support?: string;
};

type RealTask = {
  title: string;
  subject: string | null;
  simple_summary: string;
  steps: AdaptedStep[];
};

// ─── Step-by-step view for real adapted tasks ─────────────────────────────────

function RealTaskView({
  task,
  onExit,
}: {
  task: RealTask;
  onExit: () => void;
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [done, setDone] = useState(false);

  const step = task.steps[currentStep];
  const isLast = currentStep === task.steps.length - 1;

  if (done) {
    return (
      <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-6 bg-[#EDF4FF] px-6 text-center sm:left-1/2 sm:right-auto sm:w-full sm:max-w-[430px] sm:-translate-x-1/2 sm:shadow-[0_24px_80px_rgba(9,54,124,0.24)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Trophy/3D/trophy_3d.png"
          alt=""
          className="h-20 w-20 object-contain"
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
        <div>
          <p className="text-2xl font-black text-amiko-ink">¡Lo lograste!</p>
          <p className="mt-2 font-bold text-amiko-muted">Completaste todos los pasos.</p>
        </div>
        <StudentButton onClick={onExit} className="min-h-12 px-8 text-base">
          Volver al inicio
        </StudentButton>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex flex-col overflow-hidden bg-[#EDF4FF] sm:left-1/2 sm:right-auto sm:w-full sm:max-w-[430px] sm:-translate-x-1/2 sm:shadow-[0_24px_80px_rgba(9,54,124,0.24)]">
      {/* Header */}
      <header className="shrink-0 border-b border-blue-100 bg-white/95 px-4 py-3 backdrop-blur-xl">
        <div className="grid grid-cols-[40px_1fr_40px] items-center gap-3">
          <button
            type="button"
            aria-label="Volver"
            onClick={onExit}
            className="focus-ring flex h-10 w-10 items-center justify-center rounded-full text-amiko-navy transition hover:bg-amiko-sky"
          >
            <AmikoIcon name="back" className="h-6 w-6" />
          </button>
          <div className="text-center">
            {task.subject && (
              <p className="text-[10px] font-black uppercase tracking-widest text-amiko-muted">
                {task.subject}
              </p>
            )}
            <h1 className="text-sm font-black text-amiko-navy line-clamp-1">{task.title}</h1>
          </div>
          <div />
        </div>
      </header>

      {/* Progress bar */}
      <div className="shrink-0 px-4 pt-4">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs font-bold text-amiko-muted">
            Paso {currentStep + 1} de {task.steps.length}
          </span>
          <span className="text-xs font-black text-amiko-ink">
            {Math.round((currentStep / task.steps.length) * 100)}%
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-amiko-green transition-all duration-500"
            style={{ width: `${(currentStep / task.steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Step content */}
      <main className="flex-1 overflow-y-auto px-4 py-5">
        <div className="rounded-3xl bg-white p-5 shadow-card">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amiko-mint">
            <span className="text-2xl font-black text-amiko-green">{step.number}</span>
          </div>
          <p className="text-xl font-black leading-snug text-amiko-ink">{step.instruction}</p>
          {step.visual_support && (
            <p className="mt-4 rounded-xl bg-amiko-sky px-4 py-3 text-sm font-bold leading-5 text-amiko-navy">
              💡 {step.visual_support}
            </p>
          )}
        </div>

        {/* Summary on first step */}
        {currentStep === 0 && task.simple_summary && (
          <div className="mt-4 rounded-2xl border border-amiko-green/20 bg-amiko-mint/40 p-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-amiko-green">
              Resumen de la tarea
            </p>
            <p className="mt-1 text-sm font-bold leading-5 text-amiko-ink">
              {task.simple_summary}
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="shrink-0 border-t border-blue-100 bg-white/95 px-4 pb-6 pt-4 backdrop-blur-xl">
        <div className="flex gap-3">
          {currentStep > 0 && (
            <StudentButton
              variant="tertiary"
              onClick={() => setCurrentStep((prev) => prev - 1)}
              className="min-h-12 flex-1"
            >
              <AmikoIcon name="back" className="h-4 w-4" />
              Anterior
            </StudentButton>
          )}
          <StudentButton
            onClick={() => {
              if (isLast) {
                setDone(true);
              } else {
                setCurrentStep((prev) => prev + 1);
              }
            }}
            className="min-h-12 flex-1"
          >
            {isLast ? "¡Listo!" : "Siguiente"}
            {!isLast && <AmikoIcon name="chevron" className="h-4 w-4" />}
          </StudentButton>
        </div>
      </footer>
    </div>
  );
}

// ─── Loading & not-found shells ───────────────────────────────────────────────

function LoadingShell() {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#EDF4FF] sm:left-1/2 sm:right-auto sm:w-full sm:max-w-[430px] sm:-translate-x-1/2 sm:shadow-[0_24px_80px_rgba(9,54,124,0.24)]">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-2.5 w-2.5 animate-bounce rounded-full bg-amiko-blue"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}

function NotFoundShell({ onExit }: { onExit: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-5 bg-[#EDF4FF] px-6 text-center sm:left-1/2 sm:right-auto sm:w-full sm:max-w-[430px] sm:-translate-x-1/2 sm:shadow-[0_24px_80px_rgba(9,54,124,0.24)]">
      <AmikoMark className="h-16 w-16 shrink-0 opacity-40" />
      <p className="font-black text-amiko-muted">No encontramos esta tarea.</p>
      <StudentButton variant="tertiary" onClick={onExit} className="min-h-11 px-6">
        <AmikoIcon name="back" className="h-4 w-4" />
        Volver
      </StudentButton>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AventuraPage() {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();

  const taskId = params.id as string;
  const basePath = pathname.startsWith("/student-portal")
    ? "/student-portal"
    : "/demo/student-portal";

  const mockTask = studentPortalTasks.find((t) => t.id === taskId);
  const [realTask, setRealTask] = useState<RealTask | null>(null);
  // Start as "done" when a mock task is found — avoids calling setState inside the effect
  const [loadState, setLoadState] = useState<"loading" | "done">(mockTask ? "done" : "loading");

  const handleExit = useCallback(() => {
    router.push(basePath);
  }, [router, basePath]);

  useEffect(() => {
    if (mockTask) return;

    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        setLoadState("done");
        return;
      }

      const { data } = await supabase
        .from("adapted_tasks")
        .select("simple_summary, steps, tasks(title, subject)")
        .eq("task_id", taskId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (data) {
        const taskMeta = data.tasks as unknown as { title: string; subject: string | null } | null;
        setRealTask({
          title: taskMeta?.title ?? "Tarea",
          subject: taskMeta?.subject ?? null,
          simple_summary: data.simple_summary,
          steps: (data.steps as AdaptedStep[]) ?? [],
        });
      }
      setLoadState("done");
    });
  }, [taskId, mockTask]);

  // Mock task found — use the rich existing experience
  if (mockTask) {
    return <StudentAdventure task={mockTask} onExit={handleExit} demoMode={false} />;
  }

  if (loadState === "loading") return <LoadingShell />;

  if (!realTask || realTask.steps.length === 0) return <NotFoundShell onExit={handleExit} />;

  return <RealTaskView task={realTask} onExit={handleExit} />;
}
