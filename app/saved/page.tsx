"use client";

import { PageFade } from "@/components/PageFade";
import { useLocale } from "@/components/providers";
import { getSaying } from "@/lib/content";
import { getText } from "@/lib/corpus";
import { readSaved, removePlace, type SavedState } from "@/lib/storage";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function SavedPage() {
  const { locale } = useLocale();
  const t = useTranslations("saved");
  const [saved, setSaved] = useState<SavedState>({ texts: [], sayings: [], highlights: [], places: [] });

  useEffect(() => {
    setSaved(readSaved());
  }, []);

  const empty = saved.places.length + saved.texts.length + saved.sayings.length + saved.highlights.length === 0;

  return (
    <PageFade>
      <main id="content" className="mx-auto max-w-3xl px-6 pt-20 pb-28">
        <h1 className="font-display mb-10 text-4xl">{t("title")}</h1>
        {empty ? (
          <p className="font-display text-2xl text-muted">{t("empty")}</p>
        ) : (
          <div className="space-y-10">
            {saved.places.map((item) => (
              <div key={item.href} className="flex items-start justify-between gap-4">
                <Link href={item.href} className="min-w-0 hover:text-gold">
                  {item.kicker ? (
                    <p className="text-[10px] tracking-[0.16em] text-gold uppercase">{item.kicker}</p>
                  ) : null}
                  <p className="font-display mt-2 text-2xl">{item.title}</p>
                </Link>
                <button
                  type="button"
                  onClick={() => setSaved(removePlace(item.href))}
                  className="mt-1 inline-flex min-h-11 shrink-0 items-center px-2 text-sm text-muted hover:text-gold"
                >
                  {t("remove")}
                </button>
              </div>
            ))}
            {saved.texts.map((slug) => {
              const text = getText(slug);
              if (!text) return null;
              return (
                <Link key={slug} href={`/text/${slug}`} className="block hover:text-gold">
                  <p className="font-display text-2xl">
                    {locale === "lt" ? text.titleLt : text.titleEn}
                  </p>
                </Link>
              );
            })}
            {saved.sayings.map((item) => {
              const saying = getSaying(item.n);
              return (
                <Link
                  key={`${item.slug}-${item.n}`}
                  href={`/text/${item.slug}#${item.n}`}
                  className="block hover:text-gold"
                >
                  <p className="text-[10px] tracking-[0.16em] text-gold uppercase">
                    {locale === "lt" ? `Ev. Tomo ${item.n}` : `Gos. Thomas ${item.n}`}
                  </p>
                  <p className="mt-2 text-sm text-muted">
                    {locale === "lt" ? saying?.lt : saying?.en}
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </PageFade>
  );
}
