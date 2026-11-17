const FLEX: Record<string, string> = {
  a: "[aą]",
  c: "[cč]",
  e: "[eęė]",
  i: "[iį]",
  s: "[sš]",
  u: "[uųū]",
  z: "[zž]",
};

export function fold(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");
}

const ENDINGS = new Set(["as", "a", "o", "os", "ui", "u", "e", "ai", "us", "aus", "ams", "yje", "oje", "ojeje"]);

function sameName(word: string, needle: string) {
  const stem = needle.endsWith("as") && needle.length >= 5 ? needle.slice(0, -2) : "";
  if (stem.length < 3 || !word.startsWith(stem)) return false;
  return ENDINGS.has(word.slice(stem.length));
}

function tokenNear(word: string, needle: string) {
  if (word === needle) return true;
  const gap = Math.abs(word.length - needle.length);
  if (gap <= 2 && gap > 0 && (word.startsWith(needle) || needle.startsWith(word))) return true;
  if (sameName(word, needle) || sameName(needle, word)) return true;
  let shared = 0;
  const limit = Math.min(word.length, needle.length);
  while (shared < limit && word[shared] === needle[shared]) shared += 1;
  return shared >= 5 && gap <= 2;
}

export function hasQuery(text: string, needle: string) {
  const query = fold(needle);
  if (query.length < 2) return false;
  const folded = fold(text);
  if (query.length < 4) return folded.includes(query);
  return folded.split(/[^\p{L}\p{N}]+/u).some((word) => word.length >= 3 && tokenNear(word, query));
}

export function flexPattern(query: string) {
  const body = fold(query)
    .split("")
    .map((char) => FLEX[char] ?? char.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("");
  return new RegExp(body, "i");
}

export function snippet(text: string, query: string, radius = 70) {
  const foldedQuery = fold(query);
  const stem = foldedQuery.endsWith("as") && foldedQuery.length >= 5 ? foldedQuery.slice(0, -2) : foldedQuery.slice(0, 4);
  const stemRe =
    stem.length >= 4
      ? new RegExp(
          `${stem
            .split("")
            .map((char) => FLEX[char] ?? char.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
            .join("")}\\p{L}*`,
          "iu",
        )
      : null;
  const match = flexPattern(query).exec(text) ?? stemRe?.exec(text);
  if (!match || match.index === undefined) return "";
  let start = Math.max(0, match.index - radius);
  let end = Math.min(text.length, match.index + match[0].length + radius);
  if (start > 0) {
    const space = text.lastIndexOf(" ", start);
    start = space >= 0 ? space + 1 : 0;
  }
  if (end < text.length) {
    const space = text.indexOf(" ", end);
    end = space >= 0 ? space : text.length;
  }
  return `${start > 0 ? "…" : ""}${text.slice(start, end).trim()}${end < text.length ? "…" : ""}`;
}
