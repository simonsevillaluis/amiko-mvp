"use client";

import { useEffect, useState } from "react";

interface ArasaacPictogramProps {
  searchText: string;
  className?: string;
}

function extractKeyword(text: string): string {
  if (!text) return "";
  
  // Convertir a minúsculas y limpiar acentos básicos para facilitar la búsqueda
  let clean = text.toLowerCase();
  
  // Quitar frases introductorias comunes
  clean = clean.replace(/^(imagen|dibujo|foto|pictograma|representación|ilustración|apoyo visual)\s+(de|del|sobre|para)?\s+/, "");
  
  // Quitar artículos y conectores comunes en español
  clean = clean.replace(/\b(un|una|unos|unas|el|la|los|las|de|del|al|en|con|y|para|sobre)\b/g, "");
  
  // Tomar la primera palabra significativa (sustantivo o verbo principal)
  const words = clean.trim().split(/\s+/).filter(Boolean);
  return words[0] || "";
}

export function ArasaacPictogram({ searchText, className = "h-24 w-24" }: ArasaacPictogramProps) {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAiFallback, setIsAiFallback] = useState(false);
  const keyword = extractKeyword(searchText);

  useEffect(() => {
    let active = true;

    if (!keyword) {
      // Evitar setState síncrono dentro del effect utilizando un microtask o setTimeout
      const timeoutId = setTimeout(() => {
        if (active) {
          setImgUrl(`https://placehold.co/300x300/edf4ff/082a61?text=${encodeURIComponent(searchText)}`);
          setIsAiFallback(true);
          setLoading(false);
        }
      }, 0);
      return () => {
        active = false;
        clearTimeout(timeoutId);
      };
    }

    async function fetchPictogram() {
      setLoading(true);
      try {
        const response = await fetch(`https://api.arasaac.org/api/pictograms/es/search/${encodeURIComponent(keyword)}`);
        
        if (!response.ok) {
          throw new Error("No ARASAAC match");
        }

        const data = await response.json();
        
        if (active) {
          if (Array.isArray(data) && data.length > 0 && data[0]?._id) {
            const picId = data[0]._id;
            setImgUrl(`https://static.arasaac.org/pictograms/${picId}/${picId}_300.png`);
            setIsAiFallback(false);
          } else {
            // Fallback a Placehold.co si no hay pictogramas en ARASAAC
            setImgUrl(`https://placehold.co/300x300/edf4ff/082a61?text=${encodeURIComponent(keyword)}`);
            setIsAiFallback(true);
          }
        }
      } catch (err) {
        if (active) {
          console.warn("ARASAAC API error, falling back to Placehold.co:", err);
          setImgUrl(`https://placehold.co/300x300/edf4ff/082a61?text=${encodeURIComponent(keyword)}`);
          setIsAiFallback(true);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchPictogram();

    return () => {
      active = false;
    };
  }, [searchText, keyword]);

  if (loading) {
    return (
      <div className={`${className} flex items-center justify-center rounded-2xl bg-slate-50 border border-slate-100`}>
        <svg className="h-6 w-6 animate-spin text-amiko-blue" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  if (!imgUrl) return null;

  return (
    <div className="relative group shrink-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imgUrl}
        alt={searchText}
        className={`${className} object-contain rounded-2xl border border-slate-100 bg-white p-2 shadow-sm transition group-hover:scale-105 duration-300`}
        onError={() => {
          // Si el link de imagen por algún motivo falla, usamos placehold.co de salvavidas final
          setImgUrl(`https://placehold.co/300x300/edf4ff/082a61?text=${encodeURIComponent(keyword || searchText)}`);
          setIsAiFallback(true);
        }}
      />
      {isAiFallback ? (
        <span className="absolute bottom-1 right-1 rounded-full bg-amiko-coral/95 px-1.5 py-0.5 text-[8px] font-black text-white shadow-sm pointer-events-none">
          IA
        </span>
      ) : (
        <span className="absolute bottom-1 right-1 rounded-full bg-amiko-green/95 px-1.5 py-0.5 text-[8px] font-black text-white shadow-sm pointer-events-none" title="Pictograma oficial ARASAAC">
          ARASAAC
        </span>
      )}
    </div>
  );
}
