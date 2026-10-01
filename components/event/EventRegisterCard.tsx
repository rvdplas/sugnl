import Link from "next/link";
import AddToCalendar from "@/components/event/AddToCalendar";
import { ArrowRightIcon } from "@/components/event/icons";
import { cardClassName, cardHeadingClassName, primaryButtonClassName } from "@/components/event/styles";
import { Event } from "@/types";

type EventRegisterCardProps = {
  readonly event: Event;
};

export default function EventRegisterCard({ event }: EventRegisterCardProps) {
  if (event.isPast) {
    return (
      <aside aria-labelledby="register-heading" className={cardClassName}>
        <h2 id="register-heading" className={`${cardHeadingClassName} mb-3`}>
          This event has passed
        </h2>
        <p className="mb-6 leading-relaxed text-[color:var(--muted)]">
          Thanks to everyone who joined. Keep an eye out for our next SUGNL evening.
        </p>
        <Link href="/events" className={`${primaryButtonClassName} w-full`}>
          View upcoming events
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </aside>
    );
  }

  const hasRegistrationUrl = event.registrationUrl.trim().length > 0;

  return (
    <aside aria-labelledby="register-heading" className={cardClassName}>
      <h2 id="register-heading" className={`${cardHeadingClassName} mb-3`}>
        Ready to join?
      </h2>
      {hasRegistrationUrl ? (
        <>
          <p className="mb-6 leading-relaxed text-[color:var(--muted)]">
            Registration is open! Save your spot and be part of another great SUGNL evening.
          </p>
          <a
            href={event.registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`${primaryButtonClassName} w-full`}
          >
            Register now
            <ArrowRightIcon className="h-4 w-4" />
          </a>
        </>
      ) : (
        <p className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] px-4 py-3 text-sm font-semibold leading-relaxed text-[color:var(--ink)]">
          Sign-up opens closer to the event. Check back soon.
        </p>
      )}
      <div className="mt-5 border-t border-[color:var(--line)] pt-4">
        <AddToCalendar event={event} variant="link" />
      </div>
    </aside>
  );
}
