export type ProgressEventType =
  | "step_completed"
  | "help_requested"
  | "frustration_reported"
  | "task_paused"
  | "task_completed"
  | "calming_breathing"
  | "calming_break"
  | "emotion_checkin";

export type LocalProgressEvent = {
  id: string;
  taskId: string;
  stepNumber?: number;
  eventType: ProgressEventType;
  notes?: string;
  timestamp: string;
};

function getKeys() {
  const isDemo = typeof window !== "undefined" && window.location.pathname.startsWith("/demo");
  return {
    storageKey: isDemo ? "amiko_demo_progress_events" : "amiko_progress_events",
    checkinKey: isDemo ? "amiko_demo_last_checkin" : "amiko_last_checkin",
  };
}

function generateId(): string {
  return `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function saveProgressEvent(
  eventType: ProgressEventType,
  taskId: string,
  stepNumber?: number,
  notes?: string,
): LocalProgressEvent {
  const event: LocalProgressEvent = {
    id: generateId(),
    taskId,
    stepNumber,
    eventType,
    notes,
    timestamp: new Date().toISOString(),
  };

  const events = getProgressEvents();
  events.push(event);

  if (typeof window !== "undefined") {
    localStorage.setItem(getKeys().storageKey, JSON.stringify(events));
  }

  return event;
}

export function getProgressEvents(): LocalProgressEvent[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(getKeys().storageKey);
    return stored ? (JSON.parse(stored) as LocalProgressEvent[]) : [];
  } catch {
    return [];
  }
}

export function clearProgressEvents(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(getKeys().storageKey);
  }
}

export function getAggregatedMetrics() {
  const events = getProgressEvents();

  return {
    stepsCompleted: events.filter((e) => e.eventType === "step_completed").length,
    helpRequested: events.filter((e) => e.eventType === "help_requested").length,
    frustrationReported: events.filter((e) => e.eventType === "frustration_reported").length,
    tasksCompleted: events.filter((e) => e.eventType === "task_completed").length,
    tasksPaused: events.filter((e) => e.eventType === "task_paused").length,
    calmingUsed:
      events.filter((e) => e.eventType === "calming_breathing").length +
      events.filter((e) => e.eventType === "calming_break").length,
    totalEvents: events.length,
  };
}

export function shouldShowCheckin(): boolean {
  if (typeof window === "undefined") return false;

  try {
    const lastCheckin = localStorage.getItem(getKeys().checkinKey);
    if (!lastCheckin) return true;

    const last = new Date(lastCheckin);
    const now = new Date();
    const hoursDiff = (now.getTime() - last.getTime()) / (1000 * 60 * 60);

    return hoursDiff >= 6;
  } catch {
    return true;
  }
}

export function markCheckinDone(): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(getKeys().checkinKey, new Date().toISOString());
  }
}

export function getRecentEvents(limit = 10): LocalProgressEvent[] {
  const events = getProgressEvents();
  return events.slice(-limit).reverse();
}

export function getEventLabel(eventType: ProgressEventType): string {
  const labels: Record<ProgressEventType, string> = {
    step_completed: "Paso completado",
    help_requested: "Pidió ayuda",
    frustration_reported: "Se frustró",
    task_paused: "Pausó la tarea",
    task_completed: "Terminó la tarea",
    calming_breathing: "Usó respiración",
    calming_break: "Tomó un descanso",
    emotion_checkin: "Check-in emocional",
  };
  return labels[eventType];
}
