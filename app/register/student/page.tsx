"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

function Field({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  optional = false,
}: {
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  optional?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center justify-between text-sm font-black text-amiko-ink">
        <span>{label}</span>
        {optional ? <span className="text-xs text-amiko-muted">Opcional</span> : null}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="focus-ring w-full rounded-md border border-amiko-blue bg-white px-4 py-3 text-base font-medium text-amiko-muted outline-none placeholder:text-slate-400"
      />
    </label>
  );
}

export default function StudentOnboardingPage() {
  const router = useRouter();
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [error, setError] = useState("");

  function handleSubmit() {
    if (!studentName.trim() || !birthDate.trim()) {
      setError("Agrega el nombre y la fecha de nacimiento para crear el perfil.");
      return;
    }

    setError("");
    router.push("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-start justify-center bg-white px-6 py-10 sm:items-center">
      <section className="w-full max-w-[390px]">
        <Link href="/register" className="text-sm font-black text-amiko-navy">
          Atrás
        </Link>

        <div className="mb-5 mt-5 flex justify-center">
          <Image
            src="/amiko-character/amiko-character-photo.svg"
            alt="Mascota de AMIKO saludando"
            width={104}
            height={104}
            className="object-contain"
            priority
          />
        </div>

        <h1 className="text-center text-3xl font-black leading-tight text-amiko-navy">
          ¿A quién apoyará Amiko?
        </h1>
        <p className="mt-2 text-center text-base font-bold leading-6 text-amiko-muted">
          Creemos un perfil simple para adaptar tareas con más cuidado.
        </p>

        <div className="mt-6 rounded-3xl border border-amiko-blue/15 bg-amiko-sky px-4 py-4">
          <p className="text-sm font-black text-amiko-navy">Paso 2 de 2</p>
          <p className="mt-1 text-sm font-bold leading-6 text-amiko-muted">
            No pedimos diagnóstico. Estos datos solo ayudan a organizar el apoyo
            pedagógico de la demo.
          </p>
        </div>

        <div className="mt-5 space-y-4">
          <Field
            label="Nombre del estudiante"
            placeholder="Ejemplo: Ángel"
            value={studentName}
            onChange={setStudentName}
          />
          <Field
            label="Correo de la persona que recibe apoyo"
            type="email"
            placeholder="correo@ejemplo.com"
            value={studentEmail}
            onChange={setStudentEmail}
            optional
          />
          <Field
            label="Fecha de nacimiento"
            type="date"
            placeholder="Fecha de nacimiento"
            value={birthDate}
            onChange={setBirthDate}
          />
        </div>

        {error ? (
          <p className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold leading-6 text-red-700">
            {error}
          </p>
        ) : null}

        <div className="mt-5 rounded-2xl border border-amiko-green/30 bg-amiko-mint px-4 py-3">
          <p className="text-sm font-black text-green-900">Permisos e invitaciones</p>
          <p className="mt-1 text-sm font-bold leading-6 text-green-900/75">
            Después podrás invitar cuidadores y decidir qué pueden ver desde
            Círculo de cuidado.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="focus-ring mt-5 flex min-h-14 w-full items-center justify-center rounded-full bg-amiko-blue px-6 text-lg font-black text-white shadow-card transition hover:bg-amiko-navy"
        >
          Crear perfil
        </button>
      </section>
    </main>
  );
}
