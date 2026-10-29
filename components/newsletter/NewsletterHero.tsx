import type { ReactNode } from "react";

interface NewsletterHeroProps {
  readonly title: string;
  readonly description: ReactNode;
}

/** Page intro matching the events pages: eyebrow, large heading and muted lead text. */
export default function NewsletterHero({ title, description }: NewsletterHeroProps) {
  return (
    <section className="mb-10 md:mb-12">
      <p className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-(--link)">Newsletter</p>
      <h1 className="mb-4 max-w-3xl text-4xl font-black leading-tight [font-family:var(--font-heading)] md:text-5xl">
        {title}
      </h1>
      <p className="max-w-3xl text-lg leading-relaxed text-(--muted)">{description}</p>
    </section>
  );
}
