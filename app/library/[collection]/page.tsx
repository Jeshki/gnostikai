import { JsonLd } from "@/components/JsonLd";
import { CollectionView } from "@/components/CollectionView";
import { collections } from "@/lib/corpus";
import { breadcrumbJsonLd, collectionCrumbs, collectionJsonLd, pageMeta } from "@/lib/seo";
import type { CollectionId } from "@/lib/types";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

const ids = Object.keys(collections) as CollectionId[];

export function generateStaticParams() {
  return ids.map((collection) => ({ collection }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ collection: string }>;
}): Promise<Metadata> {
  const { collection } = await params;
  const meta = collections[collection as CollectionId];
  if (!meta) return {};
  return pageMeta({
    title: meta.titleLt,
    description: meta.blurbLt,
    path: `/library/${collection}`,
    titleEn: meta.titleEn,
    descriptionEn: meta.blurbEn,
    keywords: [meta.titleLt, meta.titleEn, "Nag Hammadi", "apokrifai", "apocrypha"],
  });
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ collection: string }>;
}) {
  const { collection } = await params;
  if (!ids.includes(collection as CollectionId)) notFound();
  const id = collection as CollectionId;
  return (
    <>
      <JsonLd data={[collectionJsonLd(id), breadcrumbJsonLd(collectionCrumbs(id))]} />
      <CollectionView id={id} />
    </>
  );
}
