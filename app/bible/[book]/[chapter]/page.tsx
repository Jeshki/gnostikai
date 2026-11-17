import { BibleReader } from "@/components/BibleReader";
import { chapterName, getBibleBook } from "@/lib/bible";
import { readBibleChapter } from "@/lib/bible-server";
import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ book: string; chapter: string }>;
}): Promise<Metadata> {
  const { book, chapter } = await params;
  const meta = getBibleBook(book);
  const number = Number(chapter);
  if (!meta || !Number.isInteger(number) || !meta.chapters.includes(number)) return {};
  return pageMeta({
    title: `${meta.titleLt} - ${chapterName(number, "lt")}`,
    description: `${meta.titleLt}. ${chapterName(number, "lt")}. Etiopijos Biblija.`,
    path: `/bible/${meta.slug}/${number}`,
    type: "article",
    keywords: [meta.titleLt, "Etiopijos Biblija"],
  });
}

export default async function BibleChapterPage({
  params,
}: {
  params: Promise<{ book: string; chapter: string }>;
}) {
  const { book, chapter } = await params;
  const number = Number(chapter);
  if (!Number.isInteger(number)) notFound();
  const data = readBibleChapter(book, number);
  if (!data) notFound();
  return <BibleReader slug={book} chapter={number} blocks={data.blocks} />;
}
