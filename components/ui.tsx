import Link from "next/link";
import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-5 lg:mb-8 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl">
        {eyebrow ? (
          <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-amiko-green">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-3xl font-black tracking-tight text-amiko-ink md:text-4xl">
          {title}
        </h1>
        <p className="mt-3 text-base leading-7 text-amiko-muted md:text-lg md:leading-8">{description}</p>
      </div>
      {action}
    </div>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-xl border border-white/80 bg-white p-5 shadow-card ${className}`}>
      {children}
    </section>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "quiet";
}) {
  const styles = {
    primary: "bg-amiko-navy text-white shadow-card hover:bg-blue-900",
    secondary: "bg-amiko-green text-white shadow-card hover:brightness-95",
    quiet: "border border-slate-200 bg-white text-amiko-ink hover:bg-amiko-sky",
  };

  return (
    <Link
      href={href}
      className={`focus-ring inline-flex min-h-12 items-center justify-center rounded-full px-6 py-3 text-base font-black transition ${styles[variant]}`}
    >
      {children}
    </Link>
  );
}

export function StatusPill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex rounded-full bg-amiko-sky px-3 py-1 text-sm font-black text-amiko-navy">
      {children}
    </span>
  );
}

export function FieldLabel({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) {
  return (
    <label className="text-sm font-black text-amiko-ink" htmlFor={htmlFor}>
      {children}
    </label>
  );
}

export function DemoNotice() {
  return (
    <section className="mb-6 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-950">
      <strong>Demo para validación:</strong> los datos son de ejemplo. La integración con
      autenticación, Supabase y OpenAI se conectará después de validar el flujo principal.
    </section>
  );
}
