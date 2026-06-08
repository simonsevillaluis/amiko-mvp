import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AmikoIcon, type AmikoIconName } from "@/components/amiko-icon";
import { AppShell } from "@/components/app-shell";
import { createClient } from "@/lib/supabase/server";
import { getOrSyncProfile } from "@/lib/supabase/profile";
import { TaskCard, type TaskStatus } from "@/components/task-card";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Obtener perfil del adulto para mostrar su nombre real
  // (getOrSyncProfile completa full_name/role desde los metadatos de auth si faltan)
  const profile = await getOrSyncProfile(user.id);

  const metaFullName =
    (user.user_metadata?.full_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined);
  const adultName =
    profile?.full_name?.trim()?.split(" ")[0] ||
    metaFullName?.trim()?.split(" ")[0] ||
    "Adulto";

  // Consultar estudiantes reales del usuario
  const { data: students } = await supabase
    .from("student_profiles")
    .select("id, name")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  const hasStudents = students && students.length > 0;

  if (!hasStudents) {
    return (
      <AppShell>
        <section className="mb-6">
          <p className="text-3xl font-black leading-tight text-amiko-ink">Hola, {adultName}.</p>
          <p className="mt-2 text-lg font-bold leading-7 text-amiko-muted">
            Te damos la bienvenida a AMIKO.
          </p>
        </section>

        <div className="flex flex-col items-center justify-center rounded-[32px] border border-amiko-blue/15 bg-amiko-sky px-6 py-8 text-center shadow-soft mb-8">
          <div className="relative mb-5 flex justify-center">
            <Image
              src="/amiko-character/amiko-character-photo.svg"
              alt="Mascota de AMIKO dándote la bienvenida"
              width={140}
              height={140}
              className="object-contain hover:scale-105 transition-transform duration-300"
              priority
            />
          </div>

          <h2 className="text-2xl font-black text-amiko-navy leading-tight">
            ¡Creemos el perfil de tu estudiante!
          </h2>
          <p className="mt-3 max-w-[280px] text-base font-bold leading-6 text-amiko-muted">
            Para comenzar a adaptar tareas escolares y registrar sus avances paso a paso, primero necesitamos crear su perfil pedagógico.
          </p>

          <Link
            href="/register/student"
            className="focus-ring mt-6 flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-amiko-green px-6 text-lg font-black text-white shadow-card transition hover:opacity-90"
          >
            <AmikoIcon name="sparkles" className="h-5 w-5" />
            Crear perfil pedagógico
          </Link>
        </div>

        <section>
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-black text-amiko-ink">Recursos para ti</h2>
              <p className="mt-1 text-sm font-bold text-amiko-muted">Herramientas de apoyo y bienestar.</p>
            </div>
          </div>
          <div className="space-y-3">
            <Link
              href="/bienestar"
              className="focus-ring flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-card transition hover:-translate-y-0.5"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amiko-cream text-amiko-coral">
                <AmikoIcon name="calm" className="h-6 w-6" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-black text-amiko-ink">Bienestar</span>
                <span className="mt-1 block text-sm font-bold leading-5 text-amiko-muted">
                  Respira, baja la carga y vuelve con calma.
                </span>
              </span>
              <AmikoIcon name="chevron" className="h-5 w-5 shrink-0 text-slate-400" />
            </Link>
          </div>
        </section>
      </AppShell>
    );
  }

  const currentStudent = students[0];
  const studentId = currentStudent.id;

  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

  // Consultar estadísticas en tiempo real desde Supabase para el estudiante
  const [
    { count: completedTasksCount },
    { count: stepsCompletedCount },
    { count: helpRequestedCount },
    { count: frustrationReportedCount },
    { data: dbTasks },
    { data: progressEvents },
    { count: recentHelpCount },
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
    supabase
      .from("tasks")
      .select(`
        id,
        title,
        subject,
        original_text,
        status,
        updated_at,
        adapted_tasks (
          simple_summary,
          steps,
          difficulty_level
        )
      `)
      .eq("student_id", studentId)
      .order("updated_at", { ascending: false })
      .limit(3),
    supabase
      .from("progress_events")
      .select("task_id, step_number, event_type")
      .eq("student_id", studentId)
      .eq("event_type", "step_completed"),
    supabase
      .from("progress_events")
      .select("id", { count: "exact", head: true })
      .eq("student_id", studentId)
      .eq("event_type", "help_requested")
      .gte("created_at", yesterday),
  ]);

  const hasTasks = dbTasks && dbTasks.length > 0;
  const tasks = dbTasks?.map((t) => {
    const adaptation = t.adapted_tasks?.[0];
    const stepsArray = Array.isArray(adaptation?.steps) ? adaptation.steps : [];
    const totalSteps = stepsArray.length;
    
    const completedSteps = progressEvents
      ? new Set(
          progressEvents
            .filter((e) => e.task_id === t.id)
            .map((e) => e.step_number)
        ).size
      : 0;

    return {
      id: t.id,
      title: t.title,
      subject: t.subject || undefined,
      original_text: t.original_text,
      status: t.status as TaskStatus,
      updated_at: t.updated_at,
      completed_steps: completedSteps,
      total_steps: totalSteps,
      simple_summary: adaptation?.simple_summary || undefined,
      difficulty_level: adaptation?.difficulty_level || undefined,
    };
  }) || [];

  const weekSummary = [
    { value: String(completedTasksCount || 0), label: "Tareas acompañadas", tone: "text-amiko-green" },
    { value: String(stepsCompletedCount || 0), label: "Pasos completados", tone: "text-amiko-blue" },
    { value: String(helpRequestedCount || 0), label: "Veces pidió ayuda", tone: "text-amiko-navy" },
    { value: String(frustrationReportedCount || 0), label: "Pausa que ayudó", tone: "text-amiko-coral" },
  ];

  const quickActions: Array<{
    title: string;
    description: string;
    href: string;
    icon: AmikoIconName;
    tone: string;
  }> = [
    {
      title: "Registrar cómo fue la tarea",
      description: "Guarda lo que funcionó y lo que costó hoy.",
      href: "/mi-dia",
      icon: "journal",
      tone: "bg-amiko-sky text-amiko-blue",
    },
    {
      title: "Bienestar",
      description: "Respira, baja la carga y vuelve con calma.",
      href: "/bienestar",
      icon: "calm",
      tone: "bg-amiko-cream text-amiko-coral",
    },
    {
      title: "Revisar la red de apoyo",
      description: `Mira quiénes pueden acompañar a ${currentStudent.name}.`,
      href: "/comunidad",
      icon: "users",
      tone: "bg-amiko-mint text-green-800",
    },
  ];

  return (
    <AppShell>
      <section className="mb-6">
        <p className="text-3xl font-black leading-tight text-amiko-ink">Hola, {adultName}.</p>
        <p className="mt-2 text-lg font-bold leading-7 text-amiko-muted">
          ¿Cómo ayudamos hoy a <span className="text-amiko-green">{currentStudent.name}</span>?
        </p>
      </section>

      {(recentHelpCount ?? 0) > 0 && (
        <div className="mb-5 flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3.5 shadow-sm">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
            <AmikoIcon name="help" className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-black text-amber-800">
              {currentStudent.name} pidió ayuda
            </p>
            <p className="text-xs font-bold text-amber-600">
              Hay una solicitud de ayuda en las últimas 24 horas.
            </p>
          </div>
          <Link
            href="/acompanamiento"
            className="shrink-0 rounded-full bg-amber-500 px-3 py-1.5 text-xs font-black text-white transition hover:brightness-95"
          >
            Ver
          </Link>
        </div>
      )}

      <Link
        href="/adapt-task"
        className="focus-ring group relative mb-6 block overflow-hidden rounded-[28px] bg-gradient-to-br from-amiko-blue via-amiko-navy to-[#082A61] p-6 text-white shadow-soft"
      >
        <div className="relative z-10 max-w-[72%]">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-100">
            Vamos paso a paso
          </p>
          <h1 className="mt-2 text-2xl font-black leading-tight">Adaptar una tarea</h1>
          <p className="mt-3 text-sm font-bold leading-6 text-blue-100">
            Escribe la consigna y Amiko la convierte en instrucciones claras para acompañarla.
          </p>
          <span className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-5 text-sm font-black text-amiko-navy shadow-card transition group-hover:-translate-y-0.5">
            <AmikoIcon name="sparkles" className="h-5 w-5" />
            Adaptar ahora
          </span>
        </div>
        <div className="absolute -bottom-2 -right-1 h-40 w-40 rounded-full bg-amiko-green/20" />
        <Image
          src="/amiko-character/amiko-character-photo.svg"
          alt=""
          width={122}
          height={122}
          className="absolute bottom-1 right-0 object-contain drop-shadow-md"
        />
      </Link>

      {/* Tareas del estudiante */}
      <section className="mb-7">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-amiko-blue">
              Tareas de {currentStudent.name}
            </p>
            <h2 className="mt-1 text-xl font-black text-amiko-ink">
              Seguimiento diario
            </h2>
          </div>
          <Link
            href="/historial"
            className="text-xs font-black text-amiko-blue hover:underline"
          >
            Ver historial
          </Link>
        </div>

        {hasTasks ? (
          <div className="space-y-4">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <div className="rounded-[24px] border border-dashed border-slate-200 bg-white p-6 text-center shadow-sm">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amiko-sky text-amiko-blue">
              <AmikoIcon name="task" className="h-6 w-6" />
            </span>
            <h3 className="mt-3 text-base font-black text-amiko-ink">
              Sin tareas adaptadas aún
            </h3>
            <p className="mt-1 text-xs font-bold leading-5 text-amiko-muted">
              Usa el botón de arriba para adaptar la primera tarea de {currentStudent.name}.
            </p>
          </div>
        )}
      </section>

      <section className="mb-7 rounded-[24px] bg-gradient-to-br from-amiko-sky to-white p-5 shadow-card">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-amiko-blue">
              Esta semana
            </p>
            <h2 className="mt-1 text-xl font-black text-amiko-ink">Pequeños avances que cuentan</h2>
          </div>
          <Link
            href="/logros"
            className="focus-ring shrink-0 rounded-full bg-amiko-green px-3 py-2 text-xs font-black text-white shadow-sm transition hover:brightness-95"
          >
            Ver logros
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {weekSummary.map((item) => (
            <div key={item.label} className="rounded-2xl bg-white p-4 shadow-sm">
              <p className={`text-3xl font-black ${item.tone}`}>{item.value}</p>
              <p className="mt-1 text-xs font-bold leading-5 text-amiko-muted">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-black text-amiko-ink">Para acompañar hoy</h2>
            <p className="mt-1 text-sm font-bold text-amiko-muted">Elige solo lo que necesitas ahora.</p>
          </div>
          <Link href="/acompanamiento" className="text-xs font-black text-amiko-blue">
            Ver todo
          </Link>
        </div>
        <div className="space-y-3">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              href={action.href}
              className="focus-ring flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-card transition hover:-translate-y-0.5"
            >
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${action.tone}`}>
                <AmikoIcon name={action.icon} className="h-6 w-6" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-black text-amiko-ink">{action.title}</span>
                <span className="mt-1 block text-sm font-bold leading-5 text-amiko-muted">
                  {action.description}
                </span>
              </span>
              <AmikoIcon name="chevron" className="h-5 w-5 shrink-0 text-slate-400" />
            </Link>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
