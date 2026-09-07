import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = pageMeta({
  title: "Paieška",
  description: "Ieškok teksto, posakio ar eono AEON korpuse — Tomas, Marija, Nag Hammadi, žodynas.",
  path: "/search",
  titleEn: "Search",
});

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
