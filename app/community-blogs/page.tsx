import type { Metadata } from "next";
import { getLatestBlogPosts, getBlogSources } from "@/lib/blogFeeds";
import { BlogContent } from "@/components/BlogContent";

const BLOG_PAGE_TITLE = "Community blogs | SUGNL";
const BLOG_PAGE_DESCRIPTION =
  "Read the latest community blogs curated by SUGNL, featuring practical insights from developers, architects, and tech enthusiasts.";

export const metadata: Metadata = {
  title: BLOG_PAGE_TITLE,
  description: BLOG_PAGE_DESCRIPTION,
  keywords: [
    "SUGNL",
    "community blogs",
    "developer blog",
    "software architecture",
    "tech community",
    "meetup community",
  ],
  alternates: {
    canonical: "/community-blogs",
  },
  openGraph: {
    title: BLOG_PAGE_TITLE,
    description: BLOG_PAGE_DESCRIPTION,
    type: "website",
    url: "/community-blogs",
    siteName: "SUGNL",
    images: [
      {
        url: "/sugnl-logo.png",
        width: 200,
        height: 32,
        alt: "SUGNL community logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: BLOG_PAGE_TITLE,
    description: BLOG_PAGE_DESCRIPTION,
    images: ["/sugnl-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function BlogPage() {
  const blogPosts = await getLatestBlogPosts(20);
  const sources = getBlogSources();
  const blogListSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "SUGNL Community blogs",
    description: BLOG_PAGE_DESCRIPTION,
    url: "/community-blogs",
    publisher: {
      "@type": "Organization",
      name: "SUGNL",
      logo: {
        "@type": "ImageObject",
        url: "/sugnl-logo.png",
      },
    },
    blogPost: blogPosts.slice(0, 10).map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: post.url,
      datePublished: post.publishedAt,
      description: post.excerpt,
      author: {
        "@type": "Person",
        name: post.sourceName,
      },
    })),
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListSchema) }}
      />
      <section className="mb-8">
        <h1 className="mb-3 text-4xl font-black [font-family:var(--font-heading)] md:text-5xl">
          Community blogs
        </h1>
        <p className="max-w-2xl text-lg text-[color:var(--muted)]">
          Articles and updates from people in our SUGNL community, and it is
          open to others as well. Want your RSS feed added too? Please reach
          out to{" "}
          <a className="underline" href="mailto:info@sugnl.net">
            info@sugnl.net
          </a>
          .
        </p>
      </section>

      {blogPosts.length > 0 ? (
        <BlogContent initialPosts={blogPosts} sources={sources} />
      ) : (
        <p className="py-12 text-center text-[color:var(--muted)]">
          No blog posts are available right now. Please check back later.
        </p>
      )}
    </div>
  );
}