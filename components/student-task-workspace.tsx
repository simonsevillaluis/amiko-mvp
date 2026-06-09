"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { AmikoIcon } from "@/components/amiko-icon";
import { ArasaacPictogram } from "@/components/arasaac-pictogram";
import { AmikoMark, StudentPortalIcon } from "@/components/student-portal-icons";
import {
  breakActivities,
  studentPortalStudent,
  type MathExercise,
  type StudentPortalTask,
} from "@/lib/student-mock-data";
import { saveProgressEvent } from "@/lib/local-progress";
import { playSound } from "@/lib/sounds";
import { soundSettings } from "@/lib/student-sound-settings";

// z-[60] > StudentShell nav (z-40) — covers fixed bottom nav while task is open
const SHELL =
  "fixed inset-0 z-[60] flex flex-col overflow-hidden text-amiko-ink sm:left-1/2 sm:right-auto sm:w-full sm:max-w-[430px] sm:-translate-x-1/2 sm:shadow-[0_24px_80px_rgba(9,54,124,0.24)] sm:ring-1 sm:ring-white/70";

type Phase = "ready" | "workspace" | "done";
type WorkspaceTab = "pasos" | "amiko" | "recursos";
type SaveFn = (...args: Parameters<typeof saveProgressEvent>) => void;

const REWARD_EMOJI: Record<string, string> = {
  calm: "🧘", draw: "🎨", water: "🥤", stretch: "🤸", eyes: "😌", music: "🎵",
};

function getCorrectAnswer(ex: MathExercise): number {
  if (ex.missingSlot === "a") return ex.a;
  if (ex.missingSlot === "b") return ex.b;
  return ex.answer;
}

function getAmikoMsg(
  ex: MathExercise,
  hintLevel: number,
  checked: boolean,
  isCorrect: boolean,
): string {
  if (checked && isCorrect) return "¡Exacto! Muy bien. Vamos al siguiente.";
  if (checked && !isCorrect) {
    return ex.missingSlot === "a" || ex.missingSlot === "b"
      ? "Casi. Pensá: ¿qué número sumado (o restado) al otro da ese resultado?"
      : "Casi. Revisá cada columna de derecha a izquierda.";
  }
  if (hintLevel === 0) return ex.amikoIntro;
  return ex.hints[Math.min(hintLevel - 1, 2)];
}

// ─── Tab bar ──────────────────────────────────────────────────────────────────

