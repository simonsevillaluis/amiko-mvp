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

  // Upsert atómico — funciona tanto si la fila existe como si no.
  const { error: upsertError } = await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        email: user.email,
        full_name: sanitizedName,
        role: sanitizedRole,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    );

  if (upsertError) {
    console.error("[updateProfile] upsert failed:", upsertError.message, upsertError.code);
    return { success: false, error: "No pudimos guardar los cambios. Intenta de nuevo." };
  }

  // Sincronizar también en user_metadata para que el fallback del dashboard siempre funcione.
  await supabase.auth.updateUser({
    data: { full_name: sanitizedName, role: sanitizedRole },
  });

  revalidatePath("/students");
  revalidatePath("/dashboard");
  revalidatePath("/settings");

  return { success: true };
}
