"use client";

import { NhLibrary } from "@/components/NhLibrary";
import { PageFade } from "@/components/PageFade";
import { useLocale } from "@/components/providers";
import { pageCrumbs } from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function LibraryPage() {
  const t = useTranslations("library");
  const { locale } = useLocale();

  return (
    <PageFade>
      <div className="mx-auto max-w-5xl px-6 pt-20 pb-28 md:px-10">
        <main id="content">
          <Breadcrumbs crumbs={pageCrumbs("Biblioteka", "Biblioteka", "/library", locale)} className="mb-6" />
          <p className="text-[10px] tracking-[0.22em] text-gold uppercase">AEON</p>
          <h1 className="font-display mt-3 mb-8 text-4xl">{t("title")}</h1>
          <Link href="/bible" className="mb-10 block border border-gold/40 p-5 hover:border-gold">
            <p className="text-[10px] tracking-[0.22em] text-gold uppercase">Etiopijos Biblija</p>
            <p className="font-display mt-2 text-2xl">Visas kanonas, skyrius po skyriaus.</p>
          </Link>
          <NhLibrary />
        </main>
      </div>
    </PageFade>
  );
}
