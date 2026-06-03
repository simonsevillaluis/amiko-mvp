import { AppShell } from "@/components/app-shell";
import { ProgressSummary } from "@/components/progress-summary";
import { Card, PageHeader } from "@/components/ui";

const timeline = [
  { event: "Paso 1 completado sin ayuda.", type: "Hecho" },
  { event: "Paso 2 solicitó ayuda para leer la consigna.", type: "Ayuda" },
  { event: "Paso 3 completado con apoyo visual.", type: "Hecho" },
  { event: "Reportó frustración y tomó una pausa breve.", type: "Pausa" },
  { event: "Paso 4 retomado con acompañamiento adulto.", type: "Acompañado" },
];

export default function ProgressPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Progreso básico"
        title="Señales simples para acompañar mejor"
        description="Eventos mínimos para una conversación útil: pasos completados, ayudas solicitadas y momentos de frustración."
      />
      <ProgressSummary />
      <Card className="mt-5">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-amiko-green">
          Registro reciente
        </p>
        <h2 className="mt-2 text-2xl font-black text-amiko-ink">Lo que pasó en modo niño</h2>
        <div className="mt-5 space-y-3">
          {timeline.map((item, index) => (
            <div key={item.event} className="flex gap-4 rounded-xl bg-blue-50/70 p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white font-black text-amiko-blue shadow-card">
                {index + 1}
              </span>
              <div>
                <span className="rounded-full bg-amiko-mint px-3 py-1 text-xs font-black text-green-800">
                  {item.type}
                </span>
                <p className="mt-2 leading-7 text-amiko-ink">{item.event}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </AppShell>
  );
}
