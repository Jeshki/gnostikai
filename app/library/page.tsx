"use client";

import { CodexTree } from "@/components/CodexTree";
import { LibraryBrowser } from "@/components/LibraryBrowser";
import { PageFade } from "@/components/PageFade";
import { useTranslations } from "next-intl";

export default function LibraryPage() {
  const t = useTranslations("library");

  return (
    <PageFade>
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 px-6 pt-20 pb-28 md:px-10 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="hidden pr-6 lg:sticky lg:top-14 lg:block lg:max-h-[calc(100dvh-3.5rem)] lg:self-start lg:overflow-y-auto">
          <CodexTree />
        </aside>
        <main id="content">
          <p className="text-[10px] tracking-[0.22em] text-gold uppercase">AEON</p>
          <h1 className="font-display mt-3 mb-10 text-4xl">{t("title")}</h1>
          <LibraryBrowser />
        </main>
      </div>
    </PageFade>
  );
}
