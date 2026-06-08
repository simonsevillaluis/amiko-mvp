import Link from "next/link";
import { AmikoIcon } from "@/components/amiko-icon";
import { DetailShell } from "@/components/detail-shell";

const alerts = [
  {
    title: "¿Quieres registrar cómo fue la tarea?",
    description: "Una nota breve puede ayudarte a recordar qué funcionó.",
    href: "/mi-dia",
    action: "Registrar",
  },
  {
    title: "Nuevo logro para reconocer",
    description: "Ángel volvió a intentarlo después de una pausa.",
    href: "/logros",
    action: "Ver logro",
  },
  {
    title: "Invitación pendiente",
    description: "Hay una persona esperando unirse a la red de apoyo.",
    href: "/comunidad",
    action: "Revisar",
  },
];

export default function AlertsPage() {
  return (
    <DetailShell title="Notificaciones">
      <section className="mb-6">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-amiko-green">Solo lo útil</p>
        <h2 className="mt-2 text-3xl font-black leading-tight text-amiko-ink">Recordatorios tranquilos</h2>
        <p className="mt-3 text-base font-bold leading-7 text-amiko-muted">
          Recordatorios tranquilos para acompañar sin sentir más carga.
        </p>
      </section>

      <div className="space-y-3">
        {alerts.map((alert, index) => (
          <article key={alert.title} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-card">
            <div className="flex items-start gap-4">
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                  index === 0
                    ? "bg-amiko-sky text-amiko-blue"
                    : index === 1
                      ? "bg-amiko-mint text-green-800"
                      : "bg-amiko-cream text-amiko-navy"
                }`}
              >
                <AmikoIcon name={index === 0 ? "journal" : index === 1 ? "award" : "users"} className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="font-black text-amiko-ink">{alert.title}</h2>
                <p className="mt-1 text-sm font-bold leading-6 text-amiko-muted">{alert.description}</p>
                <Link href={alert.href} className="mt-3 inline-flex text-sm font-black text-amiko-blue">
                  {alert.action}
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </DetailShell>
  );
}
