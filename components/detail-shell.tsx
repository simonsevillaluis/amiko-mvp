"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { AmikoIcon } from "@/components/amiko-icon";

export function DetailShell({
  title,
  children,
  backHref,
  fallbackHref = "/dashboard",
  rightAction,
}: {
  title: string;
  children: ReactNode;
  backHref?: string;
  fallbackHref?: string;
  rightAction?: ReactNode;
}) {
  const router = useRouter();

  function goBack() {
    if (backHref) {
      router.push(backHref);
      return;
    }

    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push(fallbackHref);
  }

  return (
    <main className="min-h-dvh bg-slate-100">
      <div className="mx-auto flex min-h-dvh max-w-[430px] flex-col bg-gradient-to-b from-white via-[#F5F8FB] to-[#F6FBEF] shadow-soft lg:max-w-5xl lg:px-8">
        <header className="sticky top-0 z-30 border-b border-blue-100 bg-white/95 px-4 py-3 backdrop-blur-xl lg:px-8">
          <div className="grid grid-cols-[40px_1fr_40px] items-center gap-3">
            <button
              type="button"
              onClick={goBack}
              aria-label="Volver"
              className="focus-ring flex h-10 w-10 items-center justify-center rounded-full text-amiko-navy transition hover:bg-amiko-sky"
            >
              <AmikoIcon name="back" className="h-6 w-6" />
            </button>
            <h1 className="text-center text-lg font-black text-amiko-navy">{title}</h1>
            <div className="flex justify-end">
              {rightAction ?? <span aria-hidden />}
            </div>
          </div>
        </header>

        <div className="flex-1 px-4 py-5 lg:px-8 lg:py-8">{children}</div>
      </div>
    </main>
  );
}
