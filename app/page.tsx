import Link from "next/link";
import { getLatestBlogPosts } from "@/lib/blogFeeds";
import { getUpcomingEvents } from "@/lib/events";
import PageIntro from "@/components/PageIntro";
import PageContainer from "@/components/PageContainer";
import { featureFlags } from "@/lib/featureFlags";

function formatEventDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function Home() {
  const communityPosts = await getLatestBlogPosts(3);
  const nextEvent = getUpcomingEvents()[0];

  return (
    <PageContainer>
      <PageIntro
        title="Welcome to SUGNL"
        description="We organize three community events per year to bring together developers, architects, and tech enthusiasts. Join us for evenings of knowledge sharing, networking, and exploring the latest technologies."
      />
      
      <section className="surface-card mb-12 p-6 md:p-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.15em] text-[color:var(--muted)]">
          Upcoming Event
        </p>
        {nextEvent ? (
          <>
            <h2 className="mb-3 text-3xl font-black [font-family:var(--font-heading)] md:text-4xl">
              {nextEvent.title}
            </h2>
            <p className="mb-1 text-sm text-[color:var(--muted)] md:text-base">
              {formatEventDate(nextEvent.date)}
            </p>
            <p className="mb-1 text-sm text-[color:var(--muted)] md:text-base">
              {nextEvent.startTime} - {nextEvent.endTime}
            </p>
            <p className="mb-5 text-sm text-[color:var(--muted)] md:text-base">
              {nextEvent.location}
            </p>
            <p className="mb-6 max-w-2xl text-[color:var(--muted)] md:text-lg">
              {nextEvent.description}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/event/${nextEvent.id}`}
                className="inline-block rounded-full border border-[color:var(--nav-line)] bg-[color:var(--button-primary)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[color:var(--button-primary-hover)]"
              >
                View Event Details →
              </Link>
              <Link
                href="/events"
                className="inline-block rounded-full border border-[color:var(--line)] bg-[color:var(--surface)] px-6 py-3 text-sm font-semibold text-[color:var(--ink)] transition-colors hover:bg-[color:var(--surface-soft)]"
              >
                Browse All Events
              </Link>
            </div>
          </>
        ) : (
          <>
            <h2 className="mb-3 text-3xl font-black [font-family:var(--font-heading)] md:text-4xl">
              New Event Announcement Coming Soon
            </h2>
            <p className="mb-6 max-w-2xl text-[color:var(--muted)] md:text-lg">
              We are preparing the next SUGNL meetup. Check back shortly or explore our community blogs while you wait.
            </p>
            <Link
              href="/events"
              className="inline-block rounded-full border border-[color:var(--nav-line)] bg-[color:var(--button-primary)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[color:var(--button-primary-hover)]"
            >
              View Events →
            </Link>
          </>
        )}
      </section>

      <section className="mb-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="mb-2 text-3xl font-black [font-family:var(--font-heading)] md:text-4xl">
              From Our Community Blogs
            </h2>
            <p className="max-w-2xl text-[color:var(--muted)] md:text-lg">
              Sharp ideas, practical stories, and lessons learned straight from fellow builders in the SUGNL network.
            </p>
          </div>
          <Link
            href="/community-blogs"
            className="shrink-0 text-sm font-semibold text-[color:var(--link)] hover:underline"
          >
            Explore all posts →
          </Link>
        </div>

        {communityPosts.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-3">
            {communityPosts.map((post) => (
              <article
                key={post.id}
                className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-4"
              >
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[color:var(--muted)]">
                  {post.sourceName} ·{" "}
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <h3 className="mb-2 line-clamp-2 text-lg font-bold text-[color:var(--ink)]">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="mb-3 line-clamp-3 text-sm leading-relaxed text-[color:var(--muted)]">
                    {post.excerpt}
                  </p>
                )}
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-[color:var(--link)] hover:underline"
                >
                  Read post →
                </a>
              </article>
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-4 text-sm text-[color:var(--muted)]">
            Community posts are loading in. Visit the community blog page for the latest updates.
          </p>
        )}
      </section>

      {featureFlags.newsletter && (
        <section className="surface-card p-6 md:p-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.15em] text-[color:var(--muted)]">
            Stay In The Loop
          </p>
          <h2 className="mb-3 text-3xl font-black [font-family:var(--font-heading)] md:text-4xl">
            Get meetup invites before they fill up
          </h2>
          <p className="mb-6 max-w-2xl text-[color:var(--muted)] md:text-lg">
            Join the SUGNL newsletter for early event announcements, speaker highlights, and practical community updates you can use right away.
          </p>
          <Link
            href="/newsletter"
            className="inline-block rounded-full border border-[color:var(--nav-line)] bg-[color:var(--button-primary)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[color:var(--button-primary-hover)]"
          >
            Sign up for newsletter →
          </Link>
        </section>
      )}
    </PageContainer>
  );
}
