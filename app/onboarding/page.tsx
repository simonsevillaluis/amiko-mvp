"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Role = "caregiver" | "parent" | "teacher";

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
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!active) {
        return;
      }

      if (!user) {
        router.replace("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, role, onboarding_completed")
        .eq("id", user.id)
        .maybeSingle();

      if (profile?.onboarding_completed) {
        router.replace("/dashboard");
        return;
      }

      setFullName(
        profile?.full_name ??
          user.user_metadata?.full_name ??
          user.user_metadata?.name ??
          "",
      );
      setRole((profile?.role as Role | null) ?? "caregiver");
      setLoading(false);
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, [router]);

  async function handleSubmit() {
    if (!fullName.trim()) {
      setError("Agrega el nombre del adulto para continuar.");
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
    <main className="flex min-h-dvh items-center justify-center bg-white px-6 py-8">
      <section className="w-full max-w-[390px]">
        <p className="text-sm font-black text-amiko-blue">Paso 1 de 2</p>
        <h1 className="mt-2 text-3xl font-black leading-tight text-amiko-navy">
          Completa tu perfil
        </h1>
        <p className="mt-2 text-base font-bold leading-6 text-amiko-muted">
          Cuéntanos quién acompaña el aprendizaje para adaptar la experiencia a tus necesidades.
        </p>

        <label className="mt-6 block">
          <span className="mb-2 block text-sm font-black text-amiko-ink">Nombre del adulto</span>
          <input
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder="Tu nombre"
            className="focus-ring w-full rounded-md border border-amiko-blue bg-white px-4 py-3 text-base font-medium text-amiko-muted outline-none placeholder:text-slate-400"
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
