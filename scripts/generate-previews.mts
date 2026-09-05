import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { thomas } from "../lib/content";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const bodies = join(root, "content", "bodies");
const bodiesLt = join(root, "content", "bodies-lt");

function clip(text: string) {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > 900 ? `${clean.slice(0, 900).trim()}…` : clean;
}

const previews: Record<string, { en: string; lt: string }> = {
  thomas: { en: clip(thomas.prologue), lt: clip(thomas.prologueLt) },
};

for (const file of readdirSync(bodies)) {
  if (!file.endsWith(".json") || file.startsWith("_")) continue;
  const slug = file.replace(/\.json$/, "");
  const en = JSON.parse(readFileSync(join(bodies, file), "utf8")) as {
    sections: Array<{ body?: string }>;
  };
  const ltPath = join(bodiesLt, file);
  const lt = existsSync(ltPath)
    ? (JSON.parse(readFileSync(ltPath, "utf8")) as { sections: Array<{ bodyLt?: string }> })
    : null;
  previews[slug] = {
    en: clip(en.sections[0]?.body ?? ""),
    lt: clip(lt?.sections[0]?.bodyLt ?? en.sections[0]?.body ?? ""),
  };
}

writeFileSync(join(root, "content", "previews.json"), `${JSON.stringify(previews)}\n`);
console.log(`previews ${Object.keys(previews).length}`);
