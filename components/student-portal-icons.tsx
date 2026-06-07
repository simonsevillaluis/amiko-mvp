import { AmikoIcon, type AmikoIconName } from "@/components/amiko-icon";
import type { ReactNode } from "react";

export type StudentPortalIconName =
  | AmikoIconName
  | "math"
  | "reading"
  | "science"
  | "write"
  | "look"
  | "think"
  | "water"
  | "stretch"
  | "draw"
  | "eyes"
  | "music"
  | "body"
  | "smile"
  | "steady"
  | "tired"
  | "sad";

const amikoIconNames = new Set<string>([
  "home",
  "chat",
  "heart",
  "users",
  "award",
  "bell",
  "settings",
  "plus",
  "task",
  "journal",
  "history",
  "calm",
  "resources",
  "chevron",
  "shield",
  "user-plus",
  "mail",
  "check",
  "help",
  "pause",
  "play",
  "clock",
  "send",
  "mic",
  "image",
  "camera",
  "clip",
  "sparkles",
  "back",
  "close",
]);

export function StudentAvatar({
  name,
  className = "h-10 w-10",
}: {
  name?: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full bg-gradient-to-br from-amiko-green to-green-600 shadow-card ${className}`}
      aria-hidden="true"
    >
      <svg
        className="h-[55%] w-[55%] text-white"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    </span>
  );
}

export function AmikoMark({ className = "h-12 w-12" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full border-2 border-amiko-green bg-white shadow-card ${className}`}
      aria-hidden="true"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/amiko-character/amiko-character-photo.svg"
        alt=""
        className="h-[82%] w-[82%] object-contain"
      />
    </span>
  );
}

export function StudentPortalIcon({
  name,
  className = "h-6 w-6",
}: {
  name: StudentPortalIconName;
  className?: string;
}) {
  if (amikoIconNames.has(name)) {
    return <AmikoIcon name={name as AmikoIconName} className={className} />;
  }

  const common = {
    className,
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 2.25,
    viewBox: "0 0 24 24",
    "aria-hidden": true,
  };

  const paths: Record<Exclude<StudentPortalIconName, AmikoIconName>, ReactNode> = {
    math: (
      <>
        <rect x="4" y="3" width="16" height="18" rx="3" />
        <path d="M8 8h8M8 12h2M14 12h2M8 16h2M14 16h2" />
      </>
    ),
    reading: (
      <>
        <path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H20v17H7.5A3.5 3.5 0 0 0 4 22Z" />
        <path d="M8 6h7M8 10h8M8 14h6" />
      </>
    ),
    science: (
      <>
        <path d="M10 2v6l-5.5 9.5A3 3 0 0 0 7.1 22h9.8a3 3 0 0 0 2.6-4.5L14 8V2" />
        <path d="M8 2h8M8.5 16h7" />
      </>
    ),
    write: (
      <>
        <path d="M4 20h16" />
        <path d="M6 16 16.5 5.5a2.1 2.1 0 0 1 3 3L9 19l-4 1Z" />
      </>
    ),
    look: (
      <>
        <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    think: (
      <>
        <path d="M8.5 18H7a4 4 0 0 1 0-8 5 5 0 0 1 9.7-1.5A3.5 3.5 0 0 1 17.5 18H15" />
        <path d="M10 21h4M11 17h2" />
      </>
    ),
    water: (
      <>
        <path d="M12 3s6 6.2 6 11a6 6 0 1 1-12 0c0-4.8 6-11 6-11Z" />
        <path d="M9 15a3 3 0 0 0 3 3" />
      </>
    ),
    stretch: (
      <>
        <circle cx="12" cy="4" r="2" />
        <path d="M12 6v6M6 10l6 2 6-2M9 22l3-10 3 10" />
      </>
    ),
    draw: (
      <>
        <circle cx="7" cy="17" r="3" />
        <path d="M10 14 19 5a2.1 2.1 0 0 1 3 3l-9 9" />
        <path d="M5 20c4 1 7 0 9-2" />
      </>
    ),
    eyes: (
      <>
        <path d="M4 12a4 4 0 0 1 8 0 4 4 0 0 1-8 0ZM12 12a4 4 0 0 1 8 0 4 4 0 0 1-8 0Z" />
        <path d="M2 7c2 1 4 1 6 0M16 7c2 1 4 1 6 0" />
      </>
    ),
    music: (
      <>
        <path d="M9 18V5l10-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="16" cy="16" r="3" />
      </>
    ),
    body: (
      <>
        <circle cx="12" cy="5" r="2.5" />
        <path d="M5 10h14M12 8v6M8 22l4-8 4 8" />
      </>
    ),
    smile: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M8.5 10h.01M15.5 10h.01M8.5 14.5c2 2 5 2 7 0" />
      </>
    ),
    steady: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M8 10h.01M16 10h.01M8 15h8" />
      </>
    ),
    tired: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M8 10h2M14 10h2M9 16c1.5-1 4.5-1 6 0" />
      </>
    ),
    sad: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M8.5 10h.01M15.5 10h.01M8.5 16c2-2 5-2 7 0" />
      </>
    ),
  };

  return <svg {...common}>{paths[name as Exclude<StudentPortalIconName, AmikoIconName>]}</svg>;
}
