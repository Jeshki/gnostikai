import { bibleCatalog } from "@/lib/bible";
import { getTerm, glossary } from "@/lib/glossary";
import { nhCatalog } from "@/lib/nh";
import { describe, expect, it } from "vitest";

const bibleSlugs = new Set(bibleCatalog.map((book) => book.slug));
const nhSlugs = new Set(nhCatalog.map((work) => work.slug));

function hrefExists(href: string) {
  if (href.startsWith("/bible/")) {
    const slug = href.split("/")[2];
    return bibleSlugs.has(slug);
  }
  if (href.startsWith("/nh/")) {
    const slug = href.split("/")[2]?.split("#")[0];
    return nhSlugs.has(slug);
  }
  return ["/glossary", "/about", "/library", "/map", "/search"].some((path) => href === path || href.startsWith(`${path}#`));
}

describe("glossary", () => {
  it("has a unique slug, a definition, and real related terms", () => {
    const slugs = glossary.map((term) => term.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const term of glossary) {
      expect(term.term.trim().length).toBeGreaterThan(0);
      expect(term.defLt.trim().length).toBeGreaterThan(0);
      for (const related of term.related) expect(slugs).toContain(related);
      for (const read of term.reads) {
        expect(read.label.trim().length, term.slug).toBeGreaterThan(0);
        expect(hrefExists(read.href), `${term.slug} -> ${read.href}`).toBe(true);
      }
    }
  });

  it("finds a term and misses an unknown one", () => {
    expect(getTerm("sophia")?.term).toBe("Sofija");
    expect(getTerm("nėra")).toBeUndefined();
  });
});
