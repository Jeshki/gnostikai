import { collections, corpus } from "@/lib/corpus";
import { siteUrl } from "@/lib/site";
import type { CollectionId } from "@/lib/types";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"] }> = [
    { path: "", priority: 1, changeFrequency: "weekly" },
    { path: "/library", priority: 0.9, changeFrequency: "weekly" },
    { path: "/about", priority: 0.9, changeFrequency: "monthly" },
    { path: "/glossary", priority: 0.8, changeFrequency: "monthly" },
    { path: "/map", priority: 0.7, changeFrequency: "monthly" },
    { path: "/timeline", priority: 0.7, changeFrequency: "yearly" },
    { path: "/compare", priority: 0.6, changeFrequency: "monthly" },
    { path: "/search", priority: 0.4, changeFrequency: "weekly" },
    ...((Object.keys(collections) as CollectionId[]).map((id) => ({
      path: `/library/${id}`,
      priority: 0.8,
      changeFrequency: "monthly" as const,
    }))),
  ];

  return [
    ...routes.map((item) => ({
      url: `${siteUrl}${item.path}`,
      lastModified: now,
      changeFrequency: item.changeFrequency,
      priority: item.priority,
    })),
    ...corpus.map((item) => ({
      url: `${siteUrl}/text/${item.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: item.featured ? 0.85 : 0.7,
    })),
  ];
}
