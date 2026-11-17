import { NhReader } from "@/components/NhReader";
import { getNhWork, nhCatalog } from "@/lib/nh";
import { readNhBody } from "@/lib/nh-server";
import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return nhCatalog.map((work) => ({ slug: work.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const work = getNhWork(slug);
  if (!work) return {};
  return pageMeta({
    title: work.title,
    description: `${work.title}. ${work.codex}. Nag Hammadi biblioteka.`,
    path: `/nh/${work.slug}`,
    type: "article",
    keywords: [work.title, work.codex, "Nag Hammadi"],
  });
}

export default async function NhPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = readNhBody(slug);
  if (!doc) notFound();
  return <NhReader slug={doc.slug} title={doc.title} codex={doc.codex} blocks={doc.blocks} />;
}
