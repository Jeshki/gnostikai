import {
  adjacentReading,
  bibleCatalog,
  bibleTitle,
  chapterCountKey,
  chapterName,
  getBibleBook,
  readingChapters,
} from "@/lib/bible";
import { readBibleChapter } from "@/lib/bible-server";
import { describe, expect, it } from "vitest";

describe("bible catalog", () => {
  it("has a unique slug for every book", () => {
    const slugs = bibleCatalog.map((book) => book.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(slugs.length).toBeGreaterThan(80);
  });

  it("gives every book a Lithuanian title and at least one chapter", () => {
    for (const book of bibleCatalog) {
      expect(book.titleLt.trim().length).toBeGreaterThan(0);
      expect(book.abbrLt.trim().length).toBeGreaterThan(0);
      expect(book.chapters.length).toBeGreaterThan(0);
      expect(new Set(book.chapters).size).toBe(book.chapters.length);
    }
  });

  it("returns null for an unknown book", () => {
    expect(getBibleBook("nėra-tokios")).toBeNull();
  });
});

describe("chapter names", () => {
  it("uses Lithuanian plural rules", () => {
    expect(chapterCountKey(1)).toBe("chapterOne");
    expect(chapterCountKey(21)).toBe("chapterOne");
    expect(chapterCountKey(2)).toBe("chapterFew");
    expect(chapterCountKey(9)).toBe("chapterFew");
    expect(chapterCountKey(11)).toBe("chapterMany");
    expect(chapterCountKey(0)).toBe("chapterMany");
  });

  it("names the opening and a numbered chapter", () => {
    expect(chapterName(0)).toBe("Įžanga");
    expect(chapterName(1)).toBe("1 skyrius");
  });
});

describe("reading order", () => {
  it("steps to the next chapter inside a book", () => {
    const genesis = getBibleBook("genesis");
    expect(genesis).not.toBeNull();
    const next = adjacentReading("genesis", genesis!.chapters[0], 1);
    expect(next?.slug).toBe("genesis");
    expect(next?.chapter).toBe(genesis!.chapters[1]);
  });

  it("steps into the following book after the last chapter", () => {
    const genesis = getBibleBook("genesis")!;
    const last = genesis.chapters[genesis.chapters.length - 1];
    const next = adjacentReading("genesis", last, 1);
    expect(next).not.toBeNull();
    expect(next?.slug).not.toBe("genesis");
  });

  it("stops before the first chapter of the first book", () => {
    const first = bibleCatalog[0];
    expect(adjacentReading(first.slug, first.chapters[0], -1)).toBeNull();
  });

  it("stops after the last chapter of the last book", () => {
    const last = bibleCatalog[bibleCatalog.length - 1];
    const chapter = last.chapters[last.chapters.length - 1];
    expect(adjacentReading(last.slug, chapter, 1)).toBeNull();
  });

  it("returns null for a missing book or chapter", () => {
    expect(adjacentReading("nėra", 1, 1)).toBeNull();
    expect(adjacentReading("genesis", 9999, 1)).toBeNull();
  });
});

describe("bible files", () => {
  it("opens every catalog chapter and keeps the Lithuanian verse text", () => {
    let verses = 0;
    let empty = 0;
    for (const book of bibleCatalog) {
      expect(bibleTitle(book)).toBe(book.titleLt);
      expect(readingChapters(book).every((chapter) => chapter > 0)).toBe(true);
      for (const chapter of book.chapters) {
        const data = readBibleChapter(book.slug, chapter);
        expect(data, `${book.slug} ${chapter}`).not.toBeNull();
        const numbers = data!.blocks.filter((block) => block.t === "v").map((block) => block.n);
        expect(new Set(numbers).size, `${book.slug} ${chapter}`).toBe(numbers.length);
        for (const block of data!.blocks) {
          if (block.t !== "v") continue;
          verses += 1;
          if (!block.lt?.trim()) empty += 1;
        }
      }
    }
    expect(verses).toBeGreaterThan(30_000);
    expect(empty).toBe(0);
    expect(readBibleChapter("genesis", 9999)).toBeNull();
    expect(readBibleChapter("nėra", 1)).toBeNull();
  });
});
