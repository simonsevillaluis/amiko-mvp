import { AdaptedTaskResult } from "@/components/adapted-task-result";
import { AppShell } from "@/components/app-shell";
import { Card, PageHeader } from "@/components/ui";
import { adaptedTask } from "@/lib/mock-data";

export default function TaskResultPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Tarea adaptada"
        title="Lista para acompañarla paso a paso"
        description="Puedes ajustar los pasos antes de empezar. No hace falta completar todo de una vez."
      />
      <Card className="mb-5 bg-amiko-cream">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-amiko-muted">Tarea original</p>
        <p className="mt-2 text-lg font-bold leading-8 text-amiko-ink">{adaptedTask.originalText}</p>
      </Card>
      <AdaptedTaskResult />
    </AppShell>
  );
}
