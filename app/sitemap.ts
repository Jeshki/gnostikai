import { bibleCatalog } from "@/lib/bible";
import { nhCatalog } from "@/lib/nh";
import { siteUrl } from "@/lib/site";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes: Array<{
    path: string;
    priority: number;
    changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"];
  }> = [
    { path: "", priority: 1, changeFrequency: "weekly" },
    { path: "/bible", priority: 0.95, changeFrequency: "weekly" },
    { path: "/library", priority: 0.9, changeFrequency: "weekly" },
    { path: "/about", priority: 0.9, changeFrequency: "monthly" },
    { path: "/glossary", priority: 0.8, changeFrequency: "monthly" },
    { path: "/map", priority: 0.7, changeFrequency: "monthly" },
    { path: "/compare", priority: 0.6, changeFrequency: "monthly" },
    { path: "/search", priority: 0.4, changeFrequency: "weekly" },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  ];

  const texts = nhCatalog.map((item) => ({
    url: `${siteUrl}/nh/${item.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const bibleBooks = bibleCatalog.map((book) => ({
    url: `${siteUrl}/bible/${book.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const bibleChapters = bibleCatalog.flatMap((book) =>
    book.chapters.map((chapter) => ({
      url: `${siteUrl}/bible/${book.slug}/${chapter}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.4,
    })),
  );

  return [
    ...routes.map((item) => ({
      url: `${siteUrl}${item.path}`,
      lastModified: now,
      changeFrequency: item.changeFrequency,
      priority: item.priority,
    })),
    ...texts,
    ...bibleBooks,
    ...bibleChapters,
  ];
}
