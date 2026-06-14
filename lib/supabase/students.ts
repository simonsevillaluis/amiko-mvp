import { createClient } from "@/lib/supabase/server";
export { studentInitial, supportLevelLabel } from "@/lib/student-format";

export type StudentProfile = {
  id: string;
  user_id: string;
  name: string;
  age: number;
  school_grade: string;
  support_level: "bajo" | "medio" | "alto";
  visual_preferences: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export async function getStudentProfiles(): Promise<StudentProfile[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("student_profiles")
    .select("id, user_id, name, age, school_grade, support_level, visual_preferences, notes, created_at, updated_at")
    .order("created_at", { ascending: true });
  return (data as StudentProfile[]) ?? [];
}

export async function getFirstStudent(): Promise<StudentProfile | null> {
  const students = await getStudentProfiles();
  return students[0] ?? null;
}

