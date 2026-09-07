import { CollectionView } from "@/components/CollectionView";
import { JsonLd } from "@/components/JsonLd";
import { collections } from "@/lib/corpus";
import { breadcrumbJsonLd, collectionCrumbs, pageMeta } from "@/lib/seo";
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
      <JsonLd data={breadcrumbJsonLd(collectionCrumbs(id))} />
      <CollectionView id={id} />
    </>
  );
}
