import { AppShell } from "@/components/app-shell";

const events = [
  { title: "Matemáticas Divertidas", date: "22 Dic · 11:00 AM", tag: "Taller" },
  { title: "Grupo de Padres", date: "25 Dic · 07:00 AM", tag: "Apoyo" },
];

const workshops = [
  {
    emoji: "🏫",
    title: "Técnica de estudio efectivas",
    description: "Aprende métodos comprobados para estudiar",
    date: "18/05/2026",
    time: "04:00 PM",
    tag: "Taller",
  },
  {
    emoji: "👨‍👩‍👧",
    title: "Crianza con amor y límites",
    description: "Estrategias para el acompañamiento en casa",
    date: "20/05/2026",
    time: "06:00 PM",
    tag: "Apoyo",
  },
];

export default function ComunidadPage() {
  return (
    <AppShell>
      <div className="flex items-center gap-2 mb-5">
        <span className="text-amiko-green text-xl">👥</span>
        <h1 className="text-2xl font-black text-amiko-ink">Comunidad</h1>
      </div>

      {/* Próximos eventos */}
      <section className="mb-5 rounded-xl bg-amiko-mint p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base">📅</span>
          <h2 className="font-black text-amiko-ink">Próximos eventos</h2>
        </div>
        <div className="space-y-2">
          {events.map((event) => (
            <div
              key={event.title}
              className="flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-card"
            >
              <div>
                <p className="font-black text-amiko-ink">{event.title}</p>
                <p className="text-xs text-amiko-muted">{event.date}</p>
              </div>
              <span className="rounded-full bg-amiko-navy px-3 py-1 text-xs font-black text-white">
                {event.tag}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Talleres y Eventos */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-amiko-green">⭐</span>
          <h2 className="font-black text-amiko-ink">Talleres y Eventos</h2>
        </div>
        <div className="space-y-4">
          {workshops.map((w) => (
            <div key={w.title} className="rounded-xl bg-white shadow-card overflow-hidden">
              <div className="flex h-28 items-center justify-center bg-gradient-to-br from-amiko-sky to-amiko-mint text-6xl">
                {w.emoji}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-black text-amiko-ink leading-5">{w.title}</h3>
                  <span className="shrink-0 rounded-full bg-amiko-green px-2 py-0.5 text-[10px] font-black text-white">
                    {w.tag}
                  </span>
                </div>
                <p className="mt-1 text-sm text-amiko-muted">{w.description}</p>
                <p className="mt-2 text-xs text-amiko-muted">
                  📅 {w.date} · {w.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
