"use client";

import { PageFade } from "@/components/PageFade";
import { useLocale } from "@/components/providers";
import { glossary } from "@/lib/glossary";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function GlossaryPage() {
  const { locale } = useLocale();
  const t = useTranslations("glossary");

  return (
    <PageFade>
      <main id="content" className="mx-auto max-w-3xl px-6 pt-20 pb-28">
        <p className="text-[10px] tracking-[0.22em] text-gold uppercase">{t("kicker")}</p>
        <h1 className="font-display mt-3 mb-12 text-4xl">{t("title")}</h1>
        <div className="space-y-12">
          {glossary.map((term) => (
            <article key={term.slug} id={term.slug} className="scroll-mt-24 border-t border-line pt-8">
              <h2 className="font-display text-3xl text-gold">{term.term}</h2>
              {term.greek ? (
                <p className="mt-1 font-display italic text-muted">{term.greek}</p>
              ) : null}
              <p className="mt-4 leading-relaxed">
                {locale === "lt" ? term.defLt : term.defEn}
              </p>
              <ul className="mt-4 flex flex-wrap gap-3 text-[11px] tracking-[0.14em] text-muted uppercase">
                {term.related.map((rel) => (
                  <li key={rel}>
                    <Link href={`/glossary#${rel}`} className="hover:text-gold">
                      {rel}
                    </Link>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <p className="mt-16 text-sm text-muted">
          <Link href="/about#zodis" className="hover:text-gold">
            {locale === "lt" ? "Kaip šie vardai susiję — Apie" : "How these names belong together — About"}
          </Link>
        </p>
      </main>
    </PageFade>
  );
}
