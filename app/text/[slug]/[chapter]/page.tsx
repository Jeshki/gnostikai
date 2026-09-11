import { JsonLd } from "@/components/JsonLd";
import { Reader } from "@/components/Reader";
import { getBodyChapter, getFullBody } from "@/lib/bodies";
import { corpus, getText } from "@/lib/corpus";
import { bookJsonLd, breadcrumbJsonLd, chapterJsonLd, pageMeta, textCrumbs } from "@/lib/seo";
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
  const chapterMeta = text.chapters.find((item) => item.id === chapter);
  const chapterTitle = chapterMeta?.titleLt ?? chapter;
  const chapterTitleEn = chapterMeta?.titleEn ?? chapter;
  return pageMeta({
    title: `${text.titleLt} — ${chapterTitle}`,
    description: text.introLt.slice(0, 180),
    path: `/text/${text.slug}/${chapter}`,
    titleEn: `${text.titleEn} — ${chapterTitleEn}`,
    descriptionEn: text.introEn.slice(0, 180),
    type: "article",
    keywords: [text.titleLt, text.titleEn, chapterTitle, chapterTitleEn],
  });
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
  const chapterMeta = text.chapters.find((item) => item.id === chapter);
  return (
    <>
      <JsonLd
        data={[
          bookJsonLd(text),
          chapterJsonLd(text, chapter, chapterMeta?.titleLt ?? chapter, chapterMeta?.titleEn),
          breadcrumbJsonLd([
            ...textCrumbs(text),
            { name: chapterMeta?.titleLt ?? chapter, path: `/text/${text.slug}/${chapter}` },
          ]),
        ]}
      />
      <Reader text={text} chapterId={chapter} body={chapterBody} />
    </>
  );
}
