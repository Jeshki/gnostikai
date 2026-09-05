import thomasJson from "@/content/thomas.json";
import thomasLt from "@/content/thomas-lt.json";
import { excerpts } from "@/content/excerpts";
import { corpus, getText } from "./corpus";

export type Saying = {
  n: number;
  title: string;
  titleLt: string;
  en: string;
  lt: string;
};

const ltByN = new Map(
  (thomasLt.sayings as Array<{ n: number; title: string; lt: string }>).map((item) => [
    item.n,
    item,
  ]),
);

export const thomas = {
  prologue: thomasJson.prologue,
  prologueLt: thomasLt.prologue,
  translator: thomasJson.translator,
  source: thomasJson.source,
  license: thomasJson.license,
  sayings: thomasJson.sayings.map((saying) => {
    const lt = ltByN.get(saying.n);
    return {
      n: saying.n,
      title: saying.title,
      titleLt: lt?.title ?? saying.title,
      en: saying.en,
      lt: lt?.lt ?? saying.en,
    };
  }),
};

export function getSaying(n: number) {
  return thomas.sayings.find((s) => s.n === n);
}

export function getBody(slug: string) {
  return excerpts[slug] ?? null;
}

export function nextInCodex(slug: string) {
  const current = getText(slug);
  if (!current) return null;
  const same = corpus.filter((item) => item.collection === current.collection);
  const idx = same.findIndex((item) => item.slug === slug);
  return same[idx + 1] ?? same[0] ?? null;
}
