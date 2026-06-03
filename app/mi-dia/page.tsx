import Link from "next/link";

function BackIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} viewBox="0 0 24 24">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg className="h-5 w-5" fill="white" viewBox="0 0 24 24">
      <path d="M6 4l15 8-15 8V4Z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} viewBox="0 0 24 24">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="h-5 w-5 text-amiko-green" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v6l4 2" />
    </svg>
  );
}

const tasks = [
  {
    id: "task-1",
    subject: "Matemáticas",
    time: "8:00 AM",
    duration: "60 min",
    title: "Resolver ecuaciones cuadráticas",
    percent: 60,
    done: false,
  },
  {
    id: "task-2",
    subject: "Biología",
    time: "8:00 AM",
    duration: "60 min",
    title: "Estudiar células eucariotas",
    percent: 80,
    done: false,
  },
  {
    id: "task-3",
    subject: "Historia",
    time: "8:00 AM",
    duration: "60 min",
    title: "Independencia de Venezuela",
    percent: 30,
    done: false,
  },
  {
    id: "task-4",
    subject: "Edu. Física",
    time: "8:00 AM",
    duration: "60 min",
    title: "Rutina de entrenamiento",
    percent: 100,
    done: true,
  },
];

export default function MiDiaPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-slate-100 bg-white">
        <div className="mx-auto flex max-w-[411px] items-center justify-between px-4 py-3">
          <Link href="/dashboard" className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-100">
            <BackIcon />
          </Link>
          <h1 className="text-base font-black text-amiko-ink">Mi Dia</h1>
          <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-100">
            <ClockIcon />
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-[411px] px-4 py-5">
        {/* Section title */}
        <div className="mb-4 flex items-center gap-2">
          <span className="text-amiko-green text-lg">🔖</span>
          <h2 className="text-xl font-black text-amiko-green">Agenda de Hoy</h2>
        </div>

        {/* Task cards */}
        <div className="space-y-3">
          {tasks.map((task) => (
            <Link
              key={task.id}
              href={`/tasks/${task.id}`}
              className={`block rounded-2xl p-4 shadow-card transition hover:shadow-soft ${
                task.done ? "bg-amiko-mint" : "bg-white"
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Play/Check circle */}
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full shadow-card ${
                    task.done ? "bg-amiko-green" : "bg-amiko-navy"
                  }`}
                >
                  {task.done ? <CheckIcon /> : <PlayIcon />}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="rounded-full bg-amiko-green px-3 py-0.5 text-xs font-black text-white">
                      {task.subject}
                    </span>
                    <span className="text-xs text-amiko-muted">
                      {task.time} <span className="mx-1">■</span> {task.duration}
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-start justify-between gap-2">
                    <h3 className="font-black leading-5 text-amiko-ink">{task.title}</h3>
                    <span className="shrink-0 text-2xl font-black text-amiko-navy">
                      {task.percent}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${task.percent}%`,
                    background: task.done
                      ? "#8EC733"
                      : "linear-gradient(90deg, #0F5AD1 0%, #22D3EE 100%)",
                  }}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
