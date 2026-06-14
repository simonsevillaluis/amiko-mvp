import { progressEvents } from "@/lib/mock-data";

const cardStyles = [
  "bg-amiko-blue text-white",
  "bg-amiko-green text-white",
  "bg-amiko-sky text-amiko-navy",
  "bg-amiko-cream text-amiko-ink",
];

export function ProgressSummary() {
  return (
    <div className="grid gap-4">
      {progressEvents.map((event, index) => (
        <section
          key={event.id}
          className={`rounded-xl p-5 shadow-card ${cardStyles[index % cardStyles.length]}`}
        >
          <p className="text-sm font-black uppercase tracking-[0.16em] opacity-80">{event.label}</p>
          <p className="mt-3 text-4xl font-black">{event.value}</p>
          <p className="mt-2 leading-6 opacity-85">{event.detail}</p>
        </section>
      ))}
    </div>
  );
}
