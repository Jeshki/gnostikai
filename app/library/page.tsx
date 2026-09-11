"use client";

import { CodexTree } from "@/components/CodexTree";
import { LibraryBrowser } from "@/components/LibraryBrowser";
import { PageFade } from "@/components/PageFade";
import { useLocale } from "@/components/providers";
import { pageCrumbs } from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { useTranslations } from "next-intl";

export default function LibraryPage() {
  const t = useTranslations("library");
  const { locale } = useLocale();

  return (
    <PageFade>
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 px-6 pt-20 pb-28 md:px-10 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="hidden max-h-dvh overflow-y-auto pr-6 lg:block">
          <CodexTree />
        </aside>
        <main id="content">
          <Breadcrumbs crumbs={pageCrumbs("Biblioteka", "Library", "/library", locale)} className="mb-6" />
          <p className="text-[10px] tracking-[0.22em] text-gold uppercase">AEON</p>
          <h1 className="font-display mt-3 mb-10 text-4xl">{t("title")}</h1>
          <LibraryBrowser />
        </main>
      </div>
    </PageFade>
  );
}
