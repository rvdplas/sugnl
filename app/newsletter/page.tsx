import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import PageContainer from "@/components/PageContainer";
import NewsletterEmailForm from "@/components/newsletter/NewsletterEmailForm";
import NewsletterShowcase from "@/components/newsletter/NewsletterShowcase";
import { featureFlags } from "@/lib/featureFlags";

export const metadata: Metadata = {
  title: "Newsletter Sign-Up | SUGNL",
  description: "Subscribe to the SUGNL newsletter for event announcements and community updates.",
};

export default async function NewsletterPage() {
  if (!featureFlags.newsletter) {
    notFound();
  }

  // Render per request so the CSP nonce reaches the inline scripts that hydrate the form.
  await connection();

  return (
    <PageContainer className="py-8 md:py-12">
      <NewsletterShowcase
        title="Join the SUGNL"
        highlight="newsletter"
        description="Stay up to date on upcoming events, sessions and news from the Dutch Sitecore community. We only ask for your email address."
        action={
          <>
            <NewsletterEmailForm
              endpoint="/api/newsletter/subscribe"
              submitLabel="Subscribe"
              requireConsent
              variant="showcase"
            />
            <p className="mt-4 text-sm text-(--muted)">
              We&apos;ll email you a link to confirm. Changed your mind?{" "}
              <Link href="/newsletter/unsubscribe" className="text-(--link) underline-offset-4 hover:underline">
                Unsubscribe
              </Link>
            </p>
          </>
        }
      />
    </PageContainer>
  );
}
