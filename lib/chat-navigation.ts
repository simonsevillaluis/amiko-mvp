export const CHAT_HOME_PATH = "/adapt-task/chat";
export const CHAT_CONVERSATION_PATH = "/adapt-task/chat/conversation";
export const CHAT_FALLBACK_PATH = "/dashboard";

const allowedChatReturnPaths = [
  "/dashboard",
  CHAT_HOME_PATH,
  "/bienestar",
  "/historial",
  "/acompanamiento",
  "/adapt-task",
  "/mi-dia",
  "/progress",
  "/settings",
  "/alerts",
  "/students",
  "/comunidad",
  "/faq",
  "/tasks/new",
  "/teacher",
];

function normalizePath(path: string | null | undefined) {
  if (!path) return null;

  try {
    const decodedPath = decodeURIComponent(path);

    if (!decodedPath.startsWith("/") || decodedPath.startsWith("//")) {
      return null;
    }

    const [pathname] = decodedPath.split(/[?#]/);
    return pathname || null;
  } catch {
    return null;
  }
}

function isAllowedChatReturnPath(path: string) {
  if (path === CHAT_CONVERSATION_PATH) return false;
  if (path.startsWith("/login") || path.startsWith("/register") || path.startsWith("/auth")) {
    return false;
  }

  return allowedChatReturnPaths.some((allowedPath) => {
    if (path === allowedPath) return true;
    return allowedPath !== "/" && path.startsWith(`${allowedPath}/`);
  });
}

export function getSafeChatReturnPath(
  path: string | null | undefined,
  fallback = CHAT_FALLBACK_PATH,
) {
  const normalizedPath = normalizePath(path);

  if (normalizedPath && isAllowedChatReturnPath(normalizedPath)) {
    return normalizedPath;
  }

  return fallback;
}

export function withChatFrom(href: string, from: string | null | undefined) {
  const safeFrom = getSafeChatReturnPath(from, "");
  if (!safeFrom) return href;

  const [pathname, rawQuery = ""] = href.split("?");
  const params = new URLSearchParams(rawQuery);
  params.set("from", safeFrom);

  return `${pathname}?${params.toString()}`;
}
