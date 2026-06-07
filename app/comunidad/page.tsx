import Link from "next/link";
import { AmikoIcon } from "@/components/amiko-icon";
import { AppShell } from "@/components/app-shell";
import { getFirstStudent } from "@/lib/supabase/students";

const members = [
  { name: "Luis", role: "Cuidador principal", initials: "L", permissions: "5 permisos" },
  { name: "Maydeli", role: "Madre", initials: "M", permissions: "4 permisos" },
  { name: "Carmen", role: "Familiar", initials: "C", permissions: "2 permisos" },
];

export default async function ComunidadPage() {
  const firstStudent = await getFirstStudent();
  const studentName = firstStudent?.name ?? "tu estudiante";

  return (
    <AppShell>
      <section className="mb-6">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-amiko-green">
          Red privada
        </p>
        <h1 className="mt-2 text-3xl font-black leading-tight text-amiko-ink">Comunidad</h1>
        <p className="mt-2 text-base font-bold leading-7 text-amiko-muted">
          Personas de confianza que acompañan a {studentName}.
        </p>
      </section>

      <section className="mb-6 overflow-hidden rounded-[28px] bg-gradient-to-br from-amiko-green to-green-700 p-6 text-white shadow-soft">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-green-100">Red de apoyo</p>
            <h2 className="mt-2 text-2xl font-black">Red de {studentName}</h2>
            <p className="mt-2 text-sm font-bold leading-6 text-green-50">
              Comparte solo la información necesaria con quienes ayudan a acompañar su aprendizaje.
            </p>
          </div>
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15">
            <AmikoIcon name="users" className="h-6 w-6" />
          </span>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white/15 p-3">
            <p className="text-3xl font-black">3</p>
            <p className="mt-1 text-xs font-bold text-green-50">Personas activas</p>
          </div>
          <div className="rounded-2xl bg-white/15 p-3">
            <p className="text-3xl font-black">2</p>
            <p className="mt-1 text-xs font-bold text-green-50">Invitaciones pendientes</p>
          </div>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="mb-3 text-xl font-black text-amiko-ink">Acciones rápidas</h2>
        {/* 2-col grid always — container is 411px so both cards fit comfortably */}
        <div className="grid grid-cols-2 items-stretch gap-3">
          <button
            type="button"
            className="focus-ring flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-4 text-left shadow-card transition hover:-translate-y-0.5"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amiko-blue text-white">
              <AmikoIcon name="user-plus" className="h-5 w-5" />
            </span>
            <span>
              <span className="block font-black text-amiko-ink">Invitar</span>
              <span className="mt-0.5 block text-xs font-bold leading-4 text-amiko-muted">Elige el acceso con calma.</span>
            </span>
          </button>
          <button
            type="button"
            className="focus-ring relative flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-4 text-left shadow-card transition hover:-translate-y-0.5"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amiko-sky text-amiko-blue">
              <AmikoIcon name="mail" className="h-5 w-5" />
            </span>
            <span>
              <span className="block font-black text-amiko-ink">Invitaciones</span>
              <span className="mt-0.5 block text-xs font-bold leading-4 text-amiko-muted">2 pendientes de revisar.</span>
            </span>
            <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white">
              2
            </span>
          </button>
        </div>

        {/* Profesionales — full-width card, visually distinct as coming-soon */}
        <Link
          href="/professionals"
          className="focus-ring mt-3 flex items-center gap-4 rounded-2xl border border-amiko-green/20 bg-gradient-to-r from-amiko-mint/60 to-white p-4 shadow-card transition hover:-translate-y-0.5"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-amiko-green shadow-sm">
            <AmikoIcon name="heart" className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-2 font-black text-amiko-ink">
              Profesionales
              <span className="rounded-full border border-amiko-green/40 px-2 py-0.5 text-[10px] font-black text-amiko-green">
                Próximamente
              </span>
            </span>
            <span className="mt-0.5 block text-xs font-bold leading-4 text-amiko-muted">
              Red de apoyo especializada, en desarrollo.
            </span>
          </span>
          <AmikoIcon name="chevron" className="h-4 w-4 shrink-0 text-amiko-green/50" />
        </Link>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-black text-amiko-ink">Personas activas</h2>
          <span className="text-xs font-black text-amiko-muted">Acceso configurable</span>
        </div>
        <div className="space-y-3">
          {members.map((member, index) => (
            <article
              key={member.name}
              className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-card"
            >
              <span
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-base font-black text-white ${
                  index === 0 ? "bg-amiko-green" : index === 1 ? "bg-amiko-blue" : "bg-amiko-navy"
                }`}
              >
                {member.initials}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-black text-amiko-ink">{member.name}</span>
                <span className="mt-1 block text-sm font-bold text-amiko-muted">{member.role}</span>
              </span>
              <span className="flex items-center gap-1 rounded-full bg-slate-50 px-3 py-2 text-xs font-black text-amiko-muted">
                <AmikoIcon name="shield" className="h-4 w-4" />
                {member.permissions}
              </span>
            </article>
          ))}
        </div>
      </section>

      <p className="mt-6 rounded-2xl bg-amiko-sky px-4 py-3 text-sm font-bold leading-6 text-amiko-navy">
        Esta comunidad es privada. No es un foro público y cada persona solo verá lo que tú permitas.
      </p>
    </AppShell>
  );
}
