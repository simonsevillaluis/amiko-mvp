"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { AmikoIcon } from "@/components/amiko-icon";
import { updateProfile } from "@/app/actions/update-profile";

type Role = "parent" | "caregiver" | "professional";

const roleOptions: Array<{ value: Role; label: string }> = [
  { value: "caregiver", label: "Cuidador principal" },
  { value: "parent", label: "Padre / Madre" },
  { value: "professional", label: "Profesional" },
];

export function EditProfileForm({
  initialFullName,
  initialRole,
}: {
  initialFullName: string;
  initialRole: Role | null;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState(initialFullName);
  const [role, setRole] = useState<Role>(initialRole ?? "caregiver");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function close() {
    if (isPending) return;
    setOpen(false);
    setError("");
    setFullName(initialFullName);
    setRole(initialRole ?? "caregiver");
  }

  function handleSubmit() {
    if (!fullName.trim()) {
      setError("Agrega tu nombre para continuar.");
      return;
    }

    setError("");

    startTransition(async () => {
      const result = await updateProfile(fullName.trim(), role);

      if (!result.success) {
        setError(result.error);
        return;
      }

      setOpen(false);
      router.refresh();
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="focus-ring mt-1 inline-flex items-center gap-1 text-xs font-black text-amiko-blue"
      >
        <AmikoIcon name="settings" className="h-3.5 w-3.5" />
        Editar perfil
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#161616]/85 px-5 py-4 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-[360px] overflow-hidden rounded-3xl bg-white shadow-soft">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="text-lg font-black text-amiko-ink">Editar mi perfil</h2>
              <button
                type="button"
                onClick={close}
                aria-label="Cerrar"
                className="focus-ring flex h-9 w-9 items-center justify-center rounded-full text-amiko-muted transition hover:bg-slate-100"
              >
                <AmikoIcon name="close" className="h-5 w-5" />
              </button>
            </div>

            <div className="px-5 py-4">
              <label className="block">
                <span className="mb-2 block text-sm font-black text-amiko-ink">Nombre</span>
                <input
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Tu nombre"
                  className="focus-ring w-full rounded-xl border border-blue-100 bg-amiko-sky/30 px-4 py-3 text-sm font-bold text-amiko-ink outline-none placeholder:text-slate-400"
                />
              </label>

              <div className="mt-4">
                <p className="mb-2 text-sm font-black text-amiko-ink">Tu rol principal</p>
                <div className="grid gap-2">
                  {roleOptions.map((option) => {
                    const isActive = role === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setRole(option.value)}
                        className={`focus-ring rounded-2xl border px-4 py-2.5 text-left text-sm font-black transition ${
                          isActive
                            ? "border-amiko-green bg-amiko-mint text-green-900"
                            : "border-slate-200 bg-white text-amiko-muted hover:border-amiko-green/40"
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {error ? (
                <p className="mt-3 rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-xs font-bold leading-5 text-red-700">
                  {error}
                </p>
              ) : null}

              <div className="mt-5 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={close}
                  disabled={isPending}
                  className="focus-ring min-h-11 rounded-full border-2 border-amiko-navy px-4 text-sm font-black text-amiko-navy disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isPending}
                  className="focus-ring flex min-h-11 items-center justify-center rounded-full bg-amiko-green px-4 text-sm font-black text-white shadow-card disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isPending ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
