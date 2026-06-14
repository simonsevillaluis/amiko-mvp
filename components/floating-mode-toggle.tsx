"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Props {
  mode: "adult" | "student";
}

export function FloatingModeToggle({ mode }: Props) {
  const [studentName, setStudentName] = useState<string | null>(null);
  const [ready, setReady] = useState(mode !== "adult");
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    if (mode !== "adult") return;

    const supabase = createClient();
    async function load() {
      const { data } = await supabase
        .from("student_profiles")
        .select("name")
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();
      setStudentName(data?.name ?? null);
      setReady(true);
    }
    load().catch(() => setReady(true));
  }, [mode]);

  if (!ready) return null;

  const isAdult = mode === "adult";
  const href = isAdult ? "/demo/student-portal" : "/dashboard";
  const label = isAdult
    ? studentName ? `Entrar: ${studentName}` : "Modo estudiante"
    : "Modo adulto";
  const fallbackEmoji = isAdult ? "🎒" : "👤";
  const iconSrc = isAdult
    ? "https://img.icons8.com/3d-fluency/94/student.png"
    : "https://img.icons8.com/3d-fluency/94/user-male.png";

  return (
    <div className="fixed bottom-20 right-4 z-[45] flex items-center">
      {/* Glow ring behind button */}
      <div
        className={`absolute -inset-1 rounded-full blur-sm animate-pulse ${
          isAdult ? "bg-amiko-blue/50" : "bg-amiko-green/50"
        }`}
      />
      <Link
        href={href}
        className={`relative flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-black text-white transition-all duration-200 active:scale-95 hover:brightness-105 ${
          isAdult
            ? "bg-amiko-blue shadow-[0_4px_18px_rgba(37,99,235,0.55)]"
            : "bg-amiko-green shadow-[0_4px_18px_rgba(34,197,94,0.55)]"
        }`}
      >
        {imgFailed ? (
          <span className="animate-bounce text-lg" style={{ animationDuration: "1.8s" }}>
            {fallbackEmoji}
          </span>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={iconSrc}
            alt=""
            width={24}
            height={24}
            className="h-6 w-6 shrink-0 object-contain animate-bounce"
            style={{ animationDuration: "1.8s" }}
            onError={() => setImgFailed(true)}
          />
        )}
        <span className="max-w-[152px] truncate">{label}</span>
      </Link>
    </div>
  );
}
