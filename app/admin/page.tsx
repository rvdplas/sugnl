import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import PageIntro from "@/components/PageIntro";
import PageContainer from "@/components/PageContainer";
import { auth } from "@/auth";
import { featureFlags } from "@/lib/featureFlags";
import { signInWithGitHub, signOutAdmin } from "./actions";

export const metadata: Metadata = {
  title: "Admin | SUGNL",
  robots: { index: false, follow: false },
};

const buttonClassName =
  "rounded-md bg-(--button-primary) px-4 py-2 text-white transition-colors hover:bg-(--button-primary-hover)";

interface AdminPageProps {
  readonly searchParams: Promise<{ error?: string }>;
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  if (!featureFlags.newsletter) {
    notFound();
  }

  const session = await auth();

  if (!session?.isAdmin) {
    const { error } = await searchParams;
    const denied = error === "AccessDenied" || Boolean(session);

    return (
      <PageContainer className="py-12 md:py-16">
        <PageIntro title="Admin" description="Sign in with an Admin GitHub account to continue." />
        <section className="surface-card max-w-xl space-y-4 bg-(--surface-soft) p-6 md:p-8">
          {denied && (
            <p className="rounded-md bg-(--error-bg) p-3 text-(--error-ink)">
              This GitHub account is not allowed to use the admin pages.
            </p>
          )}
          {error && !denied && (
            <p className="rounded-md bg-(--error-bg) p-3 text-(--error-ink)">
              Signing in failed. Please try again.
            </p>
          )}
          <form action={session ? signOutAdmin : signInWithGitHub}>
            <button type="submit" className={buttonClassName}>
              {session ? "Sign out" : "Sign in with GitHub"}
            </button>
          </form>
        </section>
      </PageContainer>
    );
  }

  redirect("/admin/newsletter");
}
