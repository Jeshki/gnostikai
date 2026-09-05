import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import manifest from "../content/bodies/_manifest.json" with { type: "json" };

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const core = readFileSync(join(root, "lib", "corpus.ts"), "utf8");
const extra = readFileSync(join(root, "lib", "corpus-extra.ts"), "utf8");
const slugs = [
  ...core.matchAll(/slug: "([^"]+)"/g),
  ...extra.matchAll(/x\("([^"]+)"/g),
].map((m) => m[1]);
const all = new Set(slugs);
const have = new Set(manifest.map((item) => item.slug));
const missing = [...all].filter((slug) => !have.has(slug) && slug !== "thomas");
console.log("catalog", all.size);
console.log("bodies", manifest.length);
console.log("no body", missing.join(", ") || "none");
