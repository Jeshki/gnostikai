import catalogJson from "@/content/bible/catalog.json";
import type { Locale } from "@/lib/i18n";

export const bibleSections = ["law", "history", "wisdom", "prophets", "gospels", "letters", "revelation"] as const;

export type BibleSection = (typeof bibleSections)[number] | "front";
export type BibleCanon = "common" | "deuterocanon" | "ethiopian" | "front";

export type BibleBookMeta = {
  slug: string;
  section: BibleSection;
  canon: BibleCanon;
  titleEn: string;
  titleLt: string;
  abbrEn: string;
  abbrLt: string;
  chapters: number[];
  order: number;
};

export type BibleBlock =
  | { t: "h"; en?: string; lt?: string; n?: never }
  | { t: "p"; en?: string; lt?: string; n?: never }
  | { t: "v"; n: number; en?: string; lt?: string };

export const bibleCatalog = catalogJson as BibleBookMeta[];

const openingLt = String.fromCharCode(0x012e, 0x017e) + "anga";

export function getBibleBook(slug: string) {
  return bibleCatalog.find((book) => book.slug === slug) ?? null;
}

export function bibleTitle(book: BibleBookMeta, _locale?: Locale) {
  return book.titleLt;
}

export function bibleAbbr(book: BibleBookMeta, _locale?: Locale) {
  return book.abbrLt;
}

export function readingChapters(book: BibleBookMeta) {
  return book.chapters.filter((chapter) => chapter > 0);
}

export function chapterCountKey(count: number, _locale?: Locale) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod100 >= 11 && mod100 <= 19) return "chapterMany";
  if (mod10 === 1) return "chapterOne";
  if (mod10 >= 2 && mod10 <= 9) return "chapterFew";
  return "chapterMany";
}

export function chapterName(chapter: number, _locale?: Locale) {
  if (chapter === 0) return openingLt;
  return `${chapter} skyrius`;
}

export type BibleNeighbor = {
  slug: string;
  chapter: number;
  titleLt: string;
  titleEn: string;
};

export function adjacentReading(slug: string, chapter: number, direction: -1 | 1): BibleNeighbor | null {
  const book = getBibleBook(slug);
  if (!book) return null;
  const index = book.chapters.indexOf(chapter);
  if (index === -1) return null;
  const nextIndex = index + direction;
  if (nextIndex >= 0 && nextIndex < book.chapters.length) {
    return {
      slug: book.slug,
      chapter: book.chapters[nextIndex],
      titleLt: book.titleLt,
      titleEn: book.titleEn,
    };
  }
  const bookIndex = bibleCatalog.findIndex((item) => item.slug === slug);
  const other = bibleCatalog[bookIndex + direction];
  if (!other || other.chapters.length === 0) return null;
  const nextChapter = direction === 1 ? other.chapters[0] : other.chapters[other.chapters.length - 1];
  return {
    slug: other.slug,
    chapter: nextChapter,
    titleLt: other.titleLt,
    titleEn: other.titleEn,
  };
}
