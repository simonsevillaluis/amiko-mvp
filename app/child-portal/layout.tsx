import { ChildShell } from "@/components/child-shell";

export default function ChildPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ChildShell>{children}</ChildShell>;
}
