import type { ReactNode } from "react";

export const studentPhoneSurface =
  "relative min-h-dvh w-full overflow-hidden bg-gradient-to-b from-[#EAF0FD] via-white to-[#F0F8E8] text-amiko-ink sm:max-w-[430px] sm:shadow-[0_24px_80px_rgba(9,54,124,0.22)] sm:ring-1 sm:ring-white/70";

export const studentFixedSurface =
  "fixed inset-0 z-[60] flex flex-col overflow-hidden sm:left-1/2 sm:right-auto sm:w-full sm:max-w-[430px] sm:-translate-x-1/2 sm:shadow-[0_24px_80px_rgba(9,54,124,0.24)] sm:ring-1 sm:ring-white/70";

export const studentModalSurface =
  "fixed inset-0 z-[70] flex items-center justify-center bg-amiko-navy/55 px-4 backdrop-blur-sm sm:left-1/2 sm:right-auto sm:w-full sm:max-w-[430px] sm:-translate-x-1/2";

export function StudentPhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-[#DDE8F7] sm:flex sm:justify-center">
      <div className={studentPhoneSurface}>{children}</div>
    </div>
  );
}
