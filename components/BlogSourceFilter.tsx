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
  const allSourceIds = sources.map((s) => s.id);
  const [selectedSources, setSelectedSources] = useState<Set<string>>(
    new Set(allSourceIds)
  );

  const postCountBySource = posts.reduce(
    (acc, post) => {
      acc[post.sourceId] = (acc[post.sourceId] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
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
    <div className="mb-6 rounded-lg border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-4">
      <h3 className="mb-3 text-sm font-semibold tracking-wide text-[color:var(--muted)]">
        Filter by Source
      </h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleSelectAll}
          className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
            areAllSourcesSelected
              ? "bg-[color:var(--accent)] text-[color:var(--surface)]"
              : "border border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--muted)] hover:bg-[color:var(--surface-soft)]"
          }`}
        >
          All sources ({posts.length})
        </button>

        {sources.map((source) => {
          const postCount = postCountBySource[source.id] ?? 0;
          const isSelected = selectedSources.has(source.id);

          return (
            <button
              key={source.id}
              onClick={() => handleSelectSource(source.id)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                isSelected
                  ? "bg-[color:var(--accent)] text-[color:var(--surface)]"
                  : "border border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--muted)] hover:bg-[color:var(--surface-soft)]"
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
