"use client";

import { PageFade } from "@/components/PageFade";
import { TextCard } from "@/components/TextCard";
import { useLocale } from "@/components/providers";
import { about, aboutTerms } from "@/content/about";
import { collections, corpus, getText, textsByCollection } from "@/lib/corpus";
import { getTerm } from "@/lib/glossary";
import type { CollectionId } from "@/lib/types";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect } from "react";

const featuredSlugs = ["thomas", "mary", "john", "thunder"] as const;

const termPattern = new RegExp(
  `(?<![\\p{L}])(${[
    "gnosticizmą",
    "gnosticizmas",
    "Gnosticism",
    "gnosis",
    "Gnosis",
    "pleromą",
    "pleroma",
    "Pleroma",
    "Kenoma",
    "kenoma",
    "Sofija",
    "Sophia",
    "Demiurgas",
    "demiurge",
    "pistis",
    "Setianų",
    "setianų",
    "Sethian",
    "valentinianų",
    "Valentinian",
    "eonai",
    "Aeons",
    "archontai",
    "archons",
  ].join("|")})(?![\\p{L}])`,
  "gu",
);

const termHref: Record<string, string> = {
  gnosticizmą: "gnosis",
  gnosticizmas: "gnosis",
  Gnosticism: "gnosis",
  gnosis: "gnosis",
  Gnosis: "gnosis",
  pleromą: "pleroma",
  pleroma: "pleroma",
  Pleroma: "pleroma",
  Kenoma: "kenoma",
  kenoma: "kenoma",
  Sofija: "sophia",
  Sophia: "sophia",
  Demiurgas: "demiurge",
  demiurge: "demiurge",
  pistis: "pistis",
  Setianų: "sethians",
  setianų: "sethians",
  Sethian: "sethians",
  valentinianų: "valentinians",
  Valentinian: "valentinians",
  eonai: "aeon",
  Aeons: "aeon",
  archontai: "archon",
  archons: "archon",
};

function LinkedProse({ text }: { text: string }) {
  const parts = text.split(termPattern);
  return (
    <>
      {parts.map((part, index) => {
        const slug = termHref[part];
        if (!slug) return <span key={`${part}-${index}`}>{part}</span>;
        return (
          <Link
            key={`${part}-${index}`}
            href={`/glossary#${slug}`}
            className="text-gold underline-offset-4 hover:underline"
          >
            {part}
          </Link>
        );
      })}
    </>
  );
}

