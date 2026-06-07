import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { getSupabasePublishableKey, getSupabaseUrl, hasSupabaseEnv } from "@/lib/supabase/env";

const protectedRoutes = [
  "/acompanamiento",
  "/adapt-task",
  "/alerts",
  "/bienestar",
  // "/child-mode", // Habilitado acceso directo para pruebas de demo
  "/child-portal",
  "/student-portal",
  "/comunidad",
  "/dashboard",
  "/historial",
  "/mi-dia",
  "/onboarding",
  "/professionals",
  "/progress",
  "/register/student",
  "/settings",
  // "/student-mode", // Habilitado acceso directo para pruebas de demo
  "/student-portal",
  "/students",
  "/tasks",
  "/teacher",
];

const authRoutes = ["/", "/login", "/register"];

function startsWithRoute(pathname: string, routes: string[]) {
  return routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

function isDevelopmentChildPortalPreview(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const host = request.headers.get("host")?.split(":")[0];
  const isLocalHost = host === "localhost" || host === "127.0.0.1" || host === "::1";
  const localPreviewEnabled =
    isLocalHost &&
    (process.env.npm_lifecycle_event === "dev" ||
      process.env.AMIKO_ENABLE_CHILD_PORTAL_DEMO === "1");

  return (
    localPreviewEnabled &&
    searchParams.get("demo") === "1" &&
    startsWithRoute(pathname, ["/child-portal", "/student-portal"])
  );
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const { pathname } = request.nextUrl;

  // Solo para revision visual local: permite /child-portal?demo=1 sin sesion
  // cuando el servidor corre con `npm run dev` o una variable local explicita.
  // En production esta excepcion no aplica y /child-portal sigue protegido.
  if (isDevelopmentChildPortalPreview(request)) {
    return response;
  }

  if (!hasSupabaseEnv()) {
    return response;
  }

  const supabase = createServerClient(getSupabaseUrl()!, getSupabasePublishableKey()!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && startsWithRoute(pathname, protectedRoutes)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (user && authRoutes.includes(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}
