"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AmikoIcon } from "@/components/amiko-icon";

type Role = "caregiver" | "parent" | "teacher";
type Gender = "femenino" | "masculino" | "otro";

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
    description: "Función en desarrollo para una siguiente etapa.",
    disabled: true,
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<Role>("caregiver");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState<Gender | "">("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const today = new Date();
  const maxBirthDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
    .toISOString()
    .split("T")[0];
  const minBirthDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate())
    .toISOString()
    .split("T")[0];

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!active) return;

      if (!user) {
        router.replace("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, role, onboarding_completed, birth_date, gender")
        .eq("id", user.id)
        .maybeSingle();

      if (profile?.onboarding_completed) {
        router.replace("/inicio");
        return;
      }

      setFullName(
        profile?.full_name ??
          user.user_metadata?.full_name ??
          user.user_metadata?.name ??
          "",
      );
      setRole((profile?.role as Role | null) ?? "caregiver");
      if (profile?.birth_date) setBirthDate(profile.birth_date as string);
      if (profile?.gender) setGender(profile.gender as Gender);
      setLoading(false);
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, [router]);

  async function handleSubmit() {
    if (!fullName.trim()) {
      setError("Agrega tu nombre para continuar.");
      return;
    }

    setError("");
    setSaving(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      const { error: profileError } = await supabase.from("profiles").upsert({
        id: user.id,
        email: user.email,
        full_name: fullName.trim(),
        role,
        birth_date: birthDate || null,
        gender: gender || null,
        onboarding_completed: true,
      });

      if (profileError) {
        setError("No pudimos guardar el perfil. Intenta de nuevo.");
        return;
      }

      router.refresh();
      router.push("/register/student");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-white px-6">
        <p className="text-center text-base font-black text-amiko-navy">Preparando tu perfil...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-dvh items-start justify-center bg-white px-6 py-8 sm:items-center">
      <section className="w-full max-w-[390px]">
        <div className="flex items-center justify-between">
          <p className="text-sm font-black text-amiko-blue">Paso 1 de 2</p>
          <button
            type="button"
            onClick={() => router.replace("/login")}
            aria-label="Cancelar y volver al inicio de sesión"
            className="focus-ring flex h-10 w-10 items-center justify-center rounded-full text-amiko-muted transition hover:bg-slate-100 hover:text-amiko-ink"
          >
            <AmikoIcon name="close" className="h-5 w-5" />
          </button>
        </div>

        <h1 className="mt-3 text-3xl font-black leading-tight text-amiko-navy">
          Completa tu perfil
        </h1>
        <p className="mt-2 text-base font-bold leading-6 text-amiko-muted">
          Cuéntanos quién acompaña el aprendizaje para adaptar la experiencia a tus necesidades.
        </p>

        <label className="mt-6 block">
          <span className="mb-2 block text-sm font-black text-amiko-ink">Tu nombre</span>
          <input
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder="Tu nombre completo"
            className="focus-ring w-full rounded-2xl border border-blue-100 bg-white px-4 py-3 text-base font-bold text-amiko-ink outline-none placeholder:text-slate-400"
          />
        </label>

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
                  <span className="block text-sm font-black">{option.label}</span>
                  <span className="mt-1 block text-xs font-bold">{option.description}</span>
                </button>
              );
            })}
          </div>
        </div>

        <label className="mt-5 block">
          <span className="mb-2 flex items-center justify-between text-sm font-black text-amiko-ink">
            <span>Fecha de nacimiento</span>
            <span className="text-xs font-bold text-amiko-muted">Opcional</span>
          </span>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            min={minBirthDate}
            max={maxBirthDate}
            className="focus-ring w-full rounded-2xl border border-blue-100 bg-white px-4 py-3 text-base font-bold text-amiko-ink outline-none"
          />
        </label>

        <label className="mt-5 block">
          <span className="mb-2 flex items-center justify-between text-sm font-black text-amiko-ink">
            <span>Género</span>
            <span className="text-xs font-bold text-amiko-muted">Opcional</span>
          </span>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value as Gender | "")}
            className="focus-ring w-full rounded-2xl border border-blue-100 bg-white px-4 py-3 text-base font-bold text-amiko-ink outline-none"
          >
            <option value="">Prefiero no decir</option>
            <option value="femenino">Mujer</option>
            <option value="masculino">Hombre</option>
            <option value="otro">Otro</option>
          </select>
        </label>

        {error ? (
          <p className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold leading-6 text-red-700">
            {error}
          </p>
        ) : null}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="focus-ring mt-6 flex min-h-14 w-full items-center justify-center rounded-full bg-amiko-blue px-6 text-lg font-black text-white shadow-card transition hover:bg-amiko-navy disabled:cursor-not-allowed disabled:opacity-70"
        >
          {saving ? "Guardando..." : "Continuar"}
        </button>
      </section>
    </main>
  );
}
