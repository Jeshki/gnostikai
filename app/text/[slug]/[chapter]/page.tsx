import { Reader } from "@/components/Reader";
import { getBodyChapter, getFullBody } from "@/lib/bodies";
import { corpus, getText } from "@/lib/corpus";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

const huge = new Set([
  "pistis-sophia",
  "clementine-recognitions",
  "clementine-homilies",
  "against-marcion-4",
  "against-marcion-5",
  "life-of-john",
  "paul-seneca",
  "apocalypse-thomas",
  "vindicta",
  "acts-thomas",
  "nicodemus",
  "acts-peter-paul",
]);

export function generateStaticParams() {
  return corpus
    .filter((item) => !huge.has(item.slug))
    .flatMap((item) =>
      item.chapters.map((chapter) => ({ slug: item.slug, chapter: chapter.id })),
    );
}

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; chapter: string }>;
}): Promise<Metadata> {
  const { slug, chapter } = await params;
  const text = getText(slug);
  if (!text) return {};
  return { title: `${text.titleLt} ${chapter}` };
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ slug: string; chapter: string }>;
}) {
  const { slug, chapter } = await params;
  const text = getText(slug);
  if (!text) notFound();
  const exists = text.chapters.some((item) => item.id === chapter);
  if (!exists) notFound();
  const full = getFullBody(slug);
  const chapterBody = full ? getBodyChapter(full, chapter).sections : undefined;
  return <Reader text={text} chapterId={chapter} body={chapterBody} />;
}
