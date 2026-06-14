import type { Metadata, Viewport } from "next";
import Image from "next/image";
import Link from "next/link";
import { AmikoIcon } from "@/components/amiko-icon";

// ─── SEO ──────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "AMIKO — Apoyo pedagógico con IA para niños con TEA",
  description:
    "Convierte tareas escolares en pasos simples y visuales. Gratis para familias que acompañan a niños con Trastorno del Espectro Autista.",
  keywords: ["TEA", "autismo", "tareas escolares", "pedagogía inclusiva", "apoyo familiar"],
  openGraph: {
    title: "AMIKO — Apoyo pedagógico con IA para niños con TEA",
    description:
      "Convierte tareas escolares en pasos simples y visuales. Gratis para familias que acompañan a niños con Trastorno del Espectro Autista.",
    url: "https://amikoapp.vercel.app", // FIX #8: URL corregida
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AMIKO — Apoyo pedagógico con IA para niños con TEA",
    description:
      "Convierte tareas escolares en pasos simples y visuales. Gratis para familias que acompañan a niños con Trastorno del Espectro Autista.",
  },
  robots: { index: true, follow: true },
};

// FIX #9: viewport separado del objeto metadata (Next.js 14 App Router)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#8EC733",
};

// ─── NAV ──────────────────────────────────────────────────────────────────────

