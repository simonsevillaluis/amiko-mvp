import { redirect } from "next/navigation";

// Redirect permanente: /child-mode/[id] → /student-mode/[id]
// Mantener esta redirección para compatibilidad con enlaces existentes.
export default async function ChildModeLegacyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/student-mode/${id}`);
}
