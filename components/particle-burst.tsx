"use client";

import { useEffect, useState } from "react";

const COLORS = ["#8EC733", "#0F5AD1", "#FF8A7A", "#fbbf24", "#ECF6D0", "#09367C"];
const SHAPES = ["circle", "square", "triangle"];

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function ParticleBurst() {
  const [particles, setParticles] = useState<Array<{ id: number; color: string; shape: string; angle: number; velocity: number; size: number }>>([]);

  useEffect(() => {
    // Generar partículas en el cliente para evitar mismatch de hidratación
    const newParticles = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      color: COLORS[getRandomInt(0, COLORS.length - 1)],
      shape: SHAPES[getRandomInt(0, SHAPES.length - 1)],
      angle: getRandomInt(0, 360),
      velocity: getRandomInt(50, 150),
      size: getRandomInt(6, 14),
    }));
    setParticles(newParticles);
  }, []);

  if (particles.length === 0) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
      <style>{`
        @keyframes burstOut {
          0% {
            transform: translate(0, 0) scale(0.5) rotate(0deg);
            opacity: 1;
          }
          60% {
            opacity: 1;
          }
          100% {
            transform: translate(var(--tx), var(--ty)) scale(0) rotate(var(--rot));
            opacity: 0;
          }
        }
        .particle {
          position: absolute;
          animation: burstOut 1.5s cubic-bezier(0.15, 0.9, 0.3, 1) forwards;
        }
        .shape-circle { border-radius: 50%; }
        .shape-square { border-radius: 3px; }
        .shape-triangle {
          width: 0 !important;
          height: 0 !important;
          border-left: calc(var(--size) / 2) solid transparent;
          border-right: calc(var(--size) / 2) solid transparent;
          border-bottom: var(--size) solid var(--color);
          background-color: transparent !important;
        }
      `}</style>
      {particles.map((p) => {
        const rad = (p.angle * Math.PI) / 180;
        const tx = Math.cos(rad) * p.velocity;
        const ty = Math.sin(rad) * p.velocity;
        const rot = getRandomInt(180, 720) * (Math.random() > 0.5 ? 1 : -1);

        return (
          <div
            key={p.id}
            className={`particle shape-${p.shape}`}
            style={
              {
                "--tx": `${tx}px`,
                "--ty": `${ty}px`,
                "--rot": `${rot}deg`,
                "--size": `${p.size}px`,
                "--color": p.color,
                width: p.shape !== "triangle" ? `${p.size}px` : undefined,
                height: p.shape !== "triangle" ? `${p.size}px` : undefined,
                backgroundColor: p.shape !== "triangle" ? p.color : undefined,
              } as React.CSSProperties
            }
          />
        );
      })}
    </div>
  );
}
