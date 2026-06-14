import { type ReactNode, type ButtonHTMLAttributes, type ElementType } from "react";
import Link from "next/link";

export type StudentButtonVariant = "primary" | "secondary" | "tertiary" | "amber" | "danger";

interface StudentButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: StudentButtonVariant;
  children: ReactNode;
  as?: "button" | "span" | "div";
  href?: string;
  className?: string;
  isGroupChild?: boolean;
}

export function getStudentButtonClasses(variant: StudentButtonVariant = "primary", isGroupChild = false) {
  // Si está dentro de un botón/tarjeta (group), usamos group-active para que se hunda cuando se hace clic en la tarjeta.
  // Además, los botones dentro de grupos suelen ser "badges" más pequeños, así que usamos 3px de relieve en vez de 4px.
  const depth = isGroupChild ? "3px" : "4px";
  
  const base = isGroupChild 
    ? `inline-flex items-center justify-center gap-1 rounded-xl font-black transition-all group-active:translate-y-[${depth}] group-active:shadow-none`
    : `focus-ring inline-flex items-center justify-center gap-2 rounded-[20px] font-black transition-all active:translate-y-[${depth}] active:shadow-none disabled:translate-y-0 disabled:shadow-none disabled:cursor-not-allowed`;

  const variants = {
    primary: `bg-amiko-green text-white shadow-[0_${depth}_0_#6FA327] hover:brightness-105 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-[0_${depth}_0_#cbd5e1]`,
    secondary: `bg-amiko-blue text-white shadow-[0_${depth}_0_#09367C] hover:brightness-105 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-[0_${depth}_0_#cbd5e1]`,
    tertiary: `bg-white text-amiko-ink border-2 border-slate-200 shadow-[0_${depth}_0_#e2e8f0] hover:bg-slate-50 disabled:bg-slate-50 disabled:text-slate-400 disabled:border-slate-100 disabled:shadow-[0_${depth}_0_#cbd5e1]`,
    amber: `bg-amber-50 text-amber-800 border-2 border-amber-200 shadow-[0_${depth}_0_#fde68a] hover:bg-amber-100 disabled:bg-slate-50 disabled:text-slate-400 disabled:border-slate-200 disabled:shadow-[0_${depth}_0_#cbd5e1]`,
    danger: `bg-amiko-coral text-white shadow-[0_${depth}_0_#CC6E61] hover:brightness-105 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-[0_${depth}_0_#cbd5e1]`,
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
