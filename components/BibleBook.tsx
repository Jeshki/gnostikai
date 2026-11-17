"use client";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageFade } from "@/components/PageFade";
import { useLocale } from "@/components/providers";
import {
  adjacentReading,
  bibleCatalog,
  bibleTitle,
  chapterCountKey,
  chapterName,
  getBibleBook,
  readingChapters,
  type BibleBookMeta,
} from "@/lib/bible";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import Link from "next/link";

export function BibleBook({ slug }: { slug: string }) {
  const book = getBibleBook(slug);
  if (!book) return null;
  return <BibleBookView book={book} />;
}

function BibleBookView({ book }: { book: BibleBookMeta }) {
  const t = useTranslations("bible");
  const { locale } = useLocale();
  const first = book.chapters[0];
  const count = readingChapters(book).length;
  const prev = adjacentReading(book.slug, book.chapters[0], -1);
  const next = adjacentReading(book.slug, book.chapters[book.chapters.length - 1], 1);
  const title = bibleTitle(book, locale);

  return (
    <PageFade>
      <div className="mx-auto max-w-5xl px-5 pt-20 pb-32 md:px-10">
        <Breadcrumbs
          crumbs={[
            { name: t("home"), path: "/" },
            { name: t("title"), path: "/bible" },
            { name: title, path: `/bible/${book.slug}` },
          ]}
          className="mb-6"
        />
        <p className="text-[10px] tracking-[0.22em] text-gold uppercase">
          {t(book.section)}
          {book.canon === "common" ? "" : ` / ${t(book.canon)}`}
        </p>
        <h1 className="font-display mt-3 text-4xl leading-tight md:text-6xl">{title}</h1>
        <p className="mt-4 text-sm text-muted">
          {count} {t(chapterCountKey(count, locale))}
        </p>
        {first !== undefined ? (
          <Link
            href={`/bible/${book.slug}/${first}`}
            className="mt-8 inline-flex min-h-12 items-center bg-gold px-6 font-display text-lg text-[#1a140c]"
          >
            {t("read")}
          </Link>
        ) : null}

        <h2 className="font-display mt-12 text-2xl">{t("chapter")}</h2>
        <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
          {book.chapters.map((chapter) => (
            <Link
              key={chapter}
              href={`/bible/${book.slug}/${chapter}`}
              className="flex min-h-14 items-center justify-center border border-line font-display text-lg hover:border-gold hover:text-gold"
            >
              {chapter === 0 ? t("openingShort") : chapter}
            </Link>
          ))}
        </div>

        <nav className="mt-14 grid gap-3 border-t border-line pt-6 sm:grid-cols-2">
          {prev ? <NeighborLink item={prev} label={t("prev")} /> : <span />}
          {next ? <NeighborLink item={next} label={t("next")} align="end" /> : null}
        </nav>
        <p className="mt-8 text-sm">
          <Link href="/bible" className="text-muted hover:text-gold">
            {t("shelf")}
          </Link>
          <span className="text-muted"> / </span>
          <span className="text-muted">{bibleCatalog.length}</span>
        </p>
      </div>
    </PageFade>
  );
}

function NeighborLink({
  item,
  label,
  align = "start",
}: {
  item: { slug: string; chapter: number; titleLt: string; titleEn: string };
  label: string;
  align?: "start" | "end";
}) {
  const { locale } = useLocale();
  const title = locale === "lt" ? item.titleLt : item.titleEn;
  return (
    <Link href={`/bible/${item.slug}/${item.chapter}`} className={cn("block hover:text-gold", align === "end" && "sm:text-right")}>
      <span className="block text-[10px] tracking-[0.16em] text-muted uppercase">{label}</span>
      <span className="font-display mt-1 block text-xl">
        {title}
        {item.chapter > 0 ? ` ${item.chapter}` : ""}
      </span>
    </Link>
  );
}
