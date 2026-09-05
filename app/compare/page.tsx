"use client";

import { PageFade } from "@/components/PageFade";
import { useLocale } from "@/components/providers";
import previews from "@/content/previews.json";
import { thomas } from "@/lib/content";
import { corpus, getText } from "@/lib/corpus";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

export default function ComparePage() {
  const { locale, bilingual } = useLocale();
  const t = useTranslations("compare");
  const [left, setLeft] = useState("thomas");
  const [right, setRight] = useState("mary");
  const a = getText(left);
  const b = getText(right);

  const leftBody = useMemo(() => preview(left, locale, bilingual), [left, locale, bilingual]);
  const rightBody = useMemo(() => preview(right, locale, bilingual), [right, locale, bilingual]);

  return (
    <PageFade>
      <main id="content" className="mx-auto max-w-6xl px-6 pt-20 pb-28">
        <h1 className="font-display mb-8 text-4xl">{t("title")}</h1>
        <div className="mb-8 grid gap-4 md:grid-cols-2">
          <Select value={left} onChange={setLeft} locale={locale} />
          <Select value={right} onChange={setRight} locale={locale} />
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          <Column text={a} body={leftBody} locale={locale} bilingual={bilingual} />
          <Column text={b} body={rightBody} locale={locale} bilingual={bilingual} />
        </div>
      </main>
    </PageFade>
  );
}

function preview(slug: string, locale: string, bilingual: boolean) {
  if (slug === "thomas") {
    if (bilingual) return `${thomas.prologueLt}\n\n${thomas.prologue}`;
    return locale === "lt" ? thomas.prologueLt : thomas.prologue;
  }
  const item = (previews as Record<string, { en: string; lt: string }>)[slug];
  if (!item) return "";
  if (bilingual) return `${item.lt}\n\n${item.en}`;
  return locale === "lt" ? item.lt : item.en;
}

function Select({
  value,
  onChange,
  locale,
}: {
  value: string;
  onChange: (v: string) => void;
  locale: string;
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="min-h-11 border border-line bg-bg px-3 text-sm text-ink"
    >
      {corpus.map((item) => (
        <option key={item.slug} value={item.slug}>
          {locale === "lt" ? item.titleLt : item.titleEn}
        </option>
      ))}
    </select>
  );
}

function Column({
  text,
  body,
  locale,
  bilingual,
}: {
  text: ReturnType<typeof getText>;
  body: string;
  locale: string;
  bilingual: boolean;
}) {
  if (!text) return null;
  return (
    <article className="border border-line bg-elevated p-6">
      <h2 className="font-display text-2xl text-gold">
        {bilingual ? `${text.titleLt} / ${text.titleEn}` : locale === "lt" ? text.titleLt : text.titleEn}
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-muted">
        {bilingual ? `${text.introLt}\n\n${text.introEn}` : locale === "lt" ? text.introLt : text.introEn}
      </p>
      {body ? (
        <p className="font-display mt-6 text-base leading-8 whitespace-pre-wrap">{body}</p>
      ) : (
        <p className="mt-6 text-sm text-muted">—</p>
      )}
    </article>
  );
}
