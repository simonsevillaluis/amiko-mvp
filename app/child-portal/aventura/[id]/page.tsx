import { redirect } from "next/navigation";

export default async function ChildPortalAventuraLegacy({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/student-portal/aventura/${id}`);
}
