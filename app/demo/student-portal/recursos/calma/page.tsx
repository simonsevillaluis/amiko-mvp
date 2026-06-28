"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AmikoIcon } from "@/components/amiko-icon";

type Phase = "inhale" | "hold" | "exhale" | "hold2";

export default function CalmaPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("inhale");
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!isActive) return;

    let timeoutId: NodeJS.Timeout;

    const cycle = () => {
      setPhase("inhale");
      timeoutId = setTimeout(() => {
        setPhase("hold");
        timeoutId = setTimeout(() => {
          setPhase("exhale");
          timeoutId = setTimeout(() => {
            setPhase("hold2");
            timeoutId = setTimeout(cycle, 2000); // Wait 2s before next inhale
          }, 4000); // Exhale for 4s
        }, 2000); // Hold for 2s
      }, 4000); // Inhale for 4s
    };

    cycle();

    return () => clearTimeout(timeoutId);
  }, [isActive]);

  const getPhaseText = () => {
    if (!isActive) return "Toca para empezar";
    switch (phase) {
      case "inhale": return "Respira profundo...";
      case "hold": return "Sostén el aire...";
      case "exhale": return "Suelta despacio...";
      case "hold2": return "Descansa...";
    }
  };

  const getCircleClasses = () => {
    if (!isActive) return "scale-100 bg-sky-100";
    switch (phase) {
      case "inhale": return "scale-[2.0] bg-sky-200 transition-all duration-[4000ms] ease-out";
      case "hold": return "scale-[2.0] bg-sky-200";
      case "exhale": return "scale-100 bg-sky-100 transition-all duration-[4000ms] ease-in-out";
      case "hold2": return "scale-100 bg-sky-100";
    }
  };

  return (
    <div className="flex h-full min-h-[calc(100vh-100px)] flex-col items-center justify-center relative">
      <button
        type="button"
        onClick={() => router.back()}
        className="focus-ring absolute top-0 left-0 flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-amiko-navy transition hover:bg-slate-100"
      >
        <AmikoIcon name="back" className="h-6 w-6" />
      </button>

      <div className="mb-12 flex flex-col items-center text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Person%20in%20lotus%20position/Default/3D/person_in_lotus_position_3d_default.png" 
          alt="Persona meditando" 
          className="mb-6 h-20 w-20 object-contain drop-shadow-md" 
        />
        <h1 className="text-3xl font-black text-amiko-navy">Zona de calma</h1>
        <p className="mt-2 text-lg font-bold text-amiko-muted">Sigue el círculo para relajarte</p>
      </div>

      {/* Wrapper reserva el espacio del círculo en su escala máxima (2x),
          ya que `transform: scale()` no empuja el layout del documento. */}
      <div className="relative flex h-96 w-96 items-center justify-center">
        <div
          onClick={() => !isActive && setIsActive(true)}
          className={`relative flex h-48 w-48 cursor-pointer items-center justify-center rounded-full border-4 border-sky-50 shadow-soft ${!isActive ? "animate-pulse" : ""}`}
        >
          <div className={`absolute h-full w-full rounded-full opacity-60 ${getCircleClasses()}`} />
          <div className="z-10 text-center px-4">
            <p className="text-xl font-black text-amiko-navy">{getPhaseText()}</p>
          </div>
        </div>
      </div>

      {isActive && (
        <button
          onClick={() => setIsActive(false)}
          className="mt-4 rounded-full px-6 py-3 font-bold text-slate-400 hover:text-slate-600"
        >
          Detener ejercicio
        </button>
      )}
    </div>
  );
}
