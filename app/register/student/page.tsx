"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { AmikoIcon } from "@/components/amiko-icon";
import { createStudent } from "@/app/actions/create-student";

type EducationLevel = "primaria" | "secundaria";
type Step = 1 | 2 | 3;

// ─── Constants ────────────────────────────────────────────────────────────────

const AGE_MIN = 4;
const AGE_MAX = 25;

const PREFERENCE_OPTIONS = [
  "Pasos cortos",
  "Pictogramas",
  "Poco texto",
  "Apoyo visual",
  "Audio",
  "Rutina clara",
  "Ejemplos guiados",
];

const SUPPORT_OPTIONS = [
  { value: "bajo", label: "Apoyo ocasional", desc: "Entiende bien con poca guía." },
  { value: "medio", label: "Apoyo frecuente", desc: "Necesita más explicaciones en cada paso." },
  { value: "alto", label: "Paso a paso constante", desc: "Prefiere tener apoyo en todo momento." },
  { value: "no_seguro", label: "Aún no lo sé", desc: "Lo exploraremos juntos." },
] as const;

const gradeOptions: Record<EducationLevel, string[]> = {
  primaria: ["1er grado", "2do grado", "3er grado", "4to grado", "5to grado", "6to grado"],
  secundaria: ["1er año", "2do año", "3er año", "4to año", "5to año"],
};

const educationLabel: Record<EducationLevel, string> = {
  primaria: "Primaria",
  secundaria: "Secundaria",
};

const stepMeta: Record<Step, { title: string; description: string }> = {
  1: {
    title: "Datos básicos",
    description: "Solo lo necesario para empezar a adaptar tareas.",
  },
  2: {
    title: "Nivel escolar",
    description: "Esto ayuda a que las instrucciones tengan el nivel adecuado.",
  },
  3: {
    title: "Preferencias de apoyo",
    description: "Puedes ajustar esto más adelante cuando conozcamos mejor el ritmo.",
  },
};

