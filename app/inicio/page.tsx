import Link from "next/link";
import { AmikoIcon } from "@/components/amiko-icon";

export default function InicioPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-white px-6 py-10">
      <div className="w-full max-w-[390px]">
        <div className="mb-8 text-center">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-amiko-blue">
            AMIKO
          </p>
          <h1 className="mt-2 text-3xl font-black leading-tight text-amiko-navy">
            ¿Qué hacemos hoy?
          </h1>
          <p className="mt-2 text-base font-bold text-amiko-muted">
            Elige cómo quieres usar AMIKO.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/dashboard"
            className="flex w-full items-center gap-4 rounded-2xl border border-amiko-blue/20 bg-amiko-sky/40 px-5 py-4 shadow-card transition hover:bg-amiko-sky active:scale-[0.98]"
          >
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amiko-blue text-white">
              <AmikoIcon name="home" className="h-7 w-7" />
            </span>
            <span className="flex-1 text-left">
              <span className="block text-base font-black text-amiko-navy">
                Panel del adulto
              </span>
              <span className="mt-0.5 block text-sm font-bold text-amiko-muted">
                Adaptar tareas, ver progreso y acompañar el aprendizaje.
              </span>
            </span>
            <AmikoIcon name="chevron" className="h-5 w-5 shrink-0 text-amiko-blue" />
          </Link>

          <Link
            href="/demo/student-portal"
            className="flex w-full items-center gap-4 rounded-2xl border border-amiko-green/20 bg-amiko-mint/40 px-5 py-4 shadow-card transition hover:bg-amiko-mint active:scale-[0.98]"
          >
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amiko-green text-white">
              <AmikoIcon name="sparkles" className="h-7 w-7" />
            </span>
            <span className="flex-1 text-left">
              <span className="block text-base font-black text-amiko-navy">
                Portal del estudiante
              </span>
              <span className="mt-0.5 block text-sm font-bold text-amiko-muted">
                Explora cómo ve AMIKO tu estudiante.
              </span>
            </span>
            <AmikoIcon name="chevron" className="h-5 w-5 shrink-0 text-amiko-green" />
          </Link>
        </div>
      </div>
    </main>
  );
}
