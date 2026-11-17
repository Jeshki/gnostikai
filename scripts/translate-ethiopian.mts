import { existsSync, mkdirSync, readFileSync, renameSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { deeplHost, deeplKey, deeplUsage } from "../lib/deepl.ts";

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
type DoneUnit = { id: string; kind: string; lt: string };
type BookOut = {
  slug: string;
  titleLt: string;
  titleEn: string;
  engine: "deepl";
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

function pack(units: Unit[], maxChars = 28000, maxItems = 12) {
  const batches: Unit[][] = [];
  let current: Unit[] = [];
  let size = 0;
  for (const unit of units) {
    const length = unit.text.length;
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

async function translateBatch(texts: string[], context: string, key: string) {
  const response = await fetch(`${deeplHost(key)}/v2/translate`, {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: texts,
      source_lang: "EN",
      target_lang: "LT",
      preserve_formatting: true,
      split_sentences: "1",
      model_type: "prefer_quality_optimized",
      show_billed_characters: true,
      context,
    }),
    signal: AbortSignal.timeout(180000),
  });
  if (response.status === 429) {
    const wait = Number(response.headers.get("retry-after") ?? 8);
    const error = new Error("429") as Error & { retryAfter: number };
    error.retryAfter = Number.isFinite(wait) ? wait : 8;
    throw error;
  }
  const raw = await response.text();
  if (response.status === 456) {
    const error = new Error("456") as Error & { quota: true };
    error.quota = true;
    throw error;
  }
  if (!response.ok) {
    throw new Error(`DeepL ${response.status}: ${raw.slice(0, 300)}`);
  }
  const data = JSON.parse(raw) as {
    translations: Array<{ text: string; billed_characters?: number }>;
  };
  return data.translations.map((item) => ({
    text: item.text,
    billed: item.billed_characters ?? 0,
  }));
}

async function translateOne(unit: Unit, context: string, key: string) {
  for (let attempt = 0; attempt < 6; attempt += 1) {
    try {
      const [result] = await translateBatch([unit.text], context, key);
      return result;
    } catch (error) {
      const retryAfter = (error as { retryAfter?: number }).retryAfter;
      if (retryAfter) {
        console.log(`  429 ${retryAfter}s`);
        await sleep((retryAfter + 1) * 1000);
        continue;
      }
      if ((error as { quota?: boolean }).quota) throw error;
      if (attempt === 5) throw error;
      console.log(`  retry ${unit.id}: ${(error as Error).message}`);
      await sleep(3000 * (attempt + 1));
    }
  }
  throw new Error(`nepavyko ${unit.id}`);
}

async function main() {
  loadEnv();
  const key = deeplKey();
  if (!key) throw new Error("Nėra DEEPL_API_KEY");
  mkdirSync(outDir, { recursive: true });
  const only = arg("slug");
  const queue = (JSON.parse(readFileSync(queuePath, "utf8")) as Book[]).filter((book) =>
    only ? book.slug === only : true,
  );
  const usage = await deeplUsage(key);
  let left = usage.character_limit - usage.character_count;
  console.log(`DeepL ${usage.character_count}/${usage.character_limit} left=${left}`);

  let spent = 0;
  let stopped = false;
  for (const book of queue) {
    if (stopped) break;
    const existing = loadBook(book.slug);
    const done = new Map((existing?.units ?? []).map((unit) => [unit.id, unit.lt]));
    const pending = book.units.filter((unit) => !unit.skip && !done.has(unit.id));
    const output: BookOut = {
      slug: book.slug,
      titleLt: book.titleLt,
      titleEn: book.titleEn,
      engine: "deepl",
      at: new Date().toISOString(),
      billed: existing?.billed ?? 0,
      complete: pending.length === 0,
      units: book.units
        .filter((unit) => unit.skip || done.has(unit.id))
        .map((unit) => ({
          id: unit.id,
          kind: unit.kind,
          lt: unit.skip ? unit.text : (done.get(unit.id) as string),
        })),
    };
    console.log(`${book.slug} pending=${pending.length} chars~${pending.reduce((sum, unit) => sum + unit.text.length, 0)}`);
    if (pending.length === 0) {
      saveBook(output);
      continue;
    }
    if (left < 2000) {
      console.log("quota-stop");
      stopped = true;
      break;
    }

    const byId = new Map(output.units.map((unit) => [unit.id, unit]));
    for (const full of pack(pending)) {
      let batch = full;
      const room = left - 80;
      const batchChars = batch.reduce((sum, unit) => sum + unit.text.length, 0);
      if (batchChars > room) {
        const fit: Unit[] = [];
        let size = 0;
        for (const unit of batch) {
          if (size + unit.text.length > room) break;
          fit.push(unit);
          size += unit.text.length;
        }
        if (!fit.length) {
          console.log(`quota-stop before ${book.slug} unit ${batch[0].text.length} left=${left}`);
          stopped = true;
          break;
        }
        console.log(`  shrink batch ${batch.length} -> ${fit.length} to fit left=${left}`);
        batch = fit;
      }
      const shrunk = batch.length !== full.length;
      let translated: Array<{ text: string; billed: number }> | null = null;
      for (let attempt = 0; attempt < 6; attempt += 1) {
        try {
          translated = await translateBatch(
            batch.map((unit) => unit.text),
            book.context,
            key,
          );
          break;
        } catch (error) {
          if ((error as { quota?: boolean }).quota) {
            console.log("quota-stop 456");
            stopped = true;
            break;
          }
          const retryAfter = (error as { retryAfter?: number }).retryAfter;
          if (retryAfter) {
            console.log(`  429 ${retryAfter}s`);
            await sleep((retryAfter + 1) * 1000);
            continue;
          }
          if (attempt === 5) throw error;
          console.log(`  batch retry: ${(error as Error).message}`);
          await sleep(4000 * (attempt + 1));
        }
      }
      if (stopped || !translated) break;
      if (translated.length !== batch.length) {
        throw new Error(`${book.slug} batch size ${translated.length} != ${batch.length}`);
      }

      let billed = 0;
      for (let index = 0; index < batch.length; index += 1) {
        const unit = batch[index];
        let result = translated[index];
        const expected = markerCount(unit.text);
        let got = markerCount(result.text);
        let pieceBilled = result.billed;
        if (expected !== got) {
          console.log(`  markers ${unit.id} ${got}/${expected}, retry`);
          try {
            const retry = await translateOne(
              unit,
              `${book.context} The tokens ⟦1⟧ ⟦2⟧ must stay character-for-character.`,
              key,
            );
            pieceBilled += retry.billed;
            if (markerCount(retry.text) >= got) result = retry;
            got = markerCount(result.text);
          } catch (error) {
            if ((error as { quota?: boolean }).quota) {
              stopped = true;
              break;
            }
            console.log(`  marker retry failed ${unit.id}`);
          }
        }
        if (expected !== got) console.log(`  markers remain ${unit.id} ${got}/${expected}`);
        const lt = restore(result.text);
        byId.set(unit.id, { id: unit.id, kind: unit.kind, lt });
        billed += pieceBilled;
      }
      output.units = book.units
        .filter((unit) => byId.has(unit.id))
        .map((unit) => byId.get(unit.id) as DoneUnit);
      output.billed += billed;
      output.at = new Date().toISOString();
      output.complete = output.units.length === book.units.length;
      saveBook(output);
      spent += billed;
      left -= billed;
      const doneCount = output.units.filter((unit) => book.units.find((item) => item.id === unit.id && !item.skip)).length;
      saveProgress({
        slug: book.slug,
        titleLt: book.titleLt,
        done: doneCount,
        total: book.units.filter((unit) => !unit.skip).length,
        billedBook: output.billed,
        spentRun: spent,
        left,
        complete: output.complete,
        at: output.at,
      });
      console.log(`  ${book.slug} ${doneCount} billed+${billed} left~${left}`);
      if (shrunk) {
        console.log(`quota-stop after partial ${book.slug}`);
        stopped = true;
      }
      if (stopped) break;
      await sleep(400);
    }
  }
  console.log(`DONE spent=${spent} stopped=${stopped}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
