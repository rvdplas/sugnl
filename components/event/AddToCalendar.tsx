import { getGoogleCalendarUrl } from "@/lib/calendar";
import { Event } from "@/types";
import { CalendarIcon, ChevronDownIcon } from "@/components/event/icons";
import { secondaryButtonClassName } from "@/components/event/styles";

type AddToCalendarProps = {
  readonly event: Event;
  readonly variant?: "button" | "link";
  readonly align?: "left" | "right";
};

export default function AddToCalendar({ event, variant = "button", align = "left" }: AddToCalendarProps) {
  const options = [
    { label: "Google Calendar", href: getGoogleCalendarUrl(event), external: true },
    { label: "Apple / Outlook (.ics)", href: `/event/${encodeURIComponent(event.id)}/calendar.ics`, external: false },
  ];

  const summaryClassName =
    variant === "button"
      ? `${secondaryButtonClassName} cursor-pointer`
      : "inline-flex cursor-pointer items-center gap-2 rounded-md text-sm font-semibold text-(--link) hover:opacity-80";

  return (
    <details className="group relative">
      <summary
        className={`${summaryClassName} list-none focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--focus-ring) [&::-webkit-details-marker]:hidden`}
      >
        <CalendarIcon className="h-5 w-5 text-(--link)" />
        Add to calendar
        <ChevronDownIcon className="h-4 w-4 transition-transform group-open:rotate-180" />
      </summary>
      <ul
        className={`absolute z-20 mt-2 min-w-[220px] overflow-hidden rounded-xl border border-(--line) bg-(--surface-soft) py-1 shadow-xl ${
          align === "right" ? "right-0" : "left-0"
        }`}
      >
        {options.map((option) => (
          <li key={option.label}>
            <a
              href={option.href}
              {...(option.external ? { target: "_blank", rel: "noopener noreferrer" } : { download: true })}
              className="block px-4 py-2.5 text-sm text-(--ink) transition-colors hover:bg-(--surface-muted) focus-visible:bg-(--surface-muted) focus-visible:outline-solid focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--focus-ring)"
            >
              {option.label}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}
