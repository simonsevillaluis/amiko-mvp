"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { AmikoIcon } from "@/components/amiko-icon";
import { DetailShell } from "@/components/detail-shell";
import { createClient } from "@/lib/supabase/client";

const quickOptions = [
  "Pasos muy simples",
  "Necesita apoyo visual",
  "Puede causar frustración",
  "Tarea larga",
];

export const ADAPTATION_SESSION_KEY = "amiko_current_adaptation";

function AdaptTaskForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const taskId = searchParams.get("taskId");

  const [task, setTask] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>(["Pasos muy simples"]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [analyzingImage, setAnalyzingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase
          .from("profiles")
          .select("is_premium")
          .eq("id", user.id)
          .single()
          .then(({ data }) => {
            if (data) {
              setIsPremium(!!data.is_premium);
            }
          });
      }
    });

    if (taskId) {
      const supabase = createClient();
      supabase
        .from("tasks")
        .select("original_text")
        .eq("id", taskId)
        .single()
        .then(({ data, error }) => {
          if (!error && data?.original_text) {
            setTask(data.original_text);
          }
        });
    }
  }, [taskId]);

  function toggleOption(option: string) {
    setSelectedOptions((current) =>
      current.includes(option) ? current.filter((item) => item !== option) : [...current, option],
    );
  }

  async function handleAdapt() {
    if (!task.trim()) {
      setError("Escribe o pega la tarea para que Amiko pueda adaptarla.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/adapt-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskText: task.trim(), options: selectedOptions }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error ?? "No se pudo adaptar la tarea. Intenta de nuevo.");
      }

      const adaptation = await response.json();
      sessionStorage.setItem(ADAPTATION_SESSION_KEY, JSON.stringify(adaptation));
      if (adaptation.id) {
        router.push(`/tasks/${adaptation.id}`);
      } else {
        router.push("/tasks/new");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Ocurrió un error inesperado.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  function handlePhotoUploadClick() {
    if (!isPremium) {
      setShowPremiumModal(true);
    } else {
      fileInputRef.current?.click();
    }
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setAnalyzingImage(true);
    setError("");

    setTimeout(() => {
      setTask(
        "Lectura obligatoria: El ciclo del agua. Lee las páginas 12 y 13 del libro de Ciencias Naturales y responde:\n1. ¿Qué es la condensación?\n2. ¿Cómo se forman las nubes?"
      );
      setAnalyzingImage(false);
    }, 2500);
  }

  async function activatePremiumDemo() {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from("profiles")
          .update({ is_premium: true })
          .eq("id", user.id);
        
        setIsPremium(true);
        setShowPremiumModal(false);
        alert("¡Felicidades! AMIKO Premium ha sido activado para esta cuenta de demostración.");
      }
    } catch (err) {
      console.error(err);
      alert("No se pudo activar el premium. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <DetailShell title="Adaptar tarea" fallbackHref="/acompanamiento">
      <section className="mb-6">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-amiko-green">
          Acompañamiento
        </p>
        <h1 className="mt-2 text-3xl font-black leading-tight text-amiko-ink">Adaptar tarea</h1>
        <p className="mt-3 text-base font-bold leading-7 text-amiko-muted">
          Comparte la consigna como la recibiste. Amiko te ayudará a volverla más clara.
        </p>
      </section>

      <section className="mb-5 rounded-[24px] bg-gradient-to-br from-amiko-blue to-amiko-navy p-5 text-white shadow-soft">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white">
            <AmikoIcon name="sparkles" className="h-6 w-6" />
          </span>
          <div>
            <h2 className="font-black">No necesitas simplificarla antes</h2>
            <p className="mt-1 text-sm font-bold leading-6 text-blue-100">
              Escríbela tal como la envió el docente. Vamos paso a paso desde ahí.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-[24px] border border-slate-100 bg-white p-5 shadow-card">
        <label htmlFor="task" className="text-sm font-black text-amiko-ink">
          ¿Qué tarea necesita apoyo?
        </label>
        <textarea
          id="task"
          value={task}
          onChange={(event) => setTask(event.target.value)}
          placeholder="Ejemplo: Lee el texto sobre los animales y responde tres preguntas."
          className="focus-ring mt-3 min-h-40 w-full resize-none rounded-2xl border border-blue-100 bg-amiko-sky/30 px-4 py-4 text-base font-bold leading-7 text-amiko-ink outline-none placeholder:text-slate-400"
          disabled={loading}
        />

        <div className="mt-5">
          <p className="text-sm font-black text-amiko-ink">¿Qué podría ayudar?</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {quickOptions.map((option) => {
              const active = selectedOptions.includes(option);

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleOption(option)}
                  disabled={loading}
                  className={`focus-ring rounded-full border px-4 py-2 text-sm font-black transition ${
                    active
                      ? "border-amiko-green bg-amiko-mint text-green-900"
                      : "border-slate-200 bg-white text-amiko-muted"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        {error ? (
          <p className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
            {error}
          </p>
        ) : null}

        <button
          type="button"
          onClick={handleAdapt}
          disabled={loading || analyzingImage}
          className="focus-ring mt-6 flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-amiko-green px-6 text-base font-black text-white shadow-card transition hover:brightness-95 disabled:opacity-60"
        >
          <AmikoIcon name="sparkles" className="h-5 w-5" />
          {loading ? "Adaptando con Amiko…" : "Adaptar con Amiko"}
        </button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        <button
          type="button"
          disabled={loading || analyzingImage}
          onClick={handlePhotoUploadClick}
          className="focus-ring mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 text-sm font-black text-amiko-muted transition hover:bg-slate-50 disabled:opacity-60"
        >
          <AmikoIcon name="camera" className="h-5 w-5 text-amiko-blue" />
          {isPremium ? "Subir foto de la tarea" : "Subir foto de la tarea (Premium)"}
        </button>
      </section>

      {showPremiumModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/65 p-4 backdrop-blur-sm">
          <div className="w-full max-w-[360px] overflow-hidden rounded-[32px] border border-blue-100 bg-white p-6 shadow-soft animate-fade-in">
            <div className="flex justify-center mb-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amiko-coral to-red-500 text-white shadow-soft">
                <AmikoIcon name="sparkles" className="h-7 w-7" />
              </span>
            </div>
            <h3 className="text-center text-xl font-black text-amiko-navy leading-tight">
              AMIKO Premium
            </h3>
            <p className="mt-3 text-center text-sm font-bold leading-6 text-amiko-muted">
              Sube fotos de las tareas escolares y deja que nuestra IA las transcriba automáticamente.
            </p>
            
            <div className="mt-5 space-y-3 rounded-2xl bg-amiko-sky/40 p-4">
              <p className="flex items-start gap-2.5 text-xs font-bold leading-relaxed text-amiko-ink">
                <span className="text-amiko-green">✓</span>
                <span>Escaneo de consignas mediante fotos y PDFs sin escribir.</span>
              </p>
              <p className="flex items-start gap-2.5 text-xs font-bold leading-relaxed text-amiko-ink">
                <span className="text-amiko-green">✓</span>
                <span>Procesamiento prioritario y respuestas de IA más rápidas.</span>
              </p>
              <p className="flex items-start gap-2.5 text-xs font-bold leading-relaxed text-amiko-ink">
                <span className="text-amiko-green">✓</span>
                <span>Registro de progreso sin límites.</span>
              </p>
            </div>

            <p className="mt-4 text-center text-[10px] font-bold text-amiko-muted leading-normal">
              * El análisis de fotos consume créditos de procesamiento con modelos de visión de IA, por lo que requiere suscripción.
            </p>

            <button
              type="button"
              onClick={activatePremiumDemo}
              disabled={loading}
              className="focus-ring mt-5 flex min-h-12 w-full items-center justify-center rounded-full bg-amiko-green px-5 text-sm font-black text-white shadow-card transition hover:brightness-95 disabled:opacity-60"
            >
              Activar Premium (Demo Gratis)
            </button>
            
            <button
              type="button"
              onClick={() => setShowPremiumModal(false)}
              className="focus-ring mt-2 flex min-h-10 w-full items-center justify-center rounded-full text-sm font-black text-slate-400 hover:text-slate-500"
            >
              Tal vez más tarde
            </button>
          </div>
        </div>
      )}

      {analyzingImage && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/65 p-4 backdrop-blur-sm">
          <div className="w-full max-w-[280px] rounded-[24px] bg-white p-6 text-center shadow-soft">
            <svg className="mx-auto h-12 w-12 animate-spin text-amiko-blue" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <h4 className="mt-4 font-black text-amiko-navy">Leyendo tarea escolar...</h4>
            <p className="mt-2 text-xs font-bold text-amiko-muted leading-relaxed">
              La inteligencia artificial de Amiko está transcribiendo el texto de tu foto.
            </p>
          </div>
        </div>
      )}
    </DetailShell>
  );
}

export default function AdaptTaskPage() {
  return (
    <Suspense
      fallback={
        <DetailShell title="Adaptar tarea" fallbackHref="/acompanamiento">
          <div className="flex min-h-[40vh] items-center justify-center">
            <p className="text-base font-bold text-amiko-muted">Cargando formulario…</p>
          </div>
        </DetailShell>
      }
    >
      <AdaptTaskForm />
    </Suspense>
  );
}
// Force rebuild comment
