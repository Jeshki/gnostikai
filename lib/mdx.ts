import { corpus } from "./corpus";
import { compileMDX } from "next-mdx-remote/rsc";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";

export function textMdxPath(slug: string, locale: "en" | "lt" = "en") {
  const folder = locale === "lt" ? "texts-lt" : "texts";
  return join(process.cwd(), "content", folder, `${slug}.mdx`);
}

async function compileFile(file: string) {
  if (!existsSync(file)) return null;
  const raw = readFileSync(file, "utf8");
  const { content, data } = matter(raw);
  const compiled = await compileMDX({
    source: content,
    options: { parseFrontmatter: false },
  });
  return { content: compiled.content, data };
}

export async function getTextMdx(slug: string) {
  const en = await compileFile(textMdxPath(slug, "en"));
  if (!en) return null;
  const lt = await compileFile(textMdxPath(slug, "lt"));
  return { content: en.content, contentLt: lt?.content, data: en.data };
}

export function stubSource(slug: string) {
  const item = corpus.find((entry) => entry.slug === slug);
  if (!item) return "";
  return [
    `---`,
    `slug: ${item.slug}`,
    `title: "${item.titleEn}"`,
    `completeness: ${item.completeness}`,
    `---`,
    ``,
    `## ${item.titleEn}`,
    ``,
    item.introEn,
    ``,
    item.completeness === "full"
      ? `_Full public-domain text is rendered by the reader._`
      : `_Full text forthcoming. This opening is a scholarly stub._`,
  ].join("\n");
}
