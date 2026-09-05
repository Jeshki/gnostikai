import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { BodyDoc } from "../lib/bodies";
import { deeplKey, deeplUsage, ensureGlossary, translateTexts } from "../lib/deepl";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const bodiesDir = join(root, "content", "bodies");
const outDir = join(root, "content", "bodies-lt");
const progressPath = join(outDir, "_progress.json");
const glossaryPath = join(root, "content", "deepl-glossary.tsv");

const HUGE = new Set([
  "pistis-sophia",
  "clementine-recognitions",
  "clementine-homilies",
  "against-marcion-4",
  "against-marcion-5",
  "life-of-john",
  "paul-seneca",
  "apocalypse-thomas",
  "vindicta",
  "acts-thomas",
  "nicodemus",
  "acts-peter-paul",
  "epistula-apostolorum",
  "acts-john",
  "tripartite",
]);

const CORE = [
  "thunder",
  "mary",
  "judas",
  "philip",
  "truth",
  "john",
  "archons",
  "origin",
  "adam",
  "soul",
  "norea",
  "protennoia",
  "great-seth",
  "egyptians-sethian",
  "1james",
  "2james",
  "secret-james",
  "dialogue-savior",
  "sophia-jesus",
  "rheginos",
  "valentinus-exposition",
  "prayer-paul",
  "thanksgiving",
  "eighth-ninth",
  "eugnostos",
  "peter-philip",
  "contender",
  "three-steles",
  "authoritative",
  "interpretation-knowledge",
];

const SKIP = new Set(["thomas"]);

type Progress = {
  glossaryId?: string;
  billed: number;
  files: Record<
    string,
    {
      hash: string;
      billed: number;
      at: string;
      sections: number;
    }
  >;
};

type LtDoc = {
  slug: string;
  engine: "deepl";
  target: "LT";
  hash: string;
  at: string;
  billed: number;
  sections: Array<{ headingLt?: string; bodyLt: string }>;
};

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

