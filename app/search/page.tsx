"use client";

import { PageFade } from "@/components/PageFade";
import { useLocale } from "@/components/providers";
import { about } from "@/content/about";
import { thomas } from "@/lib/content";
import { collectionLabel, corpus } from "@/lib/corpus";
import { fieldLabel } from "@/lib/fields";
import { glossary } from "@/lib/glossary";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useMemo, useState } from "react";

export default function SearchPage() {
  const t = useTranslations("search");
  const { locale } = useLocale();
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();

  const results = useMemo(() => {
    if (query.length < 2) return { texts: [], sayings: [], terms: [], about: [] };
    return {
      texts: corpus.filter((item) =>
        `${item.titleEn} ${item.titleLt} ${item.introEn} ${item.introLt} ${item.slug}`.toLowerCase().includes(query),
      ),
      sayings: thomas.sayings.filter((item) =>
        `${item.n} ${item.title} ${item.titleLt} ${item.en} ${item.lt}`.toLowerCase().includes(query),
      ),
      terms: glossary.filter((item) =>
        `${item.term} ${item.defEn} ${item.defLt}`.toLowerCase().includes(query),
      ),
      about: about[locale].sections.filter((section) => {
        const twin = about[locale === "lt" ? "en" : "lt"].sections.find((item) => item.id === section.id);
        return `${section.title} ${section.paragraphs.join(" ")} ${twin?.title ?? ""} ${about[locale].lede}`
          .toLowerCase()
          .includes(query);
      }),
    };
  }, [query, locale]);

  const empty =
    query.length >= 2 &&
    results.texts.length + results.sayings.length + results.terms.length + results.about.length === 0;

  return (
    <PageFade>
      <main id="content" className="mx-auto max-w-3xl px-6 pt-20 pb-28">
        <h1 className="font-display mb-8 text-4xl">{t("title")}</h1>
        <input
          value={q}
          onChange={(event) => setQ(event.target.value)}
          placeholder={t("placeholder")}
          className="h-12 w-full border-b border-line bg-transparent text-lg outline-none placeholder:text-muted"
        />
        {empty ? (
          <p className="font-display mt-16 text-2xl text-muted">{t("empty")}</p>
        ) : null}

        <div className="mt-12 space-y-10">
          {results.about.map((item) => (
            <Link key={item.id} href={`/about#${item.id}`} className="block hover:text-gold">
              <p className="text-[10px] tracking-[0.16em] text-gold uppercase">{t("about")}</p>
              <p className="font-display text-2xl">{item.title}</p>
            </Link>
          ))}
          {results.texts.map((item) => (
            <Link key={item.slug} href={`/text/${item.slug}`} className="block hover:text-gold">
              <p className="text-[10px] tracking-[0.16em] text-muted uppercase">
                {item.codex ? fieldLabel(item.codex, locale) : collectionLabel(item.collection, locale)}
              </p>
              <p className="font-display text-2xl">{locale === "lt" ? item.titleLt : item.titleEn}</p>
            </Link>
          ))}
          {results.sayings.map((item) => (
            <Link key={item.n} href={`/text/thomas#${item.n}`} className="block hover:text-gold">
              <p className="text-[10px] tracking-[0.16em] text-gold uppercase">
                {t("thomas")} {item.n}
              </p>
              <p className="mt-1 line-clamp-3 text-sm text-muted">
                {locale === "lt" ? item.lt : item.en}
              </p>
            </Link>
          ))}
          {results.terms.map((item) => (
            <Link key={item.slug} href={`/glossary#${item.slug}`} className="block hover:text-gold">
              <p className="font-display text-xl">{item.term}</p>
            </Link>
          ))}
        </div>
      </main>
    </PageFade>
  );
}
