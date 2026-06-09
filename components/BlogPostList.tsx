"use client";

import { BlogPost } from "@/types";

interface BlogPostListProps {
  posts: BlogPost[];
  selectedSourceIds: string[];
}

export function BlogPostList({ posts, selectedSourceIds }: BlogPostListProps) {
  const filteredPosts = posts.filter((post) =>
    selectedSourceIds.includes(post.sourceId)
  );

  if (filteredPosts.length === 0) {
    return (
      <p className="py-12 text-center text-[color:var(--muted)]">
        No blog posts available for the selected sources.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {filteredPosts.map((post) => (
        <article
          key={post.id}
          className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-4"
        >
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[color:var(--muted)]">
            {post.sourceName} ·{" "}
            {new Date(post.publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
          <h2 className="mb-2 text-lg font-bold text-[color:var(--ink)]">
            {post.title}
          </h2>
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
  );
}
