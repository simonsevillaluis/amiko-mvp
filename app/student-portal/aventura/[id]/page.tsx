"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback } from "react";
import { studentPortalTasks } from "@/lib/student-mock-data";
import { StudentAdventure } from "@/components/student-adventure";

export default function AventuraPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.id as string;
  const task = studentPortalTasks.find((t) => t.id === taskId) ?? studentPortalTasks[0];

  const handleExit = useCallback(() => {
    router.push("/student-portal");
  }, [router]);

  return <StudentAdventure task={task} onExit={handleExit} />;
}