export function AboutView() {
  const { locale } = useLocale();
  const t = useTranslations("about");
  const copy = about[locale];
  const featured = featuredSlugs.map((slug) => getText(slug)).filter(Boolean);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;
    document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [locale]);

  return (
    <PageFade>
      <main id="content" className="px-6 pt-20 pb-16 md:px-10">
        <header className="measure mx-auto">
          <p className="text-[10px] tracking-[0.22em] text-gold uppercase">{copy.kicker}</p>
          <h1 className="font-display mt-3 mb-8 text-4xl md:text-5xl">{copy.title}</h1>
          <p className="text-[1.08rem] leading-8 text-ink">
            <LinkedProse text={copy.lede} />
          </p>
        </header>

        <nav aria-label={copy.tocLabel} className="measure mx-auto mt-10 flex flex-wrap gap-x-5 gap-y-2 text-[11px] tracking-[0.16em] text-muted uppercase">
          {copy.sections.map((section) => (
            <a key={section.id} href={`#${section.id}`} className="hover:text-gold">
              {section.title}
            </a>
          ))}
          <a href="#sroves" className="hover:text-gold">
            {copy.currentsTitle}
          </a>
          <a href="#isliko" className="hover:text-gold">
            {copy.survivalTitle}
          </a>
        </nav>

        <div className="measure mx-auto mt-16 space-y-16">
          {copy.sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-24">
              <h2 className="font-display mb-5 text-2xl text-gold">{section.title}</h2>
              <div className="space-y-5 text-[1.05rem] leading-8">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 32)}>
                    <LinkedProse text={paragraph} />
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section id="sroves" className="mx-auto mt-24 max-w-5xl scroll-mt-24">
          <h2 className="font-display mb-8 text-3xl">{copy.currentsTitle}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {copy.currents.map((current) => {
              const term = getTerm(current.term);
              return (
                <article key={current.id} className="border border-line bg-elevated p-6">
                  <p className="text-[10px] tracking-[0.2em] text-gold uppercase">
                    {term ? (
                      <Link href={`/glossary#${term.slug}`} className="hover:text-ink">
                        {term.term}
                      </Link>
                    ) : (
                      current.title
                    )}
                  </p>
                  <h3 className="font-display mt-2 text-2xl">{current.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{current.body}</p>
                  <ul className="mt-5 space-y-1.5 text-sm">
                    {current.slugs.map((slug) => {
                      const text = getText(slug);
                      if (!text) return null;
                      return (
                        <li key={slug}>
                          <Link href={`/text/${slug}`} className="hover:text-gold">
                            {locale === "lt" ? text.titleLt : text.titleEn}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </article>
              );
            })}
          </div>
        </section>

        <section id="isliko" className="mx-auto mt-24 max-w-3xl scroll-mt-24">
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2 className="font-display text-3xl">{copy.survivalTitle}</h2>
            <Link href="/timeline" className="text-[11px] tracking-[0.16em] text-gold uppercase hover:text-ink">
              {locale === "lt" ? "Visa chronologija" : "Full timeline"}
            </Link>
          </div>
          <ol className="space-y-8">
            {copy.survival.map((event) => (
              <li key={event.year} className="border-l border-gold/40 pl-6">
                <p className="text-[11px] tracking-[0.18em] text-gold uppercase">{event.year}</p>
                <p className="mt-2 leading-relaxed">{event.body}</p>
                <Link href={event.href} className="mt-2 inline-block text-[11px] tracking-[0.14em] text-muted uppercase hover:text-gold">
                  {copy.textsIn} →
                </Link>
              </li>
            ))}
          </ol>
        </section>

        <section className="mx-auto mt-24 max-w-5xl">
          <h2 className="font-display mb-8 text-3xl">{locale === "lt" ? "Kolekcijos" : "Collections"}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {(Object.keys(collections) as CollectionId[]).map((id) => {
              const count = textsByCollection(id).length;
              return (
                <Link
                  key={id}
                  href={`/library/${id}`}
                  className="border border-line bg-elevated p-5 transition-colors hover:border-gold/35"
                >
                  <p className="text-[10px] tracking-[0.2em] text-muted uppercase">
                    {count} {locale === "lt" ? "tekstai" : "texts"}
                  </p>
                  <p className="font-display mt-2 text-xl">
                    {locale === "lt" ? collections[id].titleLt : collections[id].titleEn}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {locale === "lt" ? collections[id].blurbLt : collections[id].blurbEn}
                  </p>
                </Link>
              );
            })}
          </div>
          <p className="mt-6 text-sm text-muted">
            {locale === "lt"
              ? `${corpus.length} katalogo įrašai. Viešoji nuosavybė, be Brill CGL ir Robinson NHL.`
              : `${corpus.length} catalogue entries. Public domain, no Brill CGL or Robinson NHL.`}
          </p>
        </section>

        <section className="mx-auto mt-24 max-w-5xl">
          <h2 className="font-display mb-3 text-3xl">{copy.enter}</h2>
          <p className="mb-8 max-w-xl text-sm text-muted">{t("disclaimer")}</p>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {copy.paths.map((path) => (
              <Link
                key={path.href}
                href={path.href}
                className="border border-line bg-elevated p-5 transition-colors hover:border-gold/35"
              >
                <p className="font-display text-xl">{path.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{path.blurb}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-16 max-w-5xl">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {featured.map((item) => (item ? <TextCard key={item.slug} text={item} /> : null))}
          </div>
        </section>

        <section className="measure mx-auto mt-20 border-t border-line pt-10">
          <p className="text-[10px] tracking-[0.2em] text-gold uppercase">{locale === "lt" ? "Leksikonas" : "Lexicon"}</p>
          <ul className="mt-5 flex flex-wrap gap-3 text-[12px] tracking-[0.12em] uppercase">
            {aboutTerms.map((slug) => {
              const term = getTerm(slug);
              if (!term) return null;
              return (
                <li key={slug}>
                  <Link href={`/glossary#${slug}`} className="text-muted hover:text-gold">
                    {term.term}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      </main>
    </PageFade>
  );
}
