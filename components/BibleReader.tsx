"use client";

import { ProgressBar } from "@/components/ProgressBar";
import { SaveMark } from "@/components/SaveMark";
import { useLocale } from "@/components/providers";
import {
  adjacentReading,
  bibleCatalog,
  bibleTitle,
  chapterName,
  getBibleBook,
  type BibleBlock,
  type BibleBookMeta,
} from "@/lib/bible";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Drawer } from "vaul";

type Theme = "night" | "paper" | "sepia";
type Side = { en?: string; lt?: string };

export function BibleReader({
  slug,
  chapter,
  blocks,
}: {
  slug: string;
  chapter: number;
  blocks: BibleBlock[];
}) {
  const book = getBibleBook(slug);
  if (!book) return null;
  return <ReaderView book={book} chapter={chapter} blocks={blocks} />;
}

function ReaderView({
  book,
  chapter,
  blocks,
}: {
  book: BibleBookMeta;
  chapter: number;
  blocks: BibleBlock[];
}) {
  const t = useTranslations("bible");
  const reader = useTranslations("reader");
  const { locale, bilingual } = useLocale();
  const { resolvedTheme } = useTheme();
  const router = useRouter();
  const [theme, setTheme] = useState<Theme>("night");
  const [size, setSize] = useState(1.2);
  const [leading, setLeading] = useState(1.8);
  const [ready, setReady] = useState(false);
  const [booksOpen, setBooksOpen] = useState(false);
  const [chaptersOpen, setChaptersOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [verseQuery, setVerseQuery] = useState("");
  const title = bibleTitle(book, locale);
  const proseOnly = !blocks.some((block) => block.t === "v");
  const numeral = chapter === 0 ? t("opening") : proseOnly ? "" : String(chapter);
  const prev = adjacentReading(book.slug, chapter, -1);
  const next = adjacentReading(book.slug, chapter, 1);
  const sectionBooks = bibleCatalog.filter((item) => item.section === book.section);
  const missingLt = locale === "lt" && !bilingual && blocks.some((block) => block.t === "v" && !block.lt && block.en);

  useEffect(() => {
    const raw = window.localStorage.getItem("aeon-bible-type");
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as { size?: number; leading?: number; theme?: Theme };
        if (parsed.size) setSize(parsed.size);
        if (parsed.leading) setLeading(parsed.leading);
        if (parsed.theme) setTheme(parsed.theme);
      } catch {
        setTheme(resolvedTheme === "light" ? "paper" : "night");
      }
    } else {
      setTheme(resolvedTheme === "light" ? "paper" : "night");
    }
    setReady(true);
    window.localStorage.setItem(
      "aeon-bible-last",
      JSON.stringify({ slug: book.slug, chapter }),
    );
    const hash = window.location.hash.replace("#v", "");
    if (hash) document.getElementById(`v${hash}`)?.scrollIntoView({ block: "start" });
  }, [book.slug, chapter, resolvedTheme]);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem("aeon-bible-type", JSON.stringify({ size, leading, theme }));
  }, [ready, size, leading, theme]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target;
      if (target instanceof HTMLInputElement || target instanceof HTMLSelectElement || target instanceof HTMLTextAreaElement) return;
      if (window.getSelection()?.toString()) return;
      if (event.key === "ArrowLeft" && prev) router.push(`/bible/${prev.slug}/${prev.chapter}`);
      if (event.key === "ArrowRight" && next) router.push(`/bible/${next.slug}/${next.chapter}`);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next, router]);

  const copyVerse = (number: number) => {
    const ref = chapter === 0 ? title : `${title} ${chapter}:${number}`;
    void navigator.clipboard.writeText(ref).then(() => {
      setToast(ref);
      window.setTimeout(() => setToast(""), 1600);
    });
  };

  const jumpToVerse = (raw: string) => {
    const number = Number(raw);
    if (!Number.isInteger(number)) return;
    document.getElementById(`v${number}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      className={cn(
        "min-h-dvh",
        theme === "night" && "reader-night",
        theme === "paper" && "reader-paper",
        theme === "sepia" && "reader-sepia",
      )}
      style={{ "--reader-size": `${size}rem`, "--reader-leading": String(leading) } as React.CSSProperties}
    >
      <ProgressBar />
      <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[230px_minmax(0,1fr)_230px]">
        <aside className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] overflow-y-auto border-r border-line px-4 py-6 lg:block">
          <p className="text-[10px] tracking-[0.18em] text-muted uppercase">{t(book.section)}</p>
          <ul className="mt-3 space-y-1">
            {sectionBooks.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/bible/${item.slug}/${item.chapters[0]}`}
                  className={cn(
                    "block py-1.5 text-sm leading-snug hover:text-gold",
                    item.slug === book.slug ? "text-gold" : "text-muted",
                  )}
                >
                  {bibleTitle(item, locale)}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/bible" className="mt-6 inline-block text-[11px] tracking-[0.14em] text-muted uppercase hover:text-gold">
            {t("shelf")}
          </Link>
        </aside>

        <div>
          <div className="sticky top-12 z-30 border-b border-line bg-chrome px-4 py-2 backdrop-blur-md md:top-14 md:px-8">
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" onClick={() => setBooksOpen(true)} className="min-h-11 max-w-[46vw] truncate text-left font-display text-lg lg:max-w-none lg:pointer-events-none">
                {title}
              </button>
              <label className="sr-only" htmlFor="bible-chapter">
                {t("chapter")}
              </label>
              <select
                id="bible-chapter"
                value={chapter}
                onChange={(event) => router.push(`/bible/${book.slug}/${event.target.value}`)}
                className="min-h-11 border border-line bg-transparent px-2 font-display text-base"
              >
                {book.chapters.map((item) => (
                  <option key={item} value={item} className="bg-bg text-ink">
                    {chapterName(item, locale)}
                  </option>
                ))}
              </select>
              <form
                className="flex items-center"
                onSubmit={(event) => {
                  event.preventDefault();
                  jumpToVerse(verseQuery);
                }}
              >
                <label className="sr-only" htmlFor="bible-verse">
                  {t("verse")}
                </label>
                <input
                  id="bible-verse"
                  inputMode="numeric"
                  value={verseQuery}
                  onChange={(event) => setVerseQuery(event.target.value)}
                  placeholder={t("verse")}
                  className="h-11 w-20 border border-line bg-transparent px-2 text-base outline-none placeholder:text-muted"
                />
              </form>
              <div className="ml-auto hidden items-center gap-1 md:flex">
                <IconButton label={reader("night")} active={theme === "night"} onClick={() => setTheme("night")}>
                  {reader("night")}
                </IconButton>
                <IconButton label={reader("paper")} active={theme === "paper"} onClick={() => setTheme("paper")}>
                  {reader("paper")}
                </IconButton>
                <IconButton label={reader("sepia")} active={theme === "sepia"} onClick={() => setTheme("sepia")}>
                  {reader("sepia")}
                </IconButton>
              </div>
              <div className="ml-auto flex items-center gap-1 md:ml-0">
                <IconButton label="A-" onClick={() => setSize((value) => Math.max(1, Math.round((value - 0.08) * 100) / 100))}>
                  A-
                </IconButton>
                <IconButton label="A+" onClick={() => setSize((value) => Math.min(1.7, Math.round((value + 0.08) * 100) / 100))}>
                  A+
                </IconButton>
              </div>
            </div>
          </div>

          <article id="content" className="mx-auto max-w-[68ch] px-5 pt-8 pb-40 md:px-8">
            <p className="text-[10px] tracking-[0.22em] text-gold uppercase">{t("kicker")}</p>
            <h1 className="font-display mt-3 text-3xl leading-tight md:text-5xl">{title}</h1>
            {numeral ? <p className="font-display mt-2 text-5xl text-gold md:text-7xl">{numeral}</p> : null}
            <SaveMark
              href={`/bible/${book.slug}/${chapter}`}
              title={`${title} · ${chapterName(chapter, locale)}`}
              kicker="Etiopijos Biblija"
            />
            {missingLt ? <p className="mt-6 text-sm leading-relaxed text-muted">{t("fallback")}</p> : null}

            <div className="mt-8">
              {blocks.map((block, index) => (
                <Block
                  key={`${block.t}-${block.t === "v" ? block.n : index}`}
                  block={block}
                  onCopy={copyVerse}
                />
              ))}
            </div>

            <nav className="mt-16 grid gap-4 border-t border-line pt-6 sm:grid-cols-2">
              {prev ? (
                <Link href={`/bible/${prev.slug}/${prev.chapter}`} className="hover:text-gold">
                  <span className="block text-[10px] tracking-[0.16em] text-muted uppercase">{t("prev")}</span>
                  <span className="font-display mt-1 block text-2xl">{prev.titleLt}</span>
                  <span className="text-sm text-muted">{chapterName(prev.chapter, locale)}</span>
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link href={`/bible/${next.slug}/${next.chapter}`} className="hover:text-gold sm:text-right">
                  <span className="block text-[10px] tracking-[0.16em] text-muted uppercase">{t("next")}</span>
                  <span className="font-display mt-1 block text-2xl">{next.titleLt}</span>
                  <span className="text-sm text-muted">{chapterName(next.chapter, locale)}</span>
                </Link>
              ) : null}
            </nav>
          </article>
        </div>

        <aside className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] overflow-y-auto border-l border-line px-4 py-6 xl:block">
          <p className="text-[10px] tracking-[0.18em] text-muted uppercase">{t("chapter")}</p>
          <ChapterGrid book={book} current={chapter} />
        </aside>
      </div>

      <nav className="fixed right-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] left-0 z-30 grid grid-cols-3 border-t border-line bg-chrome backdrop-blur-md md:hidden">
        {prev ? (
          <Link href={`/bible/${prev.slug}/${prev.chapter}`} className="flex min-h-12 items-center justify-center text-[11px] tracking-[0.14em] uppercase">
            {t("prev")}
          </Link>
        ) : (
          <span />
        )}
        <button type="button" onClick={() => setChaptersOpen(true)} className="min-h-12 text-[11px] tracking-[0.14em] text-gold uppercase">
          {t("chapter")}
        </button>
        {next ? (
          <Link href={`/bible/${next.slug}/${next.chapter}`} className="flex min-h-12 items-center justify-center text-[11px] tracking-[0.14em] uppercase">
            {t("next")}
          </Link>
        ) : (
          <span />
        )}
      </nav>

      {toast ? (
        <p className="fixed bottom-36 left-1/2 z-50 -translate-x-1/2 border border-gold bg-elevated px-4 py-2 text-sm text-gold">
          {toast}
        </p>
      ) : null}

      <Sheet open={booksOpen} onOpenChange={setBooksOpen} title={t("books")}>
        {bibleCatalog
          .filter((item) => item.section !== "front")
          .reduce<BibleSectionGroup[]>((groups, item) => {
            const last = groups[groups.length - 1];
            if (!last || last.section !== item.section) groups.push({ section: item.section, books: [item] });
            else last.books.push(item);
            return groups;
          }, [])
          .map((group) => (
            <div key={group.section} className="mt-5">
              <p className="text-[10px] tracking-[0.18em] text-gold uppercase">{t(group.section)}</p>
              <ul className="mt-2">
                {group.books.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={`/bible/${item.slug}/${item.chapters[0]}`}
                      onClick={() => setBooksOpen(false)}
                      className={cn("block py-2 font-display text-lg", item.slug === book.slug && "text-gold")}
                    >
                      {bibleTitle(item, locale)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
      </Sheet>

      <Sheet open={chaptersOpen} onOpenChange={setChaptersOpen} title={title}>
        <ChapterGrid book={book} current={chapter} onPick={() => setChaptersOpen(false)} />
      </Sheet>
    </div>
  );
}

type BibleSectionGroup = { section: BibleBookMeta["section"]; books: BibleBookMeta[] };

function ChapterGrid({ book, current, onPick }: { book: BibleBookMeta; current: number; onPick?: () => void }) {
  const t = useTranslations("bible");
  return (
    <div className="mt-3 grid grid-cols-5 gap-1.5">
      {book.chapters.map((item) => {
        const active = item === current;
        return (
          <Link
            key={item}
            href={`/bible/${book.slug}/${item}`}
            onClick={onPick}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex min-h-11 items-center justify-center border text-sm",
              active ? "border-gold bg-gold text-[#1a140c]" : "border-line hover:border-gold",
            )}
          >
            {item === 0 ? t("openingShort") : item}
          </Link>
        );
      })}
    </div>
  );
}

function Block({
  block,
  onCopy,
}: {
  block: BibleBlock;
  onCopy: (number: number) => void;
}) {
  const text = pick(block);
  if (!text.primary && !text.secondary) return null;
  if (block.t === "h") {
    return (
      <h2 className="font-display mt-10 mb-3 text-xl leading-snug text-gold">
        {text.primary}
        {text.secondary ? <span className="mt-1 block text-base text-muted">{text.secondary}</span> : null}
      </h2>
    );
  }
  if (block.t === "p") {
    return (
      <p className="font-display mb-4" style={{ fontSize: "var(--reader-size)", lineHeight: "var(--reader-leading)" }}>
        {text.primary}
        {text.secondary ? <span className="mt-1 block text-muted">{text.secondary}</span> : null}
      </p>
    );
  }
  return (
    <p
      id={`v${block.n}`}
      className="scroll-mt-36 font-display"
      style={{
        fontSize: "var(--reader-size)",
        lineHeight: "var(--reader-leading)",
        paddingLeft: "2.35rem",
        textIndent: "-2.35rem",
        marginBottom: text.secondary ? "0.85em" : "0.28em",
      }}
    >
      <button
        type="button"
        onClick={() => onCopy(block.n)}
        className="inline-block w-[2.35rem] pr-2 text-right align-baseline font-sans text-[0.68em] text-gold"
        style={{ textIndent: 0 }}
      >
        {block.n}
      </button>
      {text.primary}
      {text.secondary ? <span className="mt-1 block pl-[2.35rem] text-muted" style={{ textIndent: 0 }}>{text.secondary}</span> : null}
    </p>
  );
}

function pick(block: Side) {
  return { primary: block.lt ?? "", secondary: "" };
}

function IconButton({
  children,
  onClick,
  active,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={cn("min-h-11 border border-line px-2 text-[11px] tracking-[0.08em] uppercase", active && "border-gold text-gold")}
    >
      {children}
    </button>
  );
}

function Sheet({
  open,
  onOpenChange,
  title,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-black/55" />
        <Drawer.Content className="fixed right-0 bottom-0 left-0 z-50 max-h-[82vh] overflow-auto border-t border-line bg-elevated px-5 pt-4 pb-12">
          <Drawer.Title className="font-display text-2xl">{title}</Drawer.Title>
          {children}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
