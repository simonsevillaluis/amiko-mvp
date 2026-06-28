import { createClient } from "./server";

export type ProgressEventType = "step_completed" | "help_requested" | "frustration_reported";

/**
 * Inserts a row into progress_events for the authenticated user.
 * task_id is required by the schema, so student_id is resolved from the task
 * itself (RLS already scopes the lookup to the caller's own rows).
 */
export async function recordProgressEvent(params: {
  taskId: string;
  eventType: ProgressEventType;
  stepNumber?: number;
  adaptedTaskId?: string;
  notes?: string;
}): Promise<boolean> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error("[recordProgressEvent] no authenticated user");
    return false;
  }

  const { data: task, error: taskError } = await supabase
    .from("tasks")
    .select("student_id")
    .eq("id", params.taskId)
    .maybeSingle();

  if (taskError || !task) {
    console.error("[recordProgressEvent] task not found:", params.taskId, taskError?.message);
    return false;
  }

  const { error: insertError } = await supabase.from("progress_events").insert({
    user_id: user.id,
    student_id: task.student_id,
    task_id: params.taskId,
    adapted_task_id: params.adaptedTaskId || null,
    step_number: params.stepNumber ?? null,
    event_type: params.eventType,
    notes: params.notes?.trim() || null,
  });

  if (insertError) {
    console.error("[recordProgressEvent] insert failed:", insertError.message, insertError.code);
    return false;
  }

  return true;
}
