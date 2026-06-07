import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();

    // 1. Check auth
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

    // 2. Check if profile row exists
    const { data: profile, error: selectError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (selectError) {
      return NextResponse.json({
        step: "select",
        error: selectError.message,
        code: selectError.code,
        details: selectError.details,
      });
    }

    // 3. Try update
    const { data: updated, error: updateError } = await supabase
      .from("profiles")
      .update({
        full_name: "Luis Simon",
        role: "caregiver",
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
      .select("*")
      .maybeSingle();

    if (updateError) {
      return NextResponse.json({
        step: "update",
        error: updateError.message,
        code: updateError.code,
        details: updateError.details,
        hint: updateError.hint,
        profileExists: !!profile,
        profileData: profile,
      });
    }

    // 4. If update returned nothing, try insert
    if (!updated) {
      const { data: inserted, error: insertError } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          email: user.email,
          full_name: "Luis Simon",
          role: "caregiver",
        })
        .select("*")
        .maybeSingle();

      if (insertError) {
        return NextResponse.json({
          step: "insert",
          error: insertError.message,
          code: insertError.code,
          details: insertError.details,
          hint: insertError.hint,
        });
      }

      return NextResponse.json({
        step: "insert_success",
        message: "Profile was created (did not exist before)",
        data: inserted,
      });
    }

    return NextResponse.json({
      step: "update_success",
      message: "Profile updated successfully",
      before: profile,
      after: updated,
    });
  } catch (err: unknown) {
    return NextResponse.json({
      step: "exception",
      error: String(err),
    });
  }
}
