"use client";

import { PageFade } from "@/components/PageFade";
import { useLocale } from "@/components/providers";
import { about, aboutTerms } from "@/content/about";
import { getTerm } from "@/lib/glossary";
import { featuredNh } from "@/lib/nh";
import { pageCrumbs } from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect } from "react";

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
    "demiurgą",
    "Demiurgą",
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
  demiurgą: "demiurge",
  Demiurgą: "demiurge",
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

const bibleReads = [
  { href: "/bible/1enoch", label: "Henochas" },
  { href: "/bible/jubilees", label: "Jubiliejų knyga" },
  { href: "/bible/baruch", label: "Barucho knyga" },
  { href: "/bible/4baruch", label: "4 Baruchas" },
  { href: "/bible/1esdras", label: "Pirmoji Ezdro knyga" },
  { href: "/bible/2esdras", label: "Antroji Ezdro knyga" },
  { href: "/bible/meqabyan-1", label: "Mekabjanų I knyga" },
  { href: "/bible/1clement", label: "Klemenso laiškas" },
];

const nhReads = [
  { href: "/nh/tomo-evangelija", label: "Tomo evangelija" },
  { href: "/nh/pilypo-evangelija", label: "Pilypo evangelija" },
  { href: "/nh/jono-apokrifonas", label: "Jono apokrifonas" },
  { href: "/nh/tiesos-evangelija", label: "Tiesos evangelija" },
  { href: "/nh/perkunas-tobulas-protas", label: "Perkūnas, tobulas protas" },
  { href: "/nh/archontu-hipostaze-valdovu-realybe", label: "Archontų hipostazė" },
  { href: "/nh/trisalis-traktatas", label: "Trišalis traktatas" },
];

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
  const copy = about.lt;
  const featured = featuredNh();

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;
    document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [locale]);

  return (
    <PageFade>
      <main id="content" className="px-6 pt-20 pb-16 md:px-10">
        <header className="measure mx-auto">
          <Breadcrumbs crumbs={pageCrumbs("Apie", "About", "/about", locale)} className="mb-6" />
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
              {section.id === "etiopija" || section.id === "nag" ? (
                <ul className="mt-6 space-y-2 text-sm">
                  {(section.id === "etiopija" ? bibleReads : nhReads).map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="hover:text-gold">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>

        <section className="mx-auto mt-24 max-w-5xl">
          <h2 className="font-display mb-8 text-3xl">Kolekcijos</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Link href="/bible" className="border border-line bg-elevated p-5 transition-colors hover:border-gold/35">
              <p className="font-display mt-2 text-xl">Etiopijos Biblija</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">Visas kanonas lietuvių kalba.</p>
            </Link>
            <Link href="/library" className="border border-line bg-elevated p-5 transition-colors hover:border-gold/35">
              <p className="font-display mt-2 text-xl">Nag Hammadi</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">Kodeksai ir traktatai lietuvių kalba.</p>
            </Link>
          </div>
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
            {featured.map((item) => (
              <Link key={item.slug} href={`/nh/${item.slug}`} className="border border-line bg-elevated p-5 hover:border-gold/35">
                <p className="text-[10px] tracking-[0.2em] text-gold uppercase">{item.codex}</p>
                <p className="font-display mt-3 text-xl">{item.title}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="measure mx-auto mt-20 border-t border-line pt-10">
          <p className="text-[10px] tracking-[0.2em] text-gold uppercase">Leksikonas</p>
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
