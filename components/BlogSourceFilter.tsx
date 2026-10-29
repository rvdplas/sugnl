"use client";

import { BlogSource, BlogPost } from "@/types";
import { useState } from "react";

interface BlogSourceFilterProps {
  sources: BlogSource[];
  posts: BlogPost[];
  onSourcesChange: (sourceIds: string[]) => void;
}

export function BlogSourceFilter({
  sources,
  posts,
  onSourcesChange,
}: BlogSourceFilterProps) {
  const postCountBySource = posts.reduce(
    (acc, post) => {
      acc[post.sourceId] = (acc[post.sourceId] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const sourcesWithPosts = sources.filter(
    (source) => (postCountBySource[source.id] ?? 0) > 0
  );

  const allSourceIds = sourcesWithPosts.map((s) => s.id);
  const [selectedSources, setSelectedSources] = useState<Set<string>>(
    new Set(allSourceIds)
  );

  const handleSelectSource = (sourceId: string) => {
    const isSingleSelected =
      selectedSources.size === 1 && selectedSources.has(sourceId);
    const newSelected = isSingleSelected
      ? new Set(allSourceIds)
      : new Set([sourceId]);

    setSelectedSources(newSelected);
    onSourcesChange(Array.from(newSelected));
  };

  const handleSelectAll = () => {
    const allSelected = new Set(allSourceIds);
    setSelectedSources(allSelected);
    onSourcesChange(Array.from(allSelected));
  };

  const areAllSourcesSelected = selectedSources.size === allSourceIds.length;

  return (
    <div className="mb-6 rounded-lg border border-(--line) bg-(--surface-soft) p-4">
      <h2 className="mb-3 text-sm font-semibold tracking-wide text-(--muted)">
        Filter by Source
      </h2>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          aria-pressed={areAllSourcesSelected}
          onClick={handleSelectAll}
          className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
            areAllSourcesSelected
              ? "border-(--accent) bg-(--pill-upcoming-bg) font-semibold text-(--accent-ink)"
              : "border-(--input-border) bg-(--surface) text-(--muted) hover:bg-(--surface-soft)"
          }`}
        >
          All sources ({posts.length})
        </button>

        {sourcesWithPosts.map((source) => {
          const postCount = postCountBySource[source.id] ?? 0;
          const isSelected = selectedSources.has(source.id);

          return (
            <button
              key={source.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => handleSelectSource(source.id)}
              className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                isSelected
                  ? "border-(--accent) bg-(--pill-upcoming-bg) font-semibold text-(--accent-ink)"
                  : "border-(--input-border) bg-(--surface) text-(--muted) hover:bg-(--surface-soft)"
              }`}
            >
              {source.name}
              <span className="ml-1.5 font-semibold">({postCount})</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
