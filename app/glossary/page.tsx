"use client";

import { PageFade } from "@/components/PageFade";
import { useLocale } from "@/components/providers";
import { getTerm, glossary } from "@/lib/glossary";
import { pageCrumbs } from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";

const sorted = [...glossary].sort((a, b) => a.term.localeCompare(b.term, "lt"));
const groups = new Map<string, typeof sorted>();
for (const term of sorted) {
  const letter = term.term[0]?.toLocaleUpperCase("lt") ?? "";
  const list = groups.get(letter);
  if (list) list.push(term);
  else groups.set(letter, [term]);
}
const letters = [...groups.keys()];

export default function GlossaryPage() {
  const { locale } = useLocale();
  const t = useTranslations("glossary");
  const router = useRouter();

  return (
    <PageFade>
      <main id="content" className="mx-auto max-w-6xl px-6 pt-20 pb-28">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-6 inline-flex min-h-11 items-center gap-2 text-sm text-muted hover:text-ink"
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
          {t("back")}
        </button>
        <Breadcrumbs crumbs={pageCrumbs("Žodynas", "Glossary", "/glossary", locale)} className="mb-6" />
        <p className="text-[10px] tracking-[0.22em] text-gold uppercase">{t("kicker")}</p>
        <h1 className="font-display mt-3 text-4xl">{t("title")}</h1>
        <p className="mt-3 mb-8 max-w-2xl text-sm leading-relaxed text-muted">
          {glossary.length} žodžių iš Etiopijos Biblijos ir Nag Hammadi bibliotekos.
        </p>
        <nav aria-label="Raidės" className="mb-12 flex flex-wrap gap-x-3 gap-y-2 text-sm">
          {letters.map((letter) => (
            <a key={letter} href={`#raide-${letter}`} className="text-gold hover:text-ink">
              {letter}
            </a>
          ))}
        </nav>
        {letters.map((letter) => (
          <section key={letter} id={`raide-${letter}`} className="scroll-mt-24 mb-12">
            <h2 className="font-display mb-6 text-2xl text-gold">{letter}</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {groups.get(letter)!.map((term) => (
            <article key={term.slug} id={term.slug} className="scroll-mt-24 border border-line bg-elevated p-6">
              <h3 className="font-display text-3xl text-gold">{term.term}</h3>
              {term.greek ? (
                <p className="mt-1 font-display italic text-muted">{term.greek}</p>
              ) : null}
              <p className="mt-4 leading-relaxed">
                {term.defLt}
              </p>
              {term.reads.length > 0 ? (
                <ul className="mt-4 space-y-1 text-sm">
                  {term.reads.map((read) => (
                    <li key={read.href}>
                      <Link href={read.href} className="hover:text-gold">
                        {read.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
              <ul className="mt-4 flex flex-wrap gap-3 text-[11px] tracking-[0.14em] text-muted uppercase">
                {term.related.map((rel) => (
                  <li key={rel}>
                    <Link href={`/glossary#${rel}`} className="hover:text-gold">
                      {getTerm(rel)?.term ?? rel}
                    </Link>
                  </li>
                ))}
              </ul>
            </article>
              ))}
            </div>
          </section>
        ))}
        <p className="mt-16 text-sm text-muted">
          <Link href="/about" className="hover:text-gold">
            Kaip šie vardai susiję — Apie
          </Link>
        </p>
      </main>
    </PageFade>
  );
}
