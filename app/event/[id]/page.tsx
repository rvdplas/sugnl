import { getAllEventIds, getEventAgenda, getEventById } from "@/lib/events";
import { notFound } from "next/navigation";
import Link from "next/link";
import MarkdownContent from "@/components/MarkdownContent";
import RegisterNowSection from "@/components/RegisterNowSection";
import PageContainer from "@/components/PageContainer";

interface PageProps {
  readonly params: Promise<{
    id: string;
  }>;
}

export default async function EventPage({ params }: PageProps) {
  const { id } = await params;
  const event = getEventById(id);

  if (!event) {
    notFound();
  }

  const agenda = getEventAgenda(event);

  return (
    <PageContainer>
      <Link
        href="/events"
        className="mb-6 inline-flex items-center text-sm font-semibold text-[color:var(--link)] hover:opacity-80"
      >
        ← Back to Events
      </Link>

      <div className="surface-card mb-8 p-6 md:p-8">
        <div className="mb-4 flex items-center gap-3">
          <h1 className="text-4xl font-black [font-family:var(--font-heading)]">{event.title}</h1>
          {event.isPast ? (
            <span className="pill bg-[color:var(--pill-past-bg)] text-[color:var(--pill-past-ink)]">
              Past Event
            </span>
          ) : (
            <span className="pill bg-[color:var(--pill-upcoming-bg)] text-[color:var(--accent-ink)]">
              Upcoming
            </span>
          )}
        </div>

        <div className="mb-6 grid gap-2 text-[color:var(--muted)] md:grid-cols-2">
          <p className="text-lg md:col-span-2">
            📅{" "}
            {new Date(event.date).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="text-lg">🕐 {event.startTime} - {event.endTime}</p>
          <p className="text-lg">📍 {event.location}</p>
        </div>

        <MarkdownContent content={event.description} className="text-[color:var(--ink)]" />
      </div>

      <div className="surface-card mb-12 p-6 md:p-8">
        <h2 className="mb-4 text-2xl font-black [font-family:var(--font-heading)]">Event Agenda</h2>
        <div className="space-y-3 text-[color:var(--muted)]">
          {agenda.map((agendaItem, index) => (
            <div key={`${agendaItem.type}-${index}`} className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface)] p-4">
              {agendaItem.type === "fixed" || agendaItem.activity.type === "break" || agendaItem.activity.type === "info" ? (
                <div className="space-y-2">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="text-sm font-semibold text-[color:var(--ink)]">
                      {agendaItem.type === "fixed" ? agendaItem.startTime : agendaItem.activity.startTime}
                    </span>
                    <span className="text-lg font-semibold text-[color:var(--ink)]">
                      {agendaItem.type === "fixed" ? agendaItem.label : agendaItem.activity.subject}
                    </span>
                  </div>
                  {agendaItem.type === "activity" && agendaItem.activity.description && (
                    <MarkdownContent
                      content={agendaItem.activity.description}
                      className="text-sm leading-relaxed"
                    />
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="text-sm font-semibold text-[color:var(--ink)]">
                      {agendaItem.activity.startTime}
                    </span>
                    <h3 className="text-lg font-semibold text-[color:var(--ink)]">{agendaItem.activity.subject}</h3>
                  </div>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <div className="flex-shrink-0 self-start">
                      {agendaItem.activity.speaker?.image ? (
                        <img
                          src={agendaItem.activity.speaker.image}
                          alt={agendaItem.activity.speaker.name}
                          className="h-20 w-20 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-20 w-20 rounded-full bg-transparent" aria-hidden="true" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1 space-y-2">
                      {agendaItem.activity.speaker?.name && (
                        <div>
                          <p className="text-sm font-semibold text-[color:var(--ink)]">
                            {agendaItem.activity.speaker.name}
                          </p>
                          {agendaItem.activity.speaker.linkedin && (
                            <a
                              href={agendaItem.activity.speaker.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-[color:var(--link)] hover:underline"
                            >
                              View LinkedIn Profile →
                            </a>
                          )}
                        </div>
                      )}
                      {agendaItem.activity.description && (
                        <MarkdownContent
                          content={agendaItem.activity.description}
                          className="text-sm leading-relaxed"
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {!event.isPast && <RegisterNowSection event={event} compact />}

      {event.isPast && (
        <div className="surface-card bg-[color:var(--surface-muted)] p-6 text-center">
          <p className="text-[color:var(--muted)]">
            This event has already taken place. Check out our{" "}
            <Link href="/events" className="font-semibold text-[color:var(--link)] hover:opacity-80">
              upcoming events
            </Link>
            !
          </p>
        </div>
      )}
    </PageContainer>
  );
}

export function generateStaticParams() {
  return getAllEventIds().map((id) => ({ id }));
}
