import { about } from "@/content/about";
import { bibleCatalog } from "@/lib/bible";
import { fold, hasQuery, snippet } from "@/lib/fold";
import { glossary } from "@/lib/glossary";
import { nhCatalog } from "@/lib/nh";
import fs from "node:fs";
import path from "node:path";

export type SearchHit = {
  kind: "book" | "verse" | "text" | "term" | "about";
  title: string;
  kicker: string;
  snippet: string;
  href: string;
};

type Verse = { slug: string; title: string; chapter: number; n: number; text: string; folded: string };
type Para = { slug: string; title: string; codex: string; id: number; text: string; folded: string };

let verses: Verse[] | null = null;
let paras: Para[] | null = null;

function loadVerses() {
  if (verses) return verses;
  const dir = path.join(process.cwd(), "content", "bible", "books");
  const rows: Verse[] = [];
  for (const book of bibleCatalog) {
    if (book.section === "front") continue;
    const file = path.join(dir, `${book.slug}.json`);
    if (!fs.existsSync(file)) continue;
    const data = JSON.parse(fs.readFileSync(file, "utf8")) as {
      chapters: Array<{ n: number; blocks: Array<{ t: string; n?: number; lt?: string }> }>;
    };
    for (const chapter of data.chapters) {
      for (const block of chapter.blocks) {
        if (block.t !== "v" || !block.lt || block.n == null) continue;
        rows.push({
          slug: book.slug,
          title: book.titleLt,
          chapter: chapter.n,
          n: block.n,
          text: block.lt,
          folded: fold(block.lt),
        });
      }
    }
  }
  verses = rows;
  return rows;
}

function loadParas() {
  if (paras) return paras;
  const dir = path.join(process.cwd(), "content", "nag-hammadi", "works");
  const rows: Para[] = [];
  for (const work of nhCatalog) {
    const file = path.join(dir, `${work.slug}.json`);
    if (!fs.existsSync(file)) continue;
    const data = JSON.parse(fs.readFileSync(file, "utf8")) as {
      blocks: Array<{ text?: string }>;
    };
    data.blocks.forEach((block, index) => {
      const text = block.text?.trim();
      if (!text) return;
      rows.push({
        slug: work.slug,
        title: work.title,
        codex: work.codex,
        id: index,
        text,
        folded: fold(text),
      });
    });
  }
  paras = rows;
  return rows;
}

function queryParts(needle: string) {
  const parts = needle.split(/[^\p{L}\p{N}]+/u).filter((part) => part.length >= 2);
  return parts.length > 0 ? parts : [needle];
}

function matchesParts(text: string, parts: string[]) {
  return parts.every((part) => hasQuery(text, part));
}

function rankText(folded: string, parts: string[]) {
  const words = folded.split(/[^\p{L}\p{N}]+/u);
  return parts.reduce((score, part) => score + (words.includes(part) ? 4 : 1), 0);
}

function bookMatches(title: string, abbr: string, parts: string[]) {
  const foldedAbbr = fold(abbr);
  if (foldedAbbr && parts.length === 1 && foldedAbbr === parts[0]) return true;
  if (parts.length === 1 && parts[0].length <= 3) return fold(title).startsWith(parts[0]);
  return matchesParts(title, parts);
}

