import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

// Sesión: Supabase SSR renueva el refresh-token por cookie en cada petición.
// La sesión persiste en el navegador/teléfono mientras Supabase la considere válida.
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
