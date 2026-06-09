"use client";

import { useState } from "react";
import { BlogSource, BlogPost } from "@/types";
import { BlogSourceFilter } from "./BlogSourceFilter";
import { BlogPostList } from "./BlogPostList";

interface BlogContentProps {
  initialPosts: BlogPost[];
  sources: BlogSource[];
}

export function BlogContent({ initialPosts, sources }: BlogContentProps) {
  const [selectedSourceIds, setSelectedSourceIds] = useState<string[]>(
    sources.map((s) => s.id)
  );

  return (
    <div className="space-y-6">
      <BlogSourceFilter
        sources={sources}
        posts={initialPosts}
        onSourcesChange={setSelectedSourceIds}
      />
      <div className="surface-card p-6 md:p-8">
        <BlogPostList posts={initialPosts} selectedSourceIds={selectedSourceIds} />
      </div>
    </div>
  );
}
