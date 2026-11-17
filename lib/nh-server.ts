import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { NhBlock } from "@/lib/nh";

export type NhDocument = {
  slug: string;
  title: string;
  codex: string;
  blocks: NhBlock[];
};

export function readNhBody(slug: string): NhDocument | null {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  try {
    const raw = readFileSync(join(process.cwd(), "content", "nag-hammadi", "works", `${slug}.json`), "utf8");
    return JSON.parse(raw) as NhDocument;
  } catch {
    return null;
  }
}
