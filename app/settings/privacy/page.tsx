import Link from "next/link";
import { AmikoIcon } from "@/components/amiko-icon";
import { DetailShell } from "@/components/detail-shell";
import { InfoList, TrustNote } from "@/components/settings-ui";

const savedData = [
  "Datos básicos del adulto: nombre, correo y rol dentro de AMIKO.",
  "Perfil pedagógico del estudiante: nombre, edad, grado/año y preferencias de apoyo.",
  "Tareas que compartes para adaptar y las respuestas generadas por AMIKO.",
  "Registros básicos de progreso: tareas acompañadas, pasos completados, ayuda solicitada y pausas usadas.",
];

const notSavedData = [
  "AMIKO no pide diagnósticos clínicos detallados.",
  "No necesita historia médica, terapias, medicación ni documentos de salud para funcionar.",
  "No accede a fotos ni archivos sin que tú selecciones qué compartir.",
  "No vende ni convierte los datos del estudiante en publicidad.",
];

const dataUses = [
  "Adaptar tareas escolares en pasos más claros.",
  "Recordar preferencias pedagógicas útiles para acompañar mejor.",
  "Mostrar un progreso básico y comprensible para el adulto cuidador.",
  "Ayudar a ordenar registros recientes sin crear un reporte clínico.",
];

export default function PrivacySettingsPage() {
  return (
    <DetailShell title="Privacidad" backHref="/settings" fallbackHref="/settings">
      <TrustNote title="Datos mínimos para acompañar" icon="shield">
        AMIKO trabaja con información de menores, así que la regla es simple: pedir poco, usarlo con claridad y no convertirlo en diagnóstico.
      </TrustNote>

      <section className="mb-5 rounded-2xl border border-slate-100 bg-white p-4 shadow-card">
        <h2 className="text-lg font-black text-amiko-ink">Qué guarda AMIKO</h2>
        <div className="mt-3">
          <InfoList items={savedData} />
        </div>
      </section>

      <section className="mb-5 rounded-2xl border border-slate-100 bg-white p-4 shadow-card">
        <h2 className="text-lg font-black text-amiko-ink">Qué no guarda ni debería pedir</h2>
        <div className="mt-3">
          <InfoList items={notSavedData} tone="green" />
        </div>
      </section>

      <section className="mb-5 rounded-2xl border border-slate-100 bg-white p-4 shadow-card">
        <h2 className="text-lg font-black text-amiko-ink">Para qué se usa</h2>
        <div className="mt-3">
          <InfoList items={dataUses} />
        </div>
      </section>

      <section className="mb-5 rounded-2xl bg-amiko-mint px-4 py-4">
        <div className="flex gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-amiko-green">
            <AmikoIcon name="help" className="h-5 w-5" />
          </span>
          <p className="text-sm font-bold leading-6 text-green-900">
            AMIKO es apoyo pedagógico. No diagnostica, no reemplaza a profesionales de salud y recomienda acompañamiento adulto cuando la tarea o la emoción se vuelven difíciles.
          </p>
        </div>
      </section>

      <div className="space-y-3">
        <Link
          href="/students"
          className="focus-ring flex min-h-12 items-center justify-center rounded-full bg-amiko-blue px-5 text-sm font-black text-white shadow-card transition hover:bg-amiko-navy"
        >
          Revisar perfiles
        </Link>
        <button
          type="button"
          disabled
          className="flex min-h-12 w-full cursor-not-allowed items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-sm font-black text-slate-400"
        >
          Descargar mis datos · Próximamente
        </button>
      </div>
    </DetailShell>
  );
}