function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link href="/landing" aria-label="Inicio AMIKO">
          <Image
            src="/amiko-character/amiko-icon.svg"
            alt="AMIKO"
            width={40}
            height={40}
            priority // FIX #10: above-the-fold → priority
            className="object-contain"
          />
        </Link>

        {/*
          FIX #3 + #5: Hamburger CSS-only con HTML válido.
          Estructura: input (sr-only) → label → nav como hermanos dentro de un div.
          <nav> ya NO está dentro de <label> (era inválido per spec).
          El truco peer de Tailwind requiere que el input preceda al nav como sibling → ✓
        */}
        <div className="relative lg:hidden">
          <input
            id="nav-toggle"
            type="checkbox"
            className="sr-only peer" // sr-only: visible al a11y tree, oculto visualmente
          />
          <label
            htmlFor="nav-toggle"
            aria-label="Abrir menú de navegación"
            className="flex cursor-pointer items-center justify-center p-2"
          >
            <svg
              className="h-7 w-7 text-amiko-navy"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </label>
          {/* peer-checked:flex activa cuando input:checked — sibling via CSS ~ selector */}
          <nav
            role="navigation"
            aria-label="Navegación móvil"
            className="absolute right-0 top-full hidden w-56 flex-col gap-1 rounded-2xl border border-slate-100 bg-white p-3 shadow-xl peer-checked:flex"
          >
            <Link href="#como-funciona" className="rounded-xl px-4 py-2.5 text-base font-bold text-amiko-navy hover:bg-amiko-sky">
              Cómo funciona
            </Link>
            <Link href="#demo" className="rounded-xl px-4 py-2.5 text-base font-bold text-amiko-navy hover:bg-amiko-sky">
              Demo
            </Link>
            <Link href="#familias" className="rounded-xl px-4 py-2.5 text-base font-bold text-amiko-navy hover:bg-amiko-sky">
              Para familias
            </Link>
            <hr className="my-1 border-slate-100" />
            <Link
              href="/login"
              className="rounded-full border-2 border-amiko-green px-4 py-2 text-center text-sm font-black text-amiko-green hover:bg-amiko-mint"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-amiko-green px-4 py-2 text-center text-sm font-black text-white hover:opacity-90"
            >
              Empezar gratis
            </Link>
          </nav>
        </div>

        {/* Desktop Nav */}
        <nav
          className="hidden lg:flex lg:items-center lg:gap-8"
          role="navigation"
          aria-label="Navegación principal"
        >
          <Link href="#como-funciona" className="text-base font-bold text-amiko-navy hover:text-amiko-blue">
            Cómo funciona
          </Link>
          <Link href="#demo" className="text-base font-bold text-amiko-navy hover:text-amiko-blue">
            Demo
          </Link>
          <Link href="#familias" className="text-base font-bold text-amiko-navy hover:text-amiko-blue">
            Para familias
          </Link>
        </nav>

        <div className="hidden lg:flex lg:items-center lg:gap-4">
          <Link
            href="/login"
            className="rounded-full border-2 border-amiko-green px-6 py-2.5 font-black text-amiko-green transition hover:bg-amiko-mint"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-amiko-green px-6 py-2.5 font-black text-white shadow-sm transition hover:opacity-90"
          >
            Empezar gratis
          </Link>
        </div>
      </div>
    </header>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-amiko-sky/30 to-amiko-sky/10 py-16 lg:py-24">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-12 px-6 lg:flex-row lg:items-start lg:justify-between">

        <div className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left">
          <span className="mb-6 inline-block rounded-full bg-amiko-blue/10 px-4 py-1.5 text-[11px] font-black uppercase tracking-widest text-amiko-blue">
            Para familias con niños con TEA · Gratis
          </span>
          <h1 className="mb-6 text-4xl font-black leading-snug text-amiko-navy md:text-5xl lg:text-[64px]">
            Las tareas escolares, explicadas de una forma que tu hijo entiende
          </h1>
          <p className="mb-8 max-w-xl text-lg font-semibold leading-relaxed text-amiko-muted">
            AMIKO usa inteligencia artificial para convertir cualquier tarea escolar en pasos simples,
            visuales y adaptados. Pensado para familias que acompañan a niños y niñas con Trastorno
            del Espectro Autista.
          </p>
          <div className="flex w-full flex-col items-center gap-6 sm:flex-row lg:justify-start">
            {/*
              FIX #2: /register es correcto para usuarios no autenticados.
              Si el test se hace con sesión activa, el middleware redirige a /inicio
              — eso es comportamiento esperado del MVP, no un bug de la landing.
            */}
            <Link
              href="/register"
              className="flex w-full min-h-14 items-center justify-center rounded-full bg-amiko-green px-8 text-lg font-black text-white shadow-card transition hover:-translate-y-1 hover:opacity-90 sm:w-auto"
            >
              Crear cuenta gratis →
            </Link>
            <Link
              href="/demo/student-portal"
              target="_blank"
              rel="noopener noreferrer"
              className="text-base font-bold text-amiko-blue underline hover:text-amiko-navy"
            >
              o explorar la demo sin registro →
            </Link>
          </div>
        </div>

        <div className="w-full max-w-[380px] lg:w-1/2">
          {/* FIX #1: "brain" no existe en AmikoIconName → reemplazado por "sparkles" */}
          <div className="flex aspect-[4/5] w-full flex-col items-center justify-center rounded-3xl bg-gradient-to-br from-amiko-sky to-amiko-mint shadow-soft">
            <AmikoIcon name="sparkles" className="mb-4 h-20 w-20 text-amiko-green" />
            <p className="text-lg font-black text-amiko-navy">Demo interactiva próximamente</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── TRUST BAR ────────────────────────────────────────────────────────────────

