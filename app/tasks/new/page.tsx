"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdaptedTaskResult } from "@/components/adapted-task-result";
import { AppShell } from "@/components/app-shell";
import { Card, PageHeader } from "@/components/ui";
import { type AdaptationResult } from "@/lib/adapt-task";
import { ADAPTATION_SESSION_KEY } from "@/app/adapt-task/page";

function readAdaptation(): AdaptationResult | null {
  if (typeof window === "undefined") return null;
  const stored = sessionStorage.getItem(ADAPTATION_SESSION_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as AdaptationResult;
  } catch {
    return null;
  }
}

export default function NewTaskResultPage() {
  const router = useRouter();
  const [adaptation] = useState<AdaptationResult | null>(readAdaptation);

  useEffect(() => {
    if (!adaptation) {
      router.replace("/adapt-task");
    }
  }, [adaptation, router]);

  if (!adaptation) {
    return (
      <AppShell>
        <div className="flex min-h-[40vh] items-center justify-center">
          <p className="text-base font-bold text-amiko-muted">Cargando adaptación…</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow="Tarea adaptada"
        title="Lista para acompañarla paso a paso"
        description="Puedes ajustar los pasos antes de empezar. No hace falta completar todo de una vez."
      />
      <Card className="mb-5 bg-amiko-cream">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-amiko-muted">
          Tarea original
        </p>
        <p className="mt-2 text-lg font-bold leading-8 text-amiko-ink">{adaptation.originalText}</p>
      </Card>
      <AdaptedTaskResult adaptation={adaptation} />
    </AppShell>
  );
}
