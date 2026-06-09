import { getUpcomingEvents, getEventAgenda } from "@/lib/events";
import Link from "next/link";
import Image from "next/image";
import MarkdownContent from "@/components/MarkdownContent";
import RegisterNowSection from "@/components/RegisterNowSection";

export default function Home() {
  const upcomingEvents = getUpcomingEvents();
  const event = upcomingEvents[0];
  const agenda = event ? getEventAgenda(event) : [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <section className="mb-12">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-black [font-family:var(--font-heading)] md:text-5xl">
            Welcome to SUGNL
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-[color:var(--muted)]">
            We organize three community events per year to bring together developers, architects, and tech enthusiasts. 
            Join us for evenings of knowledge sharing, networking, and exploring the latest technologies.
          </p>
        </div>
      </section>

      {event ? (
        <>
          {/* <div className="mb-8 rounded-2xl border border-[color:var(--focus-ring)] bg-[color:var(--surface-soft)] px-5 py-4 md:px-6">
            <h2 className="mb-4 text-2xl font-black [font-family:var(--font-heading)] text-[color:var(--accent)]">Important for this event</h2>
            <p className="mt-1 text-base text-[color:var(--ink)] md:text-lg">
              Sebastian&apos;s workshop will be an interactive session. Please bring your laptop so you can follow along and participate.
            </p>
          </div> */}

          <div className="surface-card mb-8 p-6 md:p-8">
            <div className="mb-4 flex items-center gap-3">
              <h2 className="text-4xl font-black [font-family:var(--font-heading)]">{event.title}</h2>
              <span className="pill bg-[color:var(--pill-upcoming-bg)] text-[color:var(--accent-ink)]">
                Upcoming
              </span>
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
                            <Image
                              src={agendaItem.activity.speaker.image}
                              alt={agendaItem.activity.speaker.name}
                              width={80}
                              height={80}
                              loading="lazy"
                              decoding="async"
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

          <RegisterNowSection event={event} />
        </>
      ) : (
        <p className="py-12 text-center text-[color:var(--muted)]">
          No upcoming events scheduled. Check back soon!
        </p>
      )}

      <section className="mt-4 text-center">
        <Link
          href="/past-events"
          className="inline-block rounded-full border border-[color:var(--nav-line)] bg-[color:var(--button-primary)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[color:var(--button-primary-hover)]"
        >
          View Past events →
        </Link>
      </section>
    </div>
  );
}