const nameRegex = /^[\p{L}\s'.\-]{2,}$/u;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ─── Shared components ────────────────────────────────────────────────────────

function Field({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  optional = false,
  error,
  min,
  max,
  helper,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  optional?: boolean;
  error?: string;
  min?: string;
  max?: string;
  helper?: string;
}) {
  const hasError = Boolean(error);
  return (
    <label className="block" htmlFor={id}>
      <span className="mb-2 flex items-center justify-between text-sm font-black text-amiko-ink">
        <span>{label}</span>
        {optional ? <span className="text-xs font-bold text-amiko-muted">Opcional</span> : null}
      </span>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        min={min}
        max={max}
        onChange={(event) => onChange(event.target.value)}
        onInput={(event) => onChange(event.currentTarget.value)}
        aria-invalid={hasError}
        aria-required={!optional}
        aria-describedby={hasError ? `${id}-error` : helper ? `${id}-helper` : undefined}
        className={`focus-ring w-full rounded-2xl border bg-white px-4 py-3 text-base font-bold text-amiko-ink outline-none placeholder:text-slate-400 ${
          hasError ? "border-red-300 bg-red-50/40" : "border-blue-100"
        }`}
      />
      {helper && !hasError ? (
        <p id={`${id}-helper`} className="mt-1.5 text-xs font-bold leading-5 text-amiko-muted">
          {helper}
        </p>
      ) : null}
      {hasError ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs font-black leading-5 text-red-700">
          {error}
        </p>
      ) : null}
    </label>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="min-w-[80px] shrink-0 text-xs font-black text-amiko-muted">{label}</span>
      <span className="text-sm font-bold leading-5 text-amiko-ink">{value}</span>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function calcAge(birthDate: string): number {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

function getBirthDateError(birthDate: string) {
  if (!birthDate) return "Selecciona una fecha de nacimiento.";
  const birth = new Date(birthDate);
  if (Number.isNaN(birth.getTime())) return "La fecha no parece válida.";
  const age = calcAge(birthDate);
  if (age < AGE_MIN) return `AMIKO está pensado para estudiantes desde ${AGE_MIN} años.`;
  if (age > AGE_MAX) return `Por ahora el rango permitido llega hasta ${AGE_MAX} años.`;
  return "";
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function StudentOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [studentName, setStudentName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [educationLevel, setEducationLevel] = useState<EducationLevel | "">("");
  const [gradeYear, setGradeYear] = useState("");
  const [supportLevel, setSupportLevel] = useState("medio");
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [attemptedSteps, setAttemptedSteps] = useState<Record<Step, boolean>>({
    1: false,
    2: false,
    3: false,
  });

  const today = new Date();
  const maxStudentDate = new Date(today.getFullYear() - AGE_MIN, today.getMonth(), today.getDate())
    .toISOString()
    .split("T")[0];
  const minStudentDate = new Date(today.getFullYear() - AGE_MAX, today.getMonth(), today.getDate())
    .toISOString()
    .split("T")[0];

  const trimmedName = studentName.trim();
  const trimmedEmail = studentEmail.trim();
  const preferencesString = selectedPreferences.join(", ");

  const nameError = useMemo(() => {
    if (!trimmedName) return "Escribe el nombre o apodo que usas en casa.";
    if (!nameRegex.test(trimmedName)) return "Usa letras, espacios, punto, apostrofe o guion.";
    return "";
  }, [trimmedName]);

  const birthDateError = useMemo(() => getBirthDateError(birthDate), [birthDate]);
  const emailError = trimmedEmail && !emailRegex.test(trimmedEmail) ? "Revisa el formato del correo." : "";
  const educationError = !educationLevel ? "Elige el nivel educativo." : "";
  const gradeError = !gradeYear ? "Elige el grado o año." : "";

  const stepIsComplete: Record<Step, boolean> = {
    1: !nameError && !birthDateError && !emailError,
    2: !educationError && !gradeError,
    3: true,
  };

  const isFormValid = stepIsComplete[1] && stepIsComplete[2] && stepIsComplete[3];
  const currentStepComplete = stepIsComplete[step];
  const showStepErrors = attemptedSteps[step];
  const showNameError = showStepErrors || studentName.length > 0;
  const showBirthDateError = showStepErrors || birthDate.length > 0;
  const showEmailError = showStepErrors || studentEmail.length > 0;
  const progress = (step / 3) * 100;
  const studentAge = birthDate && !getBirthDateError(birthDate) ? calcAge(birthDate) : null;

  function togglePreference(pref: string) {
    setSelectedPreferences((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref],
    );
  }

  function goNext() {
    setAttemptedSteps((current) => ({ ...current, [step]: true }));
    setError("");
    if (!currentStepComplete) return;
    if (step < 3) {
      setStep((step + 1) as Step);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function goBack() {
    setError("");
    if (step > 1) {
      setStep((step - 1) as Step);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    router.push("/dashboard");
  }

  async function handleSubmit() {
    setAttemptedSteps({ 1: true, 2: true, 3: true });

    if (!isFormValid) {
      if (!stepIsComplete[1]) setStep(1);
      else if (!stepIsComplete[2]) setStep(2);
      setError("Revisa los campos marcados antes de crear el perfil.");
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
        preferencesString,
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

  // ─── Success screen ──────────────────────────────────────────────────────────

  if (isSuccess) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-6 py-10">
        <section className="w-full max-w-[390px] text-center">
          <div className="mb-6 flex justify-center">
            <Image
              src="/amiko-character/amiko-character-photo.svg"
              alt="Mascota de AMIKO saludando"
              width={150}
              height={150}
              className="object-contain transition-transform duration-300 hover:scale-105"
              priority
            />
          </div>
          <h1 className="text-3xl font-black leading-tight text-amiko-navy">Todo listo</h1>
          <p className="mt-4 text-base font-bold leading-6 text-amiko-muted">
            Ya creamos el perfil de{" "}
            <span className="font-black text-amiko-blue">{trimmedName}</span>. Ahora AMIKO puede
            ayudarte a adaptar sus tareas con más claridad.
          </p>
          <button
            type="button"
            onClick={() => {
              router.refresh();
              router.push("/inicio");
            }}
            className="focus-ring mt-8 flex min-h-14 w-full items-center justify-center rounded-full bg-amiko-green px-6 text-lg font-black text-white shadow-card transition hover:brightness-95"
          >
            Comenzar
          </button>
        </section>
      </main>
    );
  }

  // ─── Registration flow ───────────────────────────────────────────────────────

  return (
    <main className="flex min-h-screen justify-center bg-white px-5 pb-32 pt-5 sm:bg-[#F4F8FF] sm:py-8">
      <section className="w-full max-w-[430px] sm:rounded-[28px] sm:bg-white sm:p-6 sm:shadow-card">
        {/* Nav row */}
        <div className="mb-5 flex items-center justify-between">
          <button
            type="button"
            onClick={goBack}
            aria-label={step === 1 ? "Volver al inicio" : "Volver al paso anterior"}
            className="focus-ring flex h-10 w-10 items-center justify-center rounded-full text-amiko-navy transition hover:bg-amiko-sky"
          >
            <AmikoIcon name="back" className="h-6 w-6" />
          </button>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-amiko-muted">
            Paso {step} de 3
          </p>
          <div className="w-10" />
        </div>

        {/* Progress bar */}
        <div className="mb-5 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-amiko-green to-amiko-blue transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Step heading */}
        <div className="mb-5 flex items-start gap-4">
          <Image
            src="/amiko-character/amiko-icon.svg"
            alt="AMIKO"
            width={64}
            height={64}
            className="shrink-0 object-contain"
            priority
          />
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-amiko-green">
              Perfil del estudiante
            </p>
            <h1 className="mt-1 text-2xl font-black leading-tight text-amiko-navy">
              {stepMeta[step].title}
            </h1>
            <p className="mt-1 text-sm font-bold leading-6 text-amiko-muted">
              {stepMeta[step].description}
            </p>
          </div>
        </div>

        {/* Safety notice */}
        <div className="mb-5 rounded-2xl border border-amiko-green/20 bg-amiko-mint/70 px-4 py-3">
          <p className="text-sm font-black leading-6 text-amiko-navy">
            No necesitamos información clínica para empezar.
          </p>
        </div>

        {/* Form card */}
        <div className="rounded-[24px] border border-blue-100 bg-[#F8FBFF] p-4 shadow-sm">

          {/* Step 1 — Basic data */}
          {step === 1 ? (
            <div className="space-y-4">
              <Field
                id="student-name"
                label="Nombre o apodo"
                placeholder="Nombre del estudiante"
                value={studentName}
                onChange={setStudentName}
                error={showNameError ? nameError : undefined}
              />
              <Field
                id="birth-date"
                label="Fecha de nacimiento"
                type="date"
                value={birthDate}
                onChange={setBirthDate}
                min={minStudentDate}
                max={maxStudentDate}
                helper={`Rango permitido: de ${AGE_MIN} a ${AGE_MAX} años.`}
                error={showBirthDateError ? birthDateError : undefined}
              />
              <Field
                id="student-email"
                label="Correo del estudiante"
                type="email"
                placeholder="correo@ejemplo.com"
                value={studentEmail}
                onChange={setStudentEmail}
                optional
                helper="Si lo tienes, sirve para conectar su cuenta más adelante."
                error={showEmailError ? emailError : undefined}
              />
            </div>
          ) : null}

          {/* Step 2 — School level */}
          {step === 2 ? (
            <fieldset className="space-y-4">
              <legend className="sr-only">Nivel escolar</legend>
              <label className="block" htmlFor="education-level">
                <span className="mb-2 block text-sm font-black text-amiko-ink">Nivel educativo</span>
                <select
                  id="education-level"
                  value={educationLevel}
                  onChange={(event) => {
                    setEducationLevel(event.target.value as EducationLevel | "");
                    setGradeYear("");
                    setError("");
                  }}
                  aria-required
                  aria-invalid={showStepErrors && Boolean(educationError)}
                  className={`focus-ring w-full rounded-2xl border bg-white px-4 py-3 text-base font-bold text-amiko-ink outline-none ${
                    showStepErrors && educationError ? "border-red-300 bg-red-50/40" : "border-blue-100"
                  }`}
                >
                  <option value="">Selecciona un nivel</option>
                  <option value="primaria">Primaria</option>
                  <option value="secundaria">Secundaria</option>
                </select>
                {showStepErrors && educationError ? (
                  <p className="mt-1.5 text-xs font-black text-red-700">{educationError}</p>
                ) : null}
              </label>

              <label className="block" htmlFor="grade-year">
                <span className="mb-2 block text-sm font-black text-amiko-ink">Grado o año</span>
                <select
                  id="grade-year"
                  value={gradeYear}
                  onChange={(event) => {
                    setGradeYear(event.target.value);
                    setError("");
                  }}
                  disabled={!educationLevel}
                  aria-required
                  aria-invalid={showStepErrors && Boolean(gradeError)}
                  className={`focus-ring w-full rounded-2xl border bg-white px-4 py-3 text-base font-bold text-amiko-ink outline-none disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 ${
                    showStepErrors && gradeError ? "border-red-300 bg-red-50/40" : "border-blue-100"
                  }`}
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
                {showStepErrors && gradeError ? (
                  <p className="mt-1.5 text-xs font-black text-red-700">{gradeError}</p>
                ) : (
                  <p className="mt-1.5 text-xs font-bold leading-5 text-amiko-muted">
                    Elegimos esto solo para adaptar el lenguaje de las tareas.
                  </p>
                )}
              </label>
            </fieldset>
          ) : null}

          {/* Step 3 — Support preferences */}
          {step === 3 ? (
            <div className="space-y-5">
              {/* Support level — radio cards */}
              <fieldset>
                <legend className="mb-3 text-sm font-black text-amiko-ink">
                  Tipo de apoyo que suele necesitar
                </legend>
                <div className="space-y-2">
                  {SUPPORT_OPTIONS.map((option) => {
                    const isSelected = supportLevel === option.value;
                    return (
                      <label
                        key={option.value}
                        className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-3 transition ${
                          isSelected
                            ? "border-amiko-blue bg-amiko-sky"
                            : "border-blue-100 bg-white hover:border-blue-200 hover:bg-slate-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="support-level"
                          value={option.value}
                          checked={isSelected}
                          onChange={() => setSupportLevel(option.value)}
                          className="sr-only"
                        />
                        <span
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition ${
                            isSelected
                              ? "border-amiko-blue bg-amiko-blue"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {isSelected && <span className="h-2 w-2 rounded-full bg-white" />}
                        </span>
                        <div>
                          <p
                            className={`text-sm font-black ${isSelected ? "text-amiko-navy" : "text-amiko-ink"}`}
                          >
                            {option.label}
                          </p>
                          <p className="text-xs font-bold leading-5 text-amiko-muted">
                            {option.desc}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
                <p className="mt-2 text-xs font-bold leading-5 text-amiko-muted">
                  Es una guía para adaptar tareas, no una etiqueta clínica.
                </p>
              </fieldset>

              {/* Visual preferences — chip multi-select */}
              <fieldset>
                <legend className="mb-1 flex w-full items-center justify-between text-sm">
                  <span className="font-black text-amiko-ink">Qué le ayuda a aprender mejor</span>
                  <span className="font-bold text-amiko-muted">Opcional</span>
                </legend>
                <p className="mb-3 text-xs font-bold leading-5 text-amiko-muted">
                  Elige todo lo que aplique. Puedes cambiar esto después.
                </p>
                <div className="flex flex-wrap gap-2">
                  {PREFERENCE_OPTIONS.map((pref) => {
                    const isSelected = selectedPreferences.includes(pref);
                    return (
                      <button
                        key={pref}
                        type="button"
                        onClick={() => togglePreference(pref)}
                        aria-pressed={isSelected}
                        className={`focus-ring rounded-full border px-4 py-2 text-sm font-black transition active:scale-95 ${
                          isSelected
                            ? "border-amiko-green bg-amiko-mint text-amiko-navy"
                            : "border-blue-100 bg-white text-amiko-ink hover:border-blue-200 hover:bg-slate-50"
                        }`}
                      >
                        {pref}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              {/* Summary card */}
              <div className="rounded-2xl border border-amiko-blue/15 bg-white p-4 shadow-sm">
                <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-amiko-blue">
                  Resumen del perfil
                </p>
                <div className="space-y-2">
                  <SummaryRow label="Nombre" value={trimmedName || "—"} />
                  <SummaryRow
                    label="Edad"
                    value={studentAge !== null ? `${studentAge} años` : "—"}
                  />
                  <SummaryRow
                    label="Escolar"
                    value={
                      educationLevel !== "" && gradeYear
                        ? `${educationLabel[educationLevel]} · ${gradeYear}`
                        : "—"
                    }
                  />
                  {selectedPreferences.length > 0 && (
                    <SummaryRow label="Preferencias" value={selectedPreferences.join(", ")} />
                  )}
                </div>
                <p className="mt-3 text-xs font-bold text-amiko-muted">
                  Podrás editar esto después en el perfil.
                </p>
              </div>
            </div>
          ) : null}
        </div>

        {/* Error banner */}
        {error ? (
          <p className="mt-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold leading-6 text-red-700">
            {error}
          </p>
        ) : null}
      </section>

      {/* Fixed footer */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-blue-50 bg-white/95 px-5 py-3 shadow-[0_-8px_24px_rgba(9,54,124,0.08)] backdrop-blur sm:absolute sm:left-1/2 sm:max-w-[430px] sm:-translate-x-1/2 sm:rounded-t-[24px]">
        <div className="mx-auto flex w-full max-w-[390px] gap-3">
          <button
            type="button"
            onClick={step === 1 ? () => router.push("/inicio") : goBack}
            className="focus-ring flex min-h-12 flex-1 items-center justify-center rounded-full bg-slate-100 px-4 text-sm font-black text-amiko-ink transition hover:bg-slate-200"
          >
            {step === 1 ? "Saltar por ahora" : "Atrás"}
          </button>

          {step < 3 ? (
            <button
              type="button"
              onClick={goNext}
              disabled={!currentStepComplete}
              className={`focus-ring flex min-h-12 flex-1 items-center justify-center rounded-full px-4 text-sm font-black transition ${
                currentStepComplete
                  ? "bg-amiko-blue text-white shadow-card hover:bg-amiko-navy"
                  : "cursor-not-allowed bg-slate-200 text-slate-500 shadow-none"
              }`}
            >
              Siguiente
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className={`focus-ring flex min-h-12 flex-1 items-center justify-center rounded-full px-4 text-sm font-black transition ${
                saving
                  ? "bg-slate-200 text-slate-500 shadow-none"
                  : "bg-amiko-green text-white shadow-card hover:brightness-95"
              }`}
            >
              {saving ? "Guardando..." : "Crear perfil"}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
