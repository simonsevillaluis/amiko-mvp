"use client";

import { useState } from "react";
import { AmikoIcon } from "@/components/amiko-icon";
import { StudentAvatar } from "@/components/student-portal-icons";
import { saveProgressEvent } from "@/lib/local-progress";
import { supportContacts } from "@/lib/student-mock-data";

export default function DemoMiRedPage() {
  const [alertVisible, setAlertVisible] = useState(false);

  function notifyAdult(kind: string) {
    saveProgressEvent("help_requested", "general", undefined, kind);
    setAlertVisible(true);
    window.setTimeout(() => setAlertVisible(false), 3500);
  }

  return (
    <>
      <section className="mb-5 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amiko-sky text-amiko-green shadow-sm">
          <AmikoIcon name="users" className="h-5 w-5" />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-amiko-green">
            Personas de confianza
          </p>
          <h1 className="mt-1 text-2xl font-black text-amiko-ink">Mi Red</h1>
        </div>
      </section>

      <p className="mb-5 text-sm font-bold leading-6 text-amiko-muted">
        Aqui estan las personas que pueden acompanarte.
      </p>

      <section className="space-y-3">
        {supportContacts.map((contact) => (
          <div
            key={contact.id}
            className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-card"
          >
            <StudentAvatar name={contact.name} className="h-14 w-14 shrink-0 text-xl" />
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-lg font-black text-amiko-ink">
                {contact.name}
              </h3>
              <p className="text-sm font-bold text-amiko-muted">{contact.role}</p>
            </div>
            <button
              type="button"
              onClick={() => notifyAdult(`contact_${contact.id}`)}
              className="focus-ring rounded-full bg-amiko-green px-4 py-2 text-sm font-black text-white shadow-card transition active:scale-95"
            >
              Avisar
            </button>
          </div>
        ))}
      </section>

      <section className="mt-7 space-y-3">
        <button
          type="button"
          onClick={() => notifyAdult("need_help")}
          className="focus-ring flex w-full items-center gap-4 rounded-2xl bg-amiko-navy p-5 text-left shadow-card transition active:scale-[0.98]"
        >
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white">
            <AmikoIcon name="help" className="h-7 w-7" />
          </span>
          <span>
            <span className="block text-lg font-black text-white">
              Necesito ayuda
            </span>
            <span className="mt-1 block text-sm font-bold text-blue-200">
              Amiko avisara a tu adulto.
            </span>
          </span>
        </button>

        <button
          type="button"
          onClick={() => notifyAdult("pause_support")}
          className="focus-ring flex w-full items-center gap-4 rounded-2xl border-2 border-amiko-green bg-amiko-mint/40 p-5 text-left shadow-card transition active:scale-[0.98]"
        >
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-amiko-green">
            <AmikoIcon name="pause" className="h-7 w-7" />
          </span>
          <span>
            <span className="block text-lg font-black text-amiko-ink">
              Quiero una pausa
            </span>
            <span className="mt-1 block text-sm font-bold text-amiko-muted">
              Tu adulto sabra que necesitas un momento.
            </span>
          </span>
        </button>
      </section>

      {alertVisible ? (
        <div className="mt-4 rounded-2xl border border-amiko-green/20 bg-amiko-mint p-4 shadow-card">
          <div className="flex items-center gap-3">
            <AmikoIcon name="check" className="h-6 w-6 text-amiko-green" />
            <p className="text-sm font-black leading-6 text-green-800">
              Listo. Tu adulto recibio el aviso en esta demo.
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