function WorkspaceTabBar({
  active,
  onChange,
}: {
  active: WorkspaceTab;
  onChange: (t: WorkspaceTab) => void;
}) {
  const tabs: { id: WorkspaceTab; imgUrl?: string; label: string }[] = [
    { id: "pasos",    imgUrl: "https://img.icons8.com/3d-fluency/94/clipboard.png", label: "Pasos"    },
    { id: "amiko",                                                                   label: "Amiko"    },
    { id: "recursos", imgUrl: "https://img.icons8.com/3d-fluency/94/toolbox.png",   label: "Recursos" },
  ];
  return (
    <nav className="shrink-0 border-t border-slate-100 bg-white">
      <div className="grid grid-cols-3">
        {tabs.map((tab) => {
          const on = active === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => { onChange(tab.id); if (soundSettings.canPlay()) playSound("tap"); }}
              aria-pressed={on}
              className="flex flex-col items-center gap-0.5 py-2 transition"
            >
              <span
                className={`flex items-center justify-center rounded-full px-5 py-1.5 transition-colors ${
                  on ? "bg-amiko-mint" : ""
                }`}
              >
                {tab.imgUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={tab.imgUrl} alt={tab.label} className="h-6 w-6 object-contain" />
                ) : (
                  <AmikoMark className="h-6 w-6" />
                )}
              </span>
              <span
                className={`text-[10px] font-black ${on ? "text-amiko-green" : "text-amiko-muted"}`}
              >
                {tab.label}
              </span>
              {on && <span className="mt-0.5 h-0.5 w-6 rounded-full bg-amiko-green" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

// ─── AMIKO speech bubble ──────────────────────────────────────────────────────

function AmikoBubble({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-3">
      <AmikoMark className="h-9 w-9 shrink-0" />
      <div className="rounded-2xl rounded-tl-sm bg-amiko-sky px-4 py-3 shadow-sm">
        <p className="text-sm font-black leading-6 text-amiko-navy">{message}</p>
      </div>
    </div>
  );
}

// ─── Math problem column ──────────────────────────────────────────────────────
// Supports two layouts:
//   "column"  (missingSlot === "answer" or undefined)  — classic vertical format
//   "inline"  (missingSlot === "a" | "b")              — __ OP b = answer / a OP __ = answer

function MathColumn({
  ex,
  answer,
  onChange,
  checked,
  isCorrect,
}: {
  ex: MathExercise;
  answer: string;
  onChange: (v: string) => void;
  checked: boolean;
  isCorrect: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const slot = ex.missingSlot ?? "answer";
  const opColor = ex.operator === "+" ? "text-amiko-green" : "text-amiko-coral";
  const borderColor = !checked
    ? "border-slate-200 focus:border-amiko-blue"
    : isCorrect
      ? "border-amiko-green bg-green-50"
      : "border-amiko-coral bg-red-50";

  const NumInput = (
    <input
      ref={inputRef}
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      value={answer}
      onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))}
      placeholder="?"
      maxLength={4}
      className={`rounded-2xl border-2 bg-transparent py-2 text-center text-5xl font-black text-amiko-ink outline-none transition placeholder:text-slate-300 ${borderColor}`}
      style={{ width: "4.5rem" }}
    />
  );

  // ── Inline layout for missing "a" or "b" ──────────────────────────────────
  if (slot === "a" || slot === "b") {
    const showA = slot === "a" && checked && isCorrect
      ? <span className="text-5xl font-black text-amiko-green">{ex.a}</span>
      : slot === "a"
        ? NumInput
        : <span className="text-5xl font-black text-amiko-ink">{ex.a}</span>;

    const showB = slot === "b" && checked && isCorrect
      ? <span className="text-5xl font-black text-amiko-green">{ex.b}</span>
      : slot === "b"
        ? NumInput
        : <span className="text-5xl font-black text-amiko-ink">{ex.b}</span>;

    return (
      <div className="mx-auto w-fit rounded-3xl bg-white px-6 py-6 shadow-soft">
        <p className="mb-4 text-center text-[10px] font-black uppercase tracking-[0.14em] text-amiko-muted">
          Encuentra el número que falta
        </p>
        <div className="flex items-center justify-center gap-3 font-mono">
          {showA}
          <span className={`text-4xl font-black ${opColor}`}>{ex.operator}</span>
          {showB}
          <span className="text-3xl font-black text-amiko-muted">=</span>
          <span className="text-5xl font-black text-amiko-ink">{ex.answer}</span>
        </div>
        {checked && !isCorrect && (
          <p className="mt-3 text-center text-xs font-black text-amiko-coral">
            No es correcto. Intentá de nuevo.
          </p>
        )}
      </div>
    );
  }

  // ── Column layout for missing "answer" ────────────────────────────────────
  return (
    <div className="mx-auto w-fit rounded-3xl bg-white px-8 py-6 shadow-soft">
      <div className="font-mono text-right leading-tight tracking-widest">
        <div className="text-5xl font-black text-amiko-ink">{ex.a}</div>
        <div className="flex items-center justify-end gap-3">
          <span className={`text-4xl font-black ${opColor}`}>{ex.operator}</span>
          <span className="text-5xl font-black text-amiko-ink">{ex.b}</span>
        </div>
        <div className="my-2 h-1 w-full rounded-full bg-slate-200" />
        {checked && isCorrect ? (
          <div className="text-5xl font-black text-amiko-green">{ex.answer}</div>
        ) : (
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={answer}
            onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))}
            placeholder="?"
            maxLength={4}
            className={`w-full rounded-xl border-2 bg-transparent py-1 text-right text-5xl font-black text-amiko-ink outline-none transition placeholder:text-slate-300 ${borderColor}`}
          />
        )}
      </div>
      {checked && !isCorrect && (
        <p className="mt-3 text-center text-xs font-black text-amiko-coral">
          No es correcto. Intentá de nuevo.
        </p>
      )}
    </div>
  );
}

// ─── TAB: PASOS ───────────────────────────────────────────────────────────────

