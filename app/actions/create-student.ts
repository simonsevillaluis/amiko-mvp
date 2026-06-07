"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type EducationLevel = "inicial" | "primaria" | "secundaria";

type CreateStudentResult =
  | { success: true }
  | { success: false; error: string };

const educationLevelLabels: Record<EducationLevel, string> = {
  inicial: "Educación inicial",
  primaria: "Primaria",
  secundaria: "Secundaria",
};

const nameRegex = /^[\p{L}\s'.\-]{2,}$/u;

export async function createStudent(
  studentName: string,
  age: string,
  educationLevel: string,
  gradeYear: string,
  supportLevel: string,
  visualPreferences: string,
  studentEmail?: string,
): Promise<CreateStudentResult> {
  const trimmedName = studentName.trim();
  const parsedAge = Number(age);
  const trimmedGradeYear = gradeYear.trim();
  const trimmedVisualPreferences = visualPreferences.trim();
  const trimmedEmail = studentEmail?.trim() ?? "";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const supportedLevels = ["bajo", "medio", "alto"];

  if (!trimmedName || !age.trim() || !educationLevel || !trimmedGradeYear) {
    return { success: false, error: "Agrega nombre, edad y grado escolar para crear el perfil." };
  }

  if (!nameRegex.test(trimmedName)) {
    return {
      success: false,
      error: "El nombre solo puede tener letras, espacios y guiones. Sin números ni símbolos.",
    };
  }

  if (!Number.isInteger(parsedAge) || parsedAge < 4 || parsedAge > 25) {
    return { success: false, error: "La edad debe ser un número entre 4 y 25 años." };
  }

  if (trimmedEmail && !emailRegex.test(trimmedEmail)) {
    return { success: false, error: "El correo ingresado no es válido." };
  }

  if (!Object.keys(educationLevelLabels).includes(educationLevel)) {
    return { success: false, error: "Selecciona un nivel educativo válido." };
  }

  const support = supportedLevels.includes(supportLevel) ? supportLevel : "medio";
  const schoolGrade = `${educationLevelLabels[educationLevel as EducationLevel]} · ${trimmedGradeYear}`;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "No hay sesión activa. Inicia sesión de nuevo." };
  }

  const { error: insertError } = await supabase.from("student_profiles").insert({
    user_id: user.id,
    name: trimmedName,
    age: parsedAge,
    school_grade: schoolGrade,
    support_level: support,
    visual_preferences: trimmedVisualPreferences || null,
    email: trimmedEmail || null,
    notes: null,
  });

  if (insertError) {
    console.error("[createStudent] insert failed:", insertError);
    return { success: false, error: "No pudimos guardar el perfil. Intenta de nuevo." };
  }

  revalidatePath("/students");
  revalidatePath("/dashboard");

  return { success: true };
}
