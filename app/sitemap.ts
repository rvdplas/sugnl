import type { MetadataRoute } from "next";
import { events } from "@/lib/events";
import { featureFlags } from "@/lib/featureFlags";
import { siteUrl } from "@/lib/siteUrl";

const publicPaths = [
  "/",
  "/become-a-speaker",
  "/community-blogs",
  "/dutch-mvps",
  "/events",
  "/organizers",
  ...(featureFlags.newsletter ? ["/newsletter"] : []),
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...publicPaths.map((path) => ({ url: new URL(path, siteUrl).toString() })),
    ...events.map((event) => ({
      url: new URL(`/event/${encodeURIComponent(event.id)}`, siteUrl).toString(),
    })),
  ];
}