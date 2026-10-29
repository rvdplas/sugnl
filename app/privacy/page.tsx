import type { Metadata } from "next";
import Link from "next/link";
import PageIntro from "@/components/PageIntro";
import PageContainer from "@/components/PageContainer";

export const metadata: Metadata = {
  title: "Privacy Statement | SUGNL",
  description: "How SUGNL handles your personal data.",
};

const sectionTitleClassName = "text-2xl font-bold [font-family:var(--font-heading)]";

export default function PrivacyPage() {
  return (
    <PageContainer>
      <PageIntro
        title="Privacy statement"
        description="SUGNL (Sitecore User Group Netherlands) is a volunteer-run community. This statement explains which personal data we process, why, and what your rights are."
        sectionClassName="mb-8"
      />

      <div className="surface-card space-y-8 p-6 text-[color:var(--ink)] md:p-8">
        <section className="space-y-3">
          <h2 className={sectionTitleClassName}>Newsletter</h2>
          <p>
            When you subscribe to our newsletter, we store <strong>only your email address</strong>, together with the
            moment you gave and confirmed your consent. We use it solely to send you the SUGNL newsletter.
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong>Legal basis:</strong> your consent (GDPR article 6(1)(a)). We ask you to confirm your subscription
              through a link we email you, so nobody can subscribe your address without you knowing.
            </li>
            <li>
              <strong>Retention:</strong> unconfirmed subscriptions are erased after 7 days. When you unsubscribe, we erase
              your email address completely and keep no record of it.
            </li>
            <li>
              <strong>Who processes it:</strong> our database is hosted by Neon in the European Union (Frankfurt), the
              website by Vercel, and confirmation emails are sent through our email provider TransIP (the Netherlands). We
              never sell or share your address with anyone else.
            </li>
            <li>
              <strong>Unsubscribing:</strong> you can withdraw your consent at any time on our{" "}
              <Link href="/newsletter/unsubscribe" className="underline underline-offset-4">
                unsubscribe page
              </Link>
              .
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className={sectionTitleClassName}>Analytics and cookies</h2>
          <p>
            We measure visits with Vercel Web Analytics, which does not use cookies. We store your cookie choice, theme
            preference and which announcement banners you closed in your browser. Event pages can show an embedded Google Maps map, which is only loaded after you
            allow embedded content; Google may then set cookies and receive your IP address. You can change your choice at
            any time via &quot;Cookie settings&quot; at the bottom of every page.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className={sectionTitleClassName}>Your rights</h2>
          <p>
            You have the right to access, correct and erase your personal data, and to withdraw consent at any time. To
            exercise these rights, or with any question about privacy, email{" "}
            <a href="mailto:info@sugnl.net" className="underline underline-offset-4">
              info@sugnl.net
            </a>
            . You also have the right to lodge a complaint with the Dutch Data Protection Authority (Autoriteit
            Persoonsgegevens).
          </p>
        </section>
      </div>
    </PageContainer>
  );
}
