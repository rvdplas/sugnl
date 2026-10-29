import type { ComponentType, ReactNode, SVGProps } from "react";
import { CalendarIcon, DocumentIcon, ShieldCheckIcon, UsersIcon } from "@/components/event/icons";
import NewsletterIllustration from "@/components/newsletter/NewsletterIllustration";
import { gradientTextClassName, iconBadgeClassName } from "@/components/newsletter/styles";

interface NewsletterShowcaseProps {
  readonly title: string;
  /** Second line of the heading, shown in the brand gradient. */
  readonly highlight: string;
  readonly description: ReactNode;
  /** The form or confirm button; placed right under the intro so it is visible without scrolling. */
  readonly action: ReactNode;
  /** Heading for the list next to the illustration (visible on mobile only). */
  readonly benefitsTitle?: string;
  readonly benefits?: readonly NewsletterBenefit[];
}

export interface NewsletterBenefit {
  readonly icon: ComponentType<SVGProps<SVGSVGElement>>;
  readonly title: string;
  readonly text: string;
}

const subscribeBenefits: readonly NewsletterBenefit[] = [
  { icon: CalendarIcon, title: "Event updates", text: "Be the first to know about SUGNL meetups and workshops." },
  { icon: DocumentIcon, title: "Community news", text: "Insights, articles and useful resources." },
  { icon: UsersIcon, title: "Relevant content", text: "Made for the Dutch Sitecore community." },
  { icon: ShieldCheckIcon, title: "No spam", text: "Only important updates, and you can unsubscribe at any time." },
];

export const unsubscribeBenefits: readonly NewsletterBenefit[] = [
  { icon: ShieldCheckIcon, title: "Erased completely", text: "We keep no record of your email address." },
  { icon: CalendarIcon, title: "Events stay open", text: "You are still welcome at every SUGNL meetup." },
  { icon: UsersIcon, title: "Come back anytime", text: "Subscribe again whenever you like." },
];

/** Hero layout for the newsletter pages: intro and action on the left, illustration and benefits on the right. */
export default function NewsletterShowcase({
  title,
  highlight,
  description,
  action,
  benefitsTitle = "What you can expect",
  benefits = subscribeBenefits,
}: NewsletterShowcaseProps) {
  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-12">
      <div>
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-(--link)">SUGNL Newsletter</p>
        <h1 className="mb-4 text-4xl font-black leading-[1.05] [font-family:var(--font-heading)] sm:text-5xl lg:text-6xl">
          {title}
          <br />
          <span className={gradientTextClassName}>{highlight}</span>
        </h1>
        <p className="mb-8 max-w-xl text-lg leading-relaxed text-(--muted)">{description}</p>

        <section className="surface-card p-6 md:p-8">{action}</section>
      </div>

      <div>
        <NewsletterIllustration className="mx-auto w-full max-w-md lg:max-w-none" />

        <h2 className="mb-5 mt-2 text-2xl font-black [font-family:var(--font-heading)] lg:sr-only">
          {benefitsTitle}
        </h2>
        <ul className="grid gap-5 sm:grid-cols-2">
          {benefits.map(({ icon: Icon, title: benefitTitle, text }) => (
            <li key={benefitTitle} className="flex items-start gap-4">
              <span className={iconBadgeClassName}>
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-bold text-(--ink)">{benefitTitle}</p>
                <p className="text-sm text-(--muted)">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
