"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type IconName = "home" | "chat" | "community" | "wellness" | "clock" | "bell";

const navItems: Array<{ href: string; label: string; icon: IconName }> = [
  { href: "/dashboard", label: "Home", icon: "home" },
  { href: "/adapt-task", label: "Chat IA", icon: "chat" },
  { href: "/comunidad", label: "Comunidad", icon: "community" },
  { href: "/bienestar", label: "Bienestar", icon: "wellness" },
];

function Icon({ name, className = "h-5 w-5" }: { name: IconName; className?: string }) {
  const common = {
    className,
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 2,
    viewBox: "0 0 24 24",
  };

  if (name === "home") {
    return (
      <svg {...common}>
        <path d="m3 11 9-7 9 7" />
        <path d="M5 10v10h14V10" />
        <path d="M9 20v-6h6v6" />
      </svg>
    );
  }

  if (name === "chat") {
    return (
      <svg {...common}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    );
  }

  if (name === "community") {
    return (
      <svg {...common}>
        <path d="M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3Z" />
        <path d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        <path d="M22 20c0-3.33-2.67-6-6-6h-1" />
        <path d="M2 20c0-3.33 2.67-6 6-6h4c3.33 0 6 2.67 6 6" />
      </svg>
    );
  }

  if (name === "wellness") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
        <circle cx="9" cy="10" r="0.5" fill="currentColor" />
        <circle cx="15" cy="10" r="0.5" fill="currentColor" />
      </svg>
    );
  }

  if (name === "clock") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v6l4 2" />
      </svg>
    );
  }

  // bell
  return (
    <svg {...common}>
      <path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </svg>
  );
}

function AmikoLogo() {
  return (
    <Link href="/dashboard" className="focus-ring rounded-lg px-1 text-3xl font-black tracking-tight">
      <span className="text-amiko-green">ami</span>
      <span className="text-amiko-navy">k</span>
      <span className="text-amiko-navy">o</span>
    </Link>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="app-screen min-h-screen">
      <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[411px] items-center justify-between gap-4 px-4 py-3 lg:max-w-7xl lg:px-8">
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-amiko-sky text-sm font-black text-amiko-blue">
            M
          </div>
          <AmikoLogo />
          <div className="flex items-center gap-1 text-amiko-ink">
            <Link
              href="/dashboard"
              className="focus-ring flex h-9 w-9 items-center justify-center rounded-full hover:bg-amiko-sky"
              aria-label="Ver actividad"
            >
              <Icon name="clock" className="h-5 w-5" />
            </Link>
            <Link
              href="/dashboard"
              className="focus-ring flex h-9 w-9 items-center justify-center rounded-full hover:bg-amiko-sky"
              aria-label="Notificaciones"
            >
              <Icon name="bell" className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[411px] px-4 py-5 lg:max-w-7xl lg:px-8 lg:py-8">
        {children}
      </main>

      {/* Bottom nav — mobile */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-100 bg-white/95 px-2 py-1 shadow-[0_-4px_16px_rgba(23,32,46,0.07)] backdrop-blur-xl lg:hidden">
        <div className="mx-auto grid max-w-[411px] grid-cols-4">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="focus-ring flex flex-col items-center gap-0.5 py-2"
              >
                <span
                  className={`flex items-center justify-center rounded-full px-3 py-1.5 transition ${
                    active ? "bg-amiko-mint" : ""
                  }`}
                >
                  <Icon
                    name={item.icon}
                    className={`h-5 w-5 transition ${active ? "text-amiko-green" : "text-amiko-muted"}`}
                  />
                </span>
                <span
                  className={`text-[10px] font-black transition ${
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
  );
}
