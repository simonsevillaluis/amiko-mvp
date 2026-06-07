"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AmikoIcon } from "@/components/amiko-icon";
import { createClient } from "@/lib/supabase/client";

type Role = "caregiver" | "parent" | "professional";

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

function EyeIcon() {
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
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
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

function getAuthErrorMessage(message: string) {
  const msg = message.toLowerCase();

  if (msg.includes("invalid login credentials")) {
    return "No encontramos una cuenta con ese correo y contraseña. Revisa los datos.";
  }

  if (msg.includes("email not confirmed")) {
    return "Revisa tu correo y confirma la cuenta antes de entrar.";
  }

  if (msg.includes("user already exists") || msg.includes("already registered")) {
    return "Este correo ya está registrado. Intenta iniciar sesión.";
  }

  if (msg.includes("password should be")) {
    return "La contraseña debe ser más larga (mínimo 6 caracteres).";
  }

  if (msg.includes("rate limit") || msg.includes("exceeded")) {
    return "Límite de intentos superado. Espera unos minutos e intenta de nuevo.";
  }

  if (msg.includes("faltan next_public_supabase")) {
    return "Falta configurar Supabase para activar el acceso real.";
  }

  return `No pudimos completar el acceso (${message}).`;
}

function AuthInput({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  withPasswordIcon = false,
  invalid = false,
  passwordVisible = false,
  onTogglePassword,
  helperText,
}: {
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  withPasswordIcon?: boolean;
  invalid?: boolean;
  passwordVisible?: boolean;
  onTogglePassword?: () => void;
  helperText?: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className={`mb-2 block text-sm font-black ${invalid ? "text-red-700" : "text-amiko-ink"}`}>
        {label}
      </span>
      <span className="relative block">
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={invalid}
          className={`focus-ring w-full rounded-md border bg-white px-4 py-3 pr-12 text-base font-medium text-amiko-muted outline-none placeholder:text-slate-400 ${
            invalid ? "border-red-500 ring-2 ring-red-100" : "border-amiko-blue"
          }`}
        />
        {withPasswordIcon ? (
          <button
            type="button"
            onClick={onTogglePassword}
            aria-label={passwordVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
            className={`focus-ring absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full transition hover:bg-amiko-sky ${
              invalid ? "text-red-500 hover:bg-red-100" : "text-amiko-blue"
            }`}
          >
            {passwordVisible ? <EyeIcon /> : <EyeOffIcon />}
          </button>
        ) : null}
      </span>
      {helperText && !invalid ? (
        <span className="mt-1.5 block text-xs font-bold text-amiko-muted leading-relaxed">
          {helperText}
        </span>
      ) : null}
    </label>
  );
}

function GoogleButton({ onClick, loading = false }: { onClick: () => void; loading?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="focus-ring flex min-h-12 w-full items-center justify-center gap-8 rounded-full border border-slate-200 bg-white px-4 text-sm font-bold text-amiko-ink shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-65"
    >
      <GoogleIcon />
      <span>{loading ? "Conectando..." : "Continuar con Google"}</span>
    </button>
  );
}

function AuthError({
  message,
  showCreateAccount = false,
  tone = "error",
}: {
  message: string;
  showCreateAccount?: boolean;
  tone?: "error" | "success";
}) {
  const toneClass =
    tone === "success"
      ? "border-amiko-blue/20 bg-amiko-sky text-amiko-navy"
      : "border-red-200 bg-red-50 text-red-700";

  return (
    <div className={`mt-4 rounded-xl border px-4 py-3 text-sm font-bold leading-6 ${toneClass}`}>
      <p>
        {message}
        {showCreateAccount ? (
          <>
            {" "}
            <Link href="/register" className="font-black text-red-800 underline hover:text-red-950">
              crea una cuenta nueva
            </Link>
            .
          </>
        ) : null}
      </p>
    </div>
  );
}

export function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [feedbackTone, setFeedbackTone] = useState<"error" | "success">("error");
  const [invalidCredentials, setInvalidCredentials] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push("/dashboard");
      }
    });
  }, [router]);

  async function handleSubmit() {
    if (!email.trim() || !password.trim()) {
      setInvalidEmail(!email.trim());
      setInvalidCredentials(true);
      setFeedbackTone("error");
      setError("Ingresa correo y contraseña para continuar.");
      return;
    }

    if (!isValidEmail(email)) {
      setInvalidEmail(true);
      setInvalidCredentials(false);
      setFeedbackTone("error");
      setError("");
      return;
    }

    setError("");
    setFeedbackTone("error");
    setInvalidEmail(false);
    setInvalidCredentials(false);
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        setInvalidCredentials(true);
        setFeedbackTone("error");
        setError(getAuthErrorMessage(signInError.message));
        return;
      }

      router.refresh();
      router.push("/dashboard");
    } catch (authError) {
      setInvalidCredentials(true);
      setFeedbackTone("error");
      setError(getAuthErrorMessage(authError instanceof Error ? authError.message : ""));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setError("");
    setInvalidCredentials(false);
    setGoogleLoading(true);

    try {
      const supabase = createClient();
      const origin = window.location.origin;
      // Always redirect to /onboarding; new users will complete onboarding,
      // and existing users will be automatically redirected to /dashboard.
      const callbackNext = "/onboarding";
      const { error: googleError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(callbackNext)}`,
        },
      });

      if (googleError) {
        setError(getAuthErrorMessage(googleError.message));
        setGoogleLoading(false);
      }
    } catch (authError) {
      setError(getAuthErrorMessage(authError instanceof Error ? authError.message : ""));
      setGoogleLoading(false);
    }
  }

  async function handlePasswordReset() {
    if (!email.trim()) {
      setInvalidCredentials(true);
      setFeedbackTone("error");
      setError("Escribe tu correo para enviarte instrucciones de recuperación.");
      return;
    }

    setError("");
    setFeedbackTone("error");
    setInvalidCredentials(false);
    setResetLoading(true);

    try {
      const supabase = createClient();
      const origin = window.location.origin;
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${origin}/auth/callback?next=/settings`,
      });

      if (resetError) {
        setInvalidCredentials(true);
        setFeedbackTone("error");
        setError("No pudimos enviar el correo de recuperación. Revisa el correo e intenta de nuevo.");
        return;
      }

      setFeedbackTone("success");
      setError("Si el correo está registrado, recibirás instrucciones para recuperar la contraseña.");
    } catch {
      setInvalidCredentials(true);
      setFeedbackTone("error");
      setError("Falta configurar Supabase para enviar recuperación de contraseña.");
    } finally {
      setResetLoading(false);
    }
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-white px-6 py-6">
      <section className="w-full max-w-[390px]">
        <h1 className="text-center text-[2rem] font-black leading-tight text-amiko-navy">
          Bienvenidos a Amiko
        </h1>
        <p className="mt-2 text-center text-base font-bold text-amiko-muted">
          Ingresa con tu correo para adaptar tareas paso a paso.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="mt-5"
        >
          <div className="space-y-3">
            <AuthInput
              label="Correo electrónico"
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(value) => {
                setEmail(value);
                setInvalidEmail(Boolean(value.trim()) && !isValidEmail(value));
                setInvalidCredentials(false);
              }}
              invalid={invalidEmail || invalidCredentials}
            />
            <AuthInput
              label="Contraseña"
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={setPassword}
              withPasswordIcon
              invalid={invalidCredentials}
              passwordVisible={showPassword}
              onTogglePassword={() => setShowPassword((value) => !value)}
            />
          </div>

          {error ? (
            <AuthError
              message={error}
              showCreateAccount={error.endsWith("Revisa los datos o") && feedbackTone === "error"}
              tone={feedbackTone}
            />
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="focus-ring mt-5 flex min-h-14 w-full items-center justify-center rounded-full bg-amiko-blue px-6 text-lg font-black text-white shadow-card transition hover:bg-amiko-navy disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="mt-4 flex flex-col items-center justify-center gap-2 text-sm font-black">
          <button
            type="button"
            onClick={handlePasswordReset}
            disabled={resetLoading}
            className="focus-ring rounded-full px-3 py-1 text-amiko-navy transition hover:bg-amiko-sky disabled:opacity-60"
          >
            {resetLoading ? "Enviando..." : "¿Olvidaste tu contraseña?"}
          </button>

        </div>

        <div className="my-3 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-xs font-bold text-slate-400">o</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>
        <GoogleButton onClick={handleGoogleSignIn} loading={googleLoading} />

        <p className="mt-4 text-center text-sm font-bold text-amiko-muted">
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
    value: "professional",
    label: "Profesional",
    description: "Psicólogo, psicopedagogo, terapeuta o docente.",
    disabled: true,
  },
];

