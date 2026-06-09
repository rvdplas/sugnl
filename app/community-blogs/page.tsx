import type { Metadata } from "next";
import { getLatestBlogPosts, getBlogSources } from "@/lib/blogFeeds";
import { BlogContent } from "@/components/BlogContent";
import PageIntro from "@/components/PageIntro";
import PageContainer from "@/components/PageContainer";

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
    <PageContainer>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListSchema) }}
      />

      <PageIntro
        title="Community blogs"
        description={
          <>
            Articles and updates from people in our SUGNL community, and it is open to others as well. Want your RSS feed added too?
            <br />
            <br />
            Please reach out to <a className="underline" href="mailto:info@sugnl.net">info@sugnl.net</a>.
          </>
        }
      />

      {blogPosts.length > 0 ? (
        <BlogContent initialPosts={blogPosts} sources={sources} />
      ) : (
        <p className="py-12 text-center text-[color:var(--muted)]">
          No blog posts are available right now. Please check back later.
        </p>
      )}
    </PageContainer>
  );
}