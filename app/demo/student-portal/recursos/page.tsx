"use client";

import { AmikoIcon } from "@/components/amiko-icon";
import { StudentPortalIcon } from "@/components/student-portal-icons";
import { breakActivities } from "@/lib/student-mock-data";
import { playSound } from "@/lib/sounds";
import { soundSettings } from "@/lib/student-sound-settings";

const breakActivityEmojis: Record<string, string> = {
  water: "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Droplet/3D/droplet_3d.png",
  stretch: "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Person%20cartwheeling/3D/person_cartwheeling_3d.png",
  draw: "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Artist%20palette/3D/artist_palette_3d.png",
  eyes: "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Zzz/3D/zzz_3d.png",
  calm: "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Person%20in%20lotus%20position/Default/3D/person_in_lotus_position_3d_default.png",
};

const tools = [
  {
    title: "Zona de calma",
    description: "Respira un momento",
    bg: "bg-sky-50/50",
    border: "border-sky-100/60 hover:border-sky-200/80",
    iconBg: "bg-sky-100/80 shadow-sm",
    emojiUrl: "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Person%20in%20lotus%20position/Default/3D/person_in_lotus_position_3d_default.png",
  },
  {
    title: "Pasos",
    description: "Ver una cosa a la vez",
    bg: "bg-emerald-50/50",
    border: "border-emerald-100/60 hover:border-emerald-200/80",
    iconBg: "bg-emerald-100/80 shadow-sm",
    emojiUrl: "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Clipboard/3D/clipboard_3d.png",
  },
  {
    title: "Pedir ayuda",
    description: "Avisar a tu adulto",
    bg: "bg-orange-50/50",
    border: "border-orange-100/60 hover:border-orange-200/80",
    iconBg: "bg-orange-100/80 shadow-sm",
    emojiUrl: "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Raised%20hand/Default/3D/raised_hand_3d_default.png",
  },
  {
    title: "Dibujar",
    description: "Expresar una idea",
    bg: "bg-purple-50/50",
    border: "border-purple-100/60 hover:border-purple-200/80",
    iconBg: "bg-purple-100/80 shadow-sm",
    emojiUrl: "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Artist%20palette/3D/artist_palette_3d.png",
  },
];

export default function DemoRecursosPage() {
  return (
    <>
      {/* Header */}
      <section className="mb-5 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amiko-sky text-amiko-green shadow-sm">
          <AmikoIcon name="resources" className="h-5 w-5" />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-amiko-green">
            Herramientas
          </p>
          <h1 className="mt-1 text-2xl font-black text-amiko-ink">Recursos</h1>
        </div>
      </section>

      {/* Intro card */}
      <div className="mb-5 rounded-[22px] bg-gradient-to-br from-amiko-sky to-amiko-mint px-5 py-4 shadow-sm">
        <p className="text-sm font-black leading-6 text-amiko-navy">
          Usa estas herramientas cuando necesites retomar con calma. 🌱
        </p>
      </div>

      {/* Tool grid */}
      <section className="mb-7 grid grid-cols-2 gap-3">
        {tools.map((tool) => (
          <button
            key={tool.title}
            type="button"
            onClick={() => {
              if (soundSettings.canPlay()) playSound("tap");
            }}
            className={`focus-ring flex min-h-36 flex-col items-start justify-between rounded-[22px] border-2 ${tool.border} ${tool.bg} p-4 text-left shadow-sm transition active:scale-95`}
          >
            <span className={`flex h-14 w-14 items-center justify-center rounded-2xl ${tool.iconBg} bg-white/70 p-1`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={tool.emojiUrl} alt={tool.title} className="h-10 w-10 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.style.display = "none"; }} />
            </span>
            <span>
              <span className="block text-sm font-black text-amiko-ink">
                {tool.title}
              </span>
              <span className="mt-0.5 block text-xs font-bold leading-5 text-amiko-muted">
                {tool.description}
              </span>
            </span>
          </button>
        ))}
      </section>

      {/* Pausas rápidas */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Pause%20button/3D/pause_button_3d.png" alt="" className="h-5 w-5 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.style.display = "none"; }} />
          <h2 className="text-base font-black text-amiko-ink">Pausas rápidas</h2>
        </div>
        <div className="space-y-2">
          {breakActivities.slice(0, 5).map((activity) => {
            const emojiUrl = breakActivityEmojis[activity.icon] || "";
            return (
              <button
                key={activity.label}
                type="button"
                onClick={() => {
                  if (soundSettings.canPlay()) playSound("tap");
                }}
                className="focus-ring flex min-h-14 w-full items-center gap-3 rounded-2xl border border-slate-100 bg-white px-4 text-left shadow-sm transition active:scale-[0.98] hover:border-amiko-green/30 hover:bg-amiko-mint/20"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 p-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={emojiUrl} alt={activity.label} className="h-8 w-8 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.style.display = "none"; }} />
                </span>
                <span className="flex-1 text-sm font-black text-amiko-ink">{activity.label}</span>
                <AmikoIcon name="chevron" className="h-4 w-4 text-slate-300" />
              </button>
            );
          })}
        </div>
      </section>
    </>
  );
}
