"use client";

import { StudentTaskWorkspace } from "@/components/student-task-workspace";
import type { StudentPortalTask } from "@/lib/student-mock-data";

export function StudentAdventure({
  task,
  onExit,
  demoMode = false,
}: {
  task: StudentPortalTask;
  onExit: () => void;
  demoMode?: boolean;
}) {
  return <StudentTaskWorkspace task={task} onExit={onExit} demoMode={demoMode} />;
}
