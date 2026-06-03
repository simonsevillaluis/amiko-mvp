import { AppShell } from "@/components/app-shell";
import { StudentProfileCard } from "@/components/student-profile-card";
import { Card, FieldLabel, PageHeader } from "@/components/ui";
import { student } from "@/lib/mock-data";

const inputClass =
  "focus-ring w-full rounded-xl border border-blue-100 bg-white px-4 py-3 font-bold text-amiko-ink";

export default function StudentsPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Perfil del estudiante"
        title="Datos básicos para adaptar mejor"
        description="Solo pedimos información pedagógica mínima. Nada de datos clínicos innecesarios para la demo."
      />

      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <StudentProfileCard />
        <Card>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-amiko-blue">
            Formulario mockeado
          </p>
          <h2 className="mt-2 text-2xl font-black text-amiko-ink">Perfil de apoyo</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <FieldLabel>Nombre</FieldLabel>
              <input className={inputClass} value={student.name} readOnly />
            </div>
            <div className="space-y-2">
              <FieldLabel>Edad</FieldLabel>
              <input className={inputClass} value={`${student.age} años`} readOnly />
            </div>
            <div className="space-y-2">
              <FieldLabel>Grado escolar</FieldLabel>
              <input className={inputClass} value={student.grade} readOnly />
            </div>
            <div className="space-y-2">
              <FieldLabel>Nivel de apoyo</FieldLabel>
              <input className={inputClass} value={student.supportLevel} readOnly />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <FieldLabel>Preferencias visuales</FieldLabel>
            <textarea
              className="focus-ring min-h-28 w-full rounded-xl border border-blue-100 bg-white px-4 py-3 leading-7 text-amiko-ink"
              value={student.visualPreferences.join(", ")}
              readOnly
            />
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
