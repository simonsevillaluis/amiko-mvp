"use client";

import { useRef, useState } from "react";
import { AmikoIcon } from "@/components/amiko-icon";
import { createClient } from "@/lib/supabase/client";

interface AvatarUploadProps {
  userId: string;
  initialAvatarUrl: string | null;
  adultInitial: string;
}

export function AvatarUpload({ userId, initialAvatarUrl, adultInitial }: AvatarUploadProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialAvatarUrl);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith("image/")) {
      alert("Por favor, selecciona un archivo de imagen válido.");
      return;
    }

    // Limitar a 3MB
    if (file.size > 3 * 1024 * 1024) {
      alert("La imagen es demasiado grande. El límite es de 3MB.");
      return;
    }

    setUploading(true);

    try {
      const supabase = createClient();
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Intentar subir a Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { cacheControl: "3600", upsert: true });

      let finalUrl = "";

      if (!uploadError) {
        const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
        finalUrl = data.publicUrl;
      } else {
        // FALLBACK: Si no existe el bucket 'avatars' en Supabase, guardamos como base64
        console.warn("Storage upload failed, falling back to base64 DB storage:", uploadError.message);
        finalUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (error) => reject(error);
        });
      }

      // Actualizar el perfil en la base de datos
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: finalUrl })
        .eq("id", userId);

      if (updateError) {
        throw new Error(updateError.message);
      }

      setAvatarUrl(finalUrl);
    } catch (err) {
      console.error("Error al subir avatar:", err);
      alert("No se pudo guardar la imagen de perfil. Intenta de nuevo.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="relative inline-block">
      <input
        ref={inputRef}
        type="file"
        id={`avatar-file-input-${userId}`}
        onChange={handleFileChange}
        accept="image/*"
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
          if (!uploading) inputRef.current?.click();
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
  );
}
