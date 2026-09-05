import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { deeplKey, translateTexts } from "../lib/deepl";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const bodiesDir = join(root, "content", "bodies");
const outDir = join(root, "content", "bodies-lt");
const textsDir = join(root, "content", "texts");
const textsLtDir = join(root, "content", "texts-lt");

function loadEnv() {
  const file = join(root, ".env.local");
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const match = line.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (!match || process.env[match[1]]) continue;
    process.env[match[1]] = match[2].replace(/^["']|["']$/g, "").trim();
  }
}

async function tr(texts: string[]) {
  const out: string[] = [];
  for (let i = 0; i < texts.length; i += 20) {
    const slice = texts.slice(i, i + 20);
    const done = await translateTexts(slice, {
      context: "Public-domain early Christian / Gnostic text. Keep line breaks.",
    });
    out.push(...done.map((item) => item.text));
  }
  return out;
}

async function fillBodies() {
  let filled = 0;
  for (const file of readdirSync(outDir)) {
    if (!file.endsWith(".json") || file.startsWith("_")) continue;
    const ltPath = join(outDir, file);
    const enPath = join(bodiesDir, file);
    if (!existsSync(enPath)) continue;
    const lt = JSON.parse(readFileSync(ltPath, "utf8")) as {
      sections: Array<{ headingLt?: string; bodyLt?: string }>;
    };
    const en = JSON.parse(readFileSync(enPath, "utf8")) as {
      sections: Array<{ heading?: string; body?: string }>;
    };
    const missing: Array<{ i: number; text: string; kind: "body" | "heading" }> = [];
    en.sections.forEach((section, i) => {
      if (section.body?.trim() && !lt.sections[i]?.bodyLt?.trim()) {
        missing.push({ i, text: section.body, kind: "body" });
      }
      if (section.heading?.trim() && !lt.sections[i]?.headingLt?.trim()) {
        missing.push({ i, text: section.heading, kind: "heading" });
      }
    });
    if (!missing.length) continue;
    console.log(`→ ${file}  ${missing.length} spragų`);
    const translated = await tr(missing.map((item) => item.text));
    missing.forEach((item, index) => {
      lt.sections[item.i] ??= { bodyLt: "" };
      if (item.kind === "body") lt.sections[item.i].bodyLt = translated[index];
      else lt.sections[item.i].headingLt = translated[index];
    });
    writeFileSync(ltPath, `${JSON.stringify(lt)}\n`);
    filled += 1;
  }
  console.log(`Kūnai pataisyti: ${filled}`);
}

async function fillMdx() {
  mkdirSync(textsLtDir, { recursive: true });
  const files = readdirSync(textsDir).filter((file) => file.endsWith(".mdx"));
  const bodies = files.map((file) => {
    const raw = readFileSync(join(textsDir, file), "utf8");
    const split = raw.split("---");
    const fm = split[1] ?? "";
    const body = split.slice(2).join("---").trim();
    return { file, fm, body };
  });
  const translated = await tr(bodies.map((item) => item.body || item.file));
  bodies.forEach((item, index) => {
    writeFileSync(
      join(textsLtDir, item.file),
      `---${item.fm}---\n\n${translated[index]}\n`,
    );
  });
  console.log(`MDX: ${files.length}`);
}

async function main() {
  loadEnv();
  if (!deeplKey()) throw new Error("Nėra DEEPL_API_KEY");
  await fillBodies();
  await fillMdx();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
