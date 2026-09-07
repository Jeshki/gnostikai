"use client";

import { TextCard } from "@/components/TextCard";
import { useLocale } from "@/components/providers";
import { collections, getText, textsByCollection } from "@/lib/corpus";
import { PageFade } from "@/components/PageFade";
import { useTranslations } from "next-intl";
import Link from "next/link";

const featuredSlugs = ["thomas", "mary", "judas", "thunder"] as const;

export function HomeView() {
  const t = useTranslations("home");
  const { locale } = useLocale();
  const featured = featuredSlugs.map((slug) => getText(slug)).filter(Boolean);
  const nh = textsByCollection("nag-hammadi");
  const codices = Array.from(
    new Map(
      nh.map((item) => {
        const key = item.codex?.split(",")[0] ?? "NHC";
        return [key, item] as const;
      }),
    ).entries(),
  );

  return (
    <PageFade>
      <section className="flex min-h-dvh flex-col justify-end px-6 pt-24 pb-28 md:px-16 md:pb-20">
        <p className="text-[10px] tracking-[0.32em] text-gold uppercase">AEON</p>
        <blockquote className="font-display mt-10 max-w-4xl text-4xl leading-[1.15] md:text-6xl lg:text-7xl">
          {t("thunder")}
        </blockquote>
        <p className="mt-6 text-[11px] tracking-[0.18em] text-muted uppercase">{t("thunderAttr")}</p>
        <div className="mt-10 h-px w-24 bg-gold" />
        <nav className="mt-12 flex flex-col gap-5 font-display text-xl md:flex-row md:gap-12">
          <Link href="/text/thomas" className="hover:text-gold">
            {t("pathThomas")}
          </Link>
          <Link href="/library/nag-hammadi" className="hover:text-gold">
            {t("pathNh")}
          </Link>
          <Link href="/about" className="hover:text-gold">
            {t("pathAbout")}
          </Link>
        </nav>
      </section>

      <section id="content" className="border-t border-line px-6 py-20 md:px-16">
        <p className="mb-8 text-[10px] tracking-[0.22em] text-muted uppercase">{t("featured")}</p>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {featured.map((item) => (item ? <TextCard key={item.slug} text={item} /> : null))}
        </div>
      </section>

      <section className="px-6 pb-16 md:px-16">
        <p className="mb-6 text-[10px] tracking-[0.22em] text-muted uppercase">{t("codices")}</p>
        <div className="no-scrollbar flex snap-x gap-3 overflow-x-auto pb-2">
          {codices.map(([codex, item]) => (
            <Link
              key={codex}
              href={`/text/${item.slug}`}
              className="w-[220px] shrink-0 snap-start border border-line bg-elevated p-5"
            >
              <p className="text-[10px] tracking-[0.2em] text-gold uppercase">{codex}</p>
              <p className="font-display mt-4 text-lg">
                {locale === "lt" ? item.titleLt : item.titleEn}
              </p>
            </Link>
          ))}
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {(Object.keys(collections) as Array<keyof typeof collections>).map((id) => (
            <Link key={id} href={`/library/${id}`} className="border border-line p-5 hover:border-gold/35">
              <p className="font-display text-xl">
                {locale === "lt" ? collections[id].titleLt : collections[id].titleEn}
              </p>
              <p className="mt-2 text-sm text-muted">
                {locale === "lt" ? collections[id].blurbLt : collections[id].blurbEn}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </PageFade>
  );
}
