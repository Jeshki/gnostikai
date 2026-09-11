import { SearchView } from "@/components/SearchView";
import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import { Suspense } from "react";

type Props = { searchParams: Promise<{ q?: string | string[] }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const raw = (await searchParams).q;
  const q = (Array.isArray(raw) ? raw[0] : raw)?.trim() ?? "";
  const hasQuery = q.length > 0;
  return pageMeta({
    title: hasQuery ? `Paieška: ${q}` : "Paieška",
    description:
      "Ieškok teksto, posakio ar eono AEON korpuse — Tomas, Marija, Nag Hammadi, žodynas.",
    path: hasQuery ? `/search?q=${encodeURIComponent(q)}` : "/search",
    titleEn: hasQuery ? `Search: ${q}` : "Search",
    descriptionEn: "Search a text, saying, or aeon in the AEON corpus — Thomas, Mary, Nag Hammadi, glossary.",
    index: !hasQuery,
  });
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchView />
    </Suspense>
  );
}
