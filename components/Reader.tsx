"use client";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CodexTree } from "@/components/CodexTree";
import { DualText } from "@/components/DualText";
import { ProgressBar } from "@/components/ProgressBar";
import { SayingBlock } from "@/components/SayingBlock";
import { useLocale } from "@/components/providers";
import { getBody, nextInCodex, thomas, type Saying } from "@/lib/content";
import { collectionLabel, licenseLabel, relatedTexts } from "@/lib/corpus";
import { textCrumbs } from "@/lib/seo";
import { fieldLabel } from "@/lib/fields";
import type { BodySection, CorpusText } from "@/lib/types";
import { readSaved, toggleSaying, toggleText } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { Bookmark, List, Volume2 } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Drawer } from "vaul";

type Theme = "night" | "paper" | "sepia";

export function Reader({
  text,
  chapterId,
  mdx,
  mdxLt,
  body,
}: {
  text: CorpusText;
  chapterId?: string;
  mdx?: React.ReactNode;
  mdxLt?: React.ReactNode;
  body?: BodySection[];
}) {
  const t = useTranslations("reader");
  const { locale, bilingual } = useLocale();
  const { resolvedTheme } = useTheme();
  const [theme, setTheme] = useState<Theme>("night");
  const [size, setSize] = useState(1.125);
  const [leading, setLeading] = useState(1.75);
  const [bookmarked, setBookmarked] = useState(false);
  const [chaptersOpen, setChaptersOpen] = useState(false);
  const next = nextInCodex(text.slug);
  const related = relatedTexts(text.slug);
  const excerpt = getBody(text.slug);
  const title = locale === "lt" ? text.titleLt : text.titleEn;

  const sayings = useMemo(() => {
    if (text.slug !== "thomas") return [];
    if (!chapterId) return thomas.sayings;
    return thomas.sayings.filter((saying) => String(saying.n) === chapterId);
  }, [text.slug, chapterId]);

  useEffect(() => {
    setBookmarked(readSaved().texts.includes(text.slug));
  }, [text.slug]);

  useEffect(() => {
    setTheme(resolvedTheme === "light" ? "paper" : "night");
  }, [resolvedTheme]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;
    document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [text.slug]);

  const citeWhole = () => {
    void navigator.clipboard.writeText(`${title} · AEON`);
  };

  return (
    <div
      className={cn(
        "min-h-dvh transition-colors duration-200",
        theme === "night" && "reader-night",
        theme === "paper" && "reader-paper",
        theme === "sepia" && "reader-sepia",
      )}
      style={
        {
          "--reader-size": `${size}rem`,
          "--reader-leading": String(leading),
        } as React.CSSProperties
      }
    >
      <ProgressBar />

      <div className="mx-auto grid max-w-[1400px] grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)_220px]">
        <aside className="hidden max-h-dvh overflow-y-auto border-r border-line px-5 pt-24 pb-24 lg:block">
          <CodexTree activeSlug={text.slug} />
        </aside>

        <main id="content" className="px-5 pt-20 pb-28 md:px-12 lg:px-16">
          <header className="mb-12">
            <Breadcrumbs crumbs={textCrumbs(text, locale)} className="mb-6" />
            <p className="text-[10px] tracking-[0.22em] text-muted uppercase">
              {text.codex ? fieldLabel(text.codex, locale) : collectionLabel(text.collection, locale)} · {fieldLabel(text.discovery, locale)} ·{" "}
              {fieldLabel(text.originalLanguage, locale)}
            </p>
            <h1 className="font-display mt-3 text-4xl leading-tight md:text-5xl">
              {bilingual ? `${text.titleLt} / ${text.titleEn}` : title}
            </h1>
            {!bilingual ? (
              <p lang={locale === "lt" ? "en" : "lt"} className="mt-2 font-display text-lg text-muted">
                {locale === "lt" ? text.titleEn : text.titleLt}
              </p>
            ) : null}
            {text.originalTitle ? (
              <p className="mt-3 font-display text-sm italic text-muted">{text.originalTitle}</p>
            ) : null}
            <div className="mt-6 max-w-2xl text-sm leading-relaxed text-muted">
              <DualText lt={text.introLt} en={text.introEn} bilingual={bilingual} locale={locale} />
            </div>
            <p className="mt-3 text-[11px] tracking-[0.12em] text-muted uppercase">
              {fieldLabel(text.provenance, locale)} · {fieldLabel(text.dateApprox, locale)}
            </p>
            {text.translator || text.license ? (
              <p className="mt-4 text-[11px] tracking-[0.14em] text-gold uppercase">
                {[text.translator, licenseLabel(text.license, locale)].filter(Boolean).join(" · ")}
              </p>
            ) : null}

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setChaptersOpen(true)}
                className="inline-flex min-h-11 items-center gap-2 border border-line px-3 text-[11px] tracking-[0.16em] uppercase"
              >
                <List size={14} /> {t("chapters")}
              </button>
              <button
                type="button"
                onClick={() => setBookmarked(toggleText(text.slug).texts.includes(text.slug))}
                className={cn(
                  "inline-flex min-h-11 items-center gap-2 border border-line px-3 text-[11px] tracking-[0.16em] uppercase",
                  bookmarked && "text-gold",
                )}
              >
                <Bookmark size={14} /> {t("bookmark")}
              </button>
              <button
                type="button"
                disabled
                className="inline-flex min-h-11 items-center gap-2 border border-line px-3 text-[11px] tracking-[0.16em] text-muted uppercase opacity-50"
              >
                <Volume2 size={14} /> {t("audio")}
              </button>
              <button
                type="button"
                onClick={citeWhole}
                className="inline-flex min-h-11 items-center border border-line px-3 text-[11px] tracking-[0.16em] uppercase"
              >
                {t("cite")}
              </button>
            </div>

            <div className="mt-6 flex flex-wrap gap-2 text-[11px] tracking-[0.14em] uppercase">
              {(["night", "paper", "sepia"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setTheme(mode)}
                  className={cn(
                    "min-h-11 border border-line px-3",
                    theme === mode && "text-gold",
                  )}
                >
                  {t(mode)}
                </button>
              ))}
              <button
                type="button"
                className="min-h-11 border border-line px-3"
                onClick={() => setSize((value) => Math.min(1.45, value + 0.1))}
              >
                A+
              </button>
              <button
                type="button"
                className="min-h-11 border border-line px-3"
                onClick={() => setSize((value) => Math.max(0.95, value - 0.1))}
              >
                A−
              </button>
              <button
                type="button"
                className="min-h-11 border border-line px-3"
                onClick={() => setLeading((value) => (value > 1.7 ? 1.6 : 1.85))}
              >
                ↕
              </button>
            </div>
          </header>

          <article className="measure mx-auto">
            {locale === "lt" && !body?.some((block) => block.bodyLt) && excerpt?.some((block) => block.bodyLt) ? (
              <>
                <p className="mb-8 text-[11px] tracking-[0.16em] text-gold uppercase">
                  {t("excerptNote")}
                </p>
                {excerpt.map((block) => (
                  <section key={block.headingLt ?? block.heading ?? block.body.slice(0, 24)} className="mb-12">
                    {block.headingLt ? (
                      <h2 className="font-display mb-4 text-xl text-gold">{block.headingLt}</h2>
                    ) : null}
                    <p className="reader-text font-display whitespace-pre-wrap">
                      {block.bodyLt}
                    </p>
                  </section>
                ))}
              </>
            ) : body && text.slug !== "thomas" ? (
              <>
                <p className="mb-8 text-[11px] tracking-[0.16em] text-gold uppercase">
                  {text.translator ? `${text.translator} · ` : ""}
                  {licenseLabel(text.license, locale)}
                </p>
                {locale === "lt" ? (
                  <p className="mb-8 text-sm leading-relaxed text-muted">
                    {body.some((block) => block.bodyLt) ? t("deepl") : t("ltPending")}
                  </p>
                ) : null}
                {body.map((block, index) => (
                  <section key={`${block.heading ?? "s"}-${index}`} id={String(index + 1)} className="mb-12 scroll-mt-24">
                    <DualText
                      as="h2"
                      className="font-display mb-4 text-xl text-gold"
                      lt={block.headingLt}
                      en={block.heading}
                      bilingual={bilingual}
                      locale={locale}
                    />
                    <DualText
                      className="reader-text font-display whitespace-pre-wrap"
                      lt={block.bodyLt}
                      en={block.body}
                      bilingual={bilingual}
                      locale={locale}
                    />
                  </section>
                ))}
              </>
            ) : text.slug === "thomas" ? (
              <>
                {locale === "lt" || bilingual ? (
                  <p className="mb-8 text-sm leading-relaxed text-muted">{t("deepl")}</p>
                ) : null}
                {!chapterId ? (
                  <div className="reader-text mb-10 font-display italic">
                    <DualText
                      lt={thomas.prologueLt}
                      en={thomas.prologue}
                      bilingual={bilingual}
                      locale={locale}
                    />
                  </div>
                ) : null}
                {sayings.map((saying) => (
                  <ThomasSaying key={saying.n} saying={saying} />
                ))}
                {chapterId ? (
                  <ChapterNav current={Number(chapterId)} />
                ) : null}
              </>
            ) : excerpt ? (
              <>
                <p className="mb-8 text-[11px] tracking-[0.16em] text-gold uppercase">
                  {t("excerptNote")}
                </p>
                {excerpt.map((block) => (
                  <section key={block.heading ?? block.body.slice(0, 24)} className="mb-12">
                    {(locale === "lt" ? block.headingLt : block.heading) ? (
                      <h2 className="font-display mb-4 text-xl text-gold">
                        {locale === "lt" ? block.headingLt : block.heading}
                      </h2>
                    ) : null}
                    <p className="reader-text font-display whitespace-pre-wrap">
                      {locale === "lt" ? block.bodyLt : block.body}
                    </p>
                  </section>
                ))}
              </>
            ) : (
              <section>
                {bilingual ? (
                  <>
                    {mdxLt ? <div className="prose-aeon">{mdxLt}</div> : null}
                    {mdx ? <div className="prose-aeon mt-6 text-muted">{mdx}</div> : null}
                  </>
                ) : locale === "lt" && mdxLt ? (
                  <div className="prose-aeon">{mdxLt}</div>
                ) : locale === "en" && mdx ? (
                  <div className="prose-aeon">{mdx}</div>
                ) : null}
                <p className="reader-text font-display mt-8">
                  {text.chapters[0]
                    ? locale === "lt"
                      ? text.chapters[0].titleLt
                      : text.chapters[0].titleEn
                    : "I."}
                </p>
                <p className="mt-6 text-sm text-muted">{t("coming")}</p>
              </section>
            )}
          </article>

          {next ? (
            <div className="measure mx-auto mt-20 border-t border-line pt-8">
              <p className="text-[10px] tracking-[0.2em] text-muted uppercase">{t("next")}</p>
              <Link
                href={`/text/${next.slug}`}
                className="font-display mt-2 inline-block text-2xl hover:text-gold"
              >
                {locale === "lt" ? next.titleLt : next.titleEn}
              </Link>
            </div>
          ) : null}

          {related.length ? (
            <ul className="measure mx-auto mt-10 flex flex-wrap gap-3 text-sm text-muted">
              {related.map((item) => (
                <li key={item.slug}>
                  <Link href={`/text/${item.slug}`} className="hover:text-gold">
                    {locale === "lt" ? item.titleLt : item.titleEn}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </main>

        <aside className="hidden border-l border-line px-5 pt-24 text-sm text-muted xl:block">
          <p className="text-[10px] tracking-[0.2em] uppercase">{t("notes")}</p>
          <p className="mt-3 leading-relaxed">{t("notesHint")}</p>
          {related.length ? (
            <div className="mt-8">
              <p className="text-[10px] tracking-[0.2em] uppercase">{t("related")}</p>
              <ul className="mt-3 space-y-2">
                {related.map((item) => (
                  <li key={item.slug}>
                    <Link href={`/text/${item.slug}`} className="hover:text-gold">
                      {locale === "lt" ? item.titleLt : item.titleEn}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </aside>
      </div>

      <Drawer.Root open={chaptersOpen} onOpenChange={setChaptersOpen}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-50 bg-black/55" />
          <Drawer.Content className="fixed right-0 bottom-0 left-0 z-50 max-h-[80vh] overflow-auto border-t border-line bg-elevated px-6 pt-4 pb-12">
            <Drawer.Title className="font-display text-lg text-gold">{t("chapters")}</Drawer.Title>
            <ul className="mt-4 columns-2 gap-4 text-sm md:columns-3">
              {text.chapters.map((chapter) => (
                <li key={chapter.id} className="mb-2 break-inside-avoid">
                  <Link
                    href={
                      text.slug === "thomas"
                        ? `/text/thomas/${chapter.id}`
                        : `/text/${text.slug}/${chapter.id}`
                    }
                    onClick={() => setChaptersOpen(false)}
                    className="hover:text-gold"
                  >
                    {chapter.id}.{" "}
                    {bilingual
                      ? `${chapter.titleLt} / ${chapter.titleEn}`
                      : locale === "lt"
                        ? chapter.titleLt
                        : chapter.titleEn}
                  </Link>
                </li>
              ))}
            </ul>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  );
}

function ThomasSaying({ saying }: { saying: Saying }) {
  const t = useTranslations("reader");
  const [marked, setMarked] = useState(false);

  useEffect(() => {
    setMarked(readSaved().sayings.some((item) => item.slug === "thomas" && item.n === saying.n));
  }, [saying.n]);

  return (
    <div className="relative">
      <SayingBlock saying={saying} />
      <button
        type="button"
        onClick={() =>
          setMarked(toggleSaying("thomas", saying.n).sayings.some((item) => item.n === saying.n))
        }
        className={cn(
          "absolute top-6 right-0 text-[10px] tracking-[0.14em] uppercase",
          marked ? "text-gold" : "text-muted/60",
        )}
        aria-label={t("bookmark")}
      >
        {saying.n}
      </button>
    </div>
  );
}

function ChapterNav({ current }: { current: number }) {
  const { locale } = useLocale();
  const prev = current > 1 ? current - 1 : null;
  const next = current < 114 ? current + 1 : null;
  return (
    <nav className="mt-12 flex justify-between text-[11px] tracking-[0.16em] uppercase">
      {prev ? (
        <Link href={`/text/thomas/${prev}`} className="min-h-11 hover:text-gold">
          ← {prev}
        </Link>
      ) : (
        <span />
      )}
      <Link href="/text/thomas" className="min-h-11 hover:text-gold">
        {locale === "lt" ? "Korpusas" : "Corpus"}
      </Link>
      {next ? (
        <Link href={`/text/thomas/${next}`} className="min-h-11 hover:text-gold">
          {next} →
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
