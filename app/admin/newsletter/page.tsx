import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import PageIntro from "@/components/PageIntro";
import PageContainer from "@/components/PageContainer";
import AdminTabs from "@/components/AdminTabs";
import CopyEmailsButton from "@/components/newsletter/CopyEmailsButton";
import EraseSubscriberButton from "@/components/newsletter/EraseSubscriberButton";
import { auth } from "@/auth";
import { countPendingSubscriptions, listSubscribers } from "@/lib/newsletter";
import { featureFlags } from "@/lib/featureFlags";

export const metadata: Metadata = {
  title: "Newsletter Admin | SUGNL",
  robots: { index: false, follow: false },
};

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeZone: "Europe/Amsterdam",
});

export default async function NewsletterAdminPage() {
  if (!featureFlags.newsletter) {
    notFound();
  }

  const session = await auth();
  if (!session?.isAdmin) {
    redirect("/admin");
  }

  const [subscribers, pendingCount] = await Promise.all([
    listSubscribers(),
    countPendingSubscriptions(),
  ]);

  return (
    <PageContainer className="md:py-16">
      <AdminTabs userName={session.user?.name} />
      <PageIntro
        title="Newsletter"
        description={`${subscribers.length} Subscribers · ${pendingCount} pending confirmation`}
      />

      <section className="surface-card space-y-6 bg-[color:var(--surface-soft)] p-6 md:p-8">
        <CopyEmailsButton emails={subscribers.map((subscriber) => subscriber.email)} />

        {subscribers.length === 0 ? (
          <p className="text-[color:var(--muted)]">No Subscribers yet.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[color:var(--line)] text-[color:var(--muted)]">
                <th className="py-2 font-medium">Email</th>
                <th className="py-2 font-medium">Confirmed</th>
                <th className="py-2" aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {subscribers.map((subscriber) => (
                <tr key={subscriber.email} className="border-b border-[color:var(--line)]">
                  <td className="break-all py-2 pr-4">{subscriber.email}</td>
                  <td className="whitespace-nowrap py-2 pr-4">{dateFormat.format(subscriber.confirmedAt)}</td>
                  <td className="py-2 text-right">
                    <EraseSubscriberButton email={subscriber.email} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </PageContainer>
  );
}
