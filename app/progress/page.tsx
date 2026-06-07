import { AmikoIcon, type AmikoIconName } from "@/components/amiko-icon";
import { DetailShell } from "@/components/detail-shell";
import { getFirstStudent } from "@/lib/supabase/students";
import { createClient } from "@/lib/supabase/server";

const skillsInProgress: Array<{
  category: string;
  title: string;
  detail: string;
  progress: number;
  icon: AmikoIconName;
  iconTone: string;
  barTone: string;
  completed?: boolean;
}> = [
  {
    category: "Comunicación",
    title: "Pedir ayuda cuando la necesita",
    detail: "3 de 4 oportunidades registradas esta semana",
    progress: 75,
    icon: "help",
    iconTone: "bg-amiko-blue text-white",
    barTone: "bg-gradient-to-r from-amiko-blue to-cyan-400",
  },
  {
    category: "Calma",
    title: "Volver después de una pausa",
    detail: "3 de 5 oportunidades registradas esta semana",
    progress: 60,
    icon: "history",
    iconTone: "bg-amiko-navy text-white",
    barTone: "bg-gradient-to-r from-amiko-blue to-amiko-green",
  },
  {
    category: "Meta semanal",
    title: "Seguir tres pasos cortos",
    detail: "Meta observada durante una tarea acompañada",
    progress: 100,
    icon: "check",
    iconTone: "bg-green-700 text-white",
    barTone: "bg-gradient-to-r from-amiko-green to-green-500",
    completed: true,
  },
];

const achievements: Array<{
  title: string;
  description: string;
  when: string;
  icon: AmikoIconName;
  tone: string;
}> = [
  {
    title: "Volvió a intentarlo",
    description: "Retomó una actividad después de una pausa.",
    when: "Hoy",
    icon: "history",
    tone: "bg-amiko-mint text-green-800",
  },
  {
    title: "Pidió ayuda",
    description: "Reconoció que necesitaba apoyo para continuar.",
    when: "Ayer",
    icon: "help",
    tone: "bg-amiko-sky text-amiko-blue",
  },
  {
    title: "Terminó con apoyo",
    description: "Completó la tarea acompañado, paso a paso.",
    when: "Esta semana",
    icon: "check",
    tone: "bg-amiko-cream text-amiko-navy",
  },
];

const nextAchievements = [
  "Completar una tarea corta.",
  "Usar una pausa antes de frustrarse.",
  "Seguir tres pasos simples.",
];

