import { createClient } from "./server";

export type TaskStatus = "draft" | "adapted" | "in_progress" | "completed";
export type SupportLevel = "bajo" | "medio" | "alto";

export interface TaskListItem {
  id: string;
  student_id: string;
  title: string;
  subject: string | null;
  status: TaskStatus;
  created_at: string;
  student_name?: string;
  difficulty_level?: SupportLevel;
  simple_summary?: string;
}

export interface AdaptedStep {
  number: number;
  instruction: string;
  visual_support: string;
  adult_support: string;
}

export interface TaskDetails {
  id: string;
  user_id: string;
  student_id: string;
  title: string;
  subject: string | null;
  original_text: string;
  adult_notes: string | null;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
  student?: {
    name: string;
    support_level: SupportLevel;
    visual_preferences: string | null;
    notes: string | null;
    school_grade: string;
  };
  adaptation?: {
    id: string;
    simple_summary: string;
    steps: AdaptedStep[];
    emotional_support: string | null;
    difficulty_level: SupportLevel;
  };
}

type TaskListRow = {
  id: string;
  student_id: string;
  title: string;
  subject: string | null;
  status: string;
  created_at: string;
  student_profiles?: { name?: string | null } | null;
  adapted_tasks?: Array<{
    difficulty_level?: string | null;
    simple_summary?: string | null;
  }> | null;
};

type TaskDetailsRow = {
  id: string;
  user_id: string;
  student_id: string;
  title: string;
  subject: string | null;
  original_text: string;
  adult_notes: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  student_profiles?:
    | {
    name: string;
    support_level: string;
    visual_preferences: string | null;
    notes: string | null;
    school_grade: string;
  }
    | Array<{
      name: string;
      support_level: string;
      visual_preferences: string | null;
      notes: string | null;
      school_grade: string;
    }>
    | null;
  adapted_tasks?: Array<{
    id: string;
    simple_summary: string;
    steps: AdaptedStep[];
    emotional_support: string | null;
    difficulty_level: string;
  }> | null;
};

/**
 * Retrieves the list of tasks for the authenticated user's students,
 * optimized to avoid overfetching large columns like original_text,
 * steps, or raw_response.
 */
export async function getTasksList(options?: {
  studentId?: string;
  status?: TaskStatus;
}): Promise<TaskListItem[]> {
  const supabase = await createClient();

  // We explicitly select only the fields needed for the list to avoid overfetching
  let query = supabase
    .from("tasks")
    .select(`
      id,
      student_id,
      title,
      subject,
      status,
      created_at,
      student_profiles!inner (
        name
      ),
      adapted_tasks (
        difficulty_level,
        simple_summary
      )
    `);

  if (options?.studentId) {
    query = query.eq("student_id", options.studentId);
  }

  if (options?.status) {
    query = query.eq("status", options.status);
  }

  // Order by creation date descending to show newest first
  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching tasks list:", error.message);
    return [];
  }

  return ((data || []) as TaskListRow[]).map((row) => {
    // Extrapolate values from joined tables to present a clean flat structure
    const studentName = row.student_profiles?.name ?? undefined;
    const adaptation = row.adapted_tasks?.[0] || null;

    return {
      id: row.id,
      student_id: row.student_id,
      title: row.title,
      subject: row.subject,
      status: row.status as TaskStatus,
      created_at: row.created_at,
      student_name: studentName,
      difficulty_level: adaptation?.difficulty_level as SupportLevel | undefined,
      simple_summary: adaptation?.simple_summary ?? undefined,
    };
  });
}

/**
 * Retrieves full details of a specific task, including its adaptation,
 * for the task details view.
 */
export async function getTaskDetails(taskId: string): Promise<TaskDetails | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tasks")
    .select(`
      id,
      user_id,
      student_id,
      title,
      subject,
      original_text,
      adult_notes,
      status,
      created_at,
      updated_at,
      student_profiles (
        name,
        support_level,
        visual_preferences,
        notes,
        school_grade
      ),
      adapted_tasks (
        id,
        simple_summary,
        steps,
        emotional_support,
        difficulty_level
      )
    `)
    .eq("id", taskId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching task details:", error.message);
    return null;
  }

  if (!data) return null;

  const row = data as unknown as TaskDetailsRow;
  const student = Array.isArray(row.student_profiles)
    ? row.student_profiles[0]
    : row.student_profiles;
  const adaptation = row.adapted_tasks?.[0] || null;

  return {
    id: row.id,
    user_id: row.user_id,
    student_id: row.student_id,
    title: row.title,
    subject: row.subject,
    original_text: row.original_text,
    adult_notes: row.adult_notes,
    status: row.status as TaskStatus,
    created_at: row.created_at,
    updated_at: row.updated_at,
    student: student
      ? {
          name: student.name,
          support_level: student.support_level as SupportLevel,
          visual_preferences: student.visual_preferences,
          notes: student.notes,
          school_grade: student.school_grade,
        }
      : undefined,
    adaptation: adaptation
      ? {
          id: adaptation.id,
          simple_summary: adaptation.simple_summary,
          steps: adaptation.steps as AdaptedStep[],
          emotional_support: adaptation.emotional_support,
          difficulty_level: adaptation.difficulty_level as SupportLevel,
        }
      : undefined,
  };
}

/**
 * Creates a new task and its adaptation in a transaction-like sequence,
 * ensuring all foreign keys and RLS policies are validated.
 */
export async function saveAdaptedTask(params: {
  studentId: string;
  title: string;
  subject?: string;
  originalText: string;
  adultNotes?: string;
  status?: TaskStatus;
  adaptation: {
    simple_summary: string;
    steps: AdaptedStep[];
    emotional_support: string;
    difficulty_level: SupportLevel;
    model?: string;
    raw_response?: unknown;
  };
}): Promise<{ taskId: string; adaptationId: string } | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error("No authenticated user found while saving task");
    return null;
  }

  // Insert the task
  const { data: taskData, error: taskError } = await supabase
    .from("tasks")
    .insert({
      user_id: user.id,
      student_id: params.studentId,
      title: params.title,
      subject: params.subject || null,
      original_text: params.originalText,
      adult_notes: params.adultNotes || null,
      status: params.status || "adapted",
    })
    .select("id")
    .single();

  if (taskError) {
    console.error("Error creating task:", taskError.message);
    return null;
  }

  const taskId = taskData.id;

  // Insert the adapted task
  const { data: adaptData, error: adaptError } = await supabase
    .from("adapted_tasks")
    .insert({
      task_id: taskId,
      user_id: user.id,
      simple_summary: params.adaptation.simple_summary,
      steps: params.adaptation.steps,
      emotional_support: params.adaptation.emotional_support,
      difficulty_level: params.adaptation.difficulty_level,
      model: params.adaptation.model || null,
      raw_response: params.adaptation.raw_response || null,
    })
    .select("id")
    .single();

  if (adaptError) {
    console.error("Error creating adapted task entry:", adaptError.message);
    // Attempt cleanup of orphaned task
    await supabase.from("tasks").delete().eq("id", taskId);
    return null;
  }

  return {
    taskId,
    adaptationId: adaptData.id,
  };
}

/**
 * Updates the status of an existing task (e.g. from 'adapted' to 'in_progress' or 'completed').
 */
export async function updateTaskStatus(
  taskId: string,
  status: TaskStatus,
): Promise<boolean> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("tasks")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", taskId);

  if (error) {
    console.error("Error updating task status:", error.message);
    return false;
  }

  return true;
}
