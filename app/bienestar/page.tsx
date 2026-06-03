import { AppShell } from "@/components/app-shell";

function PlayIcon() {
  return (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M6 4l15 8-15 8V4Z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v6l4 2" />
    </svg>
  );
}

const sections = [
  {
    title: "Respiración Guiada",
    items: [
      {
        emoji: "🌬️",
        name: "Respiración 4-7-8",
        description: "Inhala 4 segundos, sostén 7, exhala 8",
        minutes: 5,
      },
      {
        emoji: "🌀",
        name: "Respiración Cuadrada",
        description: "Inahala, sosten, exhala (4-4-4-4)",
        minutes: 10,
      },
    ],
  },
  {
    title: "Calmar Frustración",
    items: [
      {
        emoji: "💪",
        name: "Relajación Muscular",
        description: "Libera la tensión de tu cuerpo",
        minutes: 10,
      },
    ],
  },
];

export default function BienestarPage() {
  return (
    <AppShell>
      <div className="flex items-center gap-2 mb-5">
        <span className="text-xl">😊</span>
        <h1 className="text-2xl font-black text-amiko-ink">Bienestar Emocional</h1>
      </div>

      <div className="space-y-6">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="mb-3 font-black text-amiko-blue">{section.title}</h2>
            <div className="space-y-3">
              {section.items.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-card"
                >
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-amiko-mint text-4xl">
                    {item.emoji}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-black text-amiko-ink">{item.name}</h3>
                    <p className="mt-0.5 text-sm leading-5 text-amiko-muted">{item.description}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="flex items-center gap-1 text-xs text-amiko-muted">
                        <ClockIcon />
                        {item.minutes} min
                      </span>
                      <button
                        type="button"
                        className="flex items-center gap-1.5 rounded-full bg-amiko-mint px-4 py-1.5 text-sm font-black text-green-800 shadow-sm transition hover:bg-green-100"
                      >
                        <PlayIcon />
                        Comenzar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </AppShell>
  );
}
