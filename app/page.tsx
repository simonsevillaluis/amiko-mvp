import { ButtonLink, Card, StatusPill } from "@/components/ui";

const starterSteps = [
  "Leo una consigna",
  "AMIKO la separa",
  "El estudiante avanza",
];

export default function HomePage() {
  return (
    <main className="min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <section className="mx-auto grid min-h-[calc(100vh-2.5rem)] max-w-7xl items-center gap-8 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="order-2 lg:order-1">
          <StatusPill>MVP pedagógico inclusivo</StatusPill>
          <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight text-amiko-ink sm:text-5xl lg:text-6xl">
            AMIKO transforma tareas escolares en pasos simples.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-amiko-muted">
            Una demo mobile-first para que padres, madres y docentes conviertan consignas en
            instrucciones claras, visuales y tranquilas para estudiantes con TEA.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/dashboard">Entrar a la demo</ButtonLink>
            <ButtonLink href="/login" variant="secondary">
              Login demo
            </ButtonLink>
            <ButtonLink href="/adapt-task" variant="quiet">
              Adaptar una tarea
            </ButtonLink>
          </div>
          <p className="mt-5 max-w-2xl rounded-3xl border border-blue-100 bg-white/80 p-4 text-sm leading-6 text-amiko-muted shadow-card">
            AMIKO es apoyo pedagógico. No diagnostica ni reemplaza a profesionales de salud,
            terapeutas o docentes.
          </p>
        </div>

        <div className="order-1 lg:order-2">
          <div className="mx-auto max-w-sm rounded-2xl border border-white bg-white p-3 shadow-soft sm:max-w-md">
            <div className="rounded-xl bg-amiko-cream p-4">
              <header className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-amiko-green">
                    Hola, soy
                  </p>
                  <h2 className="text-3xl font-black text-amiko-blue">AMIKO</h2>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-amiko-sky text-lg font-black text-amiko-navy">
                  AM
                </div>
              </header>

              <Card className="mt-5 bg-white/95">
                <p className="text-sm font-black text-amiko-muted">Tarea original</p>
                <p className="mt-2 text-lg font-black leading-7 text-amiko-ink">
                  Lee la página 24 y resuelve los problemas.
                </p>
              </Card>

              <div className="mt-4 space-y-3">
                {starterSteps.map((step, index) => (
                  <div
                    key={step}
                    className="flex items-center gap-3 rounded-3xl bg-white p-3 shadow-card"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amiko-mint text-lg font-black text-green-800">
                      {index + 1}
                    </span>
                    <p className="font-black text-amiko-ink">{step}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-3xl bg-amiko-blue p-4 text-white shadow-card">
                <p className="text-sm font-black uppercase tracking-[0.16em] text-blue-100">
                  Modo niño
                </p>
                <p className="mt-2 text-2xl font-black leading-tight">
                  Una instrucción por pantalla.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
