"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { AmikoIcon, type AmikoIconName } from "@/components/amiko-icon";
import { FloatingModeToggle } from "@/components/floating-mode-toggle";
import { CHAT_HOME_PATH, withChatFrom } from "@/lib/chat-navigation";

const navItems: Array<{ href: string; label: string; icon: AmikoIconName }> = [
  { href: "/dashboard", label: "Inicio", icon: "home" },
  { href: CHAT_HOME_PATH, label: "Amiko IA", icon: "chat" },
  { href: "/acompanamiento", label: "Recursos", icon: "resources" },
  { href: "/comunidad", label: "Comunidad", icon: "users" },
];

function AmikoLogo() {
  return (
    <Link href="/dashboard" className="focus-ring rounded-lg py-0.5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/amiko-logo/amiko-logo.svg"
        alt="amiko"
        width={88}
        height={32}
        className="object-contain"
      />
    </Link>
  );
}

function isNavItemActive(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }

  if (href === CHAT_HOME_PATH) {
    return pathname.startsWith(CHAT_HOME_PATH);
  }

  if (href === "/acompanamiento") {
    if (pathname.startsWith(CHAT_HOME_PATH)) {
      return false;
    }

    return [
      "/acompanamiento",
      "/adapt-task",
      "/mi-dia",
      "/bienestar",
      "/historial",
      "/tasks",
    ].some((route) => pathname === route || pathname.startsWith(`${route}/`));
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-dvh bg-slate-100">
      <div className="mx-auto min-h-dvh w-full max-w-[430px] bg-gradient-to-b from-white via-[#F5F8FB] to-[#F6FBEF] shadow-soft">
      <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto grid max-w-[430px] grid-cols-[80px_1fr_80px] items-center gap-2 px-4 py-3">
          <div className="flex items-center justify-start">
            <Link
              href="/students"
              className="focus-ring flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amiko-green to-green-600 text-sm font-black text-white shadow-sm transition hover:shadow-card"
              aria-label="Mi perfil y red"
            >
              L
            </Link>
          </div>

          <div className="flex justify-center">
            <AmikoLogo />
          </div>

          <div className="flex items-center justify-end gap-1 text-amiko-ink">
            <Link
              href="/settings"
              className="focus-ring flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-amiko-sky"
              aria-label="Ajustes"
            >
              <AmikoIcon name="settings" className="h-5 w-5" />
            </Link>
            <Link
              href="/alerts"
              className="focus-ring relative flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-amiko-sky"
              aria-label="Notificaciones"
            >
              <AmikoIcon name="bell" className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[430px] px-4 py-5 pb-28">
        {children}
      </main>

      <FloatingModeToggle mode="adult" />

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-100 bg-white/95 px-1 py-1 shadow-[0_-4px_16px_rgba(23,32,46,0.07)] backdrop-blur-xl sm:left-1/2 sm:right-auto sm:w-full sm:max-w-[430px] sm:-translate-x-1/2">
        <div className="mx-auto grid max-w-[430px] grid-cols-4">
          {navItems.map((item) => {
            const active = isNavItemActive(pathname, item.href);
            const href = item.href === CHAT_HOME_PATH
              ? withChatFrom(CHAT_HOME_PATH, pathname)
              : item.href;

            return (
              <Link
                key={item.href}
                href={href}
                className="focus-ring flex min-w-0 flex-col items-center gap-0.5 rounded-lg py-2"
              >
                <span
                  className={`flex items-center justify-center rounded-full px-3 py-1.5 transition ${
                    active ? "bg-amiko-mint" : ""
                  }`}
                >
                  <AmikoIcon
                    name={item.icon}
                    className={`h-5 w-5 transition ${
                      active ? "text-amiko-green" : "text-amiko-muted"
                    }`}
                  />
                </span>
                <span
                  className={`max-w-full whitespace-nowrap text-[9px] font-black transition sm:text-[10px] ${
                    active ? "text-amiko-green" : "text-amiko-muted"
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
    </div>
  );
}
