import Link from "next/link";
import { AmikoIcon, type AmikoIconName } from "@/components/amiko-icon";
import { DetailShell } from "@/components/detail-shell";
import { student } from "@/lib/mock-data";

type SettingRow = {
  title: string;
  description?: string;
  href: string;
  icon: AmikoIconName;
  iconTone?: string;
  badge?: string;
  value?: string;
};

const planRows: SettingRow[] = [
  {
    title: "Plan actual",
    description: "Amiko Gratuito",
    href: "#",
    icon: "sparkles",
    iconTone: "bg-amiko-sky text-amiko-blue",
    value: "Gratis",
  },
  {
    title: "Amiko Premium",
    description: "Más funciones, sin límites de sesión",
    href: "#",
    icon: "award",
    iconTone: "bg-amiko-cream text-amiko-navy",
    badge: "Próximamente",
  },
];

const prefRows: SettingRow[] = [
  {
    title: "Idioma / Language",
    href: "#",
    icon: "resources",
    iconTone: "bg-amiko-sky text-amiko-blue",
    value: "ES",
  },
  {
    title: "Apariencia",
    description: "Modo claro / oscuro",
    href: "#",
    icon: "calm",
    iconTone: "bg-amiko-mint text-green-800",
  },
  {
    title: "Accesibilidad",
    description: "Tamaño de texto, contraste, guía de voz",
    href: "#",
    icon: "help",
    iconTone: "bg-amiko-sky text-amiko-blue",
  },
];

const privacyRows: SettingRow[] = [
  {
    title: "Privacidad y datos",
    description: "Controla qué guarda y comparte Amiko",
    href: "#",
    icon: "shield",
    iconTone: "bg-amiko-navy text-white",
  },
  {
    title: "Permisos de cámara y archivos",
    description: "Revisa qué tiene acceso Amiko en este dispositivo",
    href: "#",
    icon: "camera",
    iconTone: "bg-slate-100 text-amiko-navy",
  },
];

const supportRows: SettingRow[] = [
  {
    title: "Preguntas frecuentes",
    description: "Cómo funciona Amiko y respuestas rápidas",
    href: "/faq",
    icon: "help",
    iconTone: "bg-amiko-mint text-green-800",
  },
  {
    title: "Centro de ayuda",
    description: "Guías y contacto de soporte",
    href: "#",
    icon: "resources",
    iconTone: "bg-amiko-sky text-amiko-blue",
  },
];

function SectionLabel({ label }: { label: string }) {
  return (
    <p className="mb-2 px-1 text-[11px] font-black uppercase tracking-widest text-amiko-muted">
      {label}
    </p>
  );
}

function SettingCard({ rows }: { rows: SettingRow[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card">
      {rows.map((row, i) => (
        <Link
          key={row.title}
          href={row.href}
          className={`focus-ring flex items-center gap-3 px-4 py-3.5 transition hover:bg-slate-50 ${
            i < rows.length - 1 ? "border-b border-slate-100" : ""
          }`}
        >
          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${row.iconTone ?? "bg-amiko-sky text-amiko-blue"}`}>
            <AmikoIcon name={row.icon} className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-2">
              <span className="block text-sm font-black text-amiko-ink">{row.title}</span>
              {row.badge ? (
                <span className="rounded-full border border-amiko-green/40 px-2 py-0.5 text-[10px] font-black text-amiko-green">
                  {row.badge}
                </span>
              ) : null}
            </span>
            {row.description ? (
              <span className="mt-0.5 block text-xs font-bold leading-4 text-amiko-muted">
                {row.description}
              </span>
            ) : null}
          </span>
          {row.value ? (
            <span className="shrink-0 text-sm font-black text-amiko-muted">{row.value}</span>
          ) : null}
          <AmikoIcon name="chevron" className="h-4 w-4 shrink-0 text-slate-300" />
        </Link>
      ))}
    </div>
  );
}

export default function SettingsPage() {
  return (
    <DetailShell title="Ajustes">
      {/* Profile card */}
      <Link
        href="/students"
        className="focus-ring mb-6 flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-card transition hover:shadow-soft"
      >
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amiko-green to-green-700 text-xl font-black text-white shadow-sm">
          L
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-black text-amiko-ink">Luis</span>
          <span className="mt-0.5 block text-sm font-bold text-amiko-muted">Cuidador principal</span>
          <span className="mt-1 block text-xs font-black text-amiko-blue">Editar perfil →</span>
        </span>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amiko-sky text-amiko-blue">
          <AmikoIcon name="users" className="h-5 w-5" />
        </span>
      </Link>

      {/* Plan */}
      <div className="mb-5">
        <SectionLabel label="Plan" />
        <SettingCard rows={planRows} />
      </div>

      {/* Preferencias */}
      <div className="mb-5">
        <SectionLabel label="Preferencias" />
        <SettingCard rows={prefRows} />
      </div>

      {/* Privacidad */}
      <div className="mb-5">
        <SectionLabel label="Privacidad y permisos" />
        <SettingCard rows={privacyRows} />
      </div>

      {/* Soporte */}
      <div className="mb-5">
        <SectionLabel label="Soporte" />
        <SettingCard rows={supportRows} />
      </div>

      {/* Cuenta */}
      <div className="mb-6">
        <SectionLabel label="Cuenta" />
        <div className="overflow-hidden rounded-2xl border border-red-100 bg-white shadow-card">
          <Link
            href="/login"
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
      </div>

      {/* Footer disclaimer */}
      <p className="rounded-2xl bg-amiko-sky px-4 py-3 text-xs font-bold leading-5 text-amiko-navy">
        Amiko es apoyo pedagógico. No diagnostica ni reemplaza a docentes, terapeutas o profesionales de salud.
        <br />
        <span className="mt-1 block text-amiko-muted">v0.1.0 MVP Demo · {student.name} activo</span>
      </p>
    </DetailShell>
  );
}