function TrustBar() {
  const items = [
    "Diseñado para TEA",
    "Sin diagnóstico requerido",
    "Gratis para empezar",
    "Datos del estudiante protegidos",
  ];

  return (
    <section className="bg-amiko-navy py-8">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-6 px-6 sm:gap-10">
        {items.map((item) => (
          <div key={item} className="flex items-center gap-2">
            {/* FIX #6: aria-hidden en SVG decorativo */}
            <svg
              className="h-5 w-5 flex-shrink-0 text-amiko-green"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-bold text-white sm:text-base">{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── FEATURES ─────────────────────────────────────────────────────────────────

type BulletColor = "green" | "blue" | "navy";

function BulletList({ items, color }: { items: string[]; color: BulletColor }) {
  const ringClass: Record<BulletColor, string> = {
    green: "bg-amiko-mint",
    blue:  "bg-amiko-sky",
    navy:  "bg-slate-200",
  };
  const iconClass: Record<BulletColor, string> = {
    green: "text-amiko-green",
    blue:  "text-amiko-blue",
    navy:  "text-amiko-navy",
  };

  return (
    <ul className="space-y-4">
      {items.map((bullet) => (
        <li key={bullet} className="flex items-center gap-3">
          <div
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${ringClass[color]}`}
            aria-hidden="true"
          >
            {/* FIX #6: aria-hidden en todos los SVGs decorativos de bullets */}
            <svg
              className={`h-4 w-4 ${iconClass[color]}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-base font-bold text-amiko-ink">{bullet}</span>
        </li>
      ))}
    </ul>
  );
}

function Features() {
  return (
    <section id="familias" className="py-20 lg:py-32">
      <div className="mx-auto max-w-6xl px-6">

        {/* Bloque 1 — Adaptación con IA */}
        <div className="mb-24 flex flex-col items-center gap-12 lg:flex-row lg:justify-between">
          <div className="flex-1 lg:pr-12">
            <span className="mb-4 inline-block text-[11px] font-black uppercase tracking-widest text-amiko-green">
              Adaptación con IA
            </span>
            <h2 className="mb-6 text-3xl font-black leading-tight text-amiko-navy sm:text-4xl lg:text-[40px]">
              De una consigna difícil a 5 pasos que tienen sentido
            </h2>
            <p className="mb-8 text-lg font-semibold leading-relaxed text-amiko-muted">
              Escribe o pega la tarea escolar. AMIKO la analiza y la transforma en instrucciones claras,
              con apoyos visuales concretos para cada paso. Sin pasos innecesarios. Sin lenguaje técnico.
            </p>
            <BulletList
              color="green"
              items={["Pasos numerados y breves", "Apoyo visual sugerido para cada paso", "Indicación para el adulto que acompaña"]}
            />
          </div>
          <div className="w-full max-w-md lg:w-1/2">
            <div className="flex aspect-square w-full flex-col justify-center rounded-3xl border border-slate-100 bg-white p-8 shadow-soft">
              <div className="mb-4 h-4 w-1/3 rounded-full bg-amiko-sky" />
              <div className="mb-6 h-4 w-2/3 rounded-full bg-amiko-sky" />
              <div className="flex items-start gap-4 rounded-2xl bg-amiko-mint/50 p-4">
                <div className="h-10 w-10 shrink-0 rounded-full bg-amiko-green/20" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-full rounded-full bg-amiko-green/40" />
                  <div className="h-3 w-4/5 rounded-full bg-amiko-green/40" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bloque 2 — Modo estudiante */}
        <div className="mb-24 flex flex-col-reverse items-center gap-12 lg:flex-row lg:justify-between">
          <div className="w-full max-w-md lg:w-1/2">
            <div
              className="flex aspect-[9/16] w-full flex-col items-center justify-between rounded-[40px] border-[8px] border-slate-100 bg-amiko-navy p-6 shadow-soft"
              aria-hidden="true"
            >
              <div className="h-8 w-24 rounded-full bg-slate-800" />
              <div className="flex flex-col items-center gap-4">
                <div className="h-32 w-32 rounded-full bg-amiko-sky/10" />
                <div className="h-4 w-48 rounded-full bg-white/20" />
              </div>
              <div className="h-16 w-full rounded-2xl bg-amiko-green" />
            </div>
          </div>
          <div className="flex-1 lg:pl-12">
            <span className="mb-4 inline-block text-[11px] font-black uppercase tracking-widest text-amiko-blue">
              Modo estudiante
            </span>
            <h2 className="mb-6 text-3xl font-black leading-tight text-amiko-navy sm:text-4xl lg:text-[40px]">
              Tu hijo avanza solo, un paso a la vez
            </h2>
            <p className="mb-8 text-lg font-semibold leading-relaxed text-amiko-muted">
              Una pantalla simple. Un botón grande. Una sola instrucción a la vez.
              El estudiante elige: Lo hice, Necesito ayuda o Me frustré. Sin ruido. Sin sobrecarga.
            </p>
            <BulletList
              color="blue"
              items={["Diseño de alto contraste y bajo estímulo", "Progreso registrado automáticamente", "El adulto ve todo desde su panel"]}
            />
          </div>
        </div>

        {/* Bloque 3 — Acompañamiento adulto */}
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:justify-between">
          <div className="flex-1 lg:pr-12">
            <span className="mb-4 inline-block text-[11px] font-black uppercase tracking-widest text-amiko-navy">
              Acompañamiento adulto
            </span>
            <h2 className="mb-6 text-3xl font-black leading-tight text-amiko-navy sm:text-4xl lg:text-[40px]">
              Sabe exactamente qué decir cuando se traba
            </h2>
            <p className="mb-8 text-lg font-semibold leading-relaxed text-amiko-muted">
              AMIKO no solo adapta la tarea. Te dice cómo acompañar cada momento: qué palabras usar,
              cuándo proponer una pausa y cómo retomar con calma.
            </p>
            <BulletList
              color="navy"
              items={["Chat pedagógico en tiempo real", "Sugerencias de regulación emocional", "Sin reemplazar a profesionales de salud"]}
            />
          </div>
          <div className="w-full max-w-md lg:w-1/2">
            <div className="flex aspect-square w-full flex-col justify-end rounded-3xl border border-slate-100 bg-slate-50 p-6 shadow-soft">
              <div className="mb-4 w-3/4 self-end rounded-2xl rounded-tr-none bg-amiko-blue p-4 text-sm font-bold text-white shadow-sm">
                ¿Cómo le explico que se equivocó sin frustrarlo?
              </div>
              <div className="w-4/5 self-start rounded-2xl rounded-tl-none border border-slate-100 bg-white p-4 text-sm font-semibold text-amiko-ink shadow-sm">
                Dile: &quot;¡Casi lo logras! Vamos a ver juntos esta parte otra vez.&quot;
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

// ─── DEMO ─────────────────────────────────────────────────────────────────────

function Demo() {
  return (
    <section id="demo" className="bg-amiko-sky py-20 lg:py-32">
      <div className="mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
        <h2 className="mb-4 text-3xl font-black text-amiko-navy sm:text-4xl lg:text-[40px]">
          Míralo tú mismo — sin registro
        </h2>
        <p className="mb-12 text-lg font-semibold text-amiko-muted">
          La demo es pública y está lista. Entra y explora el modo estudiante.
        </p>

        <div className="relative aspect-square w-full max-w-[430px] overflow-hidden rounded-3xl bg-white shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-amiko-sky to-amiko-mint opacity-50" aria-hidden="true" />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/40 p-8 backdrop-blur-[2px]">
            <Link
              href="/demo/student-portal"
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring flex min-h-16 items-center justify-center rounded-full bg-amiko-green px-8 text-xl font-black text-white shadow-card transition hover:scale-105 hover:opacity-90"
            >
              Abrir demo en vivo →
            </Link>
          </div>
        </div>

        <p className="mt-6 text-sm font-bold text-amiko-muted">
          Sin datos personales. Sin cookies de seguimiento en la demo.
        </p>
      </div>
    </section>
  );
}

// ─── HOW IT WORKS ─────────────────────────────────────────────────────────────

function HowItWorks() {
  const steps = [
    {
      number: "01",
      // FIX #4: text-amiko-blue sobre blanco = ~5.8:1 ✓ WCAG AA
      numberClass: "text-amiko-blue",
      title: "Ingresa la tarea",
      description: "Escribe o pega la consigna escolar. Lleva menos de un minuto.",
    },
    {
      number: "02",
      // FIX #4: text-amiko-navy sobre blanco = ~12:1 ✓ WCAG AA
      numberClass: "text-amiko-navy",
      title: "AMIKO la adapta",
      description: "La IA genera pasos claros, apoyos visuales y guía para el adulto.",
    },
    {
      number: "03",
      // FIX #4: text-green-700 sobre blanco = ~5.1:1 ✓ WCAG AA
      numberClass: "text-green-700",
      title: "Tu hijo la entiende",
      description: "El estudiante avanza paso a paso, con calma y a su ritmo.",
    },
  ] as const;

  return (
    <section id="como-funciona" className="bg-white py-20 lg:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="mb-16 text-center text-3xl font-black text-amiko-navy sm:text-4xl lg:text-[40px]">
          Así funciona AMIKO
        </h2>
        <div className="flex flex-col gap-8 md:flex-row md:items-stretch">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative flex flex-1 flex-col rounded-2xl border border-slate-100 bg-white p-8 shadow-card"
            >
              <span className={`mb-4 text-4xl font-black ${step.numberClass}`}>{step.number}</span>
              <h3 className="mb-3 text-xl font-black text-amiko-navy">{step.title}</h3>
              <p className="text-base font-semibold leading-relaxed text-amiko-muted">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── ROADMAP ──────────────────────────────────────────────────────────────────

function Roadmap() {
  const items = [
    {
      dot: "bg-amiko-green",
      badge: "bg-amiko-mint text-green-800",
      label: "Disponible ahora",
      text: "MVP adultos — Adaptar tareas con IA",
    },
    {
      dot: "bg-amiko-blue",
      badge: "bg-amiko-sky text-blue-800",
      label: "En desarrollo",
      text: "Modo estudiante completo — paso a paso interactivo",
    },
    {
      dot: "bg-slate-300",
      badge: "bg-slate-200 text-slate-700",
      label: "Próximamente",
      text: "Red de apoyo — comparte con docentes y familiares",
    },
    {
      dot: "bg-slate-300",
      badge: "bg-slate-200 text-slate-700",
      label: "2027",
      text: "Panel institucional para colegios",
    },
  ] as const;

  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto max-w-4xl px-6">
        <div className="mb-10">
          <span className="mb-2 inline-block text-[11px] font-black uppercase tracking-widest text-amiko-muted">
            Hoja de ruta
          </span>
          <h2 className="text-2xl font-black text-amiko-navy sm:text-3xl">Esto es solo el comienzo</h2>
          <p className="mt-2 text-sm font-semibold text-slate-500">
            Mapa orientativo de desarrollo — actualizado con las familias.
          </p>
        </div>

        <ol className="space-y-6 border-l-2 border-slate-200 pl-6">
          {items.map((item) => (
            <li key={item.label} className="relative">
              <div
                className={`absolute -left-[31px] top-1 h-3 w-3 rounded-full ring-4 ring-white ${item.dot}`}
                aria-hidden="true"
              />
              <span className={`mb-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-black ${item.badge}`}>
                {item.label}
              </span>
              <p className="text-base font-bold text-amiko-ink">{item.text}</p>
            </li>
          ))}
        </ol>

        <p className="mt-8 text-xs font-bold text-slate-400">
          Hoja de ruta orientativa, sujeta a validación con familias reales.
        </p>
      </div>
    </section>
  );
}

// ─── FINAL CTA ────────────────────────────────────────────────────────────────

function FinalCta() {
  return (
    <section className="bg-gradient-to-r from-amiko-green to-amiko-blue py-20 lg:py-32">
      <div className="mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
        <h2 className="mb-4 text-3xl font-black leading-tight text-white sm:text-4xl lg:text-[48px]">
          Tu hijo puede entender mejor. Empezamos hoy.
        </h2>
        <p className="mb-10 text-xl font-semibold text-white/80">
          AMIKO es gratuito para empezar. Sin tarjeta de crédito.
        </p>
        <Link
          href="/register"
          className="focus-ring mb-6 flex min-h-16 items-center justify-center rounded-full bg-white px-10 text-xl font-black text-amiko-navy shadow-xl transition hover:-translate-y-1 hover:bg-slate-50"
        >
          Crear cuenta gratis
        </Link>
        {/* FIX #11: target="_blank" para no sacar al usuario de la landing */}
        <Link
          href="/demo/student-portal"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-bold text-white underline hover:text-white/80"
        >
          ¿Prefieres explorar primero? Ver demo →
        </Link>
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-amiko-navy py-12 text-white">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">

          {/* Marca */}
          <div className="max-w-xs">
            <div className="mb-4 flex items-center gap-3">
              {/* alt="" porque "AMIKO" en texto inmediatamente después es la etiqueta */}
              <Image
                src="/amiko-character/amiko-icon.svg"
                alt=""
                width={32}
                height={32}
                className="brightness-0 invert"
              />
              <span className="text-xl font-black tracking-tight">AMIKO</span>
            </div>
            <p className="mb-4 text-sm font-bold text-white/70">
              Apoyo pedagógico para familias con TEA.
            </p>
            <p className="text-xs font-semibold text-white/50">
              AMIKO no sustituye a psicólogos, terapeutas ni docentes.
            </p>
          </div>

          {/* Navegación */}
          <nav aria-label="Navegación del pie de página">
            <h4 className="mb-3 text-sm font-black uppercase tracking-wider text-white">Navegación</h4>
            <ul className="flex flex-col gap-3">
              <li><Link href="/" className="text-sm font-bold text-white/70 hover:text-white">Inicio</Link></li>
              <li><Link href="#demo" className="text-sm font-bold text-white/70 hover:text-white">Demo</Link></li>
              <li><Link href="#como-funciona" className="text-sm font-bold text-white/70 hover:text-white">Cómo funciona</Link></li>
              <li><Link href="#familias" className="text-sm font-bold text-white/70 hover:text-white">Para familias</Link></li>
            </ul>
          </nav>

          {/* App */}
          <nav aria-label="Acceso a la aplicación">
            <h4 className="mb-3 text-sm font-black uppercase tracking-wider text-white">Aplicación</h4>
            <ul className="flex flex-col gap-3">
              <li><Link href="/login" className="text-sm font-bold text-white/70 hover:text-white">Iniciar sesión</Link></li>
              <li><Link href="/register" className="text-sm font-bold text-white/70 hover:text-white">Crear cuenta</Link></li>
            </ul>
          </nav>

          {/* Legal — FIX #7: texto plano con etiqueta honesta, sin <span> falso interactivo */}
          <div>
            <h4 className="mb-3 text-sm font-black uppercase tracking-wider text-white">Legal</h4>
            <ul className="flex flex-col gap-3">
              <li>
                <span className="text-sm font-bold text-white/40">
                  Contacto <span className="text-[10px] font-semibold">(próximamente)</span>
                </span>
              </li>
              <li>
                <span className="text-sm font-bold text-white/40">
                  Privacidad <span className="text-[10px] font-semibold">(próximamente)</span>
                </span>
              </li>
              <li>
                <span className="text-sm font-bold text-white/40">
                  Términos de uso <span className="text-[10px] font-semibold">(próximamente)</span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center sm:text-left">
          <p className="text-xs font-bold text-white/50">© 2026 AMIKO. Hecho con cuidado.</p>
        </div>
      </div>
    </footer>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Nav />
      <main>
        <Hero />
        <TrustBar />
        <Features />
        <Demo />
        <HowItWorks />
        <Roadmap />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
