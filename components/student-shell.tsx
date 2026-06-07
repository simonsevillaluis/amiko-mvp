"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { AmikoIcon, type AmikoIconName } from "@/components/amiko-icon";
import { StudentAvatar } from "@/components/student-portal-icons";
import { studentPortalStudent } from "@/lib/student-mock-data";

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
}: {
  children: ReactNode;
  basePath?: string;
}) {
  const pathname = usePathname();

  const navItems: NavItem[] = NAV_PATHS.map((path, index) => ({
    path: `${basePath}${path}`,
    label: NAV_LABELS[index],
    icon: NAV_ICONS[index],
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EAF0FD] via-white to-[#F0F8E8]">
      <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto grid max-w-[430px] grid-cols-[80px_1fr_80px] items-center gap-2 px-4 py-3">
          <div className="flex items-center justify-start">
            <StudentAvatar name={studentPortalStudent.name} className="h-10 w-10 text-base shadow-sm" />
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
            <Link
              href={basePath}
              className="focus-ring flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-amiko-sky"
              aria-label="Ajustes"
            >
              <AmikoIcon name="settings" className="h-5 w-5" />
            </Link>
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

      <main className="mx-auto max-w-[430px] px-5 py-5 pb-28">
        {children}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-100 bg-white/95 px-2 py-1 shadow-[0_-4px_16px_rgba(23,32,46,0.07)] backdrop-blur-xl">
        <div className="mx-auto grid max-w-[430px] grid-cols-4">
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
    </div>
  );
}
