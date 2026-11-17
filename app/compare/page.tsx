"use client";

import { PageFade } from "@/components/PageFade";
import { useLocale } from "@/components/providers";
import nhSearch from "@/content/nag-hammadi/search.json";
import { nhCatalog } from "@/lib/nh";
import { pageCrumbs } from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

const texts = nhSearch as Array<{ slug: string; title: string; codex: string; text: string }>;

export default function ComparePage() {
  const { locale } = useLocale();
  const t = useTranslations("compare");
  const [left, setLeft] = useState(nhCatalog[5]?.slug ?? nhCatalog[0]?.slug ?? "");
  const [right, setRight] = useState(nhCatalog[8]?.slug ?? nhCatalog[1]?.slug ?? "");
  const a = useMemo(() => texts.find((item) => item.slug === left), [left]);
  const b = useMemo(() => texts.find((item) => item.slug === right), [right]);

  return (
    <PageFade>
      <main id="content" className="mx-auto max-w-6xl px-6 pt-20 pb-28">
        <Breadcrumbs crumbs={pageCrumbs("Gretinimas", "Gretinimas", "/compare", locale)} className="mb-6" />
        <h1 className="font-display mb-8 text-4xl">{t("title")}</h1>
        <div className="mb-8 grid gap-4 md:grid-cols-2">
          <Select value={left} onChange={setLeft} />
          <Select value={right} onChange={setRight} />
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          <Column item={a} />
          <Column item={b} />
        </div>
      </main>
    </PageFade>
  );
}

function Select({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="min-h-11 border border-line bg-bg px-3 text-sm text-ink"
    >
      {nhCatalog.map((item) => (
        <option key={item.slug} value={item.slug}>
          {item.title}
        </option>
      ))}
    </select>
  );
}

function Column({ item }: { item?: { title: string; codex: string; text: string } }) {
  if (!item) return null;
  return (
    <article className="border border-line bg-elevated p-6">
      <p className="text-[10px] tracking-[0.16em] text-gold uppercase">{item.codex}</p>
      <h2 className="font-display mt-2 text-2xl">{item.title}</h2>
      <p className="font-display mt-6 max-h-[70vh] overflow-auto text-base leading-8 whitespace-pre-wrap">{item.text}</p>
    </article>
  );
}
