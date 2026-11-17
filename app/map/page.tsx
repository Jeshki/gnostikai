"use client";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageFade } from "@/components/PageFade";
import { useLocale } from "@/components/providers";
import { bibleCatalog, bibleSections } from "@/lib/bible";
import { glossary } from "@/lib/glossary";
import { codexAnchor, nhByCodex } from "@/lib/nh";
import { pageCrumbs } from "@/lib/seo";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function MapPage() {
  const { locale } = useLocale();
  const t = useTranslations("map");
  const bible = useTranslations("bible");

  return (
    <PageFade>
      <main id="content" className="mx-auto max-w-5xl px-6 pt-20 pb-28">
        <Breadcrumbs crumbs={pageCrumbs("Žemėlapis", "Žemėlapis", "/map", locale)} className="mb-6" />
        <p className="text-[10px] tracking-[0.22em] text-gold uppercase">{t("kicker")}</p>
        <h1 className="font-display mt-3 mb-4 text-4xl">{t("title")}</h1>
        <p className="mb-16 max-w-xl text-muted">{t("blurb")}</p>

        <section>
          <h2 className="font-display text-3xl">Etiopijos Biblija</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {bibleSections.map((section) => {
              const books = bibleCatalog.filter((book) => book.section === section);
              return (
                <article key={section} className="border border-line bg-elevated p-6">
                  <h3 className="font-display text-2xl text-gold">{bible(section)}</h3>
                  <p className="mt-2 text-sm text-muted">Knygų: {books.length}</p>
                  <ul className="mt-4 space-y-2 text-sm">
                    {books.slice(0, 6).map((book) => (
                      <li key={book.slug}>
                        <Link href={`/bible/${book.slug}`} className="hover:text-gold">
                          {book.titleLt}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link href="/bible" className="mt-4 inline-block text-[11px] tracking-[0.14em] text-muted uppercase hover:text-gold">
                    Visos knygos
                  </Link>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-20">
          <h2 className="font-display text-3xl">Nag Hammadi kodeksai</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {nhByCodex().map((group) => (
              <article key={group.codex} className="border border-line bg-elevated p-6">
                <h3 className="text-[11px] tracking-[0.18em] text-gold uppercase">{group.codex}</h3>
                <ul className="mt-4 space-y-2 text-sm">
                  {group.works.slice(0, 5).map((work) => (
                    <li key={work.slug}>
                      <Link href={`/nh/${work.slug}`} className="hover:text-gold">
                        {work.title}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/library#${codexAnchor(group.codex)}`}
                  className="mt-4 inline-block text-[11px] tracking-[0.14em] text-muted uppercase hover:text-gold"
                >
                  Visas kodeksas
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <h2 className="font-display text-3xl">Sąvokos</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {glossary
              .filter((term) => term.greek)
              .map((term) => (
                <article key={term.slug} className="border border-line bg-elevated p-6">
                  <h3 className="font-display text-2xl text-gold">
                    <Link href={`/glossary#${term.slug}`} className="hover:text-ink">
                      {term.term}
                    </Link>
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{term.defLt}</p>
                  <ul className="mt-4 space-y-2 text-sm">
                    {term.reads.map((read) => (
                      <li key={read.href}>
                        <Link href={read.href} className="hover:text-gold">
                          {read.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
          </div>
          <p className="mt-8 text-sm text-muted">
            <Link href="/glossary" className="hover:text-gold">
              Visi {glossary.length} žodžių — Žodynas
            </Link>
          </p>
        </section>
      </main>
    </PageFade>
  );
}
