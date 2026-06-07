import { getTaskDetails } from "@/lib/supabase/tasks";
import { AdaptedTaskResult } from "@/components/adapted-task-result";
import { AppShell } from "@/components/app-shell";
import { Card, PageHeader } from "@/components/ui";
import { redirect } from "next/navigation";

export default async function TaskResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const task = await getTaskDetails(id);

  if (!task) {
    redirect("/dashboard");
  }

  const adaptation = task.adaptation
    ? {
        originalText: task.original_text,
        simple_summary: task.adaptation.simple_summary,
        steps: task.adaptation.steps.map((s) => ({
          number: s.number,
          instruction: s.instruction,
          visual_support: s.visual_support,
          adult_support: s.adult_support,
        })),
        emotional_support: task.adaptation.emotional_support || "",
        difficulty_level: task.adaptation.difficulty_level,
      }
    : undefined;

  return (
    <AppShell>
      <PageHeader
        eyebrow="Tarea adaptada"
        title="Lista para acompañarla paso a paso"
        description="Puedes ajustar los pasos antes de empezar. No hace falta completar todo de una vez."
      />
      <Card className="mb-5 bg-amiko-cream">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-amiko-muted">Tarea original</p>
        <p className="mt-2 text-lg font-bold leading-8 text-amiko-ink">{task.original_text}</p>
      </Card>
      <AdaptedTaskResult adaptation={adaptation} />
    </AppShell>
  );
}
