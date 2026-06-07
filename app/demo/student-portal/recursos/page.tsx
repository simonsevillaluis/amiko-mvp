"use client";

import { breakActivities } from "@/lib/student-mock-data";
import { AmikoIcon } from "@/components/amiko-icon";

const tools = [
  { emoji: "🌊", title: "Zona de Calma", description: "Respira y relájate", color: "bg-blue-50" },
  { emoji: "🎮", title: "Juegos", description: "Aprende jugando", color: "bg-green-50" },
  { emoji: "🤸", title: "Mi Cuerpo", description: "Pausas activas", color: "bg-yellow-50" },
  { emoji: "🎨", title: "Dibujar", description: "Expresa lo que sientes", color: "bg-pink-50" },
  { emoji: "🎵", title: "Música", description: "Sonidos que calman", color: "bg-purple-50" },
  { emoji: "📖", title: "Cuentos", description: "Historias para ti", color: "bg-orange-50" },
];

const iconEmojiMap: Record<string, string> = {
  water: "🥤",
  stretch: "🤸",
  draw: "🎨",
  eyes: "😌",
  calm: "🧘",
  music: "🎵",
};

export default function DemoRecursosPage() {
  return (
    <>
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EBF4FF] text-amiko-green shadow-sm">
          <AmikoIcon name="resources" className="h-5 w-5 text-amiko-green" />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-amiko-green leading-none">
            HERRAMIENTAS
          </p>
          <h1 className="mt-1 text-2xl font-black text-amiko-ink">
            Recursos
          </h1>
        </div>
      </div>
      <p className="mb-6 text-sm font-bold text-amiko-muted">
        Herramientas para sentirte bien y aprender mejor
      </p>

      <div className="grid grid-cols-2 gap-3">
        {tools.map((tool) => (
          <button
            key={tool.title}
            type="button"
            className={`flex flex-col items-center gap-2 rounded-2xl ${tool.color} p-5 shadow-card transition active:scale-95 border border-transparent hover:border-slate-200/50`}
          >
            <span className="text-4xl">{tool.emoji}</span>
            <span className="text-base font-black text-amiko-ink">{tool.title}</span>
            <span className="text-xs font-bold text-amiko-muted text-center">{tool.description}</span>
          </button>
        ))}
      </div>

      <section className="mt-8">
        <div className="mb-4 flex items-center gap-2">
          <AmikoIcon name="pause" className="h-5 w-5 text-amiko-green" />
          <h2 className="text-lg font-black text-amiko-green">Pausas Rápidas</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          {breakActivities.map((activity) => (
            <button
              key={activity.label}
              type="button"
              className="flex items-center gap-2 rounded-full bg-white px-4.5 py-3 shadow-card transition active:scale-95 border border-slate-100 hover:border-slate-200"
            >
              <span className="text-xl select-none leading-none">{iconEmojiMap[activity.icon] || "✨"}</span>
              <span className="text-sm font-black text-amiko-ink">{activity.label}</span>
            </button>
          ))}
        </div>
      </section>
    </>
  );
}
