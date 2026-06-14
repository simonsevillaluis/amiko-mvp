import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOrSyncProfile } from "@/lib/supabase/profile";
import { getFirstStudent } from "@/lib/supabase/students";
import ConversationClient from "./ConversationClient";

export default async function ConversationPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [profile, firstStudent] = await Promise.all([
    getOrSyncProfile(user.id),
    getFirstStudent(),
  ]);

  const metaFullName =
    (user.user_metadata?.full_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined);
  const adultFirstName =
    profile?.full_name?.trim()?.split(" ")[0] ||
    metaFullName?.trim()?.split(" ")[0] ||
    "Adulto";
  const studentName = firstStudent?.name ?? "tu estudiante";

  return (
    <ConversationClient
      studentName={studentName}
      adultFirstName={adultFirstName}
    />
  );
}