function FuentesTab({
  task,
  currentIdx,
}: {
  task: StudentPortalTask;
  currentIdx: number;
}) {
  const exercises = task.mathExercises ?? [];
  const isMath = task.taskType === "math" && exercises.length > 0;

  return (
    <div className="flex-1 overflow-y-auto bg-[#F7F9FC] px-5 py-4">
      <div className="mb-3 flex items-center gap-2 rounded-2xl bg-amiko-mint/60 px-4 py-2.5">
        <span className="select-none text-sm">👩‍🏫</span>
        <p className="text-xs font-black text-amiko-green">
          Tu tutor preparó esta tarea para ti
        </p>
      </div>

      <div className="mb-4 rounded-3xl bg-white p-5 shadow-card">
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-amiko-green">
          {task.subject}
        </p>
        <h2 className="mt-1 text-2xl font-black text-amiko-ink">{task.title}</h2>
        {task.taskDescription && (
          <p className="mt-2 text-sm font-bold leading-6 text-amiko-muted">
            {task.taskDescription}
          </p>
        )}
      </div>

      {isMath && (
        <>
          <p className="mb-2 text-xs font-black uppercase tracking-[0.14em] text-amiko-muted">
            Ejercicios
          </p>
          <div className="space-y-2">
            {exercises.map((ex, i) => {
              const done   = i < currentIdx;
              const active = i === currentIdx;
              return (
                <div
                  key={ex.id}
                  className={`flex items-center gap-4 rounded-2xl border px-5 py-3.5 ${
                    done
                      ? "border-green-100 bg-green-50"
                      : active
                        ? "border-amiko-blue/20 bg-white shadow-card"
                        : "border-slate-100 bg-white"
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                      done
                        ? "bg-amiko-green text-white"
                        : active
                          ? "bg-amiko-blue text-white"
                          : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {done ? "✓" : i + 1}
                  </span>
                  <span
                    className={`font-mono text-xl font-black ${
                      done ? "text-green-700" : "text-amiko-ink"
                    }`}
                  >
                    {(() => {
                      const slot = ex.missingSlot ?? "answer";
                      const blank = <span className="text-slate-300">__</span>;
                      const greenA = <span className="text-amiko-green">{ex.a}</span>;
                      const greenB = <span className="text-amiko-green">{ex.b}</span>;
                      const greenAns = <span className="text-amiko-green">{ex.answer}</span>;
                      return (
                        <>
                          {slot === "a" ? (done ? greenA : blank) : ex.a}
                          {" "}{ex.operator}{" "}
                          {slot === "b" ? (done ? greenB : blank) : ex.b}
                          {" = "}
                          {slot === "answer" || !slot ? (done ? greenAns : blank) : ex.answer}
                        </>
                      );
                    })()}
                  </span>
                  {active && (
                    <span className="ml-auto text-[10px] font-black text-amiko-blue">
                      Ahora
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      <div className="mt-5 rounded-3xl border border-green-100 bg-green-50 p-4">
        <p className="text-[10px] font-black uppercase tracking-[0.14em] text-amiko-green">
          Al terminar
        </p>
        <div className="mt-2 flex items-center gap-3">
          <span className="select-none text-2xl">
            {REWARD_EMOJI[task.rewardIcon] ?? "🎁"}
          </span>
          <p className="font-black text-amiko-ink">{task.reward}</p>
        </div>
      </div>
    </div>
  );
}

// ─── TAB: AMIKO ───────────────────────────────────────────────────────────────

function AmikoTab({
  exercises,
  currentIdx,
  hintLevel,
  answer,
  checked,
  isCorrect,
  onAnswerChange,
  onRevisar,
  onNext,
  onGoToRecursos,
}: {
  exercises: MathExercise[];
  currentIdx: number;
  hintLevel: number;
  answer: string;
  checked: boolean;
  isCorrect: boolean;
  onAnswerChange: (v: string) => void;
  onRevisar: () => void;
  onNext: () => void;
  onGoToRecursos: () => void;
}) {
  const ex      = exercises[currentIdx];
  const total   = exercises.length;
  const amikoMsg = getAmikoMsg(ex, hintLevel, checked, isCorrect);
  const pct      = Math.round(((currentIdx + 1) / total) * 100);

  return (
    <>
      {/* Progress bar — subtle */}
      <div className="shrink-0 bg-white px-5 pb-2 pt-3">
        <div className="flex items-center gap-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-amiko-green transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-[10px] font-black text-amiko-muted">
            {currentIdx + 1} / {total}
          </span>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto px-5 pb-4 pt-4">
        <AmikoBubble message={amikoMsg} />

        {hintLevel > 0 && !checked && (
          <div className="mt-3 flex items-center gap-2 pl-12">
            <span className="rounded-full bg-amber-50 px-3 py-1 text-[10px] font-black text-amber-700 ring-1 ring-amber-200">
              💡 Pista {hintLevel} activa
            </span>
            <button
              type="button"
              onClick={onGoToRecursos}
              className="text-[10px] font-black text-amiko-blue underline underline-offset-2"
            >
              Ver en Recursos →
            </button>
          </div>
        )}

        <div className="mt-5">
          <MathColumn
            ex={ex}
            answer={answer}
            onChange={onAnswerChange}
            checked={checked}
            isCorrect={isCorrect}
          />
        </div>

        {checked && isCorrect && (
          <div className="mt-4">
            <button
              type="button"
              onClick={onNext}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-amiko-green py-4 text-lg font-black text-white shadow-card transition active:scale-95"
            >
              <AmikoIcon name="check" className="h-5 w-5" />
              {currentIdx + 1 < total ? "Siguiente ejercicio" : "¡Terminé la tarea!"}
            </button>
          </div>
        )}
      </div>

      {/* Actions */}
      {!(checked && isCorrect) && (
        <div className="shrink-0 px-5 pb-4 pt-1">
          <button
            type="button"
            onClick={onRevisar}
            className="flex min-h-14 w-full items-center justify-center rounded-full bg-amiko-blue text-lg font-black text-white shadow-card transition active:scale-95"
          >
            Revisar
          </button>
        </div>
      )}
    </>
  );
}

// ─── TAB: RECURSOS ────────────────────────────────────────────────────────────

function RecursosTab({
  task,
  ex,
  hintLevel,
  taskDone,
  onNoEntendi,
}: {
  task: StudentPortalTask;
  ex: MathExercise;
  hintLevel: number;
  taskDone: boolean;
  onNoEntendi: () => void;
}) {
  // Keywords: tutor-defined > operator-derived fallback
  const opKeyword  = ex.operator === "+" ? "suma" : "resta";
  const keywords   = task.visualKeywords?.length
    ? [opKeyword, ...task.visualKeywords]
    : [opKeyword, "número", "decenas"];

  return (
    <div className="flex-1 overflow-y-auto bg-[#F7F9FC] px-5 py-4">
      {!taskDone ? (
        <>
          {/* ── Nota del tutor ──────────────────────────────────────── */}
          {task.tutorNote && (
            <div className="mb-4 rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
              <div className="mb-2 flex items-center gap-2">
                <span className="select-none text-base">👩‍🏫</span>
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-amiko-blue">
                  Nota de tu tutor
                </p>
              </div>
              <p className="text-sm font-bold leading-6 text-amiko-ink">{task.tutorNote}</p>
            </div>
          )}

          {/* ── Apoyo visual ARASAAC ─────────────────────────────────── */}
          <p className="mb-3 text-xs font-black uppercase tracking-[0.14em] text-amiko-muted">
            Apoyo visual
          </p>
          <div className="mb-5 flex flex-wrap gap-3">
            {keywords.slice(0, 4).map((kw) => (
              <div key={kw} className="flex flex-col items-center gap-1.5">
                <ArasaacPictogram searchText={kw} className="h-20 w-20" />
                <span className="text-[10px] font-black capitalize text-amiko-muted">{kw}</span>
              </div>
            ))}
          </div>

          {/* ── Pistas progresivas ───────────────────────────────────── */}
          <p className="mb-1 text-xs font-black uppercase tracking-[0.14em] text-amiko-muted">
            Pistas
          </p>
          <p className="mb-3 text-[10px] font-bold text-amiko-muted">
            ¿Te trabaste en este paso? Puedes pedir pistas para que te ayuden:
          </p>

          <button
            type="button"
            onClick={onNoEntendi}
            disabled={hintLevel >= 3}
            className={`mb-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-full border-2 text-sm font-black transition active:scale-95 ${
              hintLevel >= 3
                ? "border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"
                : "border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100"
            }`}
          >
            <span className="select-none text-base">💡</span>
            {hintLevel === 0
              ? "Pedir una pista"
              : hintLevel < 3
                ? "Necesito otra pista"
                : "¡Todas las pistas reveladas!"}
          </button>

          <div className="space-y-2">
            {ex.hints.map((hint, i) => {
              const unlocked = hintLevel > i;
              return (
                <div
                  key={i}
                  className={`rounded-2xl border p-4 transition-all ${
                    unlocked
                      ? "border-amber-100 bg-amber-50"
                      : "border-slate-100 bg-white opacity-60"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="select-none text-lg">{unlocked ? "💡" : "🔒"}</span>
                    <span
                      className={`text-sm font-black ${
                        unlocked ? "text-amber-800" : "text-slate-400"
                      }`}
                    >
                      Pista {i + 1}
                    </span>
                    {!unlocked && (
                      <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-black text-slate-400">
                        Bloqueada
                      </span>
                    )}
                  </div>
                  {unlocked ? (
                    <p className="mt-2 text-sm font-bold leading-6 text-amber-900">{hint}</p>
                  ) : (
                    <p className="mt-1 text-xs font-bold text-slate-400">
                      Pedí una pista en el tab Amiko para desbloquear.
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* ── Más ayuda (próximamente) ─────────────────────────────── */}
          <p className="mb-2 mt-5 text-xs font-black uppercase tracking-[0.14em] text-amiko-muted">
            Más ayuda
          </p>
          <div className="space-y-2 opacity-55">
            {[
              { emoji: "📝", label: "Ver ejemplo resuelto",   sub: "Un ejercicio completo paso a paso"  },
              { emoji: "🔊", label: "Escuchar explicación",    sub: "Amiko lo explica en voz alta"       },
              { emoji: "🔁", label: "Practicar otro parecido", sub: "Un ejercicio similar para entrenar" },
              { emoji: "❓", label: "Mini quiz al terminar",   sub: "3 preguntas de repaso rápido"       },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white px-4 py-3"
              >
                <span className="select-none text-xl">{item.emoji}</span>
                <div className="flex-1">
                  <p className="text-sm font-black text-amiko-ink">{item.label}</p>
                  <p className="text-xs font-bold text-amiko-muted">{item.sub}</p>
                </div>
                <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-black text-slate-500">
                  Pronto
                </span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <p className="mb-1 text-xs font-black uppercase tracking-[0.14em] text-amiko-green">
            ¡Tarea completada!
          </p>
          <p className="mb-5 text-lg font-black text-amiko-ink">¿Qué quieres hacer ahora?</p>
          <div className="space-y-2 opacity-55">
            {[
              { emoji: "❓", label: "Quiz de repaso",       sub: "5 preguntas rápidas",        dur: "~2 min", bg: "bg-purple-50", bd: "border-purple-100" },
              { emoji: "🗺️", label: "Mapa mental",          sub: "Ideas organizadas",           dur: "~3 min", bg: "bg-blue-50",   bd: "border-blue-100"   },
              { emoji: "🎙️", label: "Escuchar un resumen",  sub: "Amiko lo cuenta en voz alta", dur: "~1 min", bg: "bg-orange-50", bd: "border-orange-100" },
              { emoji: "✏️", label: "Dibujar lo aprendido", sub: "Expresa lo que aprendiste",   dur: "libre",  bg: "bg-yellow-50", bd: "border-yellow-100" },
            ].map((act) => (
              <div
                key={act.label}
                className={`flex items-center gap-4 rounded-2xl border p-4 ${act.bg} ${act.bd}`}
              >
                <span className="select-none text-2xl">{act.emoji}</span>
                <div className="flex-1">
                  <p className="font-black text-amiko-ink">{act.label}</p>
                  <p className="text-xs font-bold text-amiko-muted">{act.sub}</p>
                </div>
                <span className="shrink-0 rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-black text-slate-500">
                  {act.dur}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-xs font-bold text-amiko-muted">
            Actividades disponibles muy pronto.
          </p>
        </>
      )}
    </div>
  );
}

// ─── Pause overlay ────────────────────────────────────────────────────────────

function PauseOverlay({
  taskId,
  stepNum,
  save,
  onResume,
}: {
  taskId: string;
  stepNum: number;
  save: SaveFn;
  onResume: () => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-amiko-navy/50 px-5 backdrop-blur-sm sm:left-1/2 sm:right-auto sm:w-full sm:max-w-[430px] sm:-translate-x-1/2">
      <div className="w-full rounded-[30px] bg-white p-6 shadow-soft">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-amiko-mint">
          <StudentPortalIcon name="calm" className="h-9 w-9 text-amiko-green" />
        </div>
        <h2 className="mt-4 text-center text-2xl font-black text-amiko-ink">Pausa breve</h2>
        <p className="mt-1 text-center text-sm font-bold text-amiko-muted">
          Está bien parar un momento.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          {breakActivities.slice(0, 4).map((act) => {
            const on = selected === act.label;
            return (
              <button
                key={act.label}
                type="button"
                onClick={() => {
                  setSelected(act.label);
                  save("calming_break", taskId, stepNum, act.label);
                }}
                className={`flex min-h-20 flex-col items-center justify-center gap-2 rounded-2xl border p-3 transition active:scale-95 ${
                  on ? "border-amiko-green bg-amiko-mint" : "border-amiko-blue/10 bg-amiko-sky/40"
                }`}
              >
                <StudentPortalIcon name={act.icon} className="h-7 w-7 text-amiko-blue" />
                <span className="text-xs font-black text-amiko-ink">{act.label}</span>
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={onResume}
          className="mt-5 min-h-12 w-full rounded-full bg-amiko-navy text-sm font-black text-white"
        >
          Volver a la tarea
        </button>
      </div>
    </div>
  );
}

// ─── Done screen ──────────────────────────────────────────────────────────────
// Animated celebration screen. Only this screen uses animate-celebrate-pop,
// animate-sparkle, and animate-slide-up — all other icons in the app are static.

const CELEBRATION_SPARKLES = [
  { top: "8%",  left: "6%",   animationDelay: "0s"    },
  { top: "14%", right: "7%",  animationDelay: "0.45s" },
  { top: "5%",  left: "44%",  animationDelay: "0.9s"  },
  { top: "32%", right: "5%",  animationDelay: "0.25s" },
  { top: "36%", left: "4%",   animationDelay: "1.1s"  },
  { top: "22%", left: "18%",  animationDelay: "0.65s" },
];

function DoneScreen({
  task,
  studentName,
  onViewActivities,
  onExit,
}: {
  task: StudentPortalTask;
  studentName: string;
  onViewActivities: () => void;
  onExit: () => void;
}) {
  const [emotion, setEmotion] = useState<"bien" | "regular" | "difícil" | null>(null);

  return (
    <div className={`${SHELL} bg-gradient-to-b from-[#FFF8E8] via-[#ECF6D0] to-[#E8F4FD]`}>
      {/* 6 floating stars — only animated on task completion */}
      {CELEBRATION_SPARKLES.map((style, i) => (
        <span
          key={i}
          className="pointer-events-none absolute select-none text-2xl animate-sparkle"
          style={style}
        >
          ⭐
        </span>
      ))}

      {/* Scrollable content */}
      <div className="relative flex flex-1 flex-col items-center overflow-y-auto px-6 py-10">

        {/* AmikoMark — pop animation, ping ring behind */}
        <div className="relative shrink-0">
          <div className="absolute inset-[-10px] animate-ping rounded-full bg-amiko-green/15" />
          <AmikoMark className="relative h-28 w-28 animate-celebrate-pop" />
        </div>

        {/* Trophy 3D */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Trophy/3D/trophy_3d.png"
          alt="Trofeo"
          className="mt-2 h-16 w-16 animate-slide-up object-contain"
          style={{ animationDelay: "0.2s" }}
        />

        {/* Congratulations */}
        <h1
          className="mt-4 animate-slide-up text-center text-3xl font-black leading-tight text-amiko-ink"
          style={{ animationDelay: "0.35s" }}
        >
          ¡Felicitaciones,
        </h1>
        <p
          className="animate-slide-up text-center text-4xl font-black text-amiko-green"
          style={{ animationDelay: "0.5s" }}
        >
          {studentName}!
        </p>
        <p
          className="mt-2 animate-slide-up text-center text-base font-bold text-amiko-muted"
          style={{ animationDelay: "0.65s" }}
        >
          Terminaste todos los ejercicios de {task.title}.
        </p>

        {/* Reward */}
        <div
          className="mt-5 flex w-full max-w-xs animate-slide-up items-center gap-4 rounded-3xl bg-white px-6 py-4 shadow-card"
          style={{ animationDelay: "0.8s" }}
        >
          <span className="select-none text-3xl">{REWARD_EMOJI[task.rewardIcon] ?? "🎁"}</span>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-amiko-green">
              Ahora puedes
            </p>
            <p className="text-xl font-black text-amiko-ink">{task.reward}</p>
          </div>
        </div>

        {/* Emotion check-in */}
        {!emotion ? (
          <div
            className="mt-6 w-full max-w-xs animate-slide-up rounded-3xl bg-white p-5 shadow-card"
            style={{ animationDelay: "0.95s" }}
          >
            <p className="mb-3 text-center text-sm font-black text-amiko-ink">¿Cómo te fue?</p>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { key: "bien",    emoji: "😊", label: "Bien"        },
                  { key: "regular", emoji: "😐", label: "Más o menos" },
                  { key: "difícil", emoji: "😓", label: "Difícil"     },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setEmotion(opt.key)}
                  className="flex flex-col items-center gap-1 rounded-2xl border border-slate-100 p-3 transition hover:bg-amiko-sky active:scale-95"
                >
                  <span className="select-none text-3xl">{opt.emoji}</span>
                  <span className="text-[10px] font-black text-amiko-muted">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <p
            className="mt-6 w-full max-w-xs animate-slide-up rounded-3xl bg-white px-6 py-4 text-center text-sm font-black text-amiko-ink shadow-card"
            style={{ animationDelay: "0.95s" }}
          >
            {emotion === "bien"    ? "¡Qué bueno! Lo registramos."    : ""}
            {emotion === "regular" ? "Gracias por contarme. Seguimos." : ""}
            {emotion === "difícil" ? "Gracias. Tu tutor lo verá."      : ""}
          </p>
        )}

        {/* Action buttons */}
        <div
          className="mt-6 flex w-full max-w-xs animate-slide-up flex-col gap-3"
          style={{ animationDelay: "1.1s" }}
        >
          <button
            type="button"
            onClick={onViewActivities}
            className="min-h-12 rounded-full bg-amiko-blue px-6 text-sm font-black text-white shadow-card transition hover:brightness-95"
          >
            ✨ Ver actividades de cierre
          </button>
          <button
            type="button"
            onClick={onExit}
            className="min-h-12 rounded-full border-2 border-amiko-navy px-6 text-sm font-black text-amiko-navy transition hover:bg-amiko-sky"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── StudentTaskWorkspace ─────────────────────────────────────────────────────
//
// Workspace interno de tarea del estudiante.
// Se muestra después de que el estudiante selecciona una tarea y toca "Vamos".
//
// Estructura:
//   Header (flecha atrás + título + botón Pausar)
//   Tabs contextuales: Fuentes / Amiko / Recursos
//   Sin navbar principal (z-[60] cubre el nav de StudentShell)
//
// No confundir con:
//   StudentStepRunner — pantalla individual de paso con fondo azul (legacy)
//   Home del estudiante — pantalla con lista de tareas

export function StudentTaskWorkspace({
  task,
  onExit,
  demoMode = false,
}: {
  task: StudentPortalTask;
  onExit: () => void;
  demoMode?: boolean;
}) {
  const save = useMemo<SaveFn>(
    () => saveProgressEvent,
    [],
  );

  const isMath    = task.taskType === "math" && (task.mathExercises?.length ?? 0) > 0;
  const exercises = task.mathExercises ?? [];

  const [phase,      setPhase]      = useState<Phase>("ready");
  const [activeTab,  setActiveTab]  = useState<WorkspaceTab>("amiko");
  const [taskDone,   setTaskDone]   = useState(false);
  const [showPause,  setShowPause]  = useState(false);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [hintLevel,  setHintLevel]  = useState(0);
  const [answer,     setAnswer]     = useState("");
  const [checked,    setChecked]    = useState(false);
  const [isCorrect,  setIsCorrect]  = useState(false);

  const currentEx = exercises[currentIdx];
  const stepNum   = currentIdx + 1;

  const handleExit = useCallback(() => {
    save("task_paused", task.id, stepNum);
    onExit();
  }, [onExit, save, stepNum, task.id]);

  const handleRevisar = useCallback(() => {
    if (!currentEx) return;
    const correct = Number(answer) === getCorrectAnswer(currentEx);
    setChecked(true);
    setIsCorrect(correct);
    if (correct) {
      save("step_completed", task.id, stepNum);
      if (soundSettings.canPlay()) playSound("confirm");
    } else {
      if (soundSettings.canPlay()) playSound("tap");
    }
  }, [answer, currentEx, save, stepNum, task.id]);

  const handleNoEntendi = useCallback(() => {
    if (!currentEx) return;
    const next = Math.min(hintLevel + 1, 3);
    setHintLevel(next);
    save("help_requested", task.id, stepNum, `hint_${next}`);
    if (soundSettings.canPlay()) playSound("discover");
  }, [currentEx, hintLevel, save, stepNum, task.id]);

  const handleNext = useCallback(() => {
    if (currentIdx + 1 >= exercises.length) {
      save("task_completed", task.id);
      setTaskDone(true);
      setPhase("done");
      if (soundSettings.canPlay()) playSound("celebrate");
      return;
    }
    setCurrentIdx((i) => i + 1);
    setHintLevel(0);
    setAnswer("");
    setChecked(false);
    setIsCorrect(false);
  }, [currentIdx, exercises.length, save, task.id]);

  // ── Ready ─────────────────────────────────────────────────────────────────

  if (phase === "ready") {
    return (
      <div
        className={`${SHELL} items-center justify-center bg-gradient-to-b from-amiko-sky via-white to-amiko-mint px-6`}
      >
        <button
          type="button"
          onClick={handleExit}
          className="absolute left-5 top-5 flex items-center gap-1 rounded-full bg-white/90 px-4 py-2 text-sm font-black text-amiko-muted shadow-card"
        >
          <AmikoIcon name="back" className="h-4 w-4" /> Salir
        </button>

        <AmikoMark className="mb-5 h-20 w-20" />
        <p className="text-xs font-black uppercase tracking-[0.16em] text-amiko-green">
          Antes de empezar
        </p>
        <h1 className="mb-8 mt-2 text-3xl font-black text-amiko-ink">Vamos paso a paso</h1>

        <div className="flex w-full max-w-xs flex-col gap-4">
          <div className="rounded-[28px] border-l-4 border-l-amiko-blue bg-white p-5 shadow-card">
            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-amiko-blue">
              Tu tarea de hoy
            </p>
            <div className="mt-3 flex items-center gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amiko-sky/50">
                <StudentPortalIcon name={task.icon} className="h-8 w-8 text-amiko-blue" />
              </span>
              <div>
                <p className="text-xl font-black text-amiko-ink">{task.title}</p>
                <p className="text-sm font-bold text-amiko-muted">
                  {isMath ? `${exercises.length} ejercicios` : `${task.steps.length} pasos`}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border-l-4 border-l-amiko-green bg-[#FDFBF7] p-5 shadow-card">
            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-amiko-green">
              Al terminar te espera
            </p>
            <div className="mt-3 flex items-center gap-4">
              <span className="select-none text-3xl">
                {REWARD_EMOJI[task.rewardIcon] ?? "🎁"}
              </span>
              <p className="text-xl font-black text-amiko-ink">{task.reward}</p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setPhase("workspace");
            if (soundSettings.canPlay()) playSound("tap");
          }}
          className="mt-10 min-h-16 w-full max-w-xs rounded-full bg-amiko-green text-2xl font-black text-white shadow-card transition active:scale-95"
        >
          Vamos
        </button>
      </div>
    );
  }

  // ── Done ──────────────────────────────────────────────────────────────────

  if (phase === "done") {
    return (
      <DoneScreen
        task={task}
        studentName={studentPortalStudent.name}
        onViewActivities={() => {
          setActiveTab("recursos");
          setPhase("workspace");
        }}
        onExit={onExit}
      />
    );
  }

  // ── Workspace ─────────────────────────────────────────────────────────────

  return (
    <div className={`${SHELL} bg-[#F7F9FC]`}>
      {showPause && (
        <PauseOverlay
          taskId={task.id}
          stepNum={stepNum}
          save={save}
          onResume={() => setShowPause(false)}
        />
      )}

      <header className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-white px-4 py-3">
        <button
          type="button"
          onClick={handleExit}
          aria-label="Volver"
          className="flex h-9 w-9 items-center justify-center rounded-full text-amiko-navy transition hover:bg-amiko-sky"
        >
          <AmikoIcon name="back" className="h-5 w-5" />
        </button>

        <h1 className="flex-1 truncate px-3 text-center text-base font-black text-amiko-ink">
          {task.title}
        </h1>

        <button
          type="button"
          onClick={() => setShowPause(true)}
          className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-black text-amiko-muted transition hover:border-amiko-blue hover:text-amiko-blue"
        >
          Pausar
        </button>
      </header>

      <div className="flex min-h-0 flex-1 flex-col">
        {activeTab === "pasos" && (
          <FuentesTab task={task} currentIdx={currentIdx} />
        )}

        {activeTab === "amiko" && isMath && currentEx && (
          <AmikoTab
            exercises={exercises}
            currentIdx={currentIdx}
            hintLevel={hintLevel}
            answer={answer}
            checked={checked}
            isCorrect={isCorrect}
            onAnswerChange={setAnswer}
            onRevisar={handleRevisar}
            onNext={handleNext}
            onGoToRecursos={() => setActiveTab("recursos")}
          />
        )}

        {activeTab === "amiko" && !isMath && (
          <div className="flex-1 overflow-y-auto px-5 py-6">
            <AmikoBubble message="Empecemos. Haz el primer paso con calma." />
          </div>
        )}

        {activeTab === "recursos" && currentEx && (
          <RecursosTab
            task={task}
            ex={currentEx}
            hintLevel={hintLevel}
            taskDone={taskDone}
            onNoEntendi={handleNoEntendi}
          />
        )}
      </div>

      <WorkspaceTabBar active={activeTab} onChange={setActiveTab} />
    </div>
  );
}
