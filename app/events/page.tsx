import { getPastEvents, getUpcomingEvents } from "@/lib/events";
import Link from "next/link";
import MarkdownContent from "@/components/MarkdownContent";
import PageIntro from "@/components/PageIntro";
import PageContainer from "@/components/PageContainer";

function formatEventDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function EventsPage() {
  const upcomingEvents = getUpcomingEvents();
  const pastEvents = getPastEvents();

  return (
    <PageContainer>
      <PageIntro
        title="Events"
        description="Find upcoming meetups and browse our past events."
        sectionClassName="mb-10"
      />

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-black [font-family:var(--font-heading)]">Upcoming events</h2>

        {upcomingEvents.length === 0 ? (
          <p className="surface-card p-6 text-[color:var(--muted)]">
            No upcoming events scheduled. Check back soon.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {upcomingEvents.map((event) => (
              <Link
                key={event.id}
                href={`/event/${event.id}`}
                className="surface-card p-6 transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-3 flex items-start justify-between gap-4">
                  <h3 className="text-xl font-bold [font-family:var(--font-heading)]">{event.title}</h3>
                  <span className="pill bg-[color:var(--pill-upcoming-bg)] text-[color:var(--accent-ink)]">
                    Upcoming
                  </span>
                </div>
                <div className="mb-4 space-y-2 text-sm text-[color:var(--muted)]">
                  <p>📅 {formatEventDate(event.date)}</p>
                  <p>🕐 {event.startTime} - {event.endTime}</p>
                  <p>📍 {event.location}</p>
                </div>
                <MarkdownContent content={event.description} className="text-[color:var(--ink)]" />
              </Link>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-black [font-family:var(--font-heading)]">Past events</h2>

        {pastEvents.length === 0 ? (
          <p className="surface-card p-6 text-[color:var(--muted)]">
            No past events yet. Check back after our first event.
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
                  <p>📅 {formatEventDate(event.date)}</p>
                  <p>🕐 {event.startTime} - {event.endTime}</p>
                  <p>📍 {event.location}</p>
                </div>
                <MarkdownContent content={event.description} className="text-[color:var(--ink)]" />
              </Link>
            ))}
          </div>
        )}
      </section>
    </PageContainer>
  );
}
