"use client";

import { useState } from "react";
import Image from "next/image";
import { AmikoIcon, type AmikoIconName } from "@/components/amiko-icon";

export function ComingSoonAction({
  title,
  description,
  icon,
  iconClassName = "bg-amiko-sky text-amiko-blue",
  className = "",
  children,
}: {
  title: string;
  description: string;
  icon: AmikoIconName;
  iconClassName?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={className}
      >
        {children}
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#161616]/80 px-5 py-8 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="coming-soon-title"
          onClick={() => setOpen(false)}
        >
          <section
            className="w-full max-w-[340px] rounded-[28px] bg-white p-5 text-center shadow-soft"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src="/amiko-character/amiko-character-main.svg"
              alt=""
              width={116}
              height={116}
              className="mx-auto object-contain"
              priority
            />
            <span className={`mx-auto mt-3 flex h-12 w-12 items-center justify-center rounded-2xl ${iconClassName}`}>
              <AmikoIcon name={icon} className="h-6 w-6" />
            </span>
            <p className="mt-4 text-xs font-black uppercase tracking-[0.16em] text-amiko-green">
              Proximamente
            </p>
            <h2 id="coming-soon-title" className="mt-1 text-2xl font-black text-amiko-ink">
              {title}
            </h2>
            <p className="mt-3 text-sm font-bold leading-6 text-amiko-muted">
              {description}
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="focus-ring mt-5 min-h-12 w-full rounded-full bg-amiko-green px-6 text-sm font-black text-white shadow-card transition hover:brightness-95"
            >
              Entendido
            </button>
          </section>
        </div>
      ) : null}
    </>
  );
}
