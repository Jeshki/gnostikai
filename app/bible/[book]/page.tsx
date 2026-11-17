import { BibleBook } from "@/components/BibleBook";
import { getBibleBook, readingChapters } from "@/lib/bible";
import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ book: string }>;
}): Promise<Metadata> {
  const { book } = await params;
  const meta = getBibleBook(book);
  if (!meta) return {};
  const count = readingChapters(meta).length;
  return pageMeta({
    title: meta.titleLt,
    description: `${meta.titleLt}. ${count} skyriai. Etiopijos Biblija.`,
    path: `/bible/${meta.slug}`,
    type: "article",
    keywords: [meta.titleLt, "Etiopijos Biblija"],
  });
}

export default async function BibleBookPage({
  params,
}: {
  params: Promise<{ book: string }>;
}) {
  const { book } = await params;
  if (!getBibleBook(book)) notFound();
  return <BibleBook slug={book} />;
}
