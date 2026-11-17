import { bibleCatalog } from "@/lib/bible";
import { nhCatalog } from "@/lib/nh";
import { describe, expect, it } from "vitest";

const base = process.env.TEST_BASE_URL ?? "http://localhost:3456";

async function page(path: string, redirect: RequestRedirect = "follow") {
  const response = await fetch(new URL(path, base), { redirect });
  const text = await response.text();
  return { response, text };
}

describe("pages", () => {
  it("serves the public pages", async () => {
    const paths = ["/", "/bible", "/library", "/glossary", "/map", "/about", "/compare", "/search", "/saved", "/privacy"];
    for (const path of paths) {
      const { response, text } = await page(path);
      expect(response.status, path).toBe(200);
      expect(text, path).toContain("AEON");
    }
  });

  it("opens a real Bible book and chapter, and misses an unknown one", async () => {
    const book = await page("/bible/genesis");
    expect(book.response.status).toBe(200);
    expect(book.text).toContain("Pradžios");
    const chapter = await page("/bible/genesis/1");
    expect(chapter.response.status).toBe(200);
    expect(chapter.text).toContain("Pradžioje");
    for (const path of ["/bible/nėra", "/bible/genesis/9999", "/bible/genesis/abc"]) {
      const missing = await page(path);
      expect(missing.text, path).toContain("Šioje tyloje nieko nėra.");
    }
  });

  it("opens a real tractate and misses an unknown one", async () => {
    const work = await page("/nh/tomo-evangelija");
    expect(work.response.status).toBe(200);
    expect(work.text).toContain("Tomo evangelija");
    expect(work.text).toContain("Išsaugoti");
    const missing = await page("/nh/nėra");
    expect(missing.text).toContain("Šioje tyloje nieko nėra.");
  });

  it("sends the retired routes to the library", async () => {
    for (const path of ["/timeline", "/text/thomas", "/text/thomas/1"]) {
      const { response, text } = await page(path, "manual");
      const location = response.headers.get("location") ?? "";
      const moved = response.status >= 300 && response.status < 400 && location.includes("/library");
      const rendered = text.includes("NEXT_REDIRECT") && text.includes("/library");
      expect(moved || rendered, path).toBe(true);
    }
  });

  it("answers search queries", async () => {
    const empty = await page("/api/search?q=");
    expect(empty.response.status).toBe(200);
    expect(JSON.parse(empty.text).hits).toEqual([]);
    const short = await page("/api/search?q=a");
    expect(JSON.parse(short.text).hits).toEqual([]);
    const verse = JSON.parse((await page("/api/search?q=Prad%C5%BEios%201:1")).text) as {
      hits: Array<{ kicker: string; href: string; snippet: string }>;
    };
    expect(verse.hits.some((hit) => hit.kicker === "Eilutė" && hit.href === "/bible/genesis/1#v1")).toBe(true);
    const both = JSON.parse((await page("/api/search?q=Tomas%20Sofija")).text) as {
      hits: Array<{ kind: string; title: string }>;
    };
    expect(both.hits.filter((hit) => hit.kind === "text")).toHaveLength(1);
    const missing = JSON.parse((await page("/api/search")).text) as { hits: unknown[] };
    expect(missing.hits).toEqual([]);
  });

  it("lists the books and tractates in the sitemap", async () => {
    const { response, text } = await page("/sitemap.xml");
    expect(response.status).toBe(200);
    expect(text).toContain("/bible/genesis");
    expect(text).toContain(`/nh/${nhCatalog[0].slug}`);
    expect(text).toContain(`/bible/${bibleCatalog[0].slug}`);
    expect(text).not.toContain("/timeline");
  });
});
