import { AmikoIcon } from "@/components/amiko-icon";
import { DetailShell } from "@/components/detail-shell";
import { InfoList, TrustNote } from "@/components/settings-ui";

const cameraPoints = [
  "AMIKO no abre la cámara automáticamente.",
  "El permiso se solicita solo cuando decides subir una foto de una tarea.",
  "Puedes negar el permiso y seguir escribiendo la consigna manualmente.",
];

const filePoints = [
  "AMIKO no revisa tu galería completa.",
  "Solo recibe el archivo o foto que tú eliges compartir.",
  "En este MVP no hay análisis visual real con IA; la subida avanzada queda en desarrollo.",
];

export default function PermissionSettingsPage() {
  return (
    <DetailShell title="Permisos" backHref="/settings" fallbackHref="/settings">
      <TrustNote title="Tú decides qué compartir" icon="camera">
        Cámara y archivos deben sentirse como una acción voluntaria, no como una puerta abierta a tu dispositivo.
      </TrustNote>

      <section className="mb-5 rounded-2xl border border-slate-100 bg-white p-4 shadow-card">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amiko-sky text-amiko-blue">
            <AmikoIcon name="camera" className="h-6 w-6" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-black text-amiko-ink">Cámara</h2>
            <p className="mt-1 text-sm font-bold leading-6 text-amiko-muted">
              Se usará solo si eliges tomar o seleccionar una foto para compartirla.
            </p>
          </div>
        </div>
        <div className="mt-4">
          <InfoList items={cameraPoints} />
        </div>
        <p className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-amiko-muted">
          Estado en este navegador: se pedirá permiso cuando uses la función. AMIKO no puede cambiar permisos del sistema desde aquí.
        </p>
      </section>

      <section className="mb-5 rounded-2xl border border-slate-100 bg-white p-4 shadow-card">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amiko-mint text-green-800">
            <AmikoIcon name="clip" className="h-6 w-6" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-black text-amiko-ink">Archivos</h2>
            <p className="mt-1 text-sm font-bold leading-6 text-amiko-muted">
              Sirve para adjuntar una consigna, imagen o documento cuando el flujo lo permita.
            </p>
          </div>
        </div>
        <div className="mt-4">
          <InfoList items={filePoints} tone="green" />
        </div>
      </section>

      <section className="rounded-2xl border border-dashed border-amiko-green/40 bg-amiko-mint/30 px-4 py-4">
        <p className="text-sm font-bold leading-6 text-green-900">
          Próximamente: subir una foto o archivo para analizarlo con AMIKO. Por ahora, la forma segura del MVP es escribir o pegar la tarea.
        </p>
      </section>
    </DetailShell>
  );
}
