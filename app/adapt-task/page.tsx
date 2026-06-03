import Link from "next/link";
import { AppShell } from "@/components/app-shell";

function CameraIcon() {
  return (
    <svg
      className="h-8 w-8 text-slate-300"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
    >
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.5}
      viewBox="0 0 24 24"
    >
      <path d="M12 19V5" />
      <path d="m5 12 7-7 7 7" />
    </svg>
  );
}

const subjects = [
  { emoji: "🔬", label: "Biología" },
  { emoji: "🎨", label: "Cultura" },
  { emoji: "⚽", label: "Educación Física" },
];

export default function AdaptTaskPage() {
  return (
    <AppShell>
      {/* Main upload card */}
      <section className="mb-5 rounded-2xl border-2 border-amiko-green bg-white p-5 shadow-card">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amiko-mint text-xl">
            🤖
          </div>
          <div>
            <h1 className="text-lg font-black text-amiko-ink">Hablar con el Asistente IA</h1>
            <p className="mt-0.5 text-sm leading-5 text-amiko-muted">
              Sube una foto de tu tarea o haz una pregunta.{" "}
              <span className="font-black text-amiko-ink">¡Yo te ayudaré a Resolverla!</span>
            </p>
          </div>
        </div>

        {/* Photo upload area */}
        <div className="mt-4 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-amiko-sky/40 py-7">
          <CameraIcon />
          <p className="text-sm font-black text-amiko-muted">Sube una Foto</p>
        </div>

        {/* Attach button */}
        <Link
          href="/adapt-task/chat"
          className="focus-ring mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-amiko-green py-3 text-base font-black text-white shadow-card transition hover:brightness-95"
        >
          <UploadIcon />
          Adjuntar Archivo
        </Link>
      </section>

      {/* Subject cards */}
      <div className="space-y-4">
        {subjects.map((subject) => (
          <div
            key={subject.label}
            className="flex items-center gap-4 rounded-2xl bg-amiko-mint/50 p-4"
          >
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-white text-3xl shadow-card">
              {subject.emoji}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-black text-amiko-ink">{subject.label}</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  href="/child-mode/task-1"
                  className="focus-ring inline-flex items-center rounded-full bg-amiko-navy px-4 py-2 text-sm font-black text-white shadow-card transition hover:bg-blue-900"
                >
                  Ver temas
                </Link>
                <Link
                  href="/adapt-task/chat"
                  className="focus-ring inline-flex items-center rounded-full border border-amiko-navy px-4 py-2 text-sm font-black text-amiko-navy transition hover:bg-amiko-sky"
                >
                  Practicar
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
