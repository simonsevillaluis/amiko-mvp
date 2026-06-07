import { DetailShell } from "@/components/detail-shell";
import { InfoList, TrustNote } from "@/components/settings-ui";
import { AccessibilityPreferences } from "./accessibility-preferences";

const principles = [
  "Mantener textos cortos y escaneables para el adulto cuidador.",
  "Usar contraste suficiente sin llenar la pantalla de estímulos.",
  "Evitar animaciones intrusivas, especialmente en flujos de alta concentración.",
  "Preparar estas preferencias antes de construir el modo estudiante.",
];

export default function AccessibilitySettingsPage() {
  return (
    <DetailShell title="Accesibilidad" backHref="/settings" fallbackHref="/settings">
      <TrustNote title="Leer con menos carga" icon="help">
        La accesibilidad en AMIKO empieza por claridad: menos ruido visual, mejores jerarquías y decisiones sencillas.
      </TrustNote>

      <div className="mb-5">
        <AccessibilityPreferences />
      </div>

      <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-card">
        <h2 className="text-lg font-black text-amiko-ink">Criterios que seguimos</h2>
        <div className="mt-3">
          <InfoList items={principles} tone="green" />
        </div>
      </section>
    </DetailShell>
  );
}
