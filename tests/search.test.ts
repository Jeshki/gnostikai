import { searchCorpus } from "@/lib/search-server";
import { describe, expect, it } from "vitest";

function titles(query: string, kind?: string) {
  return searchCorpus(query)
    .filter((hit) => !kind || hit.kind === kind)
    .map((hit) => hit.title);
}

describe("search", () => {
  it("ignores an empty or one-letter query", () => {
    expect(searchCorpus("")).toEqual([]);
    expect(searchCorpus(" ")).toEqual([]);
    expect(searchCorpus("a")).toEqual([]);
  });

  it("finds Thomas without matching words that only contain those letters", () => {
    const hits = searchCorpus("Tomas");
    expect(titles("Tomas", "text").some((title) => title.includes("Tomo evangelija"))).toBe(true);
    expect(hits.some((hit) => /nematomas|tomis|matomų/i.test(`${hit.title} ${hit.snippet}`))).toBe(false);
  });

  it("puts the Wisdom of Jesus Christ first for Sofija", () => {
    const texts = titles("Sofija", "text");
    expect(texts[0]).toMatch(/Sofija/);
    expect(titles("Sofija", "term")).toContain("Sofija");
    expect(titles("Sofija").some((title) => title.includes("Sofonij"))).toBe(false);
  });

  it("opens the exact verse for a citation", () => {
    const hits = searchCorpus("Pradžios 1:1");
    const verse = hits.find((hit) => hit.kicker === "Eilutė");
    expect(verse?.href).toBe("/bible/genesis/1#v1");
    expect(verse?.snippet).toMatch(/Pradžioje/);
    expect(hits.some((hit) => hit.kind === "book" && hit.href === "/bible/genesis")).toBe(true);
  });

  it("requires every word of a two-word query", () => {
    const hits = searchCorpus("Tomas Sofija");
    expect(hits.filter((hit) => hit.kind === "text")).toHaveLength(1);
    expect(hits[0]?.title).toMatch(/Sofija/);
    expect(hits[0]?.href.startsWith("/nh/")).toBe(true);
  });

  it("finds Enoch in the books, the verses, the glossary, and the about page", () => {
    const hits = searchCorpus("Henochas");
    expect(titles("Henochas", "book")).toEqual(expect.arrayContaining(["Henochas"]));
    expect(hits.some((hit) => hit.kind === "verse")).toBe(true);
    expect(hits.some((hit) => hit.kind === "term" && hit.href === "/glossary#henoch")).toBe(true);
    expect(hits.some((hit) => hit.kind === "about")).toBe(true);
  });

  it("returns nothing for a word that is not in the library", () => {
    expect(searchCorpus("xyzzyqq")).toEqual([]);
  });

  it("does not repeat the same link", () => {
    const hrefs = searchCorpus("Pradžia").map((hit) => hit.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });
});
