import Link from "next/link";
import { redirect } from "next/navigation";
import { AmikoIcon } from "@/components/amiko-icon";
import { DetailShell } from "@/components/detail-shell";
import {
  SettingsCard,
  SettingsDivider,
  SettingsRow,
  SettingsSection,
  TrustNote,
  type SettingsRowProps,
} from "@/components/settings-ui";
import { createClient } from "@/lib/supabase/server";
import { getOrSyncProfile } from "@/lib/supabase/profile";
import { getFirstStudent } from "@/lib/supabase/students";

const preferenceRows: SettingsRowProps[] = [
  {
    title: "Idioma / Language",
    description: "Español como idioma principal del MVP",
    href: "/settings/language",
    icon: "resources",
    iconTone: "bg-amiko-sky text-amiko-blue",
    value: "ES",
  },
  {
    title: "Accesibilidad",
    description: "Texto, contraste y movimiento para leer con más calma",
    href: "/settings/accessibility",
    icon: "help",
    iconTone: "bg-amiko-mint text-green-800",
  },
  {
    title: "Apariencia",
    description: "Modo oscuro y temas visuales llegarán después",
    icon: "calm",
    iconTone: "bg-slate-100 text-amiko-muted",
    badge: "Próximamente",
    disabled: true,
  },
];

const amikoRows: SettingsRowProps[] = [
  {
    title: "Contexto que Amiko puede usar",
    description: "Perfil pedagógico, tarea compartida y registros recientes",
    href: "/adapt-task/chat/conversation?from=%2Fsettings",
    icon: "shield",
    iconTone: "bg-amiko-sky text-amiko-blue",
  },
  {
    title: "Análisis de fotos con IA",
    description: "No disponible en este MVP",
    icon: "camera",
    iconTone: "bg-slate-100 text-amiko-muted",
    badge: "Próximamente",
    disabled: true,
  },
];

const privacyRows: SettingsRowProps[] = [
  {
    title: "Privacidad y datos",
    description: "Qué guarda AMIKO, para qué lo usa y qué no pide",
    href: "/settings/privacy",
    icon: "shield",
    iconTone: "bg-amiko-navy text-white",
  },
  {
    title: "Permisos de cámara y archivos",
    description: "AMIKO solo accede cuando tú eliges una foto o archivo",
    href: "/settings/permissions",
    icon: "camera",
    iconTone: "bg-slate-100 text-amiko-navy",
  },
];

const supportRows: SettingsRowProps[] = [
  {
    title: "Preguntas frecuentes",
    description: "Respuestas rápidas sobre AMIKO",
    href: "/faq",
    icon: "help",
    iconTone: "bg-amiko-mint text-green-800",
  },
  {
    title: "Centro de ayuda",
    description: "Guías breves y qué hacer si algo sale mal",
    href: "/settings/help",
    icon: "resources",
    iconTone: "bg-amiko-sky text-amiko-blue",
  },
  {
    title: "Contactar soporte",
    description: "Canal de soporte real pendiente de definir",
    icon: "mail",
    iconTone: "bg-slate-100 text-amiko-muted",
    badge: "Próximamente",
    disabled: true,
  },
];

function renderRows(rows: SettingsRowProps[]) {
  return rows.map((row, index) => (
    <div key={row.title}>
      <SettingsRow {...row} />
      {index < rows.length - 1 ? <SettingsDivider /> : null}
    </div>
  ));
}

function roleLabel(role: string | null | undefined) {
  if (role === "parent") return "Padre / Madre";
  if (role === "caregiver") return "Cuidador principal";
  if (role === "professional") return "Profesional";
  return "Adulto acompañante";
}

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [profile, firstStudent] = await Promise.all([
    getOrSyncProfile(user.id),
    getFirstStudent(),
  ]);

  const adultName = profile?.full_name?.split(" ")[0] ?? "Adulto";
  const adultInitial = adultName.slice(0, 1).toUpperCase();

  return (
    <DetailShell title="Ajustes" backHref="/dashboard" fallbackHref="/dashboard">
      <TrustNote title="Centro de confianza" icon="shield">
        Revisa cómo AMIKO usa la información, ajusta preferencias sencillas y encuentra ayuda sin activar funciones que aún no existen.
      </TrustNote>

      <SettingsSection label="Perfil">
        <Link
          href="/students"
          className="focus-ring flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-card transition hover:shadow-soft"
        >
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amiko-green to-green-700 text-xl font-black text-white shadow-sm">
            {adultInitial}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-black text-amiko-ink">{profile?.full_name ?? adultName}</span>
            <span className="mt-0.5 block text-sm font-bold text-amiko-muted">{roleLabel(profile?.role)}</span>
            <span className="mt-1 block text-xs font-black text-amiko-blue">
              {firstStudent ? `Acompañando a ${firstStudent.name}` : "Crear o revisar perfil del estudiante"}
            </span>
          </span>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amiko-sky text-amiko-blue">
            <AmikoIcon name="users" className="h-5 w-5" />
          </span>
        </Link>
      </SettingsSection>

      <SettingsSection label="Preferencias">
        <SettingsCard>{renderRows(preferenceRows)}</SettingsCard>
      </SettingsSection>

      <SettingsSection label="Amiko IA">
        <SettingsCard>{renderRows(amikoRows)}</SettingsCard>
      </SettingsSection>

      <SettingsSection label="Privacidad y permisos">
        <SettingsCard>{renderRows(privacyRows)}</SettingsCard>
      </SettingsSection>

      <SettingsSection label="Soporte">
        <SettingsCard>{renderRows(supportRows)}</SettingsCard>
      </SettingsSection>

      <SettingsSection label="Cuenta">
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
      </SettingsSection>

      <p className="rounded-2xl bg-amiko-sky px-4 py-3 text-xs font-bold leading-5 text-amiko-navy">
        AMIKO es apoyo pedagógico. No diagnostica ni reemplaza a docentes, terapeutas o profesionales de salud.
        <br />
        <span className="mt-1 block text-amiko-muted">
          v0.1.0 MVP Demo{firstStudent ? ` · ${firstStudent.name} activo` : ""}
        </span>
      </p>
    </DetailShell>
  );
}
