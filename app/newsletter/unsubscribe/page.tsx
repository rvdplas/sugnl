import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import PageContainer from "@/components/PageContainer";
import NewsletterEmailForm from "@/components/newsletter/NewsletterEmailForm";
import NewsletterShowcase, { unsubscribeBenefits } from "@/components/newsletter/NewsletterShowcase";
import NewsletterTokenConfirmation from "@/components/newsletter/NewsletterTokenConfirmation";
import UnsubscribalityEasterEgg from "@/components/newsletter/unsubscribality/UnsubscribalityEasterEgg";
import { featureFlags } from "@/lib/featureFlags";

export const metadata: Metadata = {
  title: "Unsubscribe | SUGNL",
  description: "Unsubscribe from the SUGNL newsletter.",
};

export default async function NewsletterUnsubscribePage() {
  if (!featureFlags.newsletter) {
    notFound();
  }

  // Render per request so the CSP nonce reaches the inline scripts that hydrate the form.
  await connection();

  return (
    <PageContainer className="py-8 md:py-12">
      <NewsletterShowcase
        title="Leave the SUGNL"
        highlight="newsletter"
        description="Sorry to see you go. Once you confirm, we erase your email address from our list right away."
        benefitsTitle="Good to know"
        benefits={unsubscribeBenefits}
        action={
          <>
            <NewsletterTokenConfirmation
              variant="showcase"
              endpoint="/api/newsletter/unsubscribe/confirm"
              heading="Confirm unsubscribing"
              text="Click the button below and we erase your email address from our list."
              buttonLabel="Unsubscribe"
              successHeading="You're unsubscribed"
              successText="Your email address has been erased from our list. You're still welcome at every SUGNL event."
              fallback={
                <>
                  <p className="mb-4 text-(--muted)">
                    Enter your email address and we&apos;ll email you a link to confirm. Using the unsubscribe link in
                    one of our emails skips this step.
                  </p>
                  <NewsletterEmailForm endpoint="/api/newsletter/unsubscribe" submitLabel="Email me a link" variant="showcase" />
                </>
              }
            />
            <p className="mt-4 text-sm text-(--muted)">
              Changed your mind?{" "}
              <Link href="/newsletter" className="text-(--link) underline-offset-4 hover:underline">
                Stay subscribed
              </Link>
            </p>
            <UnsubscribalityEasterEgg />
          </>
        }
      />
    </PageContainer>
  );
}
