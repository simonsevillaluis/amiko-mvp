import { AmikoIcon } from "@/components/amiko-icon";
import { DetailShell } from "@/components/detail-shell";
import { TrustNote } from "@/components/settings-ui";

const languages = [
  {
    code: "ES",
    name: "Español",
    description: "Idioma principal del MVP",
    active: true,
    available: true,
  },
  {
    code: "EN",
    name: "English",
    description: "Preparado para la siguiente etapa de i18n",
    active: false,
    available: false,
  },
];

export default function LanguageSettingsPage() {
  return (
    <DetailShell title="Idioma" backHref="/settings" fallbackHref="/settings">
      <TrustNote title="Español primero" icon="resources">
        AMIKO mantiene español como idioma principal mientras se prepara una traducción cuidada al inglés. No traduciremos textos sensibles a medias.
      </TrustNote>

      <div className="space-y-3">
        {languages.map((language) => (
          <article
            key={language.code}
            aria-current={language.active ? "true" : undefined}
            className={`flex w-full items-center gap-4 rounded-2xl border bg-white p-4 text-left shadow-card ${
              language.active
                ? "border-amiko-green"
                : "border-slate-100"
            } ${language.available ? "" : "opacity-75"}`}
          >
            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-black ${
                language.active ? "bg-amiko-green text-white" : "bg-slate-100 text-amiko-muted"
              }`}
            >
              {language.code}
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2">
                <span className="font-black text-amiko-ink">{language.name}</span>
                {!language.available ? (
                  <span className="rounded-full border border-amiko-green/40 px-2 py-0.5 text-[10px] font-black text-amiko-green">
                    Próximamente
                  </span>
                ) : null}
              </span>
              <span className="mt-0.5 block text-xs font-bold leading-5 text-amiko-muted">{language.description}</span>
            </span>
            {language.active ? (
              <AmikoIcon name="check" className="h-5 w-5 shrink-0 text-amiko-green" />
            ) : null}
          </article>
        ))}
      </div>
    </DetailShell>
  );
}
