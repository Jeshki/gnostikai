import { codexAnchor, featuredNh, getNhWork, nhByCodex, nhCatalog, nhNeighbors } from "@/lib/nh";
import { readNhBody } from "@/lib/nh-server";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("Nag Hammadi catalog", () => {
  it("has a unique slug for every work", () => {
    const slugs = nhCatalog.map((work) => work.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(slugs.length).toBeGreaterThan(40);
  });

  it("returns null for an unknown work", () => {
    expect(getNhWork("nėra-tokio")).toBeNull();
  });

  it("links the first and last works to one neighbor", () => {
    const first = nhNeighbors(nhCatalog[0].slug);
    const last = nhNeighbors(nhCatalog[nhCatalog.length - 1].slug);
    expect(first.prev).toBeNull();
    expect(first.next?.slug).toBe(nhCatalog[1].slug);
    expect(last.next).toBeNull();
    expect(last.prev?.slug).toBe(nhCatalog[nhCatalog.length - 2].slug);
    expect(nhNeighbors("nėra")).toEqual({ prev: null, next: null });
  });

  it("picks the four featured works", () => {
    const featured = featuredNh();
    expect(featured).toHaveLength(4);
    expect(featured.map((work) => work.slug)).toContain("tomo-evangelija");
  });

  it("builds stable codex anchors", () => {
    expect(codexAnchor("KODEKSAS II")).toBe("kodeksas-ii");
    expect(codexAnchor("")).toBe("codex");
    const anchors = nhByCodex().map((group) => codexAnchor(group.codex));
    expect(new Set(anchors).size).toBe(anchors.length);
    expect(nhByCodex().flatMap((group) => group.works)).toHaveLength(nhCatalog.length);
  });
});

describe("Nag Hammadi files", () => {
  it("stores every work and the search index", () => {
    const search = JSON.parse(
      readFileSync(path.join(process.cwd(), "content", "nag-hammadi", "search.json"), "utf8"),
    ) as Array<{ slug: string; title: string; text: string }>;
    const indexed = new Map(search.map((item) => [item.slug, item]));
    for (const work of nhCatalog) {
      const file = path.join(process.cwd(), "content", "nag-hammadi", "works", `${work.slug}.json`);
      expect(existsSync(file), work.slug).toBe(true);
      const body = readNhBody(work.slug);
      expect(body?.title).toBe(work.title);
      expect(body?.codex).toBe(work.codex);
      expect(body?.blocks.length).toBeGreaterThan(0);
      expect(body?.blocks.every((block) => block.text.trim().length > 0)).toBe(true);
      expect(indexed.get(work.slug)?.text.length).toBeGreaterThan(0);
    }
    expect(readNhBody("../catalog")).toBeNull();
    expect(readNhBody("nėra")).toBeNull();
  });
});
