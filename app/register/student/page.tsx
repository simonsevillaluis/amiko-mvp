"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { AmikoIcon } from "@/components/amiko-icon";
import { createStudent } from "@/app/actions/create-student";

type EducationLevel = "primaria" | "secundaria";

const gradeOptions: Record<EducationLevel, string[]> = {
  primaria: ["1er grado", "2do grado", "3er grado", "4to grado", "5to grado", "6to grado"],
  secundaria: ["1er año", "2do año", "3er año", "4to año", "5to año"],
};

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
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  optional?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center justify-between text-sm font-black text-amiko-ink">
        <span>{label}</span>
        {optional ? <span className="text-xs font-bold text-amiko-muted">Opcional</span> : null}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="focus-ring w-full rounded-2xl border border-blue-100 bg-white px-4 py-3 text-base font-bold text-amiko-ink outline-none placeholder:text-slate-400"
      />
    </label>
  );
}

function calcAge(birthDate: string): number {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export default function StudentOnboardingPage() {
  const router = useRouter();
  const [studentName, setStudentName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [educationLevel, setEducationLevel] = useState<EducationLevel | "">("");
  const [gradeYear, setGradeYear] = useState("");
  const [supportLevel, setSupportLevel] = useState("medio");
  const [visualPreferences, setVisualPreferences] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const today = new Date();
  const maxStudentDate = new Date(today.getFullYear() - 4, today.getMonth(), today.getDate())
    .toISOString()
    .split("T")[0];
  const minStudentDate = new Date(today.getFullYear() - 25, today.getMonth(), today.getDate())
    .toISOString()
    .split("T")[0];

  // Validación dinámica del formulario
  const isFormValid = useMemo(() => {
    const nameRegex = /^[\p{L}\s''.\-]{2,}$/u;

    // Validar campo de nombre
    if (!studentName.trim() || !nameRegex.test(studentName.trim())) {
      return false;
    }

    // Validar fecha de nacimiento y edad
    if (!birthDate) {
      return false;
    }
    const studentAge = calcAge(birthDate);
    if (studentAge < 4 || studentAge > 25) {
      return false;
    }

    // Validar nivel educativo y grado
    if (!educationLevel || !gradeYear) {
      return false;
    }

    // Validar correo si está completo
    if (studentEmail.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(studentEmail.trim())) {
        return false;
      }
    }

    return true;
  }, [studentName, birthDate, educationLevel, gradeYear, studentEmail]);

  async function handleSubmit() {
    // La validación ya está hecha en isFormValid, pero hacemos verificaciones extra por seguridad
    const nameRegex = /^[\p{L}\s''.\-]{2,}$/u;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!studentName.trim() || !birthDate || !educationLevel || !gradeYear) {
      setError("Agrega nombre, fecha de nacimiento y grado escolar para crear el perfil.");
      return;
    }

    if (!nameRegex.test(studentName.trim())) {
      setError("El nombre solo puede tener letras, espacios y guiones. Sin números ni símbolos.");
      return;
    }

    const studentAge = calcAge(birthDate);
    if (studentAge < 4 || studentAge > 25) {
      setError("La edad debe ser entre 4 y 25 años.");
      return;
    }

    if (studentEmail.trim() && !emailRegex.test(studentEmail.trim())) {
      setError("El correo ingresado no es válido.");
      return;
    }

    setError("");
    setSaving(true);

    try {
      const result = await createStudent(
        studentName,
        birthDate,
        educationLevel,
        gradeYear,
        supportLevel,
        visualPreferences,
        studentEmail,
      );

      if (!result.success) {
        setError(result.error);
        return;
      }

      setIsSuccess(true);
    } finally {
      setSaving(false);
    }
  }

  if (isSuccess) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-6 py-10">
        <section className="w-full max-w-[390px] text-center">
          <div className="mb-6 flex justify-center">
            <Image
              src="/amiko-character/amiko-character-photo.svg"
              alt="Mascota de AMIKO saludando"
              width={160}
              height={160}
              className="object-contain hover:scale-105 transition-transform duration-300"
              priority
            />
          </div>

          <h1 className="text-3xl font-black leading-tight text-amiko-navy">
            ¡Todo listo! 🌟
          </h1>
          <p className="mt-4 text-base font-bold leading-6 text-amiko-muted">
            ¡Te damos la bienvenida a la familia AMIKO! Estamos muy felices de acompañarte a ti y a{" "}
            <span className="text-amiko-blue font-black">{studentName.trim()}</span> en sus tareas escolares.
          </p>

          <button
            type="button"
            onClick={() => {
              router.refresh();
              router.push("/inicio");
            }}
            className="focus-ring mt-8 flex min-h-14 w-full items-center justify-center rounded-full bg-amiko-green px-6 text-lg font-black text-white shadow-card transition hover:opacity-90"
          >
            Comenzar
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-start justify-center bg-white px-6 py-10 pb-32 sm:items-center sm:pb-10">
      <section className="w-full max-w-[390px]">
        <div className="flex items-center justify-between mb-4">
          <Link
            href="/dashboard"
            aria-label="Volver"
            className="focus-ring flex h-10 w-10 items-center justify-center rounded-full text-amiko-navy transition hover:bg-amiko-sky"
          >
            <AmikoIcon name="back" className="h-6 w-6" />
          </Link>
          <h2 className="text-xs font-bold text-amiko-muted">Formulario de registro</h2>
          <div className="w-10" />
        </div>

        <div className="mb-4 flex justify-center">
          <Image
            src="/amiko-character/amiko-icon.svg"
            alt="AMIKO"
            width={72}
            height={72}
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

        <div className="mt-5 space-y-4">
          <Field
            label="Nombre o apodo del estudiante"
            value={studentName}
            onChange={setStudentName}
          />

          <label className="block">
            <span className="mb-2 block text-sm font-black text-amiko-ink">Fecha de nacimiento</span>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              min={minStudentDate}
              max={maxStudentDate}
              className="focus-ring w-full rounded-2xl border border-blue-100 bg-white px-4 py-3 text-base font-bold text-amiko-ink outline-none"
            />
            <p className="mt-1.5 text-xs font-bold text-amiko-muted">Entre 4 y 25 años</p>
          </label>

          <Field
            label="Correo del estudiante"
            type="email"
            placeholder="correo@escuela.com"
            value={studentEmail}
            onChange={setStudentEmail}
            optional
          />

          <fieldset className="space-y-3">
            <legend className="text-sm font-black text-amiko-ink">Grado escolar</legend>
            <label className="block">
              <span className="mb-2 block text-xs font-black text-amiko-muted">Nivel educativo</span>
              <select
                value={educationLevel}
                onChange={(event) => {
                  setEducationLevel(event.target.value as EducationLevel | "");
                  setGradeYear("");
                }}
                className="focus-ring w-full rounded-2xl border border-blue-100 bg-white px-4 py-3 text-base font-bold text-amiko-ink outline-none"
              >
                <option value="">Selecciona un nivel</option>
                <option value="primaria">Primaria</option>
                <option value="secundaria">Secundaria</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-black text-amiko-muted">Grado o año</span>
              <select
                value={gradeYear}
                onChange={(event) => setGradeYear(event.target.value)}
                disabled={!educationLevel}
                className="focus-ring w-full rounded-2xl border border-blue-100 bg-white px-4 py-3 text-base font-bold text-amiko-ink outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
              >
                <option value="">
                  {educationLevel ? "Selecciona grado o año" : "Primero elige un nivel"}
                </option>
                {educationLevel
                  ? gradeOptions[educationLevel].map((grade) => (
                      <option key={grade} value={grade}>
                        {grade}
                      </option>
                    ))
                  : null}
              </select>
            </label>
          </fieldset>

          <label className="block">
            <span className="mb-2 block text-sm font-black text-amiko-ink">
              Tipo de apoyo que suele necesitar
            </span>
            <select
              value={supportLevel}
              onChange={(event) => setSupportLevel(event.target.value)}
              className="focus-ring w-full rounded-2xl border border-blue-100 bg-white px-4 py-3 text-base font-bold text-amiko-ink outline-none"
            >
              <option value="bajo">Apoyo ocasional</option>
              <option value="medio">Apoyo frecuente</option>
              <option value="alto">Acompañamiento constante</option>
              <option value="no_seguro">No lo sé todavía</option>
            </select>
            <p className="mt-2 text-xs font-bold leading-5 text-amiko-muted">
              Puedes ajustarlo más adelante. No necesitamos información clínica para empezar.
            </p>
          </label>

          <label className="block">
            <span className="mb-1 flex items-center justify-between text-sm font-black text-amiko-ink">
              <span>¿Qué le ayuda a aprender mejor?</span>
              <span className="text-xs font-bold text-amiko-muted">Opcional</span>
            </span>
            <p className="mb-2 text-xs font-bold leading-5 text-amiko-muted">
              Amiko usa esto para adaptar las tareas a su estilo. Por ejemplo: si le cuesta leer mucho texto, si prefiere listas cortas, si los colores suaves le ayudan a concentrarse, o si necesita pasos muy pequeños.
            </p>
            <input
              type="text"
              placeholder="pasos cortos, poco texto, colores suaves"
              value={visualPreferences}
              onChange={(event) => setVisualPreferences(event.target.value)}
              className="focus-ring w-full rounded-2xl border border-blue-100 bg-white px-4 py-3 text-base font-bold text-amiko-ink outline-none placeholder:text-slate-400"
            />
          </label>
        </div>

        {error ? (
          <p className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold leading-6 text-red-700">
            {error}
          </p>
        ) : null}
      </section>

      {/* Barra de acciones fija en móvil, relativa en desktop */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-blue-50 px-6 py-3 sm:relative sm:border-t-0 sm:mt-5 sm:bg-transparent sm:px-0 sm:py-0">
        <div className="flex w-full max-w-[390px] gap-3 mx-auto">
          {/* Acción secundaria: Saltar por ahora */}
          <button
            type="button"
            onClick={() => router.push("/inicio")}
            className="focus-ring flex-1 flex items-center justify-center rounded-full bg-slate-100 px-4 py-3 text-sm font-black text-amiko-ink transition hover:bg-slate-200"
          >
            Saltar por ahora
          </button>

          {/* Acción principal: Crear perfil */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isFormValid || saving}
            className="focus-ring flex-1 flex items-center justify-center rounded-full bg-amiko-green px-4 py-3 text-sm font-black text-white shadow-card transition hover:opacity-90 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
          >
            {saving ? "Guardando..." : "Crear perfil"}
          </button>
        </div>
      </div>
    </main>
  );
}
