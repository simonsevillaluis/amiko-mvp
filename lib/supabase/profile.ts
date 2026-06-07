import { createClient } from "@/lib/supabase/server";

export type AdultRole = "parent" | "caregiver" | "professional";

export type AdultProfile = {
  full_name: string | null;
  role: AdultRole | null;
  avatar_url: string | null;
};

const VALID_ROLES: AdultRole[] = ["parent", "caregiver", "professional"];

function readMetaString(meta: Record<string, unknown> | undefined, key: string): string | null {
  const value = meta?.[key];
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

/**
 * Lee el perfil del adulto y, si faltan datos que ya existen en los metadatos
 * de autenticación (ej. el nombre que escribió al registrarse), los completa
 * en `profiles` para que nunca se muestren campos vacíos en pantalla.
 */
export async function getOrSyncProfile(userId: string): Promise<AdultProfile | null> {
  const supabase = await createClient();

  // 1. Intentar leer el perfil
  let { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role, avatar_url")
    .eq("id", userId)
    .maybeSingle();

  // 2. Si no existe la fila, la creamos de inmediato para evitar problemas de persistencia
  if (!profile) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const meta = user.user_metadata as Record<string, unknown> | undefined;
      const metaName = readMetaString(meta, "full_name") ?? readMetaString(meta, "name");
      const metaRoleRaw = readMetaString(meta, "role");
      const metaRole = metaRoleRaw && VALID_ROLES.includes(metaRoleRaw as AdultRole) ? (metaRoleRaw as AdultRole) : null;

      const { data: newProfile, error: insertError } = await supabase
        .from("profiles")
        .insert({
          id: userId,
          email: user.email,
          full_name: metaName || "",
          role: metaRole,
        })
        .select("full_name, role, avatar_url")
        .maybeSingle();
      
      if (!insertError && newProfile) {
        profile = newProfile;
      }
    }
  }

  const hasFullName = !!profile?.full_name?.trim();
  const hasValidRole = !!profile?.role && VALID_ROLES.includes(profile.role as AdultRole);

  if (hasFullName && hasValidRole) {
    return profile as AdultProfile;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const meta = user?.user_metadata as Record<string, unknown> | undefined;

  const metaName = readMetaString(meta, "full_name") ?? readMetaString(meta, "name");
  const metaRoleRaw = readMetaString(meta, "role");
  const metaRole = metaRoleRaw && VALID_ROLES.includes(metaRoleRaw as AdultRole) ? (metaRoleRaw as AdultRole) : null;

  const patch: Record<string, unknown> = { id: userId };
  if (!hasFullName && metaName) patch.full_name = metaName;
  if (!hasValidRole && metaRole) patch.role = metaRole;

  if (Object.keys(patch).length === 1) {
    // No hay nada que completar — devolvemos lo que ya teníamos.
    return profile as AdultProfile | null;
  }

  const { data: synced } = await supabase
    .from("profiles")
    .upsert(patch)
    .select("full_name, role, avatar_url")
    .maybeSingle();

  return (synced as AdultProfile | null) ?? (profile as AdultProfile | null);
}
