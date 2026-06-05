import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6 py-12">
      <section className="w-full max-w-[390px] text-center">
        <div className="flex justify-center">
          <Image
            src="/amiko-character/amiko-character-main.svg"
            alt="AMIKO confundido"
            width={150}
            height={150}
            className="object-contain"
            priority
          />
        </div>
        <p className="mt-6 text-sm font-black uppercase tracking-[0.18em] text-amiko-green">
          Error 404
        </p>
        <h1 className="mt-2 text-3xl font-black leading-tight text-amiko-navy">
          No encontramos esta pantalla
        </h1>
        <p className="mt-3 text-base font-bold leading-7 text-amiko-muted">
          Volvamos a un lugar seguro para continuar adaptando tareas paso a paso.
        </p>
        <Link
          href="/dashboard"
          className="focus-ring mt-6 flex min-h-14 w-full items-center justify-center rounded-full bg-amiko-blue px-6 text-lg font-black text-white shadow-card transition hover:bg-amiko-navy"
        >
          Volver al inicio
        </Link>
      </section>
    </main>
  );
}
