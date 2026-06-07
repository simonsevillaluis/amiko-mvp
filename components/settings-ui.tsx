import Link from "next/link";
import type { ReactNode } from "react";
import { AmikoIcon, type AmikoIconName } from "@/components/amiko-icon";

export type SettingsRowProps = {
  title: string;
  description?: string;
  icon: AmikoIconName;
  iconTone?: string;
  href?: string;
  badge?: string;
  value?: string;
  disabled?: boolean;
};

export function SettingsSection({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <section className="mb-5">
      <p className="mb-2 px-1 text-[11px] font-black uppercase tracking-widest text-amiko-muted">
        {label}
      </p>
      {children}
    </section>
  );
}

export function SettingsCard({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card">
      {children}
    </div>
  );
}

export function SettingsRow({
  title,
  description,
  icon,
  iconTone = "bg-amiko-sky text-amiko-blue",
  href,
  badge,
  value,
  disabled = false,
}: SettingsRowProps) {
  const content = (
    <>
      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconTone}`}>
        <AmikoIcon name={icon} className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className={`block text-sm font-black ${disabled ? "text-slate-400" : "text-amiko-ink"}`}>
            {title}
          </span>
          {badge ? (
            <span className="rounded-full border border-amiko-green/40 px-2 py-0.5 text-[10px] font-black text-amiko-green">
              {badge}
            </span>
          ) : null}
        </span>
        {description ? (
          <span className={`mt-0.5 block text-xs font-bold leading-4 ${disabled ? "text-slate-400" : "text-amiko-muted"}`}>
            {description}
          </span>
        ) : null}
      </span>
      {value ? (
        <span className="shrink-0 text-sm font-black text-amiko-muted">{value}</span>
      ) : null}
      {href && !disabled ? (
        <AmikoIcon name="chevron" className="h-4 w-4 shrink-0 text-slate-300" />
      ) : null}
    </>
  );

  const className =
    "focus-ring flex w-full items-center gap-3 px-4 py-3.5 text-left transition";

  if (href && !disabled) {
    return (
      <Link href={href} className={`${className} hover:bg-slate-50`}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      disabled
      className={`${className} cursor-not-allowed bg-white opacity-75`}
      aria-disabled="true"
    >
      {content}
    </button>
  );
}

export function SettingsDivider() {
  return <div className="h-px bg-slate-100" />;
}

export function TrustNote({
  title,
  children,
  icon = "shield",
}: {
  title: string;
  children: ReactNode;
  icon?: AmikoIconName;
}) {
  return (
    <section className="mb-5 rounded-[24px] border border-blue-100 bg-gradient-to-br from-amiko-sky via-white to-amiko-mint p-4 shadow-card">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-amiko-blue shadow-sm">
          <AmikoIcon name={icon} className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-black leading-tight text-amiko-navy">{title}</h2>
          <div className="mt-1 text-sm font-bold leading-6 text-amiko-muted">{children}</div>
        </div>
      </div>
    </section>
  );
}

export function InfoList({
  items,
  tone = "blue",
}: {
  items: string[];
  tone?: "blue" | "green";
}) {
  const markerTone = tone === "green" ? "bg-amiko-green" : "bg-amiko-blue";

  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-2 text-sm font-bold leading-6 text-amiko-muted">
          <span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${markerTone}`} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
