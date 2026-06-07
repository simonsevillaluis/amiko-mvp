"use client";

import { useEffect, useState } from "react";
import { AmikoIcon } from "@/components/amiko-icon";

type PreferenceKey = "largeText" | "highContrast" | "reducedMotion";

const preferences: Array<{
  key: PreferenceKey;
  title: string;
  description: string;
}> = [
  {
    key: "largeText",
    title: "Texto más cómodo",
    description: "Aumenta ligeramente el tamaño del texto en esta pantalla de ajustes.",
  },
  {
    key: "highContrast",
    title: "Contraste alto",
    description: "Usa un fondo más claro y bordes más marcados para leer con menos esfuerzo.",
  },
  {
    key: "reducedMotion",
    title: "Reducir animaciones",
    description: "Prepara la preferencia para disminuir movimientos en futuras pantallas.",
  },
];

const STORAGE_KEY = "amiko-accessibility-preferences";

function readStoredPreferences() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}") as Partial<Record<PreferenceKey, boolean>>;
    return {
      largeText: Boolean(parsed.largeText),
      highContrast: Boolean(parsed.highContrast),
      reducedMotion: Boolean(parsed.reducedMotion),
    };
  } catch {
    return {
      largeText: false,
      highContrast: false,
      reducedMotion: false,
    };
  }
}

export function AccessibilityPreferences() {
  const [values, setValues] = useState<Record<PreferenceKey, boolean>>({
    largeText: false,
    highContrast: false,
    reducedMotion: false,
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValues(readStoredPreferences());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
  }, [loaded, values]);

  function togglePreference(key: PreferenceKey) {
    setValues((current) => ({
      ...current,
      [key]: !current[key],
    }));
  }

  return (
    <section
      className={`rounded-2xl border bg-white p-4 shadow-card transition ${
        values.highContrast ? "border-amiko-navy ring-2 ring-amiko-blue/20" : "border-slate-100"
      } ${values.largeText ? "text-[17px]" : ""}`}
    >
      <div className="mb-4 flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amiko-mint text-green-800">
          <AmikoIcon name="help" className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-black text-amiko-ink">Preferencias locales</h2>
          <p className="mt-1 text-sm font-bold leading-6 text-amiko-muted">
            Estos ajustes se guardan solo en este navegador. Más adelante podrán sincronizarse con tu cuenta.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {preferences.map((preference) => {
          const active = values[preference.key];

          return (
            <button
              key={preference.key}
              type="button"
              onClick={() => togglePreference(preference.key)}
              aria-pressed={active}
              className="focus-ring flex w-full items-center gap-3 rounded-2xl bg-slate-50 px-3 py-3 text-left transition hover:bg-amiko-sky/50"
            >
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-black text-amiko-ink">{preference.title}</span>
                <span className="mt-0.5 block text-xs font-bold leading-5 text-amiko-muted">{preference.description}</span>
              </span>
              <span
                className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                  active ? "bg-amiko-green" : "bg-slate-300"
                }`}
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-all ${
                    active ? "left-6" : "left-1"
                  }`}
                />
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
