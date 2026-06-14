"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type EducationLevel = "primaria" | "secundaria";

type CreateStudentResult =
  | { success: true }
  | { success: false; error: string };

const educationLevelLabels: Record<EducationLevel, string> = {
  primaria: "Primaria",
  secundaria: "Secundaria",
};

const nameRegex = /^[\p{L}\s'.\-]{2,}$/u;

function calcAge(birthDate: string): number {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export async function createStudent(
  studentName: string,
  birthDate: string,
  educationLevel: string,
  gradeYear: string,
  supportLevel: string,
  visualPreferences: string,
  studentEmail?: string,
): Promise<CreateStudentResult> {
  const trimmedName = studentName.trim();
  const trimmedGradeYear = gradeYear.trim();
  const trimmedVisualPreferences = visualPreferences.trim();
  const trimmedEmail = studentEmail?.trim() ?? "";

  if (!trimmedName || !birthDate || !educationLevel || !trimmedGradeYear) {
    return { success: false, error: "Agrega nombre, fecha de nacimiento y grado escolar para crear el perfil." };
  }

  if (!nameRegex.test(trimmedName)) {
    return {
      success: false,
      error: "El nombre solo puede tener letras, espacios y guiones. Sin números ni símbolos.",
    };
  }

  const birthDateObj = new Date(birthDate);
  if (isNaN(birthDateObj.getTime())) {
    return { success: false, error: "Fecha de nacimiento no válida." };
  }

  const age = calcAge(birthDate);
  if (age < 4 || age > 25) {
    return { success: false, error: "La edad debe ser entre 4 y 25 años." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (trimmedEmail && !emailRegex.test(trimmedEmail)) {
    return { success: false, error: "El correo ingresado no es válido." };
  }

  if (!Object.keys(educationLevelLabels).includes(educationLevel)) {
    return { success: false, error: "Selecciona un nivel educativo válido." };
  }

  const supportMap: Record<string, string> = {
    bajo: "bajo",
    medio: "medio",
    alto: "alto",
    no_seguro: "medio",
  };
  const support = supportMap[supportLevel] ?? "medio";
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
    age,
    birth_date: birthDate,
    school_grade: schoolGrade,
    support_level: support,
    visual_preferences: trimmedVisualPreferences || null,
    email: trimmedEmail || null,
    notes: null,
  });

  if (insertError) {
    console.error("[createStudent] insert failed:", {
      code: insertError.code,
      message: insertError.message,
      details: insertError.details,
      hint: insertError.hint,
    });

    // 42703 = column does not exist → la migración 001 aún no se aplicó en Supabase
    if (insertError.code === "42703") {
      return {
        success: false,
        error:
          "Hay un problema de configuración en el servidor. Si el error persiste, contacta al soporte.",
      };
    }

    // 23514 = check_violation → valor fuera del rango permitido por la constraint
    if (insertError.code === "23514") {
      return {
        success: false,
        error: "Hay un valor inválido en el formulario. Revisa los datos e intenta de nuevo.",
      };
    }

    // 42501 = insufficient_privilege → RLS bloqueó el INSERT
    if (insertError.code === "42501") {
      return {
        success: false,
        error: "No tienes permiso para realizar esta acción. Cierra sesión, vuelve a entrar e intenta de nuevo.",
      };
    }

    return { success: false, error: "No pudimos guardar el perfil. Intenta de nuevo." };
  }

  revalidatePath("/students");
  revalidatePath("/dashboard");

  return { success: true };
}
