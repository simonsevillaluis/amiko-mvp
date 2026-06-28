"use server";

import { revalidatePath } from "next/cache";
import { recordProgressEvent, type ProgressEventType } from "@/lib/supabase/progress";

export type SaveTaskLogResult = { success: true } | { success: false; error: string };

/**
 * Maps the "Registro de tarea" selections to progress_events rows.
 * task_id is required by the schema, so without one there is nothing to
 * attach the event to — we skip persistence and let the UI keep its
 * local "saved" confirmation.
 */
export async function saveTaskLog(params: {
  taskId: string | null;
  beforeMood: string[];
  supportsUsed: string[];
  note: string;
}): Promise<SaveTaskLogResult> {
  if (!params.taskId) {
    return { success: true };
  }

  const trimmedNote = params.note.trim();
  const events: ProgressEventType[] = [];

  if (params.beforeMood.includes("Frustrado")) {
    events.push("frustration_reported");
  }
  if (params.supportsUsed.includes("Ayuda adulta")) {
    events.push("help_requested");
  }
  if (events.length === 0) {
    events.push("step_completed");
  }

  let anySuccess = false;
  for (const eventType of events) {
    const ok = await recordProgressEvent({
      taskId: params.taskId,
      eventType,
      notes: trimmedNote || undefined,
    });
    anySuccess = anySuccess || ok;
  }

  if (!anySuccess) {
    return { success: false, error: "No pudimos guardar el registro. Intenta de nuevo." };
  }

  revalidatePath("/logros");
  revalidatePath("/historial");
  revalidatePath("/dashboard");

  return { success: true };
}
