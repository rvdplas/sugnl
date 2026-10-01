import Link from "next/link";
import MarkdownContent from "@/components/MarkdownContent";
import RegisterNowButton from "@/components/RegisterNowButton";
import AddToCalendar from "@/components/event/AddToCalendar";
import { ArrowRightIcon, CalendarIcon, ClockIcon, PinIcon } from "@/components/event/icons";
import { cardClassName, secondaryButtonClassName } from "@/components/event/styles";
import { parseLocation } from "@/lib/events";
import type { Event } from "@/types";

type EventOverviewCardProps = {
  event: Event;
  status: "upcoming" | "past";
};

function formatEventDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function EventOverviewCard({ event, status }: EventOverviewCardProps) {
  const isUpcoming = status === "upcoming";
  const registrationUrl = event.registrationUrl.trim();
  const recapUrl = event.recapUrl?.trim();
  const { venue, addressLines } = parseLocation(event.location);

  return (
    <article className={`${cardClassName} transition duration-200 hover:border-[color:var(--focus-ring)] hover:shadow-[0_16px_40px_-24px_var(--focus-ring)]`}>
      <div className="mb-3 flex items-center justify-between gap-4">
        <span
          className={`pill ${
            isUpcoming
              ? "bg-[color:var(--pill-upcoming-bg)] text-[color:var(--accent-ink)]"
              : "bg-[color:var(--pill-past-bg)] text-[color:var(--pill-past-ink)]"
          }`}
        >
          {isUpcoming ? "Upcoming" : "Past"}
        </span>
      </div>

      <h3 className="mb-4 text-2xl font-black [font-family:var(--font-heading)]">{event.title}</h3>

      <dl className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-[1fr_1.3fr]">
        <div className="grid content-start gap-2 sm:border-r sm:border-[color:var(--line)] sm:pr-4 lg:pr-6">
          <div className="flex items-start gap-3">
            <CalendarIcon className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--link)]" />
            <div>
              <dt className="sr-only">Date</dt>
              <dd className="font-semibold text-[color:var(--ink)]">{formatEventDate(event.date)}</dd>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <ClockIcon className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--link)]" />
            <div>
              <dt className="sr-only">Time</dt>
              <dd className="font-semibold text-[color:var(--ink)]">
                {event.startTime} - {event.endTime}
              </dd>
            </div>
          </div>
        </div>
        <div className="flex items-start gap-3 sm:pl-4 lg:pl-6">
          <PinIcon className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--link)]" />
          <div>
            <dt className="sr-only">Location</dt>
            <dd className="font-semibold text-[color:var(--ink)]">{venue}</dd>
            {addressLines.map((line) => (
              <dd key={line} className="text-[color:var(--muted)]">{line}</dd>
            ))}
          </div>
        </div>
      </dl>

      <div className="my-5 border-t border-[color:var(--line)]" />

      <MarkdownContent
        content={event.summary?.trim() || event.description}
        className="mb-5 line-clamp-4 max-w-4xl text-sm leading-relaxed text-[color:var(--muted)] md:text-base"
      />

      <div className="flex flex-wrap gap-3">
        {isUpcoming && registrationUrl && (
          <RegisterNowButton href={registrationUrl} />
        )}
        {isUpcoming ? (
          <>
            <Link href={`/event/${event.id}`} className={secondaryButtonClassName}>
              View event details
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <AddToCalendar event={event} />
          </>
        ) : recapUrl ? (
          <a href={recapUrl} className={secondaryButtonClassName}>
            View event recap
            <ArrowRightIcon className="h-4 w-4" />
          </a>
        ) : (
          <Link href={`/event/${event.id}`} className={secondaryButtonClassName}>
            View event details
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        )}
      </div>
    </article>
  );
}