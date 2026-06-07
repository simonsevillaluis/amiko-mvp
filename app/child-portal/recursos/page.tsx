"use client";

import { breakActivities } from "@/lib/child-mock-data";

const tools = [
  {
    emoji: "🌊",
    title: "Zona de Calma",
    description: "Respira y relájate",
    color: "bg-blue-50",
  },
  {
    emoji: "🎮",
    title: "Juegos",
    description: "Aprende jugando",
    color: "bg-green-50",
  },
  {
    emoji: "🤸",
    title: "Mi Cuerpo",
    description: "Pausas activas",
    color: "bg-yellow-50",
  },
  {
    emoji: "🎨",
    title: "Dibujar",
    description: "Expresa lo que sientes",
    color: "bg-pink-50",
  },
  {
    emoji: "🎵",
    title: "Música",
    description: "Sonidos que calman",
    color: "bg-purple-50",
  },
  {
    emoji: "📖",
    title: "Cuentos",
    description: "Historias para ti",
    color: "bg-orange-50",
  },
];

export default function RecursosPage() {
  return (
    <>
      <div className="mb-5 flex items-center gap-2">
        <span className="text-xl">🧩</span>
        <h1 className="text-2xl font-black text-amiko-ink">Recursos</h1>
      </div>
      <p className="mb-6 text-sm font-bold text-amiko-muted">
        Herramientas para sentirte bien y aprender mejor
      </p>

      {/* Tools grid */}
      <div className="grid grid-cols-2 gap-3">
        {tools.map((tool) => (
          <button
            key={tool.title}
            type="button"
            className={`flex flex-col items-center gap-2 rounded-2xl ${tool.color} p-5 shadow-card transition active:scale-95`}
          >
            <span className="text-4xl">{tool.emoji}</span>
            <span className="text-base font-black text-amiko-ink">
              {tool.title}
            </span>
            <span className="text-xs font-bold text-amiko-muted">
              {tool.description}
            </span>
          </button>
        ))}
      </div>

      {/* Quick break section */}
      <section className="mt-8">
        <div className="mb-4 flex items-center gap-2">
          <span className="text-lg">⏸️</span>
          <h2 className="text-lg font-black text-amiko-green">
            Pausas Rápidas
          </h2>
        </div>
        <div className="flex flex-wrap gap-3">
          {breakActivities.map((activity) => (
            <button
              key={activity.label}
              type="button"
              className="flex items-center gap-2 rounded-full bg-white px-4 py-3 shadow-card transition active:scale-95"
            >
              <span className="text-xl">{activity.emoji}</span>
              <span className="text-sm font-black text-amiko-ink">
                {activity.label}
              </span>
            </button>
          ))}
        </div>
      </section>
    </>
  );
}
