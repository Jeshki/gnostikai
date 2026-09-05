import { Reader } from "@/components/Reader";
import { getFullBody } from "@/lib/bodies";
import { corpus, getText } from "@/lib/corpus";
import { getTextMdx } from "@/lib/mdx";
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
  return corpus.filter((item) => !huge.has(item.slug)).map((item) => ({ slug: item.slug }));
}

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const text = getText(slug);
  if (!text) return {};
  return {
    title: text.titleLt,
    description: text.introLt,
    openGraph: { title: text.titleEn, description: text.introEn },
  };
}

export default async function TextPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const text = getText(slug);
  if (!text) notFound();
  const mdx = await getTextMdx(slug);
  const full = getFullBody(slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: text.titleEn,
    alternateName: text.titleLt,
    inLanguage: text.originalLanguage,
    description: text.introEn,
    dateCreated: text.dateApprox,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Reader text={text} mdx={mdx?.content} mdxLt={mdx?.contentLt} body={full?.sections} />
    </>
  );
}
