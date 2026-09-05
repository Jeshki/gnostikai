import { corpus } from "@/lib/corpus";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://aeon.library";
  const routes = [
    "",
    "/library",
    "/library/nag-hammadi",
    "/library/berlin-codex",
    "/library/nt-apocrypha",
    "/library/askew-bruce",
    "/map",
    "/timeline",
    "/glossary",
    "/compare",
    "/about",
    "/search",
    "/saved",
  ];

  return [
    ...routes.map((path) => ({
      url: `${base}${path}`,
      lastModified: new Date(),
    })),
    ...corpus.map((item) => ({
      url: `${base}/text/${item.slug}`,
      lastModified: new Date(),
    })),
  ];
}
