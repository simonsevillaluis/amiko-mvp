import Link from "next/link";
import { AmikoIcon } from "@/components/amiko-icon";
import { DetailShell } from "@/components/detail-shell";
import { student } from "@/lib/mock-data";

export default function ProfilePage() {
  return (
    <DetailShell title="Mi Perfil">
      {/* Avatar + photo change */}
      <div className="mb-6 flex flex-col items-center gap-3">
        <div className="relative">
          <span className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-amiko-green to-green-700 text-4xl font-black text-white shadow-soft">
            L
          </span>
          <button
            type="button"
            className="focus-ring absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-amiko-blue text-white shadow-card transition hover:bg-amiko-navy"
            aria-label="Cambiar foto de perfil"
          >
            <AmikoIcon name="camera" className="h-4 w-4" />
          </button>
        </div>
        <div className="text-center">
          <p className="text-xl font-black text-amiko-ink">Luis</p>
          <p className="mt-0.5 text-sm font-bold text-amiko-muted">Cuidador principal</p>
        </div>
      </div>

      {/* Account info */}
      <section className="mb-5 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card">
        <div className="border-b border-slate-100 px-4 py-3">
          <p className="text-[11px] font-black uppercase tracking-widest text-amiko-muted">Mi cuenta</p>
        </div>
        {[
          { label: "Nombre", value: "Luis Simon" },
          { label: "Correo", value: "simonsevilla.luis@gmail.com" },
          { label: "Rol", value: "Cuidador principal" },
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
          <button
            type="button"
            className="focus-ring w-full rounded-full border border-amiko-blue py-2.5 text-sm font-black text-amiko-blue transition hover:bg-amiko-sky"
          >
            Editar datos
          </button>
        </div>
      </section>

      {/* Personas a mi cuidado */}
      <section className="mb-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-lg font-black text-amiko-ink">Personas a mi cuidado</h2>
          <button type="button" className="text-xs font-black text-amiko-blue">
            + Agregar
          </button>
        </div>
        <article className="rounded-2xl bg-gradient-to-br from-amiko-mint to-white p-4 shadow-card">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-lg font-black text-amiko-green shadow-sm">
              {student.name.slice(0, 1)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-black text-amiko-ink">{student.name}</p>
              <p className="mt-0.5 text-sm font-bold text-amiko-muted">
                {student.age} años · {student.grade}
              </p>
            </div>
            <button type="button" className="focus-ring flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm transition hover:bg-amiko-sky">
              <AmikoIcon name="settings" className="h-4 w-4 text-amiko-muted" />
            </button>
          </div>
          <p className="mt-3 rounded-xl bg-white/70 px-3 py-2 text-xs font-bold leading-5 text-amiko-muted">
            Comprende mejor con apoyo visual y pasos cortos.
          </p>
        </article>
      </section>

      {/* Red de apoyo */}
      <section className="mb-5">
        <h2 className="mb-3 text-lg font-black text-amiko-ink">Red de apoyo</h2>
        <Link
          href="/comunidad"
          className="focus-ring flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-card transition hover:shadow-soft"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amiko-sky text-amiko-blue">
            <AmikoIcon name="users" className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-black text-amiko-ink">Red de {student.name}</span>
            <span className="mt-0.5 block text-xs font-bold text-amiko-muted">3 personas activas · 2 invitaciones pendientes</span>
          </span>
          <AmikoIcon name="chevron" className="h-4 w-4 shrink-0 text-slate-300" />
        </Link>
      </section>

      {/* Volver a ajustes */}
      <Link
        href="/settings"
        className="focus-ring flex items-center justify-center gap-2 rounded-full border border-slate-200 py-3 text-sm font-black text-amiko-muted transition hover:bg-slate-50"
      >
        <AmikoIcon name="settings" className="h-4 w-4" />
        Ir a Ajustes
      </Link>
    </DetailShell>
  );
}
