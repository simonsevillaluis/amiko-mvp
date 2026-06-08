"use client";

import { useState } from "react";
import { AmikoIcon } from "./amiko-icon";

interface SlideshowProps {
  code: string;
}

type Slide = {
  title: string;
  lines: string[];
};

export function Slideshow({ code }: SlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Split slides by horizontal rule marker
  const rawSlides = code.split(/^[ \t]*---[ \t]*$/m);
  
  const slides: Slide[] = rawSlides.map((raw) => {
    const lines = raw.split("\n").map(l => l.trim()).filter(Boolean);
    let title = "Diapositiva";
    const contentLines: string[] = [];
    
    for (const line of lines) {
      if (line.startsWith("#")) {
        title = line.replace(/^#+\s*/, "");
      } else {
        contentLines.push(line);
      }
    }
    
    return { title, lines: contentLines };
  }).filter(s => s.title !== "Diapositiva" || s.lines.length > 0);

  if (slides.length === 0) {
    return (
      <div className="my-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-xs font-bold text-amiko-muted">
        No hay diapositivas para mostrar.
      </div>
    );
  }

  const currentSlide = slides[currentIndex];
  const totalSlides = slides.length;

  return (
    <div className="my-3 overflow-hidden rounded-[24px] border border-blue-100 bg-white shadow-soft transition-all duration-300">
      {/* Slide Header */}
      <div className="bg-gradient-to-r from-amiko-navy to-amiko-blue px-4 py-3.5 text-white">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-black uppercase tracking-[0.16em] text-blue-200">
            Diapositiva · {currentIndex + 1} de {totalSlides}
          </span>
          <div className="flex gap-1">
            {slides.map((_, i) => (
              <span 
                key={i} 
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentIndex ? "w-4 bg-amiko-green" : "w-1.5 bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
        <h3 className="mt-1.5 text-base font-black leading-snug">{currentSlide.title}</h3>
      </div>

      {/* Slide Content */}
      <div className="min-h-[120px] px-4 py-5 flex flex-col justify-center bg-slate-50/30">
        <ul className="space-y-2.5">
          {currentSlide.lines.map((line, idx) => {
            const isNumbered = /^\d+\.\s*/.test(line);
            const cleanLine = line.replace(/^[-*+]\s*/, "").replace(/^\d+\.\s*/, "");
            
            return (
              <li key={idx} className="flex items-start gap-2.5 text-sm font-bold leading-6 text-amiko-ink">
                {isNumbered ? (
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amiko-sky text-[10px] font-black text-amiko-blue mt-0.5">
                    {idx + 1}
                  </span>
                ) : (
                  <span className="flex h-2 w-2 shrink-0 rounded-full bg-amiko-green mt-2" />
                )}
                <span>{cleanLine}</span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between border-t border-slate-100 bg-white px-3 py-2.5">
        <button
          type="button"
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex(prev => prev - 1)}
          className="focus-ring flex h-9 items-center gap-1 rounded-full border border-slate-200 px-3 text-xs font-black text-amiko-ink transition hover:bg-slate-50 active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
        >
          <AmikoIcon name="back" className="h-3.5 w-3.5" />
          Anterior
        </button>
        <button
          type="button"
          disabled={currentIndex === totalSlides - 1}
          onClick={() => setCurrentIndex(prev => prev + 1)}
          className="focus-ring flex h-9 items-center gap-1 rounded-full bg-amiko-green px-3 text-xs font-black text-white shadow-card transition hover:brightness-95 active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
        >
          Siguiente
          <svg className="h-3.5 w-3.5 rotate-180 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
