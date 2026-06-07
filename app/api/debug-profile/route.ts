import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// Read-only diagnostic endpoint — reports auth state and profiles row without writing.
export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({
        step: "auth",
        error: authError?.message ?? "No user session",
      });
    }

    const { data: profile, error: selectError } = await supabase
      .from("profiles")
      .select("id, email, full_name, role, onboarding_completed, avatar_url, updated_at")
      .eq("id", user.id)
      .maybeSingle();

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        user_metadata: user.user_metadata,
      },
      profile: selectError
        ? { error: selectError.message, code: selectError.code }
        : profile,
    });
  } catch (err: unknown) {
    return NextResponse.json({
      step: "exception",
      error: String(err),
    });
  }
}
