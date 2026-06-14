import { AppShell } from "@/components/app-shell";
import { Card, PageHeader, StatusPill } from "@/components/ui";
import { getFirstStudent } from "@/lib/supabase/students";

export default async function TeacherPage() {
  const firstStudent = await getFirstStudent();

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
              El estudiante avanza mejor cuando ve un paso por pantalla. Pidió ayuda en la lectura
              del segundo problema y retomó después de una pausa.
            </p>
          </Card>
        </div>

        <Card>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-amiko-muted">
            Tarea adaptada
          </p>
          <p className="mt-4 font-bold leading-7 text-amiko-muted">
            Cuando el adulto genere una adaptación de tarea, aparecerá aquí junto con los pasos y el apoyo visual.
          </p>
        </Card>
      </div>
    </AppShell>
  );
}
