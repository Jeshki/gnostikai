import { existsSync, mkdirSync, readFileSync, renameSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { googleTranslateKey, googleTranslateNmt } from "../lib/google-translate.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const queuePath = join(root, "Biblija", "etiopijos-src", "queue.json");
const outDir = join(root, "Biblija", "etiopijos-lt");
const progressPath = join(outDir, "_progress.json");

type Unit = { id: string; kind: string; text: string; skip?: boolean };
type Book = {
  slug: string;
  titleLt: string;
  titleEn: string;
  context: string;
  chars: number;
  units: Unit[];
};
type DoneUnit = { id: string; kind: string; lt: string; engine?: string };
type BookOut = {
  slug: string;
  titleLt: string;
  titleEn: string;
  engine: string;
  at: string;
  billed: number;
  complete: boolean;
  units: DoneUnit[];
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

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function markerCount(text: string) {
  return [...text.matchAll(/⟦\s*\d+\s*⟧/g)].length;
}

function decodeHtml(text: string) {
  return text
    .replace(/&#(\d+);/g, (_, n: string) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n: string) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function protect(text: string) {
  const escaped = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return escaped.replace(/⟦\s*(\d+)\s*⟧/g, '<span translate="no">⟦$1⟧</span>');
}

function unprotect(html: string) {
  const text = decodeHtml(html).replace(/<span\b[^>]*>(\s*⟦\s*\d+\s*⟧\s*)<\/span>/gi, "$1");
  return text.replace(/<\/?span\b[^>]*>/gi, "");
}

function restore(text: string) {
  return text.replace(/⟦\s*(\d+)\s*⟧\s*/g, (_, n: string) => `${n}\u00a0`).trim();
}

function loadBook(slug: string): BookOut | null {
  const file = join(outDir, `${slug}.json`);
  if (!existsSync(file)) return null;
  return JSON.parse(readFileSync(file, "utf8")) as BookOut;
}

function saveBook(book: BookOut) {
  const file = join(outDir, `${book.slug}.json`);
  const tmp = `${file}.tmp`;
  writeFileSync(tmp, JSON.stringify(book));
  if (existsSync(file)) unlinkSync(file);
  renameSync(tmp, file);
}

function saveProgress(data: unknown) {
  writeFileSync(progressPath, JSON.stringify(data, null, 2));
}

function pack(units: Unit[], maxChars = 5000, maxItems = 8) {
  const batches: Unit[][] = [];
  let current: Unit[] = [];
  let size = 0;
  for (const unit of units) {
    const length = protect(unit.text).length;
    if (current.length && (current.length >= maxItems || size + length > maxChars)) {
      batches.push(current);
      current = [];
      size = 0;
    }
    current.push(unit);
    size += length;
  }
  if (current.length) batches.push(current);
  return batches;
}

async function translateBatch(texts: string[], key: string) {
  for (let attempt = 0; attempt < 6; attempt += 1) {
    try {
      return await googleTranslateNmt(texts, key);
    } catch (error) {
      const retryAfter = (error as { retryAfter?: number }).retryAfter;
      if (retryAfter) {
        console.log(`  429 ${retryAfter}s`);
        await sleep((retryAfter + 1) * 1000);
        continue;
      }
      if (attempt === 5) throw error;
      console.log(`  retry: ${(error as Error).message}`);
      await sleep(3000 * (attempt + 1));
    }
  }
  throw new Error("Google Translate nepavyko");
}

async function main() {
  loadEnv();
  const key = googleTranslateKey();
  if (!key) {
    throw new Error(
      "Nėra GOOGLE_TRANSLATE_API_KEY. Įrašyk į .env.local. Raktas: console.cloud.google.com → APIs & Services → Credentials. Prieš tai įjunk Cloud Translation API.",
    );
  }

  mkdirSync(outDir, { recursive: true });
  const only = arg("slug");
  const budget = Number(process.env.GOOGLE_TRANSLATE_CHAR_BUDGET || 150000);
  const queue = (JSON.parse(readFileSync(queuePath, "utf8")) as Book[]).filter((book) =>
    only ? book.slug === only : true,
  );

  const pendingChars = queue.reduce((sum, book) => {
    const existing = loadBook(book.slug);
    const done = new Set((existing?.units ?? []).map((unit) => unit.id));
    return (
      sum +
      book.units
        .filter((unit) => !unit.skip && !done.has(unit.id))
        .reduce((inner, unit) => inner + unit.text.length, 0)
    );
  }, 0);
  console.log(`Google NMT pending=${pendingChars} budget=${budget}`);
  if (pendingChars > budget) {
    throw new Error(`Liko ${pendingChars} simbolių, lubos ${budget}. Pakelk GOOGLE_TRANSLATE_CHAR_BUDGET, jei sąmoningai.`);
  }

  if (pendingChars === 0) {
    console.log("DONE spent=0");
    return;
  }
  await translateBatch(["Amen."], key);
  console.log("probe ok");

  let spent = 0;
  for (const book of queue) {
    const existing = loadBook(book.slug);
    const done = new Map((existing?.units ?? []).map((unit) => [unit.id, unit]));
    const pending = book.units.filter((unit) => !unit.skip && !done.has(unit.id));
    const priorEngine = existing?.engine ?? "google-nmt";
    const engine = priorEngine.includes("google-nmt") ? priorEngine : `${priorEngine}+google-nmt`;
    const output: BookOut = {
      slug: book.slug,
      titleLt: book.titleLt,
      titleEn: book.titleEn,
      engine,
      at: new Date().toISOString(),
      billed: existing?.billed ?? 0,
      complete: pending.length === 0,
      units: book.units
        .filter((unit) => unit.skip || done.has(unit.id))
        .map((unit) =>
          unit.skip
            ? { id: unit.id, kind: unit.kind, lt: unit.text }
            : (done.get(unit.id) as DoneUnit),
        ),
    };
    console.log(`${book.slug} pending=${pending.length}`);
    if (pending.length === 0) continue;

    const byId = new Map(output.units.map((unit) => [unit.id, unit]));
    for (const batch of pack(pending)) {
      const protectedTexts = batch.map((unit) => protect(unit.text));
      const translated = await translateBatch(protectedTexts, key);
      let billed = protectedTexts.reduce((sum, text) => sum + text.length, 0);

      for (let index = 0; index < batch.length; index += 1) {
        const unit = batch[index];
        let plain = unprotect(translated[index]);
        if (markerCount(unit.text) !== markerCount(plain)) {
          console.log(`  markers ${unit.id}, retry`);
          const [again] = await translateBatch([protect(unit.text)], key);
          billed += protect(unit.text).length;
          const retryPlain = unprotect(again);
          if (markerCount(retryPlain) >= markerCount(plain)) plain = retryPlain;
        }
        const expected = markerCount(unit.text);
        const got = markerCount(plain);
        if (expected !== got) {
          throw new Error(`${unit.id} eilučių žymės ${got}/${expected}. Sustabdyta, kad nesugadintų teksto.`);
        }
        byId.set(unit.id, { id: unit.id, kind: unit.kind, lt: restore(plain), engine: "google-nmt" });
      }

      output.units = book.units
        .filter((unit) => byId.has(unit.id))
        .map((unit) => byId.get(unit.id) as DoneUnit);
      output.billed += billed;
      output.at = new Date().toISOString();
      output.complete = output.units.length === book.units.length;
      saveBook(output);
      spent += billed;
      const doneCount = output.units.filter((unit) => {
        const source = book.units.find((item) => item.id === unit.id);
        return source && !source.skip;
      }).length;
      saveProgress({
        slug: book.slug,
        titleLt: book.titleLt,
        engine: "google-nmt",
        done: doneCount,
        total: book.units.filter((unit) => !unit.skip).length,
        billedBook: output.billed,
        spentRun: spent,
        complete: output.complete,
        at: output.at,
      });
      console.log(`  ${book.slug} ${doneCount}/${book.units.filter((unit) => !unit.skip).length} +${billed}`);
      await sleep(300);
    }
  }
  console.log(`DONE spent=${spent}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