function arg(name: string) {
  const hit = process.argv.find((item) => item.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : undefined;
}

function hasFlag(name: string) {
  return process.argv.includes(`--${name}`);
}

function hashDoc(doc: BodyDoc) {
  return createHash("sha1")
    .update(doc.sections.map((item) => `${item.heading ?? ""}\n${item.body}`).join("\n---\n"))
    .digest("hex");
}

function loadProgress(): Progress {
  if (!existsSync(progressPath)) return { billed: 0, files: {} };
  return JSON.parse(readFileSync(progressPath, "utf8")) as Progress;
}

function saveProgress(progress: Progress) {
  mkdirSync(outDir, { recursive: true });
  writeFileSync(progressPath, `${JSON.stringify(progress, null, 2)}\n`);
}

function listSlugs() {
  return (JSON.parse(readFileSync(join(bodiesDir, "_manifest.json"), "utf8")) as Array<{ slug: string; chars: number }>)
    .filter((item) => !SKIP.has(item.slug) && existsSync(join(bodiesDir, `${item.slug}.json`)))
    .sort((a, b) => a.chars - b.chars);
}

function chunkText(text: string, max = 3500) {
  if (text.length <= max) return [text];
  const parts: string[] = [];
  const blocks = text.split(/(\n\s*\n)/);
  let current = "";
  for (const block of blocks) {
    if (current.length + block.length > max && current) {
      parts.push(current);
      current = block;
    } else {
      current += block;
    }
  }
  if (current) parts.push(current);
  return parts.flatMap((part) => {
    if (part.length <= max) return [part];
    const slices: string[] = [];
    for (let i = 0; i < part.length; i += max) slices.push(part.slice(i, i + max));
    return slices;
  });
}

async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

function packBatches(texts: string[], maxChars = 70000, maxItems = 20) {
  const batches: string[][] = [];
  let current: string[] = [];
  let size = 0;
  for (const text of texts) {
    if (current.length && (current.length >= maxItems || size + text.length > maxChars)) {
      batches.push(current);
      current = [];
      size = 0;
    }
    if (text.length > maxChars) {
      if (current.length) batches.push(current);
      current = [];
      size = 0;
      for (const piece of chunkText(text, 3000)) {
        batches.push([piece]);
      }
      continue;
    }
    current.push(text);
    size += text.length;
  }
  if (current.length) batches.push(current);
  return batches;
}

async function translateWithRetry(texts: string[], glossaryId?: string) {
  for (let attempt = 0; attempt < 6; attempt += 1) {
    try {
      return await translateTexts(texts, { glossaryId });
    } catch (error) {
      const wait = (error as { retryAfter?: number }).retryAfter;
      if (wait) {
        console.warn(`  rate limit, ${wait}s`);
        await sleep((wait + 1) * 1000);
        continue;
      }
      throw error;
    }
  }
  throw new Error("DeepL per daug 429.");
}

async function translateDoc(doc: BodyDoc, glossaryId?: string) {
  const headings = doc.sections.map((item) => item.heading ?? "");
  const headingMap = new Map<number, string>();
  const headingBatch: string[] = [];
  headings.forEach((heading, index) => {
    if (heading.trim()) {
      headingMap.set(headingBatch.length, String(index));
      headingBatch.push(heading);
    }
  });

  const headingLt = headings.map(() => "");
  if (headingBatch.length) {
    const translated = [];
    for (const batch of packBatches(headingBatch)) {
      translated.push(...(await translateWithRetry(batch, glossaryId)));
    }
    translated.forEach((item, index) => {
      const sectionIndex = Number(headingMap.get(index));
      headingLt[sectionIndex] = item.text;
    });
  }

  const sections: LtDoc["sections"] = [];
  let billed = headingBatch.join("").length;
  for (const [index, section] of doc.sections.entries()) {
    const chunks = chunkText(section.body);
    const translated = [];
    for (const batch of packBatches(chunks)) {
      translated.push(...(await translateWithRetry(batch, glossaryId)));
    }
    const bodyLt = translated.map((item) => item.text).join("");
    billed += translated.reduce((sum, item) => sum + item.billedCharacters, 0);
    sections.push({
      headingLt: headingLt[index] || undefined,
      bodyLt,
    });
    process.stdout.write(`  ${index + 1}/${doc.sections.length}\r`);
  }
  return { sections, billed };
}

async function main() {
  loadEnv();
  mkdirSync(outDir, { recursive: true });
  const progress = loadProgress();
  const only = arg("slug");
  const limit = Number(arg("limit") ?? 0);
  const coreOnly = hasFlag("core");
  const includeHuge = hasFlag("huge");
  const dry = hasFlag("dry-run") || hasFlag("status");

  let catalog = listSlugs();
  if (only) catalog = catalog.filter((item) => item.slug === only);
  else if (coreOnly) catalog = catalog.filter((item) => CORE.includes(item.slug));
  else if (!includeHuge) catalog = catalog.filter((item) => !HUGE.has(item.slug));

  const pending = catalog.filter((item) => {
    const doc = JSON.parse(readFileSync(join(bodiesDir, `${item.slug}.json`), "utf8")) as BodyDoc;
    const done = progress.files[item.slug];
    return !done || done.hash !== hashDoc(doc);
  });
  const pendingChars = pending.reduce((sum, item) => sum + item.chars, 0);

  console.log(
    `${catalog.length} tekstų šiame filtre · ${pending.length} neversta · ~${pendingChars} simb.`,
  );

  if (!deeplKey()) {
    console.log("\nNėra DEEPL_API_KEY.");
    console.log("1. https://www.deepl.com/your-account/keys");
    console.log("2. Įrašyk į aeon/.env.local:  DEEPL_API_KEY=... ");
    console.log("3. Free raktas baigiasi :fx  (500 000 simb./mėn.)");
    console.log("4. npm run translate:core     — branduolys (~450k)");
    console.log("   npm run translate -- --limit=450000");
    console.log("   npm run translate -- --slug=thunder");
    console.log("Korpusas viso ~7.3 mln. simb. Be --huge praleidžiami milžinai.");
    process.exit(dry ? 0 : 1);
  }

  const usage = await deeplUsage();
  const left = Math.max(0, usage.character_limit - usage.character_count);
  console.log(`DeepL kvota: ${usage.character_count} / ${usage.character_limit} · liko ${left}`);

  if (dry) return;

  if (!progress.glossaryId) {
    try {
      progress.glossaryId = await ensureGlossary(deeplKey(), readFileSync(glossaryPath, "utf8"));
      saveProgress(progress);
      console.log(`Žodynas ${progress.glossaryId}`);
    } catch (error) {
      console.warn("Žodynas neprisijungė, verčiu be jo:", (error as Error).message);
    }
  }

  let spent = 0;
  for (const item of pending) {
    if (limit && spent >= limit) {
      console.log(`Sustojau prie --limit=${limit}`);
      break;
    }
    if (item.chars > left - spent) {
      console.log(`Neužtenka kvotos ${item.slug} (${item.chars}).`);
      break;
    }
    const doc = JSON.parse(readFileSync(join(bodiesDir, `${item.slug}.json`), "utf8")) as BodyDoc;
    const digest = hashDoc(doc);
    console.log(`\n→ ${item.slug}  ${item.chars}`);
    let result: { sections: LtDoc["sections"]; billed: number };
    try {
      result = await translateDoc(doc, progress.glossaryId);
    } catch (error) {
      console.error(`  klaida ${item.slug}:`, (error as Error).message);
      continue;
    }
    const lt: LtDoc = {
      slug: item.slug,
      engine: "deepl",
      target: "LT",
      hash: digest,
      at: new Date().toISOString(),
      billed: result.billed,
      sections: result.sections,
    };
    writeFileSync(join(outDir, `${item.slug}.json`), `${JSON.stringify(lt)}\n`);
    progress.files[item.slug] = {
      hash: digest,
      billed: result.billed,
      at: lt.at,
      sections: result.sections.length,
    };
    progress.billed += result.billed;
    spent += result.billed;
    saveProgress(progress);
    console.log(`  ok  +${result.billed}`);
    await sleep(300);
  }

  console.log(`\nŠis paleidimas: ${spent} simb. Iš viso faile: ${progress.billed}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
