import { NextResponse } from "next/server";
import { getBlogSources, getLatestBlogPosts } from "@/lib/blogFeeds";

export async function GET() {
  try {
    const posts = await getLatestBlogPosts(10);

    return NextResponse.json(
      {
        posts,
        sources: getBlogSources(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Blog posts API error:", error);
    return NextResponse.json({ error: "Failed to load blog posts" }, { status: 500 });
  }
}