export default async function ProgressPage() {
  const firstStudent = await getFirstStudent();
  const studentName = firstStudent?.name ?? "tu estudiante";
  const studentId = firstStudent?.id;

  let completedTasksCount = 0;
  let stepsCompletedCount = 0;
  let helpRequestedCount = 0;
  let frustrationReportedCount = 0;

  if (studentId) {
    const supabase = await createClient();
    const [
      { count: completed },
      { count: steps },
      { count: help },
      { count: frustration },
    ] = await Promise.all([
      supabase
        .from("tasks")
        .select("id", { count: "exact", head: true })
        .eq("student_id", studentId)
        .eq("status", "completed"),
      supabase
        .from("progress_events")
        .select("id", { count: "exact", head: true })
        .eq("student_id", studentId)
        .eq("event_type", "step_completed"),
      supabase
        .from("progress_events")
        .select("id", { count: "exact", head: true })
        .eq("student_id", studentId)
        .eq("event_type", "help_requested"),
      supabase
        .from("progress_events")
        .select("id", { count: "exact", head: true })
        .eq("student_id", studentId)
        .eq("event_type", "frustration_reported"),
    ]);

    completedTasksCount = completed || 0;
    stepsCompletedCount = steps || 0;
    helpRequestedCount = help || 0;
    frustrationReportedCount = frustration || 0;
  }

  const metricsList = [
    {
      value: String(completedTasksCount),
      label: "Tareas acompañadas",
      icon: "task" as AmikoIconName,
      valueTone: "text-amiko-blue",
      iconTone: "bg-amiko-sky text-amiko-blue",
    },
    {
      value: String(stepsCompletedCount),
      label: "Pasos completados",
      icon: "check" as AmikoIconName,
      valueTone: "text-amiko-green",
      iconTone: "bg-amiko-mint text-green-800",
    },
    {
      value: String(helpRequestedCount),
      label: "Veces pidió ayuda",
      icon: "help" as AmikoIconName,
      valueTone: "text-amiko-navy",
      iconTone: "bg-amiko-cream text-amiko-navy",
    },
    {
      value: String(frustrationReportedCount),
      label: "Pausa usada",
      icon: "pause" as AmikoIconName,
      valueTone: "text-amiko-blue",
      iconTone: "bg-blue-50 text-amiko-blue",
    },
  ];

  return (
    <DetailShell title="Logros" fallbackHref="/acompanamiento">
      <section className="mb-6">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-amiko-green">
          Avances de {studentName}
        </p>
        <h1 className="mt-2 text-3xl font-black leading-tight text-amiko-ink">Logros</h1>
        <p className="mt-2 text-base font-bold leading-7 text-amiko-muted">
          Los pequeños avances también cuentan, incluso cuando el día fue difícil.
        </p>
      </section>

      <section className="mb-6 rounded-3xl border border-blue-100 bg-white p-4 shadow-card">
        <div className="rounded-3xl bg-gradient-to-br from-amiko-sky via-white to-amiko-mint px-4 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-amiko-green shadow-sm">
              <AmikoIcon name="award" className="h-7 w-7" />
            </span>
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-amiko-green">
                Esta semana
              </p>
              <h2 className="mt-1 text-xl font-black leading-tight text-amiko-navy">
                Avanzaron a su propio ritmo
              </h2>
            </div>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2.5">
          {metricsList.map((metric) => (
            <div
              key={metric.label}
              className="rounded-[20px] border border-blue-100 bg-slate-50/70 px-3 py-3"
            >
              <div className="flex items-center justify-between gap-2">
                <p className={`text-3xl font-black leading-none ${metric.valueTone}`}>{metric.value}</p>
                <span className={`flex h-8 w-8 items-center justify-center rounded-xl ${metric.iconTone}`}>
                  <AmikoIcon name={metric.icon} className="h-4 w-4" />
                </span>
              </div>
              <p className="mt-2 text-[11px] font-black leading-4 text-amiko-muted">{metric.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-7">
        <div className="mb-3">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-amiko-green">
            Gamificación tranquila
          </p>
          <h2 className="mt-1 text-xl font-black text-amiko-ink">Habilidades en camino</h2>
          <p className="mt-2 text-sm font-bold leading-6 text-amiko-muted">
            Se actualizan con tareas y registros. No necesitas responder preguntas todos los días.
          </p>
        </div>

        <div className="space-y-3">
          {skillsInProgress.map((skill) => (
            <article
              key={skill.title}
              className={`rounded-3xl border p-4 shadow-card ${
                skill.completed
                  ? "border-green-200 bg-gradient-to-br from-amiko-mint to-green-50"
                  : "border-blue-100 bg-white"
              }`}
            >
              <div className="flex items-center gap-4">
                <span
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${skill.iconTone}`}
                >
                  <AmikoIcon name={skill.icon} className="h-7 w-7" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="inline-flex rounded-full bg-amiko-mint px-3 py-1 text-[10px] font-black uppercase tracking-wide text-green-800">
                        {skill.category}
                      </span>
                      <h3 className="mt-2 font-black leading-5 text-amiko-ink">{skill.title}</h3>
                    </div>
                    <span
                      className={`shrink-0 text-2xl font-black ${
                        skill.completed ? "text-green-700" : "text-amiko-blue"
                      }`}
                    >
                      {skill.progress}%
                    </span>
                  </div>
                  <p className="mt-2 text-xs font-bold leading-5 text-amiko-muted">{skill.detail}</p>
                </div>
              </div>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100 p-1">
                <div
                  className={`h-full rounded-full ${skill.barTone}`}
                  style={{ width: `${skill.progress}%` }}
                />
              </div>
            </article>
          ))}
        </div>

        <p className="mt-3 rounded-2xl bg-amiko-sky px-4 py-3 text-xs font-bold leading-5 text-amiko-navy">
          Estos porcentajes muestran el avance hacia una meta semanal. No miden la capacidad de {studentName}.
        </p>
      </section>

      <section className="mb-7">
        <h2 className="mb-3 text-xl font-black text-amiko-ink">Logros recientes</h2>
        <div className="space-y-3">
          {achievements.map((achievement) => (
            <article
              key={achievement.title}
              className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-card"
            >
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${achievement.tone}`}>
                <AmikoIcon name={achievement.icon} className="h-6 w-6" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-black text-amiko-ink">{achievement.title}</h3>
                  <span className="shrink-0 text-xs font-black text-amiko-green">{achievement.when}</span>
                </div>
                <p className="mt-1 text-sm font-bold leading-6 text-amiko-muted">{achievement.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[24px] bg-gradient-to-br from-amiko-mint to-white p-5 shadow-card">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-green-800">
          Próximos logros posibles
        </p>
        <h2 className="mt-2 text-xl font-black text-amiko-ink">Sin presión, solo posibilidades</h2>
        <div className="mt-4 space-y-3">
          {nextAchievements.map((achievement) => (
            <div key={achievement} className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amiko-mint text-amiko-green">
                <AmikoIcon name="sparkles" className="h-4 w-4" />
              </span>
              <p className="text-sm font-black text-amiko-ink">{achievement}</p>
            </div>
          ))}
        </div>
      </section>
    </DetailShell>
  );
}
