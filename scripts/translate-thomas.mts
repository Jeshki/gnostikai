import { copyFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { deeplKey, translateTexts } from "../lib/deepl";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const srcPath = join(root, "content", "thomas.json");
const outPath = join(root, "content", "thomas-lt.json");
const literaryPath = join(root, "content", "thomas-lt-literary.json");

function loadEnv() {
  const file = join(root, ".env.local");
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const match = line.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (!match || process.env[match[1]]) continue;
    process.env[match[1]] = match[2].replace(/^["']|["']$/g, "").trim();
  }
}

type Src = {
  prologue: string;
  sayings: Array<{ n: number; title: string; en: string }>;
};

async function batch(texts: string[], glossaryId?: string) {
  const out: string[] = [];
  for (let i = 0; i < texts.length; i += 20) {
    const slice = texts.slice(i, i + 20);
    const translated = await translateTexts(slice, {
      glossaryId,
      context:
        "Gospel of Thomas sayings. Public-domain English by Mark M. Mattison. Keep poetic line breaks and quotation marks. Keep Jesus, Thomas, Mary, Peter.",
    });
    out.push(...translated.map((item) => item.text));
    process.stdout.write(`  ${Math.min(i + slice.length, texts.length)}/${texts.length}\n`);
  }
  return out;
}

async function main() {
  loadEnv();
  if (!deeplKey()) throw new Error("Nėra DEEPL_API_KEY");
  if (existsSync(outPath) && !existsSync(literaryPath)) {
    copyFileSync(outPath, literaryPath);
    console.log("Rankinis Tomas išsaugotas kaip thomas-lt-literary.json");
  }

  const src = JSON.parse(readFileSync(srcPath, "utf8")) as Src;
  const glossaryId = process.env.DEEPL_GLOSSARY_ID?.trim() || "192048b2-81f1-4f79-9554-7a2ab0015222";

  console.log("Prologas + 114 posakių per DeepL");
  const [prologue] = await batch([src.prologue], glossaryId);
  const titles = await batch(
    src.sayings.map((item) => item.title),
    glossaryId,
  );
  const bodies = await batch(
    src.sayings.map((item) => item.en),
    glossaryId,
  );

  const next = {
    prologue,
    engine: "deepl",
    sayings: src.sayings.map((item, index) => ({
      n: item.n,
      title: titles[index] ?? item.title,
      lt: bodies[index] ?? item.en,
    })),
  };
  writeFileSync(outPath, `${JSON.stringify(next, null, 2)}\n`);
  console.log("Įrašyta content/thomas-lt.json");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
