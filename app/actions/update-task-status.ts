"use server";

import { revalidatePath } from "next/cache";
import { updateTaskStatus, type TaskStatus } from "@/lib/supabase/tasks";
import { recordProgressEvent } from "@/lib/supabase/progress";

export type UpdateTaskStatusResult = { success: true } | { success: false; error: string };

/**
 * Moves a task to a new status and, when marking it completed, leaves a
 * progress_events trace so /logros, /historial and /dashboard reflect it.
 */
export async function markTaskStatus(
  taskId: string,
  status: TaskStatus,
): Promise<UpdateTaskStatusResult> {
  const ok = await updateTaskStatus(taskId, status);

  if (!ok) {
    return { success: false, error: "No pudimos actualizar el estado de la tarea." };
  }

  if (status === "completed") {
    await recordProgressEvent({
      taskId,
      eventType: "step_completed",
      notes: "Tarea marcada como completada",
    });
  }

  revalidatePath(`/tasks/${taskId}`);
  revalidatePath("/dashboard");
  revalidatePath("/historial");
  revalidatePath("/logros");

  return { success: true };
}
