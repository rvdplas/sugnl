import type { ComponentType, SVGProps } from "react";
import MarkdownContent from "@/components/MarkdownContent";
import { CupIcon, LaptopIcon, UsersIcon } from "@/components/event/icons";
import { cardClassName, cardHeadingClassName } from "@/components/event/styles";

type Highlight = {
  title: string;
  description: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const defaultHighlights: Highlight[] = [
  { title: "Inspiring talks", description: "Real-world experience from the community", Icon: UsersIcon },
  { title: "Hands-on workshop", description: "Try it out yourself", Icon: LaptopIcon },
  { title: "Food, drinks & networking", description: "Meet and exchange ideas", Icon: CupIcon },
];

type EventAboutProps = {
  readonly body?: string;
  readonly highlights?: Highlight[];
};

export default function EventAbout({ body, highlights = defaultHighlights }: EventAboutProps) {
  return (
    <section aria-labelledby="about-event" className={cardClassName}>
      <h2 id="about-event" className={`${cardHeadingClassName} mb-4`}>
        About this event
      </h2>
      {body && <MarkdownContent content={body} className="mb-6 space-y-3 leading-relaxed text-[color:var(--muted)]" />}

      <ul className="grid gap-4 sm:grid-cols-3">
        {highlights.map(({ title, description, Icon }) => (
          <li key={title} className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--link)]">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-[color:var(--ink)]">{title}</p>
              <p className="text-xs leading-relaxed text-[color:var(--muted)]">{description}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
