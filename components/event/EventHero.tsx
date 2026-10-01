import MarkdownContent from "@/components/MarkdownContent";
import { CalendarIcon, PinIcon } from "@/components/event/icons";
import { parseLocation } from "@/lib/events";
import { Event } from "@/types";

type EventHeroProps = {
  readonly event: Event;
  readonly intro?: string;
};

export default function EventHero({ event, intro }: EventHeroProps) {
  const { venue, addressLines } = parseLocation(event.location);
  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  return (
    <section aria-labelledby="event-title" className="surface-card relative mb-6 overflow-hidden p-6 md:p-10">
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[color:var(--bg-glow-2)] blur-3xl"
        aria-hidden="true"
      />
      <div className="relative">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[color:var(--link)]">SUGNL Meetup</p>

        <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2">
          <h1
            id="event-title"
            className="text-balance text-4xl font-black leading-tight [font-family:var(--font-heading)] md:text-5xl"
          >
            {event.title}
          </h1>
          {event.isPast ? (
            <span className="pill bg-[color:var(--pill-past-bg)] text-[color:var(--pill-past-ink)]">Past event</span>
          ) : (
            <span className="pill bg-[color:var(--pill-upcoming-bg)] text-[color:var(--accent-ink)]">Upcoming</span>
          )}
        </div>

        {intro && (
          <MarkdownContent content={intro} className="mb-8 max-w-2xl text-lg leading-relaxed text-[color:var(--muted)] md:text-xl" />
        )}

        <ul className="grid gap-5 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-0 md:max-w-3xl">
          <li className="flex items-start gap-3 sm:pr-6">
            <CalendarIcon className="mt-0.5 h-6 w-6 shrink-0 text-[color:var(--link)]" />
            <div>
              <span className="sr-only">Date and time: </span>
              <p className="font-semibold text-[color:var(--ink)]">
                <time dateTime={event.date}>{formattedDate}</time>
              </p>
              <p className="text-sm text-[color:var(--muted)]">
                {event.startTime} – {event.endTime}
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3 sm:border-l sm:border-[color:var(--line)] sm:pl-6">
            <PinIcon className="mt-0.5 h-6 w-6 shrink-0 text-[color:var(--link)]" />
            <div>
              <span className="sr-only">Location: </span>
              <p className="font-semibold text-[color:var(--ink)]">{venue}</p>
              {addressLines.length > 0 && (
                <p className="text-sm text-[color:var(--muted)]">{addressLines.join(", ")}</p>
              )}
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
}
