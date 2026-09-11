"use client";

import type { CorpusText } from "@/lib/types";
import { useLocale } from "@/components/providers";
import { collectionLabel } from "@/lib/corpus";
import { fieldLabel } from "@/lib/fields";
import Link from "next/link";

export function TextCard({ text }: { text: CorpusText }) {
  const { locale } = useLocale();
  const title = locale === "lt" ? text.titleLt : text.titleEn;

  return (
    <Link
      href={`/text/${text.slug}`}
      className="group block border border-line bg-elevated p-5 transition-colors duration-200 hover:border-gold/35"
    >
      <div className="mb-6 flex items-center justify-between text-[10px] tracking-[0.2em] text-muted uppercase">
        <span>{text.codex ? fieldLabel(text.codex, locale) : collectionLabel(text.collection, locale)}</span>
        {text.bannedBadge ? (
          <span className="text-heretic">{locale === "lt" ? "už kanono" : "extra canon"}</span>
        ) : null}
      </div>
      <h3 className="font-display text-2xl leading-tight text-ink group-hover:text-gold">{title}</h3>
      <p lang={locale === "lt" ? "en" : "lt"} className="mt-1 text-sm text-muted">
        {locale === "lt" ? text.titleEn : text.titleLt}
      </p>
      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">
        {locale === "lt" ? text.introLt : text.introEn}
      </p>
      <p className="mt-6 text-[11px] tracking-[0.16em] text-gold uppercase">
        {text.completeness === "full"
          ? locale === "lt"
            ? "Pilnas"
            : "Complete"
          : text.completeness === "excerpt"
            ? locale === "lt"
              ? "Ištrauka"
              : "Excerpt"
            : locale === "lt"
              ? "Stubas"
              : "Stub"}
      </p>
    </Link>
  );
}
