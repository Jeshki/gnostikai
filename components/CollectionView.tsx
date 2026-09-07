"use client";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { LibraryBrowser } from "@/components/LibraryBrowser";
import { PageFade } from "@/components/PageFade";
import { useLocale } from "@/components/providers";
import { collections } from "@/lib/corpus";
import { collectionCrumbs } from "@/lib/seo";
import type { CollectionId } from "@/lib/types";

export function CollectionView({ id }: { id: CollectionId }) {
  const { locale } = useLocale();
  const meta = collections[id];

  return (
    <PageFade>
      <main id="content" className="mx-auto max-w-6xl px-6 pt-20 pb-28">
        <Breadcrumbs crumbs={collectionCrumbs(id)} className="mb-6" />
        <p className="text-[10px] tracking-[0.22em] text-gold uppercase">
          {locale === "lt" ? meta.titleLt : meta.titleEn}
        </p>
        <h1 className="font-display mt-3 text-4xl">
          {locale === "lt" ? meta.titleLt : meta.titleEn}
        </h1>
        <p className="mt-4 mb-12 max-w-2xl text-muted">
          {locale === "lt" ? meta.blurbLt : meta.blurbEn}
        </p>
        <LibraryBrowser initialCollection={id} />
      </main>
    </PageFade>
  );
}