export function searchCorpus(raw: string): SearchHit[] {
  const query = raw.trim();
  const needle = fold(query);
  if (needle.length < 2) return [];

  const hits: SearchHit[] = [];
  const parts = queryParts(needle);
  const ref = /^(.+?)\s+(\d+)\s*:\s*(\d+)$/.exec(query);
  if (ref) {
    const bookNeedle = queryParts(fold(ref[1]));
    const chapter = Number(ref[2]);
    const n = Number(ref[3]);
    const book = bibleCatalog.find(
      (item) => item.section !== "front" && bookMatches(item.titleLt, item.abbrLt, bookNeedle),
    );
    const verse = book
      ? loadVerses().find((item) => item.slug === book.slug && item.chapter === chapter && item.n === n)
      : undefined;
    if (book && verse) {
      hits.push({
        kind: "verse",
        title: `${verse.title} ${verse.chapter}:${verse.n}`,
        kicker: "Eilutė",
        snippet: verse.text,
        href: `/bible/${verse.slug}/${verse.chapter}#v${verse.n}`,
      });
    }
  }

  for (const book of bibleCatalog) {
    if (book.section === "front") continue;
    if (!bookMatches(book.titleLt, book.abbrLt, parts)) continue;
    hits.push({
      kind: "book",
      title: book.titleLt,
      kicker: "Etiopijos Biblija",
      snippet: "",
      href: `/bible/${book.slug}`,
    });
    if (hits.filter((item) => item.kind === "book").length >= 8) break;
  }

  const textHits: Array<SearchHit & { rank: number }> = [];
  const cover = new Map<string, { found: Set<string>; best: Para | null; bestScore: number }>();
  for (const para of loadParas()) {
    const foundHere = parts.filter((part) => hasQuery(para.folded, part));
    if (!foundHere.length) continue;
    const current = cover.get(para.slug) ?? { found: new Set<string>(), best: null, bestScore: 0 };
    for (const part of foundHere) current.found.add(part);
    if (foundHere.length > current.bestScore) {
      current.best = para;
      current.bestScore = foundHere.length;
    }
    cover.set(para.slug, current);
  }
  for (const work of nhCatalog) {
    const body = cover.get(work.slug);
    const found = new Set(body?.found ?? []);
    for (const part of parts) {
      if (hasQuery(work.title, part) || hasQuery(work.codex, part)) found.add(part);
    }
    if (found.size < parts.length) continue;
    const titleHit = parts.every((part) => hasQuery(work.title, part));
    textHits.push({
      kind: "text",
      title: work.title,
      kicker: work.codex,
      snippet: body?.best ? snippet(body.best.text, query) : "",
      href: body?.best ? `/nh/${work.slug}#p${body.best.id}` : `/nh/${work.slug}`,
      rank: (titleHit ? 6 : 0) + (body?.bestScore ?? 0),
    });
  }
  textHits.sort((a, b) => b.rank - a.rank);
  for (const item of textHits.slice(0, 12)) {
    const { rank: _rank, ...hit } = item;
    hits.push(hit);
  }

  const bookSlugs = new Set(
    bibleCatalog.filter((book) => book.section !== "front" && bookMatches(book.titleLt, book.abbrLt, parts)).map((book) => book.slug),
  );
  const rankedVerses = loadVerses()
    .filter((verse) => matchesParts(verse.folded, parts))
    .map((verse) => ({ verse, rank: rankText(verse.folded, parts) + (bookSlugs.has(verse.slug) ? 3 : 0) }))
    .sort((a, b) => b.rank - a.rank || a.verse.chapter - b.verse.chapter || a.verse.n - b.verse.n);
  const perBook = new Map<string, number>();
  for (const item of rankedVerses) {
    const cap = bookSlugs.has(item.verse.slug) ? 6 : 2;
    const seen = perBook.get(item.verse.slug) ?? 0;
    if (seen >= cap) continue;
    perBook.set(item.verse.slug, seen + 1);
    hits.push({
      kind: "verse",
      title: `${item.verse.title} ${item.verse.chapter}:${item.verse.n}`,
      kicker: "Etiopijos Biblija",
      snippet: item.verse.text,
      href: `/bible/${item.verse.slug}/${item.verse.chapter}#v${item.verse.n}`,
    });
    if ([...perBook.values()].reduce((sum, count) => sum + count, 0) >= 16) break;
  }

  for (const term of glossary) {
    if (!matchesParts(`${term.term} ${term.defLt}`, parts)) continue;
    hits.push({
      kind: "term",
      title: term.term,
      kicker: "Žodynas",
      snippet: term.defLt,
      href: `/glossary#${term.slug}`,
    });
  }

  for (const section of about.lt.sections) {
    const text = section.paragraphs.join(" ");
    if (!matchesParts(`${section.title} ${text}`, parts)) continue;
    hits.push({
      kind: "about",
      title: section.title,
      kicker: "Apie",
      snippet: snippet(text, query, 90),
      href: `/about#${section.id}`,
    });
  }

  const seen = new Set<string>();
  return hits.filter((hit) => {
    if (seen.has(hit.href)) return false;
    seen.add(hit.href);
    return true;
  });
}
