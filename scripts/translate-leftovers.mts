import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { corpus } from "../lib/corpus";
import { deeplKey, translateTexts } from "../lib/deepl";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fieldsPath = join(root, "content", "fields-lt.json");
const metaPath = join(root, "content", "meta-lt.json");

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

const english = /\b(the|of|and|gospel|book|letter|acts|apocalypse|treatise|secret|unknown|infancy|sayings|fragment|against|lost|history|questions|preaching|excerpts|traditions|discourse|concept|paraphrase|shepherd|codex|public|domain|dedication|from|greek|coptic|latin|syriac|arabic|manuscript|tradition|upper|egypt|published|acquired|flyleaf|recensions|papyrus|revelation|second|first|third|fourth|fifth)\b/i;

function needsLt(en: string, lt?: string) {
  if (!en.trim()) return false;
  if (!lt || lt === en) return english.test(en);
  return false;
}

async function translateMap(pending: string[], context: string) {
  const out = new Map<string, string>();
  for (let i = 0; i < pending.length; i += 40) {
    const batch = pending.slice(i, i + 40);
    const translated = await translateTexts(batch, { context });
    translated.forEach((item, index) => out.set(batch[index], item.text));
    console.log(`  ${Math.min(i + batch.length, pending.length)}/${pending.length}`);
  }
  return out;
}

async function main() {
  loadEnv();
  if (!deeplKey()) throw new Error("Nėra DEEPL_API_KEY");

  const fields = existsSync(fieldsPath)
    ? (JSON.parse(readFileSync(fieldsPath, "utf8")) as Record<string, string>)
    : {};
  const meta = existsSync(metaPath)
    ? (JSON.parse(readFileSync(metaPath, "utf8")) as Record<
        string,
        { titleLt?: string; introLt?: string; chapters?: Record<string, string> }
      >)
    : {};

  const fieldKeys = [
    ...new Set(
      corpus.flatMap((item) => [
        item.provenance,
        item.discovery,
        item.originalLanguage,
        item.dateApprox,
        item.codex,
        item.license,
      ]),
    ),
  ].filter((value): value is string => Boolean(value));

  const fieldPending = fieldKeys.filter((key) => needsLt(key, fields[key]));
  console.log("Laukai / kodeksai:", fieldPending.length);
  if (fieldPending.length) {
    const translated = await translateMap(
      fieldPending,
      "Short scholarly catalogue labels: provenance, language, date, codex, license. Keep NHC, P.Oxy., ANF, names.",
    );
    for (const [en, lt] of translated) fields[en] = lt;
    writeFileSync(fieldsPath, `${JSON.stringify(fields, null, 2)}\n`);
  }

  const titlePending = corpus
    .filter((item) => needsLt(item.titleEn, meta[item.slug]?.titleLt ?? item.titleLt))
    .map((item) => item.titleEn);
  const uniqueTitles = [...new Set(titlePending)];
  console.log("Pavadinimai:", uniqueTitles.length);
  if (uniqueTitles.length) {
    const translated = await translateMap(
      uniqueTitles,
      "Scholarly titles of Gnostic and apocryphal texts. Keep proper names.",
    );
    for (const item of corpus) {
      const lt = translated.get(item.titleEn);
      if (!lt) continue;
      meta[item.slug] = { ...meta[item.slug], titleLt: lt };
    }
    writeFileSync(metaPath, `${JSON.stringify(meta, null, 2)}\n`);
  }

  const chapterPending: string[] = [];
  for (const item of corpus) {
    for (const chapter of item.chapters) {
      const saved = meta[item.slug]?.chapters?.[chapter.id];
      if (needsLt(chapter.titleEn, saved ?? chapter.titleLt)) chapterPending.push(chapter.titleEn);
    }
  }
  const uniqueChapters = [...new Set(chapterPending)];
  console.log("Skyriai:", uniqueChapters.length);
  if (uniqueChapters.length) {
    const translated = await translateMap(
      uniqueChapters,
      "Short chapter titles for a scholarly digital library. Keep proper names.",
    );
    for (const item of corpus) {
      const chapters = { ...(meta[item.slug]?.chapters ?? {}) };
      for (const chapter of item.chapters) {
        const lt = translated.get(chapter.titleEn);
        if (lt) chapters[chapter.id] = lt;
      }
      meta[item.slug] = { ...meta[item.slug], chapters };
    }
    writeFileSync(metaPath, `${JSON.stringify(meta, null, 2)}\n`);
  }

  const bodiesLt = join(root, "content", "bodies-lt");
  const bodies = join(root, "content", "bodies");
  const headingPending: string[] = [];
  const headingFiles: Array<{ slug: string; index: number; heading: string }> = [];
  if (existsSync(bodiesLt)) {
    for (const name of readdirSync(bodiesLt).filter((file) => file.endsWith(".json") && !file.startsWith("_"))) {
      const slug = name.replace(/\.json$/, "");
      const enFile = join(bodies, name);
      const ltFile = join(bodiesLt, name);
      if (!existsSync(enFile)) continue;
      const enDoc = JSON.parse(readFileSync(enFile, "utf8")) as {
        sections: Array<{ heading?: string }>;
      };
      const ltDoc = JSON.parse(readFileSync(ltFile, "utf8")) as {
        sections: Array<{ headingLt?: string; bodyLt?: string }>;
      };
      enDoc.sections.forEach((section, index) => {
        const heading = section.heading?.trim();
        const headingLt = ltDoc.sections[index]?.headingLt?.trim();
        if (heading && needsLt(heading, headingLt)) {
          headingPending.push(heading);
          headingFiles.push({ slug, index, heading });
        }
      });
    }
  }
  const uniqueHeadings = [...new Set(headingPending)];
  console.log("Kūnų antraštės:", uniqueHeadings.length);
  if (uniqueHeadings.length) {
    const translated = await translateMap(
      uniqueHeadings,
      "Section headings of early Christian / Gnostic texts. Keep names.",
    );
    const bySlug = new Map<string, number[]>();
    for (const item of headingFiles) {
      const list = bySlug.get(item.slug) ?? [];
      list.push(item.index);
      bySlug.set(item.slug, list);
    }
    for (const [slug, indexes] of bySlug) {
      const ltFile = join(bodiesLt, `${slug}.json`);
      const ltDoc = JSON.parse(readFileSync(ltFile, "utf8")) as {
        sections: Array<{ headingLt?: string; bodyLt?: string }>;
      };
      for (const index of indexes) {
        const heading = headingFiles.find((item) => item.slug === slug && item.index === index)?.heading;
        if (!heading) continue;
        const lt = translated.get(heading);
        if (lt) ltDoc.sections[index] = { ...ltDoc.sections[index], headingLt: lt };
      }
      writeFileSync(ltFile, JSON.stringify(ltDoc));
    }
  }

  console.log("Baigta.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
