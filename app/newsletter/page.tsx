import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageIntro from "@/components/PageIntro";
import PageContainer from "@/components/PageContainer";
import { featureFlags } from "@/lib/featureFlags";

export const metadata: Metadata = {
  title: "Newsletter Sign-Up | SUGNL",
  description: "Subscribe to the SUGNL newsletter for event announcements and community updates.",
};

const brevoFormUrl =
  "https://2c2f31e7.sibforms.com/v2/serve/MUIFAN2IxJ-u7HnPPmOPyutRVaNFkJSGKuxtfXAE8GevRNWU3nTkpRNYvfg97C1dpzy_9bve84YynmCH3xui7Xf00R7kTqtVvgE0Qz6e-I-2_7iYNcfwfIpLW7BUPXPTj9qA8fpK604eicasMYuFUSRKlFVMQWfWLFccZFa7H-X8BPX2y4afHYv4uEFGdDFOXPWCiLJnh9X6QF6hTQ==";

export default function NewsletterPage() {
  if (!featureFlags.newsletter) {
    notFound();
  }

  return (
    <PageContainer className="md:py-16">
      <PageIntro title="Join our newsletter" />

      <section className="surface-card overflow-hidden border-[color:var(--line)] bg-[color:var(--surface-soft)] p-4 md:p-8">
        <div className="mx-auto max-w-3xl rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface)] p-3 shadow-sm md:p-5">
          <iframe
            src={brevoFormUrl}
            frameBorder="0"
            scrolling="auto"
            allowFullScreen
            title="Brevo newsletter sign-up"
            className="block w-full rounded-xl"
            style={{ height: "500px" }}
          />
        </div>
      </section>
    </PageContainer>
  );
}