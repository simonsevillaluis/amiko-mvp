import { AppShell } from "@/components/app-shell";
import { Card, PageHeader, StatusPill } from "@/components/ui";
import { adaptedTask, student } from "@/lib/mock-data";

export default function TeacherPage() {
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
                <h2 className="mt-2 text-3xl font-black text-amiko-ink">{student.name}</h2>
                <p className="mt-2 font-bold text-amiko-muted">
                  {student.age} años · {student.grade}
                </p>
              </div>
              <StatusPill>Apoyo {student.supportLevel}</StatusPill>
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
          <p className="text-xs font-black uppercase tracking-[0.18em] text-amiko-green">
            {adaptedTask.subject}
          </p>
          <h2 className="mt-2 text-2xl font-black text-amiko-ink">{adaptedTask.title}</h2>
          <div className="mt-5 rounded-xl bg-amiko-cream p-4">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-amiko-muted">
              Tarea original
            </p>
            <p className="mt-2 leading-7 text-amiko-ink">{adaptedTask.originalText}</p>
          </div>
          <div className="mt-4 rounded-xl bg-amiko-sky p-4">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-amiko-navy">
              Adaptación generada
            </p>
            <p className="mt-2 font-bold leading-7 text-amiko-ink">{adaptedTask.simpleSummary}</p>
          </div>
          <div className="mt-4 space-y-3">
            {adaptedTask.steps.map((step) => (
              <div key={step.number} className="rounded-xl border border-blue-100 p-4">
                <p className="font-black leading-6 text-amiko-ink">
                  {step.number}. {step.instruction}
                </p>
                <p className="mt-2 text-sm font-bold text-amiko-muted">
                  Apoyo visual: {step.visualSupport}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
