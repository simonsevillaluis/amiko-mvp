"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import { AmikoIcon, type AmikoIconName } from "@/components/amiko-icon";
import { FeedbackFab } from "@/components/feedback-fab";
import { FloatingModeToggle } from "@/components/floating-mode-toggle";
import { StudentPhoneFrame } from "@/components/student-phone-frame";
import { StudentAvatar } from "@/components/student-portal-icons";
import { StudentSettingsPanel } from "@/components/student-settings-panel";
import { createClient } from "@/lib/supabase/client";

type NavItem = {
  path: string;
  label: string;
  icon: AmikoIconName;
};

const NAV_PATHS = ["", "/amiko", "/recursos", "/mi-red"] as const;
const NAV_LABELS = ["Inicio", "Amiko", "Recursos", "Mi Red"];
const NAV_ICONS: AmikoIconName[] = ["home", "chat", "resources", "users"];

export function StudentShell({
  children,
  basePath = "/student-portal",
  showAdultReturn = true,
}: {
  children: ReactNode;
  basePath?: string;
  showAdultReturn?: boolean;
}) {
  const pathname = usePathname();
  const [showSettings, setShowSettings] = useState(false);
  const [realStudentName, setRealStudentName] = useState<string | null>(null);

  useEffect(() => {
    if (basePath.startsWith("/demo")) return;

    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;

      const { data } = await supabase
        .from("student_profiles")
        .select("name")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();

      setRealStudentName(data?.name ?? null);
    });
  }, [basePath]);

  const navItems: NavItem[] = NAV_PATHS.map((path, index) => ({
    path: `${basePath}${path}`,
    label: NAV_LABELS[index],
    icon: NAV_ICONS[index],
  }));

  return (
    <StudentPhoneFrame>
      {showAdultReturn ? <FloatingModeToggle mode="student" /> : null}
      {showSettings && <StudentSettingsPanel onClose={() => setShowSettings(false)} />}

      <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/95 backdrop-blur-xl">
        <div className="grid grid-cols-[80px_1fr_80px] items-center gap-2 px-4 py-3">
          <div className="flex items-center justify-start">
            <StudentAvatar name={realStudentName ?? "Estudiante"} className="h-10 w-10 text-base shadow-sm" />
          </div>

          <div className="flex justify-center">
            <Link
              href={basePath}
              className="focus-ring rounded-lg py-0.5"
              aria-label="Inicio de AMIKO estudiante"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/amiko-logo/amiko-logo.svg"
                alt="amiko"
                width={88}
                height={32}
                className="object-contain"
              />
            </Link>
          </div>

          <div className="flex items-center justify-end gap-1 text-amiko-ink">
            <button
              type="button"
              onClick={() => setShowSettings(true)}
              className="focus-ring flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-amiko-sky"
              aria-label="Ajustes"
            >
              <AmikoIcon name="settings" className="h-5 w-5" />
            </button>
            <Link
              href={basePath}
              className="focus-ring relative flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-amiko-sky"
              aria-label="Notificaciones"
            >
              <AmikoIcon name="bell" className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            </Link>
          </div>
        </div>
      </header>

      <main className="px-5 py-5 pb-28">
        {children}
      </main>

      <FeedbackFab offsetClassName="bottom-[9.5rem] left-4" />

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-100 bg-white/95 px-2 py-1 shadow-[0_-4px_16px_rgba(23,32,46,0.07)] backdrop-blur-xl sm:left-1/2 sm:right-auto sm:w-full sm:max-w-[430px] sm:-translate-x-1/2">
        <div className="grid grid-cols-4">
          {navItems.map((item) => {
            const active =
              item.path === basePath
                ? pathname === basePath
                : pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                href={item.path}
                className="focus-ring flex flex-col items-center gap-1 rounded-lg py-2"
                aria-current={active ? "page" : undefined}
              >
                <span
                  className={`flex items-center justify-center rounded-full px-4 py-1.5 transition ${
                    active ? "bg-amiko-mint" : ""
                  }`}
                >
                  <AmikoIcon
                    name={item.icon}
                    className={`h-6 w-6 transition ${
                      active ? "text-amiko-green" : "text-slate-400"
                    }`}
                  />
                </span>
                <span
                  className={`text-[11px] font-black transition ${
                    active ? "text-amiko-green" : "text-slate-400"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </StudentPhoneFrame>
  );
}