function isValidAdultName(value: string) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return false;
  }

  return /^[\p{L}\p{M}][\p{L}\p{M}\s.'-]{1,79}$/u.test(trimmedValue);
}

const DISPOSABLE_EMAIL_DOMAINS = [
  "yopmail.com",
  "mailinator.com",
  "tempmail.plus",
  "temp-mail.org",
  "temp-mail.ru",
  "tempmail.net",
  "guerrillamail.com",
  "10minutemail.com",
  "sharklasers.com",
  "getairmail.com",
  "dispostable.com",
  "maildrop.cc",
  "burnermail.io",
  "trashmail.com",
  "disposable.com",
  "tempmail.com",
];

function isDisposableEmail(email: string): boolean {
  const trimmed = email.trim().toLowerCase();
  const domain = trimmed.split("@")[1];
  return domain ? DISPOSABLE_EMAIL_DOMAINS.includes(domain) : false;
}

function isValidEmail(value: string) {
  const trimmedValue = value.trim();

  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/iu.test(trimmedValue)) {
    return false;
  }

  return !trimmedValue.toLowerCase().endsWith(".con");
}

export function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<Role>("caregiver");
  const [error, setError] = useState("");
  const [invalidName, setInvalidName] = useState(false);
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push("/dashboard");
      }
    });
  }, [router]);

  async function handleSubmit() {
    setPasswordMismatch(false);
    setInvalidName(false);
    setInvalidEmail(false);
    setSuccessMessage("");

    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setInvalidName(!name.trim());
      setInvalidEmail(!email.trim());
      setError("Completa nombre, correo y contraseña para crear la cuenta.");
      return;
    }

    if (!isValidAdultName(name)) {
      setInvalidName(true);
      setError("");
      return;
    }

    if (!isValidEmail(email)) {
      setInvalidEmail(true);
      setError("Ingresa un correo electrónico válido.");
      return;
    }

    if (process.env.NODE_ENV === "production" && isDisposableEmail(email)) {
      setInvalidEmail(true);
      setError("Por favor, usa tu correo personal o laboral. No se permiten correos temporales.");
      return;
    }

    if (password !== confirmPassword) {
      setPasswordMismatch(true);
      setError("Las contraseñas no coinciden.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const supabase = createClient();
      const origin = window.location.origin;
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${origin}/auth/callback?next=/register/student`,
          data: {
            full_name: name.trim(),
            role,
          },
        },
      });

      if (signUpError) {
        console.error("Error de registro Supabase:", signUpError);
        setError(getAuthErrorMessage(signUpError.message));
        return;
      }

      if (data.session) {
        await supabase.from("profiles").upsert({
          id: data.session.user.id,
          email: data.session.user.email,
          full_name: name.trim(),
          role,
          onboarding_completed: true,
        });

        router.refresh();
        router.push("/register/student");
        return;
      }

      setSuccessMessage("Te enviamos un correo de confirmación. Ábrelo para terminar el registro.");
    } catch (authError) {
      console.error("Excepción en registro:", authError);
      setError(getAuthErrorMessage(authError instanceof Error ? authError.message : ""));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-start justify-center bg-white px-6 py-8 sm:items-center">
      <section className="w-full max-w-[390px]">
        <Link
          href="/"
          className="focus-ring mb-5 inline-flex h-11 w-11 items-center justify-center rounded-full text-amiko-navy transition hover:bg-amiko-sky"
          aria-label="Volver al inicio"
        >
          <AmikoIcon name="back" className="h-6 w-6" />
        </Link>

        <h1 className="text-3xl font-black leading-tight text-amiko-navy">
          Datos del adulto
        </h1>
        <p className="mt-2 text-base font-bold leading-6 text-amiko-muted">
          Primero dinos quién acompaña el aprendizaje.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="mt-5"
        >
          <div className="space-y-4">
            <AuthInput
              label="Nombre del adulto"
              placeholder="Tu nombre"
              value={name}
              onChange={(value) => {
                setName(value);
                setInvalidName(Boolean(value.trim()) && !isValidAdultName(value));
              }}
              invalid={invalidName}
            />
            <AuthInput
              label="Correo electrónico"
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(value) => {
                setEmail(value);
                setInvalidEmail(Boolean(value.trim()) && !isValidEmail(value));
              }}
              invalid={invalidEmail}
            />
            <AuthInput
              label="Contraseña"
              type={showPassword ? "text" : "password"}
              placeholder="Crea una contraseña"
              value={password}
              onChange={(value) => {
                setPassword(value);
                setPasswordMismatch(false);
              }}
              withPasswordIcon
              invalid={passwordMismatch}
              passwordVisible={showPassword}
              onTogglePassword={() => setShowPassword((value) => !value)}
            />
            <AuthInput
              label="Verificar contraseña"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Repite la contraseña"
              value={confirmPassword}
              onChange={(value) => {
                setConfirmPassword(value);
                setPasswordMismatch(false);
              }}
              withPasswordIcon
              invalid={passwordMismatch}
              passwordVisible={showConfirmPassword}
              onTogglePassword={() => setShowConfirmPassword((value) => !value)}
            />
            {passwordMismatch ? (
              <p className="-mt-1 text-sm font-black text-red-600">
                Las contraseñas no coinciden.
              </p>
            ) : null}
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

          {successMessage ? <AuthError message={successMessage} tone="success" /> : null}
          {error && !passwordMismatch ? <AuthError message={error} /> : null}

          <button
            type="submit"
            disabled={loading}
            className="focus-ring mt-5 flex min-h-14 w-full items-center justify-center rounded-full bg-amiko-blue px-6 text-lg font-black text-white shadow-card transition hover:bg-amiko-navy disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Siguiente..." : "Siguiente"}
          </button>
        </form>

      </section>
    </main>
  );
}
