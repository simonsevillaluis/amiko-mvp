"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Role = "caregiver" | "parent" | "teacher";

function EyeOffIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <path d="m1 1 22 22" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function AuthInput({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  withPasswordIcon = false,
}: {
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  withPasswordIcon?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-amiko-ink">{label}</span>
      <span className="relative block">
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="focus-ring w-full rounded-md border border-amiko-blue bg-white px-4 py-3 pr-12 text-base font-medium text-amiko-muted outline-none placeholder:text-slate-400"
        />
        {withPasswordIcon ? (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-amiko-blue">
            <EyeOffIcon />
          </span>
        ) : null}
      </span>
    </label>
  );
}

function GoogleButton() {
  return (
    <button
      type="button"
      className="focus-ring flex min-h-12 w-full items-center justify-center gap-8 rounded-full border border-slate-200 bg-white px-4 text-sm font-bold text-amiko-ink shadow-sm transition hover:bg-slate-50"
    >
      <GoogleIcon />
      <span>Continuar con Google</span>
    </button>
  );
}

function AuthError({ message }: { message: string }) {
  return (
    <p className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold leading-6 text-red-700">
      {message}
    </p>
  );
}

export function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit() {
    if (!email.trim() || !password.trim()) {
      setError("Ingresa correo y contraseña para continuar con la demo.");
      return;
    }

    setError("");
    router.push("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-start justify-center bg-white px-6 py-16 sm:items-center">
      <section className="w-full max-w-[390px]">
        <div className="mb-8 flex justify-center">
          <Image
            src="/amiko-character/amiko-character-photo.svg"
            alt="Mascota de AMIKO saludando"
            width={124}
            height={124}
            className="object-contain"
            priority
          />
        </div>

        <h1 className="text-center text-3xl font-black leading-tight text-amiko-navy">
          Bienvenidos a Amiko
        </h1>
        <p className="mt-2 text-center text-base font-bold text-amiko-muted">
          Ingresa con tu correo para adaptar tareas paso a paso.
        </p>

        <div className="mt-5 space-y-4">
          <AuthInput
            label="Correo electrónico"
            type="email"
            placeholder="correo@ejemplo.com"
            value={email}
            onChange={setEmail}
          />
          <AuthInput
            label="Contraseña"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={setPassword}
            withPasswordIcon
          />
        </div>

        {error ? <AuthError message={error} /> : null}

        <button
          type="button"
          onClick={handleSubmit}
          className="focus-ring mt-5 flex min-h-14 w-full items-center justify-center rounded-full bg-amiko-blue px-6 text-lg font-black text-white shadow-card transition hover:bg-amiko-navy"
        >
          Entrar
        </button>

        <div className="mt-5 flex items-center justify-center gap-2 text-sm font-black">
          <Link href="/login" className="text-amiko-navy">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-xs font-bold text-slate-400">o</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>
        <GoogleButton />

        <p className="mt-5 text-center text-sm font-bold text-amiko-muted">
          ¿Primera vez en AMIKO?{" "}
          <Link href="/register" className="font-black text-amiko-blue">
            Crear cuenta
          </Link>
        </p>
      </section>
    </main>
  );
}

const roleOptions: Array<{
  value: Role;
  label: string;
  description: string;
  disabled?: boolean;
}> = [
  {
    value: "caregiver",
    label: "Cuidador",
    description: "Acompaño rutinas y tareas.",
  },
  {
    value: "parent",
    label: "Padre / Madre",
    description: "Acompaño desde casa.",
  },
  {
    value: "teacher",
    label: "Docente",
    description: "Función en desarrollo.",
    disabled: true,
  },
];

export function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("caregiver");
  const [error, setError] = useState("");

  function handleSubmit() {
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Completa nombre, correo y contraseña para crear la cuenta.");
      return;
    }

    setError("");
    router.push("/register/student");
  }

  return (
    <main className="flex min-h-screen items-start justify-center bg-white px-6 py-10 sm:items-center">
      <section className="w-full max-w-[390px]">
        <div className="mb-5 flex justify-center">
          <Image
            src="/amiko-character/amiko-character-photo.svg"
            alt="Mascota de AMIKO saludando"
            width={106}
            height={106}
            className="object-contain"
            priority
          />
        </div>

        <h1 className="text-center text-3xl font-black leading-tight text-amiko-navy">
          Crea tu cuenta en Amiko
        </h1>
        <p className="mt-2 text-center text-base font-bold leading-6 text-amiko-muted">
          Primero dinos quién acompaña el aprendizaje.
        </p>

        <div className="mt-5 space-y-4">
          <AuthInput
            label="Nombre del adulto"
            placeholder="Tu nombre"
            value={name}
            onChange={setName}
          />
          <AuthInput
            label="Correo electrónico"
            type="email"
            placeholder="correo@ejemplo.com"
            value={email}
            onChange={setEmail}
          />
          <AuthInput
            label="Contraseña"
            type="password"
            placeholder="Crea una contraseña"
            value={password}
            onChange={setPassword}
            withPasswordIcon
          />
        </div>

        <div className="mt-5">
          <p className="mb-3 text-sm font-black text-amiko-ink">¿Cuál es tu rol principal?</p>
          <div className="grid gap-2">
            {roleOptions.map((option) => {
              const isActive = role === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  disabled={option.disabled}
                  onClick={() => setRole(option.value)}
                  className={`focus-ring rounded-2xl border px-4 py-3 text-left transition ${
                    isActive
                      ? "border-amiko-green bg-amiko-mint text-green-900 shadow-sm"
                      : "border-slate-200 bg-white text-amiko-muted"
                  } ${option.disabled ? "cursor-not-allowed opacity-55" : "hover:border-amiko-blue"}`}
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="text-sm font-black">{option.label}</span>
                    {option.disabled ? (
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-black text-slate-500">
                        Pronto
                      </span>
                    ) : null}
                  </span>
                  <span className="mt-1 block text-xs font-bold">{option.description}</span>
                </button>
              );
            })}
          </div>
        </div>

        {error ? <AuthError message={error} /> : null}

        <p className="mt-5 rounded-xl bg-amiko-sky px-4 py-3 text-sm font-bold leading-6 text-amiko-navy">
          AMIKO es apoyo pedagógico. No diagnostica ni reemplaza a profesionales de salud,
          terapeutas o docentes.
        </p>

        <button
          type="button"
          onClick={handleSubmit}
          className="focus-ring mt-5 flex min-h-14 w-full items-center justify-center rounded-full bg-amiko-blue px-6 text-lg font-black text-white shadow-card transition hover:bg-amiko-navy"
        >
          Crear cuenta
        </button>

        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-xs font-bold text-slate-400">o</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>
        <GoogleButton />

        <p className="mt-5 text-center text-sm font-bold text-amiko-muted">
          ¿Ya tienes cuenta?{" "}
          <Link href="/" className="font-black text-amiko-blue">
            Iniciar sesión
          </Link>
        </p>
      </section>
    </main>
  );
}
