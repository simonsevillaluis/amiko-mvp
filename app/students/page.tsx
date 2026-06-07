import Link from "next/link";
import { redirect } from "next/navigation";
import { AmikoIcon } from "@/components/amiko-icon";
import { AvatarUpload } from "@/components/avatar-upload";
import { DetailShell } from "@/components/detail-shell";
import { EditProfileForm } from "@/components/edit-profile-form";
import { createClient } from "@/lib/supabase/server";
import { getOrSyncProfile } from "@/lib/supabase/profile";
import { getStudentProfiles, studentInitial, supportLevelLabel } from "@/lib/supabase/students";

function roleLabel(role: string | null | undefined): string {
  if (role === "parent") return "Padre / Madre";
  if (role === "caregiver") return "Cuidador principal";
  if (role === "professional") return "Profesional";
  return "Adulto acompañante";
}

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [profile, students] = await Promise.all([
    getOrSyncProfile(user.id),
    getStudentProfiles(),
  ]);

  const metaFullName =
    (user.user_metadata?.full_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined);
  const displayFullName = profile?.full_name?.trim() || metaFullName?.trim() || "";
  const adultName = displayFullName.split(" ")[0] || "Adulto";
  const adultInitial = adultName.slice(0, 1).toUpperCase();

  return (
    <DetailShell title="Mi Perfil">
      {/* Avatar adulto */}
      <div className="mb-6 flex flex-col items-center gap-3">
        <AvatarUpload
          userId={user.id}
          initialAvatarUrl={profile?.avatar_url ?? null}
          adultInitial={adultInitial}
        />
        <div className="text-center">
          <p className="text-xl font-black text-amiko-ink">{displayFullName || adultName}</p>
          <p className="mt-0.5 text-sm font-bold text-amiko-muted">{roleLabel(profile?.role)}</p>
          <EditProfileForm
            initialFullName={displayFullName}
            initialRole={(profile?.role as "parent" | "caregiver" | "professional" | null) ?? null}
          />
        </div>
      </div>

      {/* Datos de la cuenta */}
      <section className="mb-5 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card">
        <div className="border-b border-slate-100 px-4 py-3">
          <p className="text-[11px] font-black uppercase tracking-widest text-amiko-muted">Mi cuenta</p>
        </div>
        {[
          { label: "Nombre", value: displayFullName || "Sin nombre aún" },
          { label: "Correo", value: user.email ?? "—" },
          { label: "Rol", value: roleLabel(profile?.role) },
        ].map((row, i, arr) => (
          <div
            key={row.label}
            className={`flex items-center justify-between gap-3 px-4 py-3.5 ${
              i < arr.length - 1 ? "border-b border-slate-100" : ""
            }`}
          >
            <span className="text-sm font-bold text-amiko-muted">{row.label}</span>
            <span className="text-sm font-black text-amiko-ink">{row.value}</span>
          </div>
        ))}
        <div className="border-t border-slate-100 px-4 py-3">
          <Link
            href="/settings"
            className="focus-ring block w-full rounded-full border border-amiko-blue py-2.5 text-center text-sm font-black text-amiko-blue transition hover:bg-amiko-sky"
          >
            Ir a ajustes
          </Link>
        </div>
      </section>

      {/* Personas a mi cuidado */}
      <section className="mb-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-lg font-black text-amiko-ink">Personas a mi cuidado</h2>
          <Link
            href="/register/student"
            className="focus-ring text-xs font-black text-amiko-blue"
          >
            + Agregar
          </Link>
        </div>

        {students.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-amiko-blue/30 bg-amiko-sky/40 px-5 py-7 text-center">
            <p className="text-sm font-black text-amiko-navy">Todavía no hay perfiles creados</p>
            <p className="mt-1 text-xs font-bold text-amiko-muted">
              Crea el perfil de tu estudiante para empezar a adaptar tareas con Amiko.
            </p>
            <Link
              href="/register/student"
              className="focus-ring mt-4 inline-flex min-h-10 items-center gap-2 rounded-full bg-amiko-green px-5 text-sm font-black text-white shadow-card transition hover:opacity-90"
            >
              <AmikoIcon name="sparkles" className="h-4 w-4" />
              Crear perfil de estudiante
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {students.map((s) => (
              <article
                key={s.id}
                className="rounded-2xl bg-gradient-to-br from-amiko-mint to-white p-4 shadow-card"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-lg font-black text-amiko-green shadow-sm">
                    {studentInitial(s.name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-black text-amiko-ink">{s.name}</p>
                    <p className="mt-0.5 text-sm font-bold text-amiko-muted">
                      {s.age} años · {s.school_grade}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="focus-ring flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm transition hover:bg-amiko-sky"
                    aria-label={`Ajustes de ${s.name}`}
                  >
                    <AmikoIcon name="settings" className="h-4 w-4 text-amiko-muted" />
                  </button>
                </div>
                {s.visual_preferences || s.notes ? (
                  <p className="mt-3 rounded-xl bg-white/70 px-3 py-2 text-xs font-bold leading-5 text-amiko-muted">
                    {s.visual_preferences ?? s.notes}
                  </p>
                ) : (
                  <p className="mt-3 rounded-xl bg-white/70 px-3 py-2 text-xs font-bold leading-5 text-amiko-muted">
                    {supportLevelLabel(s.support_level)} · {s.school_grade}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Red de apoyo */}
      <section className="mb-6">
        <h2 className="mb-3 text-lg font-black text-amiko-ink">Red de apoyo</h2>
        <Link
          href="/comunidad"
          className="focus-ring flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-card transition hover:shadow-soft"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amiko-sky text-amiko-blue">
            <AmikoIcon name="users" className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-black text-amiko-ink">Red de apoyo</span>
            <span className="mt-0.5 block text-xs font-bold text-amiko-muted">
              Personas de confianza que acompañan al estudiante
            </span>
          </span>
          <AmikoIcon name="chevron" className="h-4 w-4 shrink-0 text-slate-300" />
        </Link>
      </section>

      {/* Cerrar sesión */}
      <section className="mb-5">
        <div className="overflow-hidden rounded-2xl border border-red-100 bg-white shadow-card">
          <Link
            href="/auth/signout"
            className="focus-ring flex items-center gap-3 px-4 py-3.5 transition hover:bg-red-50"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500">
              <AmikoIcon name="back" className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-black text-red-500">Cerrar sesión</span>
            </span>
            <AmikoIcon name="chevron" className="h-4 w-4 shrink-0 text-red-200" />
          </Link>
        </div>
      </section>
    </DetailShell>
  );
}
