import { StudentShell } from "@/components/student-shell";

export default function StudentPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StudentShell>{children}</StudentShell>;
}
