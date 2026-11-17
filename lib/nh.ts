import catalogJson from "@/content/nag-hammadi/catalog.json";
import { fold } from "@/lib/fold";

export type NhMeta = {
  slug: string;
  title: string;
  codex: string;
  order: number;
  chars: number;
};

export type NhBlock = {
  t: "h2" | "h3" | "p";
  text: string;
};

export const nhCatalog = catalogJson as NhMeta[];

export function getNhWork(slug: string) {
  return nhCatalog.find((item) => item.slug === slug) ?? null;
}

export function nhNeighbors(slug: string) {
  const index = nhCatalog.findIndex((item) => item.slug === slug);
  if (index < 0) return { prev: null, next: null };
  return {
    prev: index > 0 ? nhCatalog[index - 1] : null,
    next: index + 1 < nhCatalog.length ? nhCatalog[index + 1] : null,
  };
}

const featuredNeedles = ["tomo evangelija", "pilypo evangelija", "perkūnas", "marija"];

export function featuredNh() {
  return featuredNeedles
    .map((needle) => {
      const hits = nhCatalog.filter((item) => item.title.toLowerCase().includes(needle));
      return hits.sort((a, b) => b.chars - a.chars)[0];
    })
    .filter((item): item is NhMeta => Boolean(item));
}

export function codexAnchor(codex: string) {
  return fold(codex).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "codex";
}

export function nhByCodex() {
  const groups: { codex: string; works: NhMeta[] }[] = [];
  for (const work of nhCatalog) {
    const last = groups[groups.length - 1];
    if (!last || last.codex !== work.codex) groups.push({ codex: work.codex, works: [work] });
    else last.works.push(work);
  }
  return groups;
}
