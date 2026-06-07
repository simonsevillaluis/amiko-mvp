"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import { childStudent } from "@/lib/child-mock-data";

type ChildNavItem = {
  href: string;
  label: string;
  icon: string;
};

const childNavItems: ChildNavItem[] = [
  { href: "/child-portal", label: "Inicio", icon: "home" },
  { href: "/child-portal/amiko", label: "Amiko", icon: "chat" },
  { href: "/child-portal/recursos", label: "Recursos", icon: "puzzle" },
  { href: "/child-portal/mi-red", label: "Mi Red", icon: "hands" },
];

function ChildNavIcon({
  name,
  active,
}: {
  name: string;
  active: boolean;
}) {
  const color = active ? "#8EC733" : "#94A3B8";
  const strokeWidth = active ? 2.5 : 2;

  const props = {
    className: "h-7 w-7",
    fill: "none",
    stroke: color,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth,
    viewBox: "0 0 24 24",
  };

  if (name === "home") {
    return (
      <svg {...props}>
        <path d="m3 11 9-7 9 7" />
        <path d="M5 10v10h14V10" />
        <path d="M9 20v-6h6v6" />
      </svg>
    );
  }

  if (name === "chat") {
    return (
      <svg {...props}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    );
  }

  if (name === "puzzle") {
    return (
      <svg {...props}>
        <path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.968-.925a2.501 2.501 0 1 0-3.214 3.214c.446.166.855.497.925.968a.979.979 0 0 1-.276.837l-1.61 1.61a2.404 2.404 0 0 1-1.705.707 2.402 2.402 0 0 1-1.704-.706l-1.568-1.568a1.026 1.026 0 0 0-.877-.29c-.493.074-.84.504-1.02.968a2.5 2.5 0 1 1-3.237-3.237c.464-.18.894-.527.967-1.02a1.026 1.026 0 0 0-.289-.877l-1.568-1.568A2.402 2.402 0 0 1 1.998 12c0-.617.236-1.234.706-1.704L4.23 8.77c.24-.24.581-.353.917-.303.515.077.877.528 1.073 1.01a2.5 2.5 0 1 0 3.259-3.259c-.482-.196-.933-.558-1.01-1.073-.05-.336.062-.676.303-.917l1.525-1.525A2.402 2.402 0 0 1 12 2c.617 0 1.234.236 1.704.706l1.568 1.568c.23.23.556.338.877.29.493-.074.84-.504 1.02-.968a2.5 2.5 0 1 1 3.237 3.237c-.464.18-.894.527-.967 1.02Z" />
      </svg>
    );
  }

  // hands
  return (
    <svg {...props}>
      <path d="M11 14h2" />
      <path d="M16 6h3a2 2 0 0 1 2 2v1" />
      <path d="M5 6H2a2 2 0 0 0-2 2v1" />
      <circle cx="12" cy="4" r="3" />
      <path d="M22 20c0-3.33-2.67-6-6-6h-4c-3.33 0-6 2.67-6 6" />
      <circle cx="5" cy="11" r="2" />
      <circle cx="19" cy="11" r="2" />
      <path d="M-1 20c0-2.21 1.79-4 4-4h2" />
      <path d="M25 20c0-2.21-1.79-4-4-4h-2" />
    </svg>
  );
}

export function ChildShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hasDemoParam = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener("popstate", onStoreChange);
      return () => window.removeEventListener("popstate", onStoreChange);
    },
    () => new URLSearchParams(window.location.search).get("demo") === "1",
    () => false,
  );
  const isDevelopmentPreview = process.env.NODE_ENV === "development" && hasDemoParam;
  const withPreviewParam = (href: string) => (
    isDevelopmentPreview ? `${href}?demo=1` : href
  );

  return (
    <div className="child-portal min-h-screen bg-gradient-to-b from-[#EAF0FD] via-white to-[#F0F8E8]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-100/60 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[430px] items-center justify-between px-5 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amiko-mint text-xl">
              {childStudent.avatar}
            </div>
            <span className="text-sm font-black text-amiko-ink">
              {childStudent.name}
            </span>
          </div>
          <Link
            href={withPreviewParam("/child-portal")}
            className="rounded-lg px-1 text-2xl font-black tracking-tight"
          >
            <span className="text-amiko-green">ami</span>
            <span className="text-amiko-navy">ko</span>
          </Link>
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full text-lg hover:bg-amiko-sky"
              aria-label="Notificaciones"
            >
              🔔
            </button>
            <Link
              href={withPreviewParam("/child-portal")}
              className="flex h-9 w-9 items-center justify-center rounded-full text-lg hover:bg-amiko-sky"
              aria-label="Ajustes"
            >
              ⚙️
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-[430px] px-5 py-5 pb-28">
        {children}
      </main>

      {/* Bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-100 bg-white/95 px-2 py-1 shadow-[0_-4px_16px_rgba(23,32,46,0.07)] backdrop-blur-xl">
        <div className="mx-auto grid max-w-[430px] grid-cols-4">
          {childNavItems.map((item) => {
            const active =
              item.href === "/child-portal"
                ? pathname === "/child-portal"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={withPreviewParam(item.href)}
                className="flex flex-col items-center gap-1 py-2"
                aria-current={active ? "page" : undefined}
              >
                <span
                  className={`flex items-center justify-center rounded-full px-4 py-1.5 transition ${
                    active ? "bg-amiko-mint" : ""
                  }`}
                >
                  <ChildNavIcon name={item.icon} active={active} />
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
