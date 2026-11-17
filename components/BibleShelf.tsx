"use client";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageFade } from "@/components/PageFade";
import { useLocale } from "@/components/providers";
import {
  bibleAbbr,
  bibleCatalog,
  bibleSections,
  bibleTitle,
  chapterCountKey,
  chapterName,
  readingChapters,
  type BibleBookMeta,
  type BibleCanon,
  type BibleSection,
} from "@/lib/bible";
import { fold, hasQuery } from "@/lib/fold";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type LastRead = { slug: string; chapter: number };

const canons = ["all", "common", "deuterocanon", "ethiopian"] as const;

function matches(book: BibleBookMeta, query: string) {
  const needle = query.trim();
  if (!needle) return true;
  const folded = fold(needle);
  return [book.titleLt, book.abbrLt].some((value) => fold(value).startsWith(folded) || hasQuery(value, needle));
}

export function BibleShelf() {
  const t = useTranslations("bible");
  const { locale } = useLocale();
  const [section, setSection] = useState<BibleSection | "all">("all");
  const [canon, setCanon] = useState<(typeof canons)[number]>("all");
  const [query, setQuery] = useState("");
  const [last, setLast] = useState<LastRead | null>(null);

  useEffect(() => {
    const raw = window.localStorage.getItem("aeon-bible-last");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as LastRead;
      if (parsed.slug && Number.isInteger(parsed.chapter)) setLast(parsed);
    } catch {
      setLast(null);
    }
  }, []);

  const books = useMemo(() => {
    return bibleCatalog.filter((book) => {
      if (book.section === "front") return false;
      if (section !== "all" && book.section !== section) return false;
      if (canon !== "all" && book.canon !== canon) return false;
      return matches(book, query);
    });
  }, [section, canon, query]);

  const front = bibleCatalog.filter(
    (book) => book.section === "front" && section === "all" && canon === "all" && matches(book, query),
  );
  const lastBook = last ? bibleCatalog.find((book) => book.slug === last.slug) : null;

  return (
    <PageFade>
      <div className="mx-auto max-w-6xl px-5 pt-20 pb-32 md:px-10">
        <Breadcrumbs
          crumbs={[
            { name: t("home"), path: "/" },
            { name: t("title"), path: "/bible" },
          ]}
          className="mb-6"
        />
        <p className="text-[10px] tracking-[0.28em] text-gold uppercase">{t("kicker")}</p>
        <h1 className="font-display mt-3 max-w-3xl text-4xl leading-tight md:text-6xl">{t("title")}</h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted md:text-base">{t("lede")}</p>

        {lastBook && last ? (
          <Link
            href={`/bible/${lastBook.slug}/${last.chapter}`}
            className="mt-8 flex items-center justify-between gap-4 border border-gold/50 px-5 py-4 hover:border-gold"
          >
            <span>
              <span className="block text-[10px] tracking-[0.2em] text-gold uppercase">{t("continue")}</span>
              <span className="font-display mt-1 block text-2xl">{bibleTitle(lastBook, locale)}</span>
              <span className="mt-1 block text-sm text-muted">{chapterName(last.chapter, locale)}</span>
            </span>
            <span aria-hidden className="font-display text-2xl text-gold">
              &rarr;
            </span>
          </Link>
        ) : null}

        <fieldset className="mt-10 min-w-0 border-0 p-0">
          <legend className="mb-3 text-[10px] tracking-[0.2em] text-muted uppercase">{t("sections")}</legend>
          <div className="flex flex-wrap gap-2">
            <Chip active={section === "all"} onClick={() => setSection("all")} label={t("all")} />
            {bibleSections.map((id) => (
              <Chip
                key={id}
                active={section === id}
                onClick={() => setSection(id)}
                label={`${t(id)} ${bibleCatalog.filter((book) => book.section === id).length}`}
              />
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-6 min-w-0 border-0 p-0">
          <legend className="mb-3 text-[10px] tracking-[0.2em] text-muted uppercase">{t("canonLabel")}</legend>
          <div className="flex flex-wrap gap-2">
            {canons.map((id) => (
              <Chip key={id} active={canon === id} onClick={() => setCanon(id)} label={t(id)} />
            ))}
          </div>
        </fieldset>

        <label className="mt-6 block max-w-md">
          <span className="sr-only">{t("search")}</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("search")}
            className="min-h-12 w-full border border-line bg-transparent px-4 text-base outline-none placeholder:text-muted focus:border-gold"
          />
        </label>

        {front.length ? (
          <div className="mt-8 flex flex-wrap gap-3">
            {front.map((book) => (
              <Link key={book.slug} href={`/bible/${book.slug}`} className="min-h-11 border border-line px-4 py-3 text-sm hover:border-gold hover:text-gold">
                {bibleTitle(book, locale)}
              </Link>
            ))}
          </div>
        ) : null}

        {books.length === 0 ? <p className="font-display mt-16 text-2xl text-muted">{t("empty")}</p> : null}

        {bibleSections.map((id) => {
          const items = books.filter((book) => book.section === id);
          if (!items.length) return null;
          return (
            <section key={id} className="mt-12">
              <h2 className="sticky top-12 z-10 -mx-5 bg-bg/95 px-5 py-3 font-display text-2xl backdrop-blur-md md:top-14 md:text-3xl">
                {t(id)}
                <span className="ml-3 text-base text-muted">{items.length}</span>
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {items.map((book) => (
                  <BookCard key={book.slug} book={book} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </PageFade>
  );
}

function BookCard({ book }: { book: BibleBookMeta }) {
  const t = useTranslations("bible");
  const { locale } = useLocale();
  const count = readingChapters(book).length;
  return (
    <Link href={`/bible/${book.slug}`} className="flex min-h-28 flex-col border border-line p-4 hover:border-gold/50">
      <span className="flex items-center justify-between gap-3 text-[10px] tracking-[0.16em] uppercase">
        <span className="text-gold">{bibleAbbr(book, locale)}</span>
        {book.canon === "common" ? null : (
          <span className={book.canon === "ethiopian" ? "text-gold" : "text-muted"}>{t(book.canon as BibleCanon)}</span>
        )}
      </span>
      <span className="font-display mt-3 text-xl leading-snug">{bibleTitle(book, locale)}</span>
      <span className="mt-auto pt-4 text-[11px] tracking-[0.14em] text-muted uppercase">
        {count} {t(chapterCountKey(count, locale))}
      </span>
    </Link>
  );
}

function Chip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "min-h-11 border px-3 text-[11px] tracking-[0.14em] uppercase",
        active ? "border-gold bg-gold text-[#1a140c]" : "border-line text-ink hover:border-gold/50",
      )}
    >
      {label}
    </button>
  );
}
