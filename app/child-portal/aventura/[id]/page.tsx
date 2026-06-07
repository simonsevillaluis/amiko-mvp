"use client";

import { useParams } from "next/navigation";
import { childTasks } from "@/lib/child-mock-data";
import { ChildAdventure } from "@/components/child-adventure";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export default function AventuraPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.id as string;
  const task = childTasks.find((t) => t.id === taskId) ?? childTasks[0];

  const handleExit = useCallback(() => {
    router.push("/child-portal");
  }, [router]);

  return <ChildAdventure task={task} onExit={handleExit} />;
}
