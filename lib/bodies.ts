import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { BodySection } from "./types";

export type { BodySection };

export type BodyDoc = {
  slug: string;
  title: string;
  translator: string;
  source: string;
  license: string;
  chars: number;
  sections: BodySection[];
};

type LtOverlay = {
  sections: Array<{ headingLt?: string; bodyLt?: string }>;
};

export function getFullBody(slug: string): BodyDoc | null {
  const file = join(process.cwd(), "content", "bodies", `${slug}.json`);
  if (!existsSync(file)) return null;
  const doc = JSON.parse(readFileSync(file, "utf8")) as BodyDoc;
  const ltFile = join(process.cwd(), "content", "bodies-lt", `${slug}.json`);
  if (!existsSync(ltFile)) return doc;
  const lt = JSON.parse(readFileSync(ltFile, "utf8")) as LtOverlay;
  return {
    ...doc,
    sections: doc.sections.map((section, index) => ({
      ...section,
      headingLt: lt.sections[index]?.headingLt,
      bodyLt: lt.sections[index]?.bodyLt,
    })),
  };
}

export function getBodyChapter(doc: BodyDoc, chapterId: string): BodyDoc {
  const index = Number(chapterId) - 1;
  if (Number.isNaN(index) || index < 0 || index >= doc.sections.length) return doc;
  return { ...doc, sections: [doc.sections[index]] };
}
