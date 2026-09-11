"use client";

import { PageFade } from "@/components/PageFade";
import { useLocale } from "@/components/providers";
import { corpus, themeLabels } from "@/lib/corpus";
import { glossary } from "@/lib/glossary";
import { pageCrumbs } from "@/lib/seo";
import type { ThemeTag } from "@/lib/types";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { useTranslations } from "next-intl";
import Link from "next/link";

const clusters: ThemeTag[] = ["pleroma", "sophia", "archons", "salvation", "baptism", "ascent"];

export default function MapPage() {
  const { locale } = useLocale();
  const t = useTranslations("map");

  return (
    <PageFade>
      <main id="content" className="mx-auto max-w-5xl px-6 pt-20 pb-28">
        <Breadcrumbs crumbs={pageCrumbs("Žemėlapis", "Map", "/map", locale)} className="mb-6" />
        <p className="text-[10px] tracking-[0.22em] text-gold uppercase">{t("kicker")}</p>
        <h1 className="font-display mt-3 mb-4 text-4xl">{t("title")}</h1>
        <p className="mb-16 max-w-xl text-muted">{t("blurb")}</p>

        <div className="grid gap-8 md:grid-cols-2">
          {clusters.map((tag) => {
            const texts = corpus.filter((item) => item.tags.includes(tag));
            const term = glossary.find((item) => item.slug === tag || item.term.toLowerCase() === tag);
            return (
              <section key={tag} className="border border-line bg-elevated p-6">
                <h2 className="font-display text-2xl text-gold">
                  {locale === "lt" ? themeLabels[tag].lt : themeLabels[tag].en}
                </h2>
                {term ? (
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {locale === "lt" ? term.defLt : term.defEn}
                  </p>
                ) : null}
                <ul className="mt-6 space-y-2 text-sm">
                  {texts.slice(0, 8).map((item) => (
                    <li key={item.slug}>
                      <Link href={`/text/${item.slug}`} className="hover:text-gold">
                        {locale === "lt" ? item.titleLt : item.titleEn}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
        <p className="mt-16 text-sm text-muted">
          <Link href="/about#sroves" className="hover:text-gold">
            {locale === "lt" ? "Srovės ir vardai — Apie" : "Currents and names — About"}
          </Link>
        </p>
      </main>
    </PageFade>
  );
}
