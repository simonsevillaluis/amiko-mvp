import Link from "next/link";
import { redirect } from "next/navigation";
import { AmikoIcon } from "@/components/amiko-icon";
import { AvatarUpload } from "@/components/avatar-upload";
import { DetailShell } from "@/components/detail-shell";
import { EditProfileForm } from "@/components/edit-profile-form";
import { StudentCardActions } from "@/components/student-card-actions";
import { createClient } from "@/lib/supabase/server";
import { getOrSyncProfile } from "@/lib/supabase/profile";
import { getStudentProfiles } from "@/lib/supabase/students";
import { studentInitial, supportLevelLabel } from "@/lib/student-format";

function roleLabel(role: string | null | undefined): string {
  if (role === "parent") return "Padre / Madre";
  if (role === "caregiver") return "Cuidador principal";
  if (role === "professional") return "Profesional";
  return "Adulto acompañante";
}

export default async function StudentsPage() {
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
  const studentsSummary =
    students.length === 0
      ? "Aún no has registrado estudiantes."
      : students.length === 1
        ? "1 estudiante registrado."
        : `${students.length} estudiantes registrados.`;
  const supportNetworkCopy =
    students.length === 0
      ? "Crea primero un perfil para organizar su red de apoyo."
      : students.length === 1
        ? `Personas de confianza que acompañan a ${students[0].name}.`
        : "Personas de confianza que acompañan a tus estudiantes.";

  return (
    <DetailShell title="Estudiantes">
      <section className="mb-5 rounded-[24px] bg-gradient-to-br from-amiko-blue to-amiko-navy p-5 text-white shadow-card">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-100">
          Perfiles de aprendizaje
        </p>
        <h1 className="mt-2 text-2xl font-black leading-tight">
          {students.length === 0
            ? "Aún no hay estudiantes registrados"
            : students.length === 1
              ? `${students[0].name} está listo para usar AMIKO`
              : `${students.length} estudiantes registrados`}
        </h1>
        <p className="mt-2 text-sm font-bold leading-6 text-blue-100">
          {students.length === 0
            ? "Crea un perfil simple para adaptar tareas con nombre, edad y nivel escolar."
            : "Desde aquí puedes elegir a quién acompañar, revisar sus datos y agregar otro perfil."}
        </p>
        <Link
          href="/register/student"
          className="focus-ring mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-black text-amiko-navy shadow-sm transition hover:bg-amiko-sky"
        >
          <AmikoIcon name={students.length > 0 ? "plus" : "user-plus"} className="h-4 w-4" />
          {students.length > 0 ? "Agregar otro estudiante" : "Crear perfil de estudiante"}
        </Link>
      </section>

      <section className="mb-5 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card">
        <div className="border-b border-slate-100 px-4 py-3">
          <p className="text-[11px] font-black uppercase tracking-widest text-amiko-muted">
            Mi cuenta
          </p>
        </div>
        <div className="flex flex-col items-center gap-3 px-4 py-5">
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
        <div className="border-t border-slate-100">
          {[
            { label: "Correo", value: user.email ?? "—" },
            { label: "Rol", value: roleLabel(profile?.role) },
          ].map((row, index, arr) => (
            <div
              key={row.label}
              className={`flex items-center justify-between gap-3 px-4 py-3.5 ${
                index < arr.length - 1 ? "border-b border-slate-100" : ""
              }`}
            >
              <span className="text-sm font-bold text-amiko-muted">{row.label}</span>
              <span className="text-right text-sm font-black text-amiko-ink">{row.value}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black text-amiko-ink">Personas a mi cuidado</h2>
            <p className="mt-0.5 text-xs font-bold text-amiko-muted">{studentsSummary}</p>
          </div>
          <Link href="/register/student" className="focus-ring text-xs font-black text-amiko-blue">
            {students.length > 0 ? "Agregar otro estudiante" : "+ Agregar"}
          </Link>
        </div>

        {students.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-amiko-blue/30 bg-amiko-sky/40 px-5 py-7 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-amiko-blue shadow-sm">
              <AmikoIcon name="user-plus" className="h-6 w-6" />
            </span>
            <p className="mt-3 text-base font-black text-amiko-navy">Crea el primer perfil</p>
            <p className="mt-1 text-sm font-bold leading-6 text-amiko-muted">
              Con un perfil, AMIKO puede usar el nombre real del estudiante y adaptar tareas con más contexto.
            </p>
            <Link
              href="/register/student"
              className="focus-ring mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-amiko-green px-5 text-sm font-black text-white shadow-card transition hover:brightness-95"
            >
              <AmikoIcon name="sparkles" className="h-4 w-4" />
              Crear perfil
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {students.map((student, index) => (
              <article
                key={student.id}
                className="rounded-2xl bg-gradient-to-br from-amiko-mint to-white p-4 shadow-card"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-lg font-black text-amiko-green shadow-sm">
                    {studentInitial(student.name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-black text-amiko-ink">{student.name}</p>
                      <span className="rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-black text-amiko-green">
                        {index === 0 ? "Activo en inicio" : "Disponible"}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm font-bold text-amiko-muted">
                      {student.age} años · {student.school_grade}
                    </p>
                  </div>
                  <StudentCardActions studentName={student.name} />
                </div>

                <p className="mt-3 rounded-xl bg-white/70 px-3 py-2 text-xs font-bold leading-5 text-amiko-muted">
                  {student.visual_preferences ||
                    student.notes ||
                    `${supportLevelLabel(student.support_level)} · ${student.school_grade}`}
                </p>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Link
                    href={`/adapt-task?studentId=${student.id}`}
                    className="focus-ring flex min-h-10 items-center justify-center rounded-full bg-amiko-green px-3 text-xs font-black text-white shadow-sm transition hover:brightness-95"
                  >
                    Adaptar tarea
                  </Link>
                  <Link
                    href={`/dashboard?studentId=${student.id}`}
                    className="focus-ring flex min-h-10 items-center justify-center rounded-full bg-white px-3 text-xs font-black text-amiko-blue shadow-sm transition hover:bg-amiko-sky"
                  >
                    Ver en inicio
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

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
              {supportNetworkCopy}
            </span>
          </span>
          <AmikoIcon name="chevron" className="h-4 w-4 shrink-0 text-slate-300" />
        </Link>
      </section>

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
