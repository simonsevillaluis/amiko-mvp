"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type UpdateProfileResult =
  | { success: true }
  | { success: false; error: string };

export async function updateProfile(
  fullName: string,
  role: string
): Promise<UpdateProfileResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "No hay sesión activa. Inicia sesión de nuevo." };
  }

  const validRoles = ["parent", "caregiver", "professional"];
  const sanitizedRole = validRoles.includes(role) ? role : null;
  const sanitizedName = fullName.trim();

  if (!sanitizedName) {
    return { success: false, error: "Agrega tu nombre para continuar." };
  }

  // Intentar update primero
  const { data, error: updateError } = await supabase
    .from("profiles")
    .update({
      full_name: sanitizedName,
      role: sanitizedRole,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id)
    .select("id")
    .maybeSingle();

  if (updateError) {
    console.error("[updateProfile] update failed:", updateError);
    return { success: false, error: "No pudimos guardar los cambios. Intenta de nuevo." };
  }

  // Si la fila no existía, insertarla
  if (!data) {
    const { error: insertError } = await supabase.from("profiles").insert({
      id: user.id,
      email: user.email,
      full_name: sanitizedName,
      role: sanitizedRole,
    });

    if (insertError) {
      console.error("[updateProfile] insert failed:", insertError);
      return { success: false, error: "No pudimos guardar los cambios. Intenta de nuevo." };
    }
  }

  revalidatePath("/students");
  revalidatePath("/dashboard");
  revalidatePath("/settings");

  return { success: true };
}
