import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Card, PageHeader, StatusPill } from "@/components/ui";
import { getFirstStudent } from "@/lib/supabase/students";
import { getTaskDetails, getTasksList } from "@/lib/supabase/tasks";

export default async function TeacherPage() {
  const firstStudent = await getFirstStudent();

  const latestAdaptedTask = firstStudent
    ? (await getTasksList({ studentId: firstStudent.id })).find((item) => item.simple_summary)
    : undefined;

  const taskDetails = latestAdaptedTask ? await getTaskDetails(latestAdaptedTask.id) : null;

  return (
    <AppShell>
      <PageHeader
        eyebrow="Vista docente"
        title="Tarea, adaptación y observaciones"
        description="Una vista básica para revisar qué recibió el estudiante y qué señales aparecieron durante el trabajo."
      />

      <div className="grid gap-5 lg:grid-cols-[0.82fr_1.18fr]">
        <div className="space-y-5">
          <Card className="bg-amiko-sky">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-amiko-navy">
                  Estudiante
                </p>
                <h2 className="mt-2 text-3xl font-black text-amiko-ink">
                  {firstStudent?.name ?? "—"}
                </h2>
                <p className="mt-2 font-bold text-amiko-muted">
                  {firstStudent ? `${firstStudent.age} años · ${firstStudent.school_grade}` : "—"}
                </p>
              </div>
              <StatusPill>Apoyo {firstStudent?.support_level ?? "—"}</StatusPill>
            </div>
          </Card>
          <Card>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-amiko-green">
              Observaciones
            </p>
            <p className="mt-3 leading-7 text-amiko-muted">
              {taskDetails?.adult_notes ||
                "No hay observaciones registradas todavía para esta tarea."}
            </p>
          </Card>
        </div>

        <Card>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-amiko-muted">
            Tarea adaptada
          </p>
          {taskDetails?.adaptation ? (
            <div className="mt-4 space-y-4">
              <div>
                <p className="text-lg font-black text-amiko-ink">{taskDetails.title}</p>
                <p className="mt-1 text-sm font-bold leading-6 text-amiko-muted">
                  {taskDetails.adaptation.simple_summary}
                </p>
                <StatusPill className="mt-2 inline-block">
                  Dificultad {taskDetails.adaptation.difficulty_level}
                </StatusPill>
              </div>

              <div className="space-y-2">
                {taskDetails.adaptation.steps.slice(0, 3).map((step) => (
                  <div
                    key={step.number}
                    className="rounded-xl border border-slate-100 bg-slate-50/70 p-3"
                  >
                    <p className="text-sm font-black text-amiko-ink">
                      Paso {step.number}: {step.instruction}
                    </p>
                    {step.visual_support && (
                      <p className="mt-1 text-xs font-bold text-amiko-muted">
                        Apoyo visual: {step.visual_support}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <Link
                href={`/tasks/${taskDetails.id}`}
                className="focus-ring inline-flex min-h-11 items-center justify-center rounded-full bg-amiko-blue px-5 text-sm font-black text-white shadow-card transition hover:brightness-95"
              >
                Ver tarea completa
              </Link>
            </div>
          ) : (
            <p className="mt-4 font-bold leading-7 text-amiko-muted">
              Cuando el adulto genere una adaptación de tarea, aparecerá aquí junto con los pasos y el apoyo visual.
            </p>
          )}
        </Card>
      </div>
    </AppShell>
  );
}
