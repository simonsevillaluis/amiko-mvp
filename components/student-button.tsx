import { type ReactNode, type ButtonHTMLAttributes, type ElementType } from "react";
import Link from "next/link";

export type StudentButtonVariant = "primary" | "secondary" | "tertiary" | "amber" | "danger" | "success";

interface StudentButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: StudentButtonVariant;
  children: ReactNode;
  as?: "button" | "span" | "div";
  href?: string;
  className?: string;
  isGroupChild?: boolean;
}

export function getStudentButtonClasses(variant: StudentButtonVariant = "primary", isGroupChild = false) {
  const depth = isGroupChild ? "3px" : "4px";
  
  const base = isGroupChild 
    ? `inline-flex items-center justify-center gap-1 rounded-xl font-black transition-all group-active:translate-y-[${depth}] group-active:shadow-none disabled:translate-y-[${depth}] disabled:shadow-none disabled:bg-slate-200 disabled:text-slate-400`
    : `focus-ring inline-flex items-center justify-center gap-2 rounded-[20px] font-black transition-all active:translate-y-[${depth}] active:shadow-none disabled:translate-y-[${depth}] disabled:shadow-none disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:border-transparent`;

  const variants = {
    primary: `bg-amiko-green text-white shadow-[0_${depth}_0_#5D8B20] hover:brightness-105`,
    secondary: `bg-amiko-blue text-white shadow-[0_${depth}_0_#0F3876] hover:brightness-105`,
    tertiary: `bg-white text-amiko-ink border-2 border-slate-200 shadow-[0_${depth}_0_#cbd5e1] hover:bg-slate-50`,
    amber: `bg-amber-100 text-amber-900 border-2 border-amber-300 shadow-[0_${depth}_0_#fbbf24] hover:bg-amber-200`,
    danger: `bg-amiko-coral text-white shadow-[0_${depth}_0_#BA584C] hover:brightness-105`,
    success: `bg-emerald-400 text-emerald-950 shadow-[0_${depth}_0_#10B981] hover:brightness-105`,
  };

  return `${base} ${variants[variant]}`;
}

export function StudentButton({ 
  variant = "primary", 
  children, 
  as = "button", 
  href, 
  className = "", 
  isGroupChild = false,
  ...props 
}: StudentButtonProps) {
  const classes = `${getStudentButtonClasses(variant, isGroupChild)} ${className}`;

  if (href) {
    const linkProps = props as unknown as React.HTMLAttributes<HTMLAnchorElement>;
    return (
      <Link href={href} className={classes} {...linkProps}>
        {children}
      </Link>
    );
  }

  const Component = as as ElementType;

  if (as !== "button") {
     return <Component className={classes} {...props}>{children}</Component>;
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
