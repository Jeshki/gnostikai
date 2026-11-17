"use client";

import { PageFade } from "@/components/PageFade";
import { codexAnchor, featuredNh, nhByCodex } from "@/lib/nh";
import { useTranslations } from "next-intl";
import Link from "next/link";

export function HomeView() {
  const t = useTranslations("home");
  const featured = featuredNh();
  const codices = nhByCodex();

  return (
    <PageFade>
      <section className="flex flex-col px-6 pt-16 pb-28 md:min-h-dvh md:justify-end md:px-16 md:pt-24 md:pb-20">
        <p className="text-[10px] tracking-[0.32em] text-gold uppercase">AEON</p>
        <blockquote lang="lt" className="font-display mt-6 max-w-3xl text-2xl leading-[1.3] md:mt-10 md:text-4xl lg:text-[2.75rem]">
          {t("thunder")}
        </blockquote>
        <p className="mt-6 text-[11px] tracking-[0.18em] text-muted uppercase">{t("thunderAttr")}</p>
        <div className="mt-10 h-px w-24 bg-gold" />
        <nav className="mt-12 flex flex-col gap-5 font-display text-xl md:flex-row md:gap-12">
          <Link href="/bible" className="hover:text-gold">
            {t("pathBible")}
          </Link>
          <Link href={featured[0] ? `/nh/${featured[0].slug}` : "/library"} className="hover:text-gold">
            {t("pathThomas")}
          </Link>
          <Link href="/library" className="hover:text-gold">
            {t("pathNh")}
          </Link>
          <Link href="/about" className="hover:text-gold">
            {t("pathAbout")}
          </Link>
        </nav>
      </section>

      <section id="content" className="border-t border-line px-6 py-20 md:px-16">
        <p className="mb-3 text-[10px] tracking-[0.22em] text-muted uppercase">{t("featured")}</p>
        <h1 className="font-display mb-8 max-w-2xl text-3xl md:text-4xl">Nag Hammadi biblioteka</h1>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {featured.map((item) => (
            <Link key={item.slug} href={`/nh/${item.slug}`} className="block border border-line bg-elevated p-5 hover:border-gold/35">
              <p className="text-[10px] tracking-[0.2em] text-gold uppercase">{item.codex}</p>
              <h2 className="font-display mt-4 text-2xl leading-tight">{item.title}</h2>
            </Link>
          ))}
        </div>
      </section>

      <section className="px-6 pb-16 md:px-16">
        <p className="mb-6 text-[10px] tracking-[0.22em] text-muted uppercase">{t("codices")}</p>
        <div className="no-scrollbar flex snap-x gap-3 overflow-x-auto pb-2">
          {codices.map((group) => (
            <Link
              key={group.codex}
              href={`/library#${codexAnchor(group.codex)}`}
              className="w-[220px] shrink-0 snap-start border border-line bg-elevated p-5"
            >
              <p className="text-[10px] tracking-[0.2em] text-gold uppercase">{group.codex}</p>
              <p className="font-display mt-4 text-lg">{group.works[0]?.title}</p>
            </Link>
          ))}
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <Link href="/bible" className="border border-line p-5 hover:border-gold/35">
            <p className="font-display text-xl">Etiopijos Biblija</p>
            <p className="mt-2 text-sm text-muted">Visas kanonas lietuviškai, skyrius po skyriaus.</p>
          </Link>
          <Link href="/library" className="border border-line p-5 hover:border-gold/35">
            <p className="font-display text-xl">Nag Hammadi</p>
            <p className="mt-2 text-sm text-muted">Kodeksai ir traktatai lietuviškai.</p>
          </Link>
        </div>
      </section>
    </PageFade>
  );
}
