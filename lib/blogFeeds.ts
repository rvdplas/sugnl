import Parser from "rss-parser";
import { BlogPost, BlogSource } from "@/types";

const REVALIDATE_AFTER_ONE_DAY_SECONDS = 60 * 60 * 24;

const parser = new Parser();

const blogSources: BlogSource[] = [
    {
    id: "stockpick",
    name: "Jan Bluemink",
    websiteUrl: "https://www.stockpick.nl",
    feedUrl: "https://www.stockpick.nl/rss",
  },
    {
    id: "jeroenbreuer",
    name: "Jeroen Breuer",
    websiteUrl: "https://www.jeroenbreuer.nl",
    feedUrl: "https://www.jeroenbreuer.nl/feed",
  },
  {
    id: "kayee",
    name: "Robert Hock",
    websiteUrl: "https://www.kayee.nl",
    feedUrl: "https://www.kayee.nl/feed/",
  },

  {
    id: "contentinsights",
    name: "Ronald van der Plas",
    websiteUrl: "https://www.contentinsights.dev",
    feedUrl: "https://www.contentinsights.dev/feeds/posts/default?alt=rss",
  },
];

function sanitizeText(value: string | undefined): string | undefined {
  if (!value) {
    return undefined;
  }

  const stripped = value
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return stripped.length > 0 ? stripped : undefined;
}

function normalizeDate(value: string | undefined): string {
  if (!value) {
    return new Date(0).toISOString();
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return new Date(0).toISOString();
  }

  return parsed.toISOString();
}

async function loadRssSource(source: BlogSource): Promise<BlogPost[]> {
  const response = await fetch(source.feedUrl, {
    next: { revalidate: REVALIDATE_AFTER_ONE_DAY_SECONDS, tags: [`blog-feed:${source.id}`] },
  });

  if (!response.ok) {
    throw new Error(`Feed request failed for ${source.id}: ${response.status}`);
  }

  const rssXml = await response.text();
  const feed = await parser.parseString(rssXml);

  const posts: BlogPost[] = (feed.items ?? [])
    .filter((item) => Boolean(item.link) && Boolean(item.title))
    .map((item) => {
      const rawId = item.guid ?? item.link ?? `${source.id}-${item.title}`;
      const excerpt = sanitizeText(item.contentSnippet ?? item.content ?? undefined);

      return {
        id: `${source.id}:${rawId}`,
        sourceId: source.id,
        sourceName: source.name,
        title: item.title ?? "Untitled post",
        url: item.link ?? source.websiteUrl,
        excerpt,
        publishedAt: normalizeDate(item.isoDate ?? item.pubDate),
      };
    });

  return posts;
}

export async function getLatestBlogPosts(limit = 6): Promise<BlogPost[]> {
  const allPosts = await Promise.all(
    blogSources.map(async (source) => {
      try {
        return await loadRssSource(source);
      } catch (error) {
        console.error(`Failed to load feed for ${source.id}:`, error);
        return [];
      }
    })
  );

  return allPosts
    .flat()
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
}

export function getBlogSources(): BlogSource[] {
  return blogSources;
}
