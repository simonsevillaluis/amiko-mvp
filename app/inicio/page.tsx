import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AmikoIcon } from "@/components/amiko-icon";
import { AppShell } from "@/components/app-shell";
import { getOrSyncProfile } from "@/lib/supabase/profile";
import { createClient } from "@/lib/supabase/server";
import { getStudentProfiles } from "@/lib/supabase/students";
import { studentInitial } from "@/lib/student-format";

function firstNameFrom(value: string | null | undefined) {
  return value?.trim().split(" ")[0] || "";
}

export default async function InicioPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [profile, students] = await Promise.all([
    getOrSyncProfile(user.id),
    getStudentProfiles(),
  ]);

  const metaName =
    (user.user_metadata?.full_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined);
  const adultName = firstNameFrom(profile?.full_name) || firstNameFrom(metaName) || "hola";
  const firstStudent = students[0] ?? null;

  return (
    <AppShell>
      <section className="mb-6">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-amiko-green">
          Inicio adulto
        </p>
        <h1 className="mt-2 text-3xl font-black leading-tight text-amiko-ink">
          Hola, {adultName}.
        </h1>
        <p className="mt-2 text-base font-bold leading-7 text-amiko-muted">
          {firstStudent
            ? `Hoy podemos preparar una tarea para ${firstStudent.name} o revisar sus avances.`
            : "Para empezar, crea el perfil del estudiante que vas a acompañar."}
        </p>
      </section>

      {firstStudent ? (
        <>
          <Link
            href={`/adapt-task?studentId=${firstStudent.id}`}
            className="focus-ring group relative mb-6 block overflow-hidden rounded-[30px] bg-gradient-to-br from-amiko-green to-[#4DAA42] p-6 text-white shadow-soft"
          >
            <div className="relative z-10 max-w-[72%]">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-white/80">
                Siguiente paso
              </p>
              <h2 className="mt-2 text-2xl font-black leading-tight">
                Adaptar tarea de {firstStudent.name}
              </h2>
              <p className="mt-3 text-sm font-bold leading-6 text-white/90">
                Pega una consigna y AMIKO la convierte en pasos claros.
              </p>
              <span className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-black text-amiko-green shadow-card transition group-hover:-translate-y-0.5">
                <AmikoIcon name="sparkles" className="h-5 w-5" />
                Adaptar ahora
              </span>
            </div>
            <Image
              src="/amiko-character/amiko-character-photo.svg"
              alt=""
              width={126}
              height={126}
              className="absolute bottom-1 right-0 object-contain drop-shadow-md"
            />
          </Link>

          <section className="mb-6 rounded-[24px] border border-blue-100 bg-white p-4 shadow-card">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-amiko-blue">
                  Perfil activo
                </p>
                <h2 className="mt-1 text-lg font-black text-amiko-ink">{firstStudent.name}</h2>
              </div>
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amiko-mint text-lg font-black text-amiko-green">
                {studentInitial(firstStudent.name)}
              </span>
            </div>
            <p className="text-sm font-bold leading-6 text-amiko-muted">
              {firstStudent.age} años · {firstStudent.school_grade}
            </p>
            {firstStudent.visual_preferences ? (
              <p className="mt-3 rounded-2xl bg-amiko-sky px-3 py-2 text-xs font-bold leading-5 text-amiko-navy">
                {firstStudent.visual_preferences}
              </p>
            ) : (
              <p className="mt-3 rounded-2xl bg-amiko-sky px-3 py-2 text-xs font-bold leading-5 text-amiko-navy">
                Aún no hay preferencias registradas. Puedes agregarlas después desde su perfil.
              </p>
            )}
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Link
                href="/students"
                className="focus-ring flex min-h-10 items-center justify-center rounded-full bg-slate-100 px-4 text-xs font-black text-amiko-ink transition hover:bg-slate-200"
              >
                Ver perfiles
              </Link>
              <Link
                href="/dashboard"
                className="focus-ring flex min-h-10 items-center justify-center rounded-full bg-amiko-blue px-4 text-xs font-black text-white shadow-sm transition hover:bg-amiko-navy"
              >
                Ir al dashboard
              </Link>
            </div>
          </section>

          {students.length > 1 ? (
            <section className="mb-6">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-lg font-black text-amiko-ink">Otros estudiantes</h2>
                <Link href="/register/student" className="text-xs font-black text-amiko-blue">
                  Agregar otro
                </Link>
              </div>
              <div className="space-y-2">
                {students.slice(1).map((student) => (
                  <Link
                    key={student.id}
                    href={`/dashboard?studentId=${student.id}`}
                    className="focus-ring flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm transition hover:bg-amiko-sky/40"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amiko-sky text-sm font-black text-amiko-blue">
                      {studentInitial(student.name)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-black text-amiko-ink">{student.name}</span>
                      <span className="block truncate text-xs font-bold text-amiko-muted">
                        {student.school_grade}
                      </span>
                    </span>
                    <AmikoIcon name="chevron" className="h-4 w-4 text-slate-400" />
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </>
      ) : (
        <section className="mb-7 rounded-[30px] border border-amiko-blue/15 bg-amiko-sky p-6 text-center shadow-soft">
          <Image
            src="/amiko-character/amiko-character-photo.svg"
            alt="Mascota de AMIKO saludando"
            width={136}
            height={136}
            className="mx-auto object-contain"
            priority
          />
          <h2 className="mt-4 text-2xl font-black leading-tight text-amiko-navy">
            Crea el primer perfil
          </h2>
          <p className="mt-3 text-sm font-bold leading-6 text-amiko-muted">
            AMIKO necesita nombre, edad y nivel escolar para adaptar tareas con más cuidado.
          </p>
          <Link
            href="/register/student"
            className="focus-ring mt-5 flex min-h-14 items-center justify-center gap-2 rounded-full bg-amiko-green px-5 text-base font-black text-white shadow-card transition hover:brightness-95"
          >
            <AmikoIcon name="user-plus" className="h-5 w-5" />
            Crear perfil de estudiante
          </Link>
        </section>
      )}

      <section>
        <h2 className="mb-3 text-lg font-black text-amiko-ink">Acciones rápidas</h2>
        <div className="space-y-3">
          <Link
            href={firstStudent ? `/adapt-task?studentId=${firstStudent.id}` : "/register/student"}
            className="focus-ring flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-card transition hover:-translate-y-0.5"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amiko-mint text-amiko-green">
              <AmikoIcon name={firstStudent ? "task" : "user-plus"} className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-black text-amiko-ink">
                {firstStudent ? "Adaptar una tarea" : "Registrar estudiante"}
              </span>
              <span className="mt-1 block text-xs font-bold leading-5 text-amiko-muted">
                {firstStudent
                  ? `Preparar una consigna para ${firstStudent.name}.`
                  : "Crear la base para personalizar AMIKO."}
              </span>
            </span>
            <AmikoIcon name="chevron" className="h-4 w-4 shrink-0 text-slate-400" />
          </Link>

          <Link
            href="/bienestar"
            className="focus-ring flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-card transition hover:-translate-y-0.5"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amiko-cream text-amiko-coral">
              <AmikoIcon name="calm" className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-black text-amiko-ink">Bienestar</span>
              <span className="mt-1 block text-xs font-bold leading-5 text-amiko-muted">
                Pausas y respiración para acompañar con calma.
              </span>
            </span>
            <AmikoIcon name="chevron" className="h-4 w-4 shrink-0 text-slate-400" />
          </Link>
        </div>
      </section>
    </AppShell>
  );
}
