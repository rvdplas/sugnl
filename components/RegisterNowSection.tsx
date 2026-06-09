import RegisterNowButton from "@/components/RegisterNowButton";
import { Event } from "@/types";

type RegisterNowSectionProps = {
  event: Event;
  compact?: boolean;
  className?: string;
};

function getLocationParts(location: string): { venue: string; addressLines: string[] } {
  const parts = location
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  return {
    venue: parts[0] ?? location,
    addressLines: parts.length > 1 ? parts.slice(1) : [],
  };
}

export default function RegisterNowSection({
  event,
  compact = false,
  className = "",
}: RegisterNowSectionProps) {
  const hasRegistrationUrl = event.registrationUrl.trim().length > 0;

  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (compact) {
    return (
      <div className={`surface-card mb-12 p-6 text-left md:p-8 ${className}`.trim()}>
        <p className="mb-5 text-sm font-medium uppercase tracking-[0.18em] text-[color:var(--muted)]">
          Register
        </p>
        {hasRegistrationUrl ? (
          <RegisterNowButton href={event.registrationUrl} />
        ) : (
          <p className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] px-4 py-3 text-sm font-semibold leading-relaxed text-[color:var(--ink)] md:text-base">
            Sign-up opens closer to the event. Check back soon.
          </p>
        )}
      </div>
    );
  }

  const { venue, addressLines } = getLocationParts(event.location);

  return (
    <section
      className={`surface-card mb-12 overflow-hidden p-6 text-left md:p-8 ${className}`.trim()}
    >
      <h2 className="mb-4 text-2xl font-black text-[color:var(--ink)] [font-family:var(--font-heading)]">
        Register
      </h2>

      <p className="max-w-3xl leading-relaxed text-[color:var(--muted)] md:text-lg">
        Would you like to join the SUGNL meetup on {formattedDate}?{" "}
      </p>

      {hasRegistrationUrl ? (
        <p>
          <a href={event.registrationUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-[color:var(--accent)]">
            <span className="font-semibold text-[color:var(--accent)]">Sign up now</span>
          </a>
        </p>
      ) : (
        <p className="mt-4 inline-flex rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] px-4 py-3 text-sm font-semibold text-[color:var(--ink)] md:text-base">
          Sign-up opens closer to the event. Check back soon.
        </p>
      )}

      <p className="mt-6 text-lg font-semibold text-[color:var(--ink)]">
        The meetup takes place at:
      </p>

      <div className="mt-4 space-y-1 text-[color:var(--muted)]">
        <p className="text-2xl font-black [font-family:var(--font-heading)] text-[color:var(--ink)]">{venue}</p>
        {addressLines.map((line) => (
          <p key={line} className="text-lg">
            {line}
          </p>
        ))}
        <p className="pt-3 text-base">
          Time: {event.startTime} - {event.endTime}
        </p>
      </div>

      {hasRegistrationUrl && (
        <div className="mt-8">
          <RegisterNowButton href={event.registrationUrl} />
        </div>
      )}
    </section>
  );
}
