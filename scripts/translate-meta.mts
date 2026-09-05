import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { corpus } from "../lib/corpus";
import { deeplKey, translateTexts } from "../lib/deepl";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outPath = join(root, "content", "meta-lt.json");

function loadEnv() {
  for (const name of [".env.local", ".env"]) {
    const file = join(root, name);
    if (!existsSync(file)) continue;
    for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
      const match = line.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/);
      if (!match || process.env[match[1]]) continue;
      process.env[match[1]] = match[2].replace(/^["']|["']$/g, "").trim();
    }
  }
}

function pack(texts: string[], max = 40) {
  const batches: string[][] = [];
  for (let i = 0; i < texts.length; i += max) batches.push(texts.slice(i, i + max));
  return batches;
}

async function main() {
  loadEnv();
  if (!deeplKey()) {
    console.error("Nėra DEEPL_API_KEY");
    process.exit(1);
  }

  const existing = existsSync(outPath)
    ? (JSON.parse(readFileSync(outPath, "utf8")) as Record<
        string,
        { introLt?: string; chapters?: Record<string, string> }
      >)
    : {};

  const unique = new Map<string, string>();
  for (const text of corpus) {
    const saved = existing[text.slug];
    if ((!saved?.introLt || saved.introLt === text.introEn) && text.introEn.trim()) {
      unique.set(text.introEn, "");
    }
    for (const chapter of text.chapters) {
      if (chapter.titleLt && chapter.titleLt !== chapter.titleEn) continue;
      if (saved?.chapters?.[chapter.id] && saved.chapters[chapter.id] !== chapter.titleEn) continue;
      if (chapter.titleEn.trim()) unique.set(chapter.titleEn, "");
    }
  }

  const pending = [...unique.keys()].filter((key) => {
    if (key === "Full text") {
      unique.set(key, "Visas tekstas");
      return false;
    }
    if (key === "Opening") {
      unique.set(key, "Pradžia");
      return false;
    }
    return true;
  });

  console.log(`Verčiu ${pending.length} unikalių eilučių`);
  for (const batch of pack(pending)) {
    const translated = await translateTexts(batch, {
      context: "Short scholarly titles and blurbs for a Gnostic / apocryphal digital library. Keep proper names.",
    });
    translated.forEach((item, index) => unique.set(batch[index], item.text));
    process.stdout.write(`  ${translated.length}\n`);
  }

  const next: typeof existing = { ...existing };
  for (const text of corpus) {
    const chapters: Record<string, string> = { ...(next[text.slug]?.chapters ?? {}) };
    for (const chapter of text.chapters) {
      chapters[chapter.id] =
        (chapter.titleLt && chapter.titleLt !== chapter.titleEn
          ? chapter.titleLt
          : unique.get(chapter.titleEn)) ?? chapter.titleEn;
    }
    next[text.slug] = {
      introLt:
        (text.introLt && text.introLt !== text.introEn ? text.introLt : unique.get(text.introEn)) ??
        text.introEn,
      chapters,
    };
  }

  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, `${JSON.stringify(next, null, 2)}\n`);
  console.log(`Įrašyta ${Object.keys(next).length} tekstų → content/meta-lt.json`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
