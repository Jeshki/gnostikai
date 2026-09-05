import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(join(root, "lib", "corpus.ts"), "utf8");
const slugs = [...src.matchAll(/slug: "([^"]+)"/g)].map((m) => m[1]);
const dir = join(root, "content", "texts");
mkdirSync(dir, { recursive: true });

for (const slug of slugs) {
  const re = new RegExp(
    `slug: "${slug}"[\\s\\S]*?titleEn: "([^"]+)"[\\s\\S]*?introEn:\\s*"([\\s\\S]*?)",`,
  );
  const match = src.match(re);
  const title = match?.[1] ?? slug;
  const intro = (match?.[2] ?? "").replace(/\s+/g, " ").trim();
  const note =
    slug === "thomas"
      ? "_The 114 sayings are rendered by the reader from the public-domain Mattison translation._"
      : "_Full text forthcoming. This opening is a scholarly stub._";
  writeFileSync(
    join(dir, `${slug}.mdx`),
    [
      "---",
      `slug: ${slug}`,
      `title: "${title.replaceAll('"', '\\"')}"`,
      "---",
      "",
      `## ${title}`,
      "",
      intro,
      "",
      note,
      "",
    ].join("\n"),
  );
}

console.log(`wrote ${slugs.length} mdx files`);
