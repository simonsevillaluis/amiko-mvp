import { type AdaptationResult } from "@/lib/adapt-task";
import { adaptedTask } from "@/lib/mock-data";
import { ArasaacPictogram } from "./arasaac-pictogram";
import { ButtonLink, Card, StatusPill } from "./ui";

function toAdaptationResult(mock: typeof adaptedTask): AdaptationResult {
  return {
    originalText: mock.originalText,
    simple_summary: mock.simpleSummary,
    steps: mock.steps.map((s) => ({
      number: s.number,
      instruction: s.instruction,
      visual_support: s.visualSupport,
      adult_support: s.adultSupport,
    })),
    emotional_support: mock.emotionalSupport,
    difficulty_level: mock.difficultyLevel,
  };
}

interface Props {
  adaptation?: AdaptationResult;
}

export function AdaptedTaskResult({ adaptation }: Props) {
  const data = adaptation ?? toAdaptationResult(adaptedTask);

  return (
    <div className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
      <Card className="bg-white/95">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-amiko-green">
              Amiko responde
            </p>
            <h2 className="mt-2 text-3xl font-black text-amiko-ink">Tarea adaptada</h2>
          </div>
          <StatusPill>Dificultad {data.difficulty_level}</StatusPill>
        </div>

        <div className="mt-6 rounded-xl bg-amiko-sky p-5">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-amiko-navy">
            Resumen simple
          </p>
          <p className="mt-3 text-xl font-black leading-8 text-amiko-ink">{data.simple_summary}</p>
        </div>

        <div className="mt-6 space-y-3">
          {data.steps.map((step) => (
            <article key={step.number} className="rounded-xl border border-blue-100 bg-white p-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="flex gap-4 flex-1">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amiko-blue text-xl font-black text-white">
                    {step.number}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-black leading-7 text-amiko-ink">{step.instruction}</h3>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      <p className="rounded-lg bg-amiko-mint px-3 py-2 text-sm font-bold text-green-900">
                        Apoyo visual: {step.visual_support}
                      </p>
                      <p className="rounded-lg bg-amiko-cream px-3 py-2 text-sm font-bold text-amiko-ink">
                        Para acompañar: {step.adult_support}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end sm:justify-start items-center shrink-0 self-center">
                  <ArasaacPictogram searchText={step.visual_support} className="h-16 w-16" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </Card>

      <aside className="space-y-5">
        <Card className="bg-amiko-green text-white">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-green-100">
            Apoyo para el adulto
          </p>
          <h2 className="mt-2 text-2xl font-black">Pausa y acompaña</h2>
          <p className="mt-3 leading-7 text-green-50">{data.emotional_support}</p>
        </Card>
        <Card>
          <p className="text-sm font-black uppercase tracking-[0.16em] text-amiko-blue">
            Después de la tarea
          </p>
          <h2 className="mt-2 text-2xl font-black text-amiko-ink">Guarda lo que funcionó</h2>
          <p className="mt-3 leading-7 text-amiko-muted">
            Una nota breve puede ayudarte a recordar qué apoyo resultó útil hoy.
          </p>
          <div className="mt-5">
            <ButtonLink href="/mi-dia" variant="secondary">
              Registrar después
            </ButtonLink>
          </div>
        </Card>
      </aside>
    </div>
  );
}
