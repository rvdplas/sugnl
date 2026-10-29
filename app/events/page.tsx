import EventOverviewCard from "@/components/event/EventOverviewCard";
import PageContainer from "@/components/PageContainer";
import { getPastEvents, getUpcomingEvents } from "@/lib/events";
import type { Metadata } from "next";

// Re-render hourly so events move to "past" without a redeploy.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Events | SUGNL",
};

export default function EventsPage() {
  const upcomingEvents = getUpcomingEvents();
  const pastEvents = getPastEvents();

  return (
    <PageContainer className="max-w-5xl py-14 md:py-16">
      <section className="mb-12 md:mb-14">
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-(--link)">Events</p>
        <h1 className="mb-4 max-w-3xl text-4xl font-black leading-tight [font-family:var(--font-heading)] md:text-5xl">
          Meet, learn and share with the Sitecore community
        </h1>
        <p className="max-w-3xl text-lg leading-relaxed text-(--muted)">
          Find upcoming meetups and browse our past events. Join us for practical sessions, community talks and plenty
          of time for networking.
        </p>
      </section>

      <section className="mb-12 md:mb-14">
        <h2 className="mb-5 text-2xl font-black [font-family:var(--font-heading)] md:text-3xl">Upcoming events</h2>

        {upcomingEvents.length === 0 ? (
          <p className="surface-card p-6 text-(--muted)">
            No upcoming events scheduled. Check back soon.
          </p>
        ) : (
          <div className="grid gap-4">
            {upcomingEvents.map((event) => (
              <EventOverviewCard key={event.id} event={event} status="upcoming" />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-5 text-2xl font-black [font-family:var(--font-heading)] md:text-3xl">Past events</h2>

        {pastEvents.length === 0 ? (
          <p className="surface-card p-6 text-(--muted)">
            No past events yet. Check back after our first event.
          </p>
        ) : (
          <div className="grid gap-4">
            {pastEvents.map((event) => (
              <EventOverviewCard key={event.id} event={event} status="past" />
            ))}
          </div>
        )}
      </section>
    </PageContainer>
  );
}
