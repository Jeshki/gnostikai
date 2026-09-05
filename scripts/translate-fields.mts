import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { corpus } from "../lib/corpus";
import { deeplKey, translateTexts } from "../lib/deepl";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function loadEnv() {
  const file = join(root, ".env.local");
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const match = line.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (!match || process.env[match[1]]) continue;
    process.env[match[1]] = match[2].replace(/^["']|["']$/g, "").trim();
  }
}

async function main() {
  loadEnv();
  if (!deeplKey()) throw new Error("Nėra DEEPL_API_KEY");
  const keys = [
    ...new Set(
      corpus.flatMap((item) => [item.provenance, item.discovery, item.originalLanguage, item.dateApprox]),
    ),
  ].filter(Boolean);
  const map: Record<string, string> = {};
  for (let i = 0; i < keys.length; i += 40) {
    const batch = keys.slice(i, i + 40);
    const translated = await translateTexts(batch, {
      context: "Short catalogue metadata for a scholarly library: provenance, language, date.",
    });
    translated.forEach((item, index) => {
      map[batch[index]] = item.text;
    });
  }
  writeFileSync(join(root, "content", "fields-lt.json"), `${JSON.stringify(map, null, 2)}\n`);
  console.log(Object.keys(map).length, "fields");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
