"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { AmikoIcon } from "@/components/amiko-icon";
import { DetailShell } from "@/components/detail-shell";
import { createClient } from "@/lib/supabase/client";
import { studentInitial } from "@/lib/student-format";
import type { StudentProfile } from "@/lib/supabase/students";

const quickOptions = [
  "Pasos muy simples",
  "Necesita apoyo visual",
  "Puede causar frustracion",
  "Tarea larga",
];

export const ADAPTATION_SESSION_KEY = "amiko_current_adaptation";

function AdaptTaskForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const taskId = searchParams.get("taskId");
  const initialStudentId = searchParams.get("studentId");

  const [task, setTask] = useState("");
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState(initialStudentId ?? "");
  const [selectedOptions, setSelectedOptions] = useState<string[]>(["Pasos muy simples"]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showUploadInfo, setShowUploadInfo] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    supabase
      .from("student_profiles")
      .select("id, user_id, name, age, school_grade, support_level, visual_preferences, notes, created_at, updated_at")
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        const profiles = (data as StudentProfile[] | null) ?? [];
        setStudents(profiles);
        setSelectedStudentId((current) => {
          if (current && profiles.some((student) => student.id === current)) return current;
          return profiles[0]?.id ?? "";
        });
      });

    if (!taskId) return;

    supabase
      .from("tasks")
      .select("original_text, student_id")
      .eq("id", taskId)
      .single()
      .then(({ data, error: fetchError }) => {
        if (!fetchError && data?.original_text) {
          setTask(data.original_text);
        }
        if (!fetchError && data?.student_id) {
          setSelectedStudentId(data.student_id);
        }
      });
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

    if (!selectedStudentId) {
      setError("Crea o elige un estudiante antes de adaptar la tarea.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/adapt-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskText: task.trim(),
          options: selectedOptions,
          studentId: selectedStudentId,
        }),
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
      const message = err instanceof Error ? err.message : "Ocurrio un error inesperado.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <DetailShell title="Adaptar tarea" fallbackHref="/acompanamiento">
      {students.length === 0 ? (
        <section className="mb-5 rounded-3xl border border-dashed border-amiko-blue/30 bg-amiko-sky/50 p-5 text-center shadow-card">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-amiko-blue shadow-sm">
            <AmikoIcon name="users" className="h-6 w-6" />
          </span>
          <h2 className="mt-3 text-lg font-black text-amiko-ink">Primero registra un estudiante</h2>
          <p className="mt-2 text-sm font-bold leading-6 text-amiko-muted">
            Asi AMIKO puede guardar esta tarea en el perfil correcto.
          </p>
          <a
            href="/register/student"
            className="focus-ring mt-4 inline-flex min-h-11 items-center justify-center rounded-full bg-amiko-green px-5 text-sm font-black text-white shadow-card"
          >
            Crear perfil
          </a>
        </section>
      ) : (
        <section className="mb-5 rounded-3xl border border-blue-100 bg-white p-4 shadow-card">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-amiko-blue">
            Tarea para
          </p>
          {students.length === 1 ? (
            <div className="mt-3 flex items-center gap-3 rounded-2xl bg-amiko-mint px-3 py-3 text-green-900">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amiko-green text-sm font-black text-white">
                {studentInitial(students[0].name)}
              </span>
              <span>
                <span className="block text-sm font-black">{students[0].name}</span>
                <span className="block text-xs font-bold">{students[0].school_grade}</span>
              </span>
            </div>
          ) : (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {students.map((student) => {
                const active = student.id === selectedStudentId;
                return (
                  <button
                    key={student.id}
                    type="button"
                    onClick={() => setSelectedStudentId(student.id)}
                    className={`focus-ring flex min-w-[132px] items-center gap-3 rounded-2xl border px-3 py-3 text-left transition ${
                      active
                        ? "border-amiko-green bg-amiko-mint text-green-900"
                        : "border-slate-100 bg-slate-50 text-amiko-muted"
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-black ${
                        active ? "bg-amiko-green text-white" : "bg-white text-amiko-blue"
                      }`}
                    >
                      {studentInitial(student.name)}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-black">{student.name}</span>
                      <span className="block truncate text-[11px] font-bold">{student.school_grade}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </section>
      )}

      <section className="mb-6">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-amiko-green">
          Acompanamiento
        </p>
        <h1 className="mt-2 text-3xl font-black leading-tight text-amiko-ink">Adaptar tarea</h1>
        <p className="mt-3 text-base font-bold leading-7 text-amiko-muted">
          Comparte la consigna como la recibiste. Amiko te ayudara a volverla mas clara.
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
              Escribela tal como la envio el docente. Vamos paso a paso desde ahi.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-[24px] border border-slate-100 bg-white p-5 shadow-card">
        <label htmlFor="task" className="text-sm font-black text-amiko-ink">
          Que tarea necesita apoyo?
        </label>
        <textarea
          id="task"
          value={task}
          onChange={(event) => setTask(event.target.value)}
          placeholder="Pega aqui la tarea o escribe la consigna tal como llego."
          className="focus-ring mt-3 min-h-40 w-full resize-none rounded-2xl border border-blue-100 bg-amiko-sky/30 px-4 py-4 text-base font-bold leading-7 text-amiko-ink outline-none placeholder:text-slate-400"
          disabled={loading}
        />

        <div className="mt-5">
          <p className="text-sm font-black text-amiko-ink">Que podria ayudar?</p>
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
          disabled={loading || students.length === 0}
          className="focus-ring mt-6 flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-amiko-green px-6 text-base font-black text-white shadow-card transition hover:brightness-95 disabled:opacity-60"
        >
          <AmikoIcon name="sparkles" className="h-5 w-5" />
          {loading ? "Adaptando con Amiko..." : "Adaptar con Amiko"}
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={() => setShowUploadInfo(true)}
          className="focus-ring mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 text-sm font-black text-amiko-muted transition hover:bg-slate-50 disabled:opacity-60"
        >
          <AmikoIcon name="camera" className="h-5 w-5 text-amiko-blue" />
          Subir foto de la tarea
        </button>
      </section>

      {showUploadInfo ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/65 p-4 backdrop-blur-sm">
          <div className="w-full max-w-[360px] overflow-hidden rounded-[32px] border border-blue-100 bg-white p-6 shadow-soft animate-fade-in">
            <div className="mb-4 flex justify-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amiko-blue to-amiko-navy text-white shadow-soft">
                <AmikoIcon name="camera" className="h-7 w-7" />
              </span>
            </div>
            <h3 className="text-center text-xl font-black leading-tight text-amiko-navy">
              Fotos en desarrollo
            </h3>
            <p className="mt-3 text-center text-sm font-bold leading-6 text-amiko-muted">
              La camara y los archivos todavia no estan activos en este MVP. Cuando lleguen, AMIKO pedira permiso y explicara con claridad que se comparte.
            </p>

            <div className="mt-5 space-y-3 rounded-2xl bg-amiko-sky/40 p-4">
              <p className="flex items-start gap-2.5 text-xs font-bold leading-relaxed text-amiko-ink">
                <span className="text-amiko-green">+</span>
                <span>Permiso explicito antes de abrir camara o archivos.</span>
              </p>
              <p className="flex items-start gap-2.5 text-xs font-bold leading-relaxed text-amiko-ink">
                <span className="text-amiko-green">+</span>
                <span>Uso solo cuando tu eliges compartir una imagen.</span>
              </p>
              <p className="flex items-start gap-2.5 text-xs font-bold leading-relaxed text-amiko-ink">
                <span className="text-amiko-green">+</span>
                <span>Sin prometer analisis clinico ni funciones fuera del foco pedagogico.</span>
              </p>
            </div>

            <p className="mt-4 text-center text-[10px] font-bold leading-normal text-amiko-muted">
              Esta funcion se activara mas adelante, cuando el flujo de permisos y privacidad este listo.
            </p>

            <button
              type="button"
              onClick={() => setShowUploadInfo(false)}
              className="focus-ring mt-5 flex min-h-12 w-full items-center justify-center rounded-full bg-amiko-green px-5 text-sm font-black text-white shadow-card transition hover:brightness-95"
            >
              Entendido
            </button>

            <button
              type="button"
              onClick={() => setShowUploadInfo(false)}
              className="focus-ring mt-2 flex min-h-10 w-full items-center justify-center rounded-full text-sm font-black text-slate-400 hover:text-slate-500"
            >
              Ahora no
            </button>
          </div>
        </div>
      ) : null}
    </DetailShell>
  );
}

export default function AdaptTaskPage() {
  return (
    <Suspense
      fallback={
        <DetailShell title="Adaptar tarea" fallbackHref="/acompanamiento">
          <div className="flex min-h-[40vh] items-center justify-center">
            <p className="text-base font-bold text-amiko-muted">Cargando formulario...</p>
          </div>
        </DetailShell>
      }
    >
      <AdaptTaskForm />
    </Suspense>
  );
}
