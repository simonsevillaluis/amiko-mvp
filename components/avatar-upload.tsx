"use client";

import { useRef, useState } from "react";
import { AmikoIcon } from "@/components/amiko-icon";
import { createClient } from "@/lib/supabase/client";

interface AvatarUploadProps {
  userId: string;
  initialAvatarUrl: string | null;
  adultInitial: string;
}

type UploadState = "idle" | "uploading" | "error-storage" | "error-db";

export function AvatarUpload({ userId, initialAvatarUrl, adultInitial }: AvatarUploadProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialAvatarUrl);
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const uploading = uploadState === "uploading";

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    if (!file.type.startsWith("image/")) {
      alert("Por favor, selecciona un archivo de imagen válido.");
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      alert("La imagen es demasiado grande. El límite es de 3 MB.");
      return;
    }

    setUploadState("uploading");

    try {
      const supabase = createClient();
      const fileExt = file.name.split(".").pop() ?? "jpg";
      const filePath = `avatars/${userId}-${Date.now()}.${fileExt}`;

      const { data: storageData, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { cacheControl: "3600", upsert: true });

      if (uploadError) {
        console.error("[AvatarUpload] storage upload failed:", uploadError.message);
        setUploadState("error-storage");
        return;
      }

      const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(storageData.path);
      const publicUrl = urlData.publicUrl;

      // Upsert garantiza que funciona aunque la fila no exista todavía.
      const { error: dbError } = await supabase
        .from("profiles")
        .upsert({ id: userId, avatar_url: publicUrl }, { onConflict: "id" });

      if (dbError) {
        console.error("[AvatarUpload] profiles upsert failed:", dbError.message, dbError.code);
        setUploadState("error-db");
        return;
      }

      setAvatarUrl(publicUrl);
      setUploadState("idle");
    } catch (err) {
      console.error("[AvatarUpload] unexpected error:", err);
      setUploadState("error-db");
    } finally {
      // Reset file input so the same file can be selected again.
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative inline-block">
        <input
          ref={inputRef}
          type="file"
          id={`avatar-file-input-${userId}`}
          onChange={handleFileChange}
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="sr-only"
          disabled={uploading}
        />

        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt="Foto de perfil"
            className={`h-24 w-24 rounded-full object-cover shadow-soft ring-4 ring-white transition ${
              uploading ? "opacity-60" : ""
            }`}
          />
        ) : (
          <span
            className={`flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-amiko-green to-green-700 text-4xl font-black text-white shadow-soft transition ${
              uploading ? "opacity-60" : ""
            }`}
          >
            {adultInitial}
          </span>
        )}

        <button
          type="button"
          onClick={() => {
            if (!uploading) {
              setUploadState("idle");
              inputRef.current?.click();
            }
          }}
          disabled={uploading}
          className={`focus-ring absolute -bottom-1 -right-1 z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-amiko-blue text-white shadow-card transition hover:bg-amiko-navy ${
            uploading ? "cursor-not-allowed bg-slate-400" : "cursor-pointer"
          }`}
          aria-label="Cambiar foto de perfil"
        >
          {uploading ? (
            <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <AmikoIcon name="camera" className="h-4 w-4" />
          )}
        </button>
      </div>

      {uploadState === "error-storage" ? (
        <p className="max-w-[220px] rounded-xl border border-amber-100 bg-amber-50 px-3 py-2 text-center text-xs font-bold leading-5 text-amber-700">
          El almacenamiento de imágenes no está configurado aún.{" "}
          <span className="underline decoration-dotted">Ver instrucciones abajo.</span>
        </p>
      ) : null}

      {uploadState === "error-db" ? (
        <p className="max-w-[220px] rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-center text-xs font-bold leading-5 text-red-700">
          No se pudo guardar la foto. Revisa la consola para más detalles.
        </p>
      ) : null}
    </div>
  );
}
