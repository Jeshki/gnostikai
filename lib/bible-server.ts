import { getBibleBook, type BibleBlock } from "@/lib/bible";
import fs from "fs";
import path from "path";

export type BibleChapterData = {
  n: number;
  blocks: BibleBlock[];
};

type BookFile = {
  slug: string;
  chapters: BibleChapterData[];
};

const cache = new Map<string, { mtime: number; book: BookFile }>();

export function readBibleChapter(slug: string, chapter: number): BibleChapterData | null {
  const meta = getBibleBook(slug);
  if (!meta || !meta.chapters.includes(chapter)) return null;
  const file = path.join(process.cwd(), "content", "bible", "books", `${slug}.json`);
  if (!fs.existsSync(file)) return null;
  const mtime = fs.statSync(file).mtimeMs;
  let entry = cache.get(slug);
  if (!entry || entry.mtime !== mtime) {
    entry = { mtime, book: JSON.parse(fs.readFileSync(file, "utf8")) as BookFile };
    cache.set(slug, entry);
  }
  return entry.book.chapters.find((item) => item.n === chapter) ?? null;
}
