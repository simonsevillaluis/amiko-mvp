import { ButtonLink, Card, DemoNotice, FieldLabel } from "@/components/ui";

export default function LoginPage() {
  return (
    <main className="min-h-screen px-4 py-10 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl items-center">
        <div className="grid w-full gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <section>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-amiko-green">
              Acceso demo
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-amiko-ink md:text-5xl">
              Entra como adulto y valida el flujo principal.
            </h1>
            <p className="mt-5 text-lg leading-8 text-amiko-muted">
              Esta pantalla representa el futuro inicio de sesión con Supabase. Para la validación,
              permite mostrar el recorrido sin pedir datos reales de familias ni estudiantes.
            </p>
            <p className="mt-5 rounded-2xl border border-green-200 bg-amiko-mint p-4 text-sm leading-6 text-green-900">
              AMIKO solo debe registrar información necesaria para apoyar tareas escolares. No pide
              diagnóstico clínico ni reemplaza a profesionales de salud o docentes.
            </p>
          </section>

          <Card>
            <DemoNotice />
            <h2 className="text-2xl font-black text-amiko-ink">Iniciar sesión</h2>
            <div className="mt-5 space-y-4">
              <div className="space-y-2">
                <FieldLabel htmlFor="email">Correo</FieldLabel>
                <input
                  id="email"
                  className="focus-ring w-full rounded-lg border border-slate-300 px-4 py-3"
                  defaultValue="familia@amiko.demo"
                  type="email"
                />
              </div>
              <div className="space-y-2">
                <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                <input
                  id="password"
                  className="focus-ring w-full rounded-lg border border-slate-300 px-4 py-3"
                  defaultValue="demo-amiko"
                  type="password"
                />
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/dashboard">Entrar como familia</ButtonLink>
              <ButtonLink href="/teacher" variant="quiet">
                Entrar como docente
              </ButtonLink>
            </div>
            <p className="mt-5 text-sm leading-6 text-amiko-muted">
              En producción, esta acción creará o recuperará una sesión protegida y filtrará los
              datos por usuario.
            </p>
          </Card>
        </div>
      </div>
    </main>
  );
}
