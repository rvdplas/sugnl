"use client";

import { useEffect, useState } from "react";
import { BlogPost } from "@/types";

interface BlogPostListProps {
  posts: BlogPost[];
  selectedSourceIds: string[];
}

const POSTS_PER_PAGE = 12;

export function BlogPostList({ posts, selectedSourceIds }: BlogPostListProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPosts = posts.filter((post) =>
    selectedSourceIds.includes(post.sourceId)
  );

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSourceIds]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const pageStart = (currentPage - 1) * POSTS_PER_PAGE;
  const pagePosts = filteredPosts.slice(pageStart, pageStart + POSTS_PER_PAGE);

  if (filteredPosts.length === 0) {
    return (
      <p className="py-12 text-center text-[color:var(--muted)]">
        No blog posts available for the selected sources.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {pagePosts.map((post) => (
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

      {totalPages > 1 && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[color:var(--line)] pt-4">
          <p className="text-sm text-[color:var(--muted)]">
            Showing {pageStart + 1}-{Math.min(pageStart + POSTS_PER_PAGE, filteredPosts.length)} of {filteredPosts.length} posts
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="rounded-full border border-[color:var(--line)] bg-[color:var(--surface)] px-3 py-1.5 text-sm font-medium text-[color:var(--muted)] transition-colors enabled:hover:bg-[color:var(--surface-soft)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm font-medium text-[color:var(--ink)]">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages}
              className="rounded-full border border-[color:var(--line)] bg-[color:var(--surface)] px-3 py-1.5 text-sm font-medium text-[color:var(--muted)] transition-colors enabled:hover:bg-[color:var(--surface-soft)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
