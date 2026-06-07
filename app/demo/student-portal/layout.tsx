import { StudentShell } from "@/components/student-shell";

export default function DemoStudentPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StudentShell basePath="/demo/student-portal">
      {children}
    </StudentShell>
  );
}
