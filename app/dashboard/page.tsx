import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { ProgressSummary } from "@/components/progress-summary";
import { StudentProfileCard } from "@/components/student-profile-card";
import { Card, StatusPill } from "@/components/ui";
import { recentTasks } from "@/lib/mock-data";

function MascotScene() {
  return (
    <div className="relative h-32 overflow-hidden rounded-t-[22px] bg-gradient-to-br from-[#BCE4FF] via-[#DFF4FF] to-[#C7F2BC]">
      <div className="absolute left-5 top-5 h-9 w-16 rotate-[-18deg] rounded-full bg-amiko-coral/80" />
      <div className="absolute right-7 top-5 h-7 w-12 rotate-12 rounded-full bg-amiko-green/70" />
      <div className="absolute bottom-6 left-8 h-10 w-10 rounded-xl bg-white/80" />
      <div className="absolute bottom-5 right-9 h-12 w-12 rounded-full border-4 border-white/80 bg-amiko-blue/80" />
      <div className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white bg-white text-2xl font-black text-amiko-green shadow-card">
        ami
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-amiko-navy/90 px-4 py-2 text-lg font-black text-white">
        Continuar Tareas
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AppShell>
      <section className="mb-5">
        <p className="text-xl font-black text-amiko-green">Aula Virtual</p>
        <Link href="/tasks/task-1" className="focus-ring mt-3 block overflow-hidden rounded-2xl bg-white shadow-card">
          <MascotScene />
          <div className="bg-gradient-to-r from-[#9BD875] to-[#DDF7B9] p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/80 text-white">
                <span className="h-0 w-0 border-y-[9px] border-l-[14px] border-y-transparent border-l-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl font-black leading-6 text-amiko-ink">Matemáticas</h1>
                <p className="text-sm font-bold text-green-900">Resolver operaciones cuadráticas</p>
              </div>
              <p className="text-2xl font-black text-white">60%</p>
            </div>
            <div className="mt-4 h-4 rounded-full bg-white/80 p-1">
              <div className="h-full w-3/5 rounded-full bg-amiko-blue" />
            </div>
          </div>
        </Link>
      </section>

      <Card className="mb-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-amiko-ink">Progreso de Hoy</h2>
          <span className="text-2xl font-black text-amiko-blue">3/6</span>
        </div>
        <div className="mt-4 h-4 rounded-full bg-slate-100">
          <div className="h-full w-1/2 rounded-full bg-amiko-green" />
        </div>
      </Card>

      <Link
        href="/adapt-task"
        className="focus-ring mb-5 flex items-center gap-4 rounded-2xl border-2 border-amiko-green bg-amiko-sky/70 p-4 shadow-card"
      >
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white text-xl font-black text-amiko-green shadow-card">
          AI
        </div>
        <div>
          <h2 className="text-lg font-black leading-6 text-amiko-ink">Hablar con el Asistente IA</h2>
          <p className="text-sm font-bold text-amiko-muted">Pregúntame sobre cualquier tarea.</p>
        </div>
      </Link>

      <section className="mb-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-black text-amiko-green">Tareas Pendientes</h2>
          <StatusPill>Demo</StatusPill>
        </div>
        <div className="space-y-3">
          {recentTasks.map((task) => (
            <Link
              key={task.id}
              href={`/tasks/${task.id}`}
              className="focus-ring flex items-center gap-3 rounded-xl bg-white p-3 shadow-card"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amiko-mint font-black text-green-800">
                {task.subject.slice(0, 1)}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-black text-amiko-ink">{task.title}</h3>
                <p className="text-sm font-bold text-amiko-muted">{task.subject}</p>
              </div>
              <span className="rounded-full bg-amiko-sky px-3 py-1 text-xs font-black text-amiko-blue">
                {task.status}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <StudentProfileCard />
        <div className="hidden lg:block">
          <ProgressSummary />
        </div>
      </div>
    </AppShell>
  );
}
