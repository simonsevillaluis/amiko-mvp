"use client";

import { useState } from "react";
import { AmikoIcon } from "@/components/amiko-icon";
import { StudentAvatar } from "@/components/student-portal-icons";
import { saveProgressEvent } from "@/lib/local-progress";
import { supportContacts } from "@/lib/student-mock-data";

const roleEmoji: Record<string, string> = {
  Madre: "💙",
  Padre: "💙",
  Abuela: "💛",
  Abuelo: "💛",
  Docente: "📚",
  Tutor: "🎓",
};

export default function DemoMiRedPage() {
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertContact, setAlertContact] = useState("");

  function notifyAdult(kind: string, contactName?: string) {
    saveProgressEvent("help_requested", "general", undefined, kind);
    setAlertContact(contactName ?? "tu adulto");
    setAlertVisible(true);
    window.setTimeout(() => setAlertVisible(false), 3500);
  }

  return (
    <>
      {/* Header */}
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

      {/* Intro */}
      <div className="mb-5 rounded-[22px] bg-gradient-to-br from-amiko-sky to-amiko-mint px-5 py-4 shadow-sm">
        <p className="text-sm font-black leading-6 text-amiko-navy">
          Estas personas están aquí para acompañarte. 💛
        </p>
      </div>

      {/* Contact cards */}
      <section className="mb-6 space-y-3">
        {supportContacts.map((contact) => (
          <div
            key={contact.id}
            className="flex items-center gap-4 rounded-[22px] border border-slate-100 bg-white p-4 shadow-card"
          >
            <StudentAvatar name={contact.name} className="h-13 w-13 shrink-0 text-xl" />
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-base font-black text-amiko-ink">
                {contact.name}
              </h3>
              <p className="text-sm font-bold text-amiko-muted">
                {roleEmoji[contact.role] ?? "👤"} {contact.role}
              </p>
            </div>
            <button
              type="button"
              onClick={() => notifyAdult(`contact_${contact.id}`, contact.name)}
              className="focus-ring shrink-0 rounded-full bg-amiko-green px-4 py-2 text-sm font-black text-white shadow-sm transition active:scale-95 hover:opacity-90"
            >
              Avisar
            </button>
          </div>
        ))}
      </section>

      {/* Action buttons */}
      <section className="space-y-3">
        <button
          type="button"
          onClick={() => notifyAdult("need_help")}
          className="focus-ring flex w-full items-center gap-4 rounded-[22px] bg-gradient-to-r from-amiko-coral/90 to-orange-400 p-5 text-left shadow-card transition active:scale-[0.98]"
        >
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-white">
            <AmikoIcon name="help" className="h-7 w-7" />
          </span>
          <span>
            <span className="block text-lg font-black text-white">
              Necesito ayuda
            </span>
            <span className="mt-0.5 block text-sm font-bold text-white/80">
              Amiko avisará a tu adulto.
            </span>
          </span>
        </button>

        <button
          type="button"
          onClick={() => notifyAdult("pause_support")}
          className="focus-ring flex w-full items-center gap-4 rounded-[22px] border-2 border-amiko-green bg-amiko-mint/40 p-5 text-left shadow-card transition active:scale-[0.98]"
        >
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-amiko-green">
            <AmikoIcon name="pause" className="h-7 w-7" />
          </span>
          <span>
            <span className="block text-lg font-black text-amiko-ink">
              Quiero una pausa
            </span>
            <span className="mt-0.5 block text-sm font-bold text-amiko-muted">
              Tu adulto sabrá que necesitas un momento.
            </span>
          </span>
        </button>
      </section>

      {/* Notification banner */}
      {alertVisible && (
        <div className="mt-4 rounded-2xl border border-amiko-green/20 bg-amiko-mint p-4 shadow-card">
          <div className="flex items-center gap-3">
            <AmikoIcon name="check" className="h-6 w-6 shrink-0 text-amiko-green" />
            <p className="text-sm font-black leading-6 text-green-800">
              Listo. {alertContact} recibió el aviso en esta demo.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
