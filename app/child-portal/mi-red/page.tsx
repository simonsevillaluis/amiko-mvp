"use client";

import { useState } from "react";
import { supportContacts } from "@/lib/child-mock-data";
import { saveProgressEvent } from "@/lib/local-progress";

export default function MiRedPage() {
  const [lostAlert, setLostAlert] = useState(false);

  function handleLostAlert() {
    saveProgressEvent("help_requested", "general", undefined, "lost_alert_gps");
    setLostAlert(true);
    setTimeout(() => setLostAlert(false), 4000);
  }

  return (
    <>
      <div className="mb-5 flex items-center gap-2">
        <span className="text-xl">🤝</span>
        <h1 className="text-2xl font-black text-amiko-ink">Mi Red</h1>
      </div>
      <p className="mb-6 text-sm font-bold text-amiko-muted">
        Personas de confianza que te cuidan
      </p>

      {/* Support contacts */}
      <div className="space-y-3">
        {supportContacts.map((contact) => (
          <div
            key={contact.id}
            className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-card"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-amiko-mint text-3xl">
              {contact.emoji}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-black text-amiko-ink">
                {contact.name}
              </h3>
              <p className="text-sm font-bold text-amiko-muted">
                {contact.role}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                saveProgressEvent(
                  "help_requested",
                  "general",
                  undefined,
                  `contact_${contact.id}`,
                );
              }}
              className="rounded-full bg-amiko-green px-4 py-2 text-sm font-black text-white shadow-card transition active:scale-95"
            >
              Llamar
            </button>
          </div>
        ))}
      </div>

      {/* Lost alert */}
      <section className="mt-8">
        <button
          type="button"
          onClick={handleLostAlert}
          className="flex w-full items-center gap-4 rounded-2xl border-2 border-amiko-coral bg-[#FFF5F3] p-5 shadow-card transition active:scale-[0.98]"
        >
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white text-3xl shadow-card">
            📍
          </div>
          <div className="text-left">
            <h3 className="text-lg font-black text-amiko-ink">
              ¿Estás perdido?
            </h3>
            <p className="mt-1 text-sm font-bold text-amiko-muted">
              Avisar a tu red dónde estás por GPS
            </p>
          </div>
        </button>

        {lostAlert && (
          <div className="mt-4 animate-pulse rounded-2xl bg-amiko-mint p-5 shadow-card">
            <div className="flex items-center gap-3">
              <span className="text-3xl">✅</span>
              <div>
                <p className="text-lg font-black text-green-800">
                  ¡Listo! Tu red ya sabe dónde estás
                </p>
                <p className="mt-1 text-sm font-bold text-green-700">
                  Mamá, Papá y Abuela Rosa fueron avisados
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Emergency help */}
      <section className="mt-6">
        <button
          type="button"
          onClick={() => {
            saveProgressEvent(
              "help_requested",
              "general",
              undefined,
              "emergency_help",
            );
          }}
          className="flex w-full items-center gap-4 rounded-2xl bg-amiko-navy p-5 shadow-card transition active:scale-[0.98]"
        >
          <span className="text-3xl">🆘</span>
          <div className="text-left">
            <h3 className="text-lg font-black text-white">Necesito ayuda</h3>
            <p className="mt-1 text-sm font-bold text-blue-200">
              Amiko avisará a tu tutor
            </p>
          </div>
        </button>
      </section>
    </>
  );
}
