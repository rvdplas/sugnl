import { getPastEvents } from "@/lib/events";
import Link from "next/link";
import MarkdownContent from "@/components/MarkdownContent";

export default function PastEventsPage() {
  const pastEvents = getPastEvents();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8">
        <Link
          href="/"
          className="mb-4 inline-flex items-center text-sm font-semibold text-[color:var(--link)] hover:opacity-80"
        >
          ← Back to Home
        </Link>
        <h1 className="mb-4 text-4xl font-black [font-family:var(--font-heading)]">Past events</h1>
        <p className="text-xl text-[color:var(--muted)]">
          Take a look at our previous events and what we've covered.
        </p>
      </div>

      {pastEvents.length === 0 ? (
        <p className="py-12 text-center text-[color:var(--muted)]">
          No past events yet. Check back after our first event!
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {pastEvents.map((event) => (
            <Link
              key={event.id}
              href={`/event/${event.id}`}
              className="surface-card p-6 transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-3 flex items-start justify-between gap-4">
                <h3 className="text-xl font-bold [font-family:var(--font-heading)]">{event.title}</h3>
                <span className="pill bg-[color:var(--pill-past-bg)] text-[color:var(--pill-past-ink)]">
                  Past
                </span>
              </div>
              <div className="mb-4 space-y-2 text-sm text-[color:var(--muted)]">
                <p>
                  📅{" "}
                  {new Date(event.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p>🕐 {event.startTime} - {event.endTime}</p>
                <p>📍 {event.location}</p>
              </div>
              <MarkdownContent content={event.description} className="mb-4 text-[color:var(--ink)]" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
