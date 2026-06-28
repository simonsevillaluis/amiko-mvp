import { getTaskDetails } from "@/lib/supabase/tasks";
import { TaskDetailTabs } from "@/components/task-detail-tabs";
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
        simple_summary:    task.adaptation.simple_summary,
        steps:             task.adaptation.steps.map((s) => ({
          number:         s.number,
          instruction:    s.instruction,
          visual_support: s.visual_support,
          adult_support:  s.adult_support,
        })),
        emotional_support: task.adaptation.emotional_support,
        difficulty_level:  task.adaptation.difficulty_level,
      }
    : undefined;

  return (
    <TaskDetailTabs
      task={{
        id:            task.id,
        title:         task.title,
        original_text: task.original_text,
        status:        task.status,
        subject:       task.subject,
        adult_notes:   task.adult_notes,
      }}
      adaptation={adaptation}
      studentName={task.student?.name ?? "tu estudiante"}
      studentSupportLevel={task.student?.support_level}
      studentVisualPreferences={task.student?.visual_preferences ?? undefined}
      studentNotes={task.student?.notes ?? undefined}
      studentSchoolGrade={task.student?.school_grade}
    />
  );
}
