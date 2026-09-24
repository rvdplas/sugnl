import Image from "next/image";
import Link from "next/link";
import MarkdownContent from "@/components/MarkdownContent";
import { parseLocation } from "@/lib/events";
import { Event } from "@/types";

type UpcomingEventCardProps = {
  event?: Event;
};

function getDateBadge(date: string): { month: string; day: number; year: number } {
  const parsed = new Date(date);
  return {
    month: parsed.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    day: parsed.getDate(),
    year: parsed.getFullYear(),
  };
}

function getWeekday(date: string): string {
  return new Date(date).toLocaleDateString("en-US", { weekday: "long" });
}

function getParkingLines(parking: string): string[] {
  return parking
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

export default function UpcomingEventCard({ event }: UpcomingEventCardProps) {
  return (
    <section className="surface-card relative mb-12 overflow-hidden p-6 md:p-8">
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 md:block" aria-hidden="true">
        <Image
          src="/upcomingevent/background1.png"
          alt=""
          fill
          sizes="50vw"
          className="object-cover object-[75%_center] opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[color:var(--surface)] via-[color:var(--surface)]/60 to-transparent" />
      </div>
      <div className="relative">
        <p className="mb-6 text-sm font-semibold uppercase tracking-[0.15em] text-[color:var(--muted)]">
          Upcoming Event
        </p>
        {event ? (
        (() => {
          const dateBadge = getDateBadge(event.date);
          const { venue, addressLines } = parseLocation(event.location);
          const hasRegistrationUrl = event.registrationUrl.trim().length > 0;

          return (
            <div className="grid gap-8 md:grid-cols-[260px_1fr]">
              <div className="flex flex-col gap-5 md:border-r md:border-[color:var(--line)] md:pr-8">
                <div className="flex items-center gap-4">
                  <div className="flex w-16 shrink-0 flex-col items-center justify-center rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] py-2">
                    <span className="text-xs font-bold uppercase tracking-wide text-[color:var(--link)]">
                      {dateBadge.month}
                    </span>
                    <span className="text-2xl font-black leading-none text-[color:var(--ink)]">{dateBadge.day}</span>
                    <span className="text-xs text-[color:var(--muted)]">{dateBadge.year}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-[color:var(--ink)]">
                      🕒 {event.startTime} - {event.endTime}
                    </p>
                    <p className="mt-1 text-sm text-[color:var(--muted)]">{getWeekday(event.date)}</p>
                  </div>
                </div>

                <hr className="border-[color:var(--line)]" />

                <div className="flex items-start gap-2">
                  <span aria-hidden="true">📍</span>
                  <div>
                    <p className="font-semibold text-[color:var(--ink)]">{venue}</p>
                    {addressLines.map((line) => (
                      <p key={line} className="text-sm text-[color:var(--muted)]">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>

                {event.parking && (
                  <>
                    <hr className="border-[color:var(--line)]" />
                    <div className="flex items-start gap-2">
                      <span aria-hidden="true">🚗</span>
                      <div>
                        <p className="font-semibold text-[color:var(--ink)]">Coming by car?</p>
                        <p className="text-sm text-[color:var(--muted)]">Park at the parking garage</p>
                        {getParkingLines(event.parking).map((line) => (
                          <p key={line} className="text-sm text-[color:var(--muted)]">
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[color:var(--link)]">
                  SUGNL Meetup
                </p>
                <h2 className="mb-3 text-3xl font-black [font-family:var(--font-heading)] md:text-4xl">
                  {event.title}
                </h2>
                <MarkdownContent
                  content={event.description}
                  className="mb-6 max-w-2xl text-[color:var(--muted)] md:text-lg"
                />

                <div className="mb-6 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-[color:var(--ink)]">
                  <span className="flex items-center gap-2">🎤 Inspiring talks</span>
                  <span className="flex items-center gap-2">💻 Hands-on workshop</span>
                  <span className="flex items-center gap-2">🥂 Food, drinks and networking</span>
                </div>

                <div className="flex flex-wrap gap-3">
                  {hasRegistrationUrl && (
                    <a
                      href={event.registrationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-[color:var(--nav-line)] bg-[color:var(--button-primary)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[color:var(--button-primary-hover)]"
                    >
                      Register now
                    </a>
                  )}
                  <Link
                    href={`/event/${event.id}`}
                    className="inline-block rounded-full border border-[color:var(--line)] bg-[color:var(--surface)] px-6 py-3 text-sm font-semibold text-[color:var(--ink)] transition-colors hover:bg-[color:var(--surface-soft)]"
                  >
                    View event details
                  </Link>
                </div>
              </div>
            </div>
          );
        })()
      ) : (
        <>
          <h2 className="mb-3 text-3xl font-black [font-family:var(--font-heading)] md:text-4xl">
            New Event Announcement Coming Soon
          </h2>
          <p className="mb-6 max-w-2xl text-[color:var(--muted)] md:text-lg">
            We are preparing the next SUGNL meetup. Check back shortly or explore our community blogs while you wait.
          </p>
          <Link
            href="/events"
            className="inline-block rounded-full border border-[color:var(--nav-line)] bg-[color:var(--button-primary)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[color:var(--button-primary-hover)]"
          >
            View Events
          </Link>
        </>
      )}
      </div>
    </section>
  );
}
