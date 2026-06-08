import { redirect } from "next/navigation";

export default async function ChildModeLegacyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/paso-a-paso/${id}`);
}
