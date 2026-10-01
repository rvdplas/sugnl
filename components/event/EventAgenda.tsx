import Image from "next/image";
import MarkdownContent from "@/components/MarkdownContent";
import { cardClassName, cardHeadingClassName } from "@/components/event/styles";
import type { AgendaItem } from "@/lib/events";
import { Activity } from "@/types";

type EventAgendaProps = {
  readonly agenda: AgendaItem[];
};

function toActivity(item: AgendaItem): Activity {
  return item.type === "fixed" ? { subject: item.label, startTime: item.startTime } : item.activity;
}

function SpeakerLine({ speaker }: { readonly speaker: NonNullable<Activity["speaker"]> }) {
  return (
    <div className="mt-3 flex items-center gap-3">
      {speaker.image ? (
        <Image
          src={speaker.image}
          alt=""
          width={44}
          height={44}
          className="h-11 w-11 shrink-0 rounded-full border border-[color:var(--line)] object-cover"
        />
      ) : null}
      <div className="min-w-0">
        <p className="text-sm font-semibold text-[color:var(--ink)]">{speaker.name}</p>
        {speaker.linkedin && (
          <a
            href={speaker.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-[color:var(--link)] hover:underline"
          >
            LinkedIn profile<span className="sr-only"> of {speaker.name}</span>
          </a>
        )}
      </div>
    </div>
  );
}

export default function EventAgenda({ agenda }: EventAgendaProps) {
  return (
    <section aria-labelledby="event-agenda" className={cardClassName}>
      <h2 id="event-agenda" className={`${cardHeadingClassName} mb-6`}>
        Event agenda
      </h2>

      <ol>
        {agenda.map((item, index) => {
          const activity = toActivity(item);
          const isSession = Boolean(activity.speaker);
          const isLast = index === agenda.length - 1;

          return (
            <li
              key={`${activity.startTime}-${activity.subject}`}
              className="relative grid grid-cols-[3rem_1rem_minmax(0,1fr)] gap-x-3 pb-7 last:pb-0 sm:grid-cols-[3.5rem_1rem_minmax(0,1fr)] sm:gap-x-4"
            >
              <time className="pt-0.5 text-sm font-semibold tabular-nums text-[color:var(--ink)]">{activity.startTime}</time>

              <div className="relative flex justify-center" aria-hidden="true">
                <span className="relative z-10 mt-1.5 h-3 w-3 rounded-full bg-[color:var(--link)] shadow-[0_0_0_4px_var(--surface),0_0_12px_var(--link)]" />
                {!isLast && <span className="absolute bottom-[-2.5rem] top-3 w-px bg-[color:var(--line)]" />}
              </div>

              <div className="min-w-0">
                {isSession ? (
                  <h3 className="font-semibold leading-snug text-[color:var(--ink)]">{activity.subject}</h3>
                ) : (
                  <p className="font-semibold leading-snug text-[color:var(--ink)]">{activity.subject}</p>
                )}
                {activity.speaker && <SpeakerLine speaker={activity.speaker} />}
                {activity.description && (
                  <MarkdownContent
                    content={activity.description}
                    className={`text-sm leading-relaxed text-[color:var(--muted)] ${isSession ? "mt-3" : "mt-1"}`}
                  />
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
