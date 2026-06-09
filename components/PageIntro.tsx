import type { ReactNode } from "react";

interface PageIntroProps {
  readonly title: ReactNode;
  readonly description?: ReactNode;
  readonly sectionClassName?: string;
  readonly titleClassName?: string;
  readonly descriptionClassName?: string;
}

export default function PageIntro({
  title,
  description,
  sectionClassName = "mb-12",
  titleClassName = "mb-4 text-4xl font-black [font-family:var(--font-heading)] md:text-5xl",
  descriptionClassName = "max-w-2xl text-lg text-[color:var(--muted)]",
}: PageIntroProps) {
  return (
    <section className={sectionClassName}>
      <div>
        <h1 className={titleClassName}>{title}</h1>
        {description ? <p className={descriptionClassName}>{description}</p> : null}
      </div>
    </section>
  );
}