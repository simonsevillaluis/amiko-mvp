import { student } from "@/lib/mock-data";
import { Card, StatusPill } from "./ui";

export function StudentProfileCard() {
  return (
    <Card className="overflow-hidden p-0">
      <div className="bg-amiko-mint p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-2xl font-black text-amiko-green shadow-card">
              {student.name.slice(0, 1)}
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-green-800">
                Perfil
              </p>
              <h2 className="mt-1 text-3xl font-black text-amiko-ink">{student.name}</h2>
              <p className="mt-1 text-sm font-bold text-green-900">
                {student.age} años · {student.grade}
              </p>
            </div>
          </div>
          <StatusPill>Apoyo {student.supportLevel}</StatusPill>
        </div>
      </div>
      <div className="p-5">
        <p className="leading-7 text-amiko-muted">{student.notes}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {student.visualPreferences.map((preference) => (
            <span
              key={preference}
              className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-sm font-black text-green-800"
            >
              {preference}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}
