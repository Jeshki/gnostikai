import { CollectionView } from "@/components/CollectionView";
import { collections } from "@/lib/corpus";
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
  return { title: meta.titleLt, description: meta.blurbLt };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ collection: string }>;
}) {
  const { collection } = await params;
  if (!ids.includes(collection as CollectionId)) notFound();
  return <CollectionView id={collection as CollectionId} />;
}
