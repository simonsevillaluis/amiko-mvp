import Image from "next/image";
import Link from "next/link";

export default function ProfessionalsComingSoonPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#343434] px-6 py-10 text-white">
      <section className="w-full max-w-[390px] text-center">
        <div className="flex justify-center">
          <Image
            src="/amiko-character/amiko-character-main.svg"
            alt="Amiko pensando"
            width={172}
            height={172}
            className="object-contain"
            priority
          />
        </div>
        <p className="mt-7 text-sm font-black uppercase tracking-[0.18em] text-amiko-green">
          Próximamente
        </p>
        <h1 className="mt-2 text-3xl font-black leading-tight">
          Profesionales en desarrollo
        </h1>
        <p className="mt-4 text-base font-bold leading-7 text-slate-100">
          Esta función estará disponible más adelante. Queremos diseñarla con cuidado para que aporte apoyo real,
          privacidad y confianza a las familias.
        </p>
        <Link
          href="/comunidad"
          className="focus-ring mt-8 inline-flex min-h-14 items-center justify-center rounded-full bg-amiko-green px-8 text-lg font-black text-white shadow-card transition hover:brightness-95"
        >
          Volver a Comunidad
        </Link>
      </section>
    </main>
  );
}
