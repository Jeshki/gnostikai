import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = join(root, "..", "VISAS_PD_KORPUSAS");
const outDir = join(root, "content", "bodies");
mkdirSync(outDir, { recursive: true });

const FIRST_ONLY = new Set([
  "secret-book-of-james",
  "gospel-of-philip",
  "gospel-of-truth",
  "gospel-of-thomas",
]);

const ANCHOR_TO_SLUG = {
  "unknown-gospel-egerton-papyrus-2": "egerton",
  "infancy-gospel-of-james": "james-infancy",
  "infancy-gospel-of-thomas": "infancy-thomas",
  "secret-book-of-james": "secret-james",
  "gospel-of-judas": "judas",
  "gospel-of-mary": "mary",
  "gospel-of-peter": "peter-gospel",
  "gospel-of-philip": "philip",
  "gospel-of-q": "gospel-q",
  "sayings-of-jesus-p-oxy-5575": "poxy-5575",
  "secret-gospel-of-mark": "secret-mark",
  "the-stranger-s-book": "stranger-tchacos",
  "gospel-of-thomas": null,
  "gospel-of-truth": "truth",
  "the-apocalypse-of-james": "1james",
  "the-coptic-revelation-of-peter": "apocalypse-peter-nhc",
  "the-second-apocalypse-of-james": "2james",
  "2-melchizedek": "melchizedek-2",
  "the-2nd-discourse-of-the-great-seth": "great-seth",
  "the-three-steles-of-seth": "three-steles",
  "discourse-on-the-eighth-and-ninth": "eighth-ninth",
  "the-acts-of-peter": "peter-twelve",
  "the-revelation-of-adam": "adam",
  "substance-of-the-archons": "archons",
  "excerpt-from-the-perfect-discourse": "asclepius",
  "thomas-the-contender": "contender",
  "dialogue-of-the-savior": "dialogue-savior",
  "eugnostos": "eugnostos",
  "a-valentinian-exposition-and-liturgical-readings": "valentinus-exposition",
  "hypsiphrone": "hypsiphrone",
  "the-secret-book-of-james": null,
  "the-secret-book-of-john": "john",
  "the-authentic-logos": "authoritative",
  "marsanes": "marsanes",
  "the-thought-of-norea": "norea",
  "on-the-origin-of-the-world": "origin",
  "the-revelation-of-paul": "apocalypse-paul",
  "the-letter-of-peter-to-philip": "peter-philip",
  "the-gospel-of-philip": null,
  "plato-s-republic": "plato-republic",
  "the-idea-of-our-great-power": "great-power",
  "prayer-of-the-apostle-paul": "prayer-paul",
  "treatise-on-the-resurrection": "rheginos",
  "the-sentences-of-sextus": "sextus",
  "the-teachings-of-silvanus": "silvanus",
  "the-sophia-of-jesus-christ": "sophia-jesus",
  "exegesis-on-the-soul": "soul",
  "the-testimony-of-truth": "testimony-truth",
  "the-prayer-of-thanksgiving": "thanksgiving",
  "the-gospel-of-thomas": null,
  "trimorphic-protennoia": "protennoia",
  "the-thunder-perfect-mind": "thunder",
  "the-tripartite-tractate": "tripartite",
  "the-gospel-of-truth": null,
  "apelles": "apelles",
  "pistis-sophia": "pistis-sophia",
  "the-valentinian-movement": "valentinian-movement",
  "valentinus": "valentinus",
  "fragments-of-early-gospels-etc": "james-fragments",
  "lost-heretical-books": "lost-heretical",
  "against-marcion-book-i": "against-marcion-1",
  "against-marcion-book-ii": "against-marcion-2",
  "against-marcion-book-iii": "against-marcion-3",
  "against-marcion-book-iv": "against-marcion-4",
  "against-marcion-book-v": "against-marcion-5",
  "p-oxy-1224-uncanonical-gospel-fragment": "poxy-1224",
  "p-oxy-840-fragment-of-an-uncanonical-gospel": "poxy-840",
};

const PRIEDAS = [
  { heading: "Zostrianos\nhttps://othergospels.com/zostrianos/", slug: "zostrianos", until: "## 1 Melchizedek" },
  { heading: "## 1 Melchizedek", slug: "melchizedek-qumran", until: "## Odes of Solomon" },
  { heading: "## Odes of Solomon", slug: "odes-solomon", until: "## Untitled Text" },
  { heading: "## Untitled Text (Bruce) — Gnosis of the Light", slug: "untitled-bruce", until: "## The Act of Peter" },
  { heading: "## The Act of Peter (Berlin BG 8502,4)", slug: "act-peter", until: "## The Paraphrase of Shem" },
  { heading: "## The Paraphrase of Shem", slug: "shem", until: "## Sacred Book" },
  { heading: "## Sacred Book / Coptic Gospel of the Egyptians", slug: "egyptians-sethian", until: "## Allogenes" },
  { heading: "## Allogenes (NHC XI,3)", slug: "allogenes", until: "## The Interpretation of Knowledge" },
  { heading: "## The Interpretation of Knowledge", slug: "interpretation-knowledge", until: "## The Gospel of Pseudo-Matthew" },
  { heading: "## The Gospel of Pseudo-Matthew", slug: "pseudo-matthew", until: "## Arabic Gospel of the Infancy" },
  { heading: "## Arabic Gospel of the Infancy", slug: "arabic-infancy", until: "## History of Joseph the Carpenter" },
  { heading: "## History of Joseph the Carpenter", slug: "joseph-carpenter", until: "## Questions of Bartholomew" },
  { heading: "## Questions of Bartholomew", slug: "bartholomew", until: "## Fayyum Gospel Fragment" },
  { heading: "## Fayyum Gospel Fragment", slug: "fayyum", until: "## Book of the Resurrection by Bartholomew" },
  { heading: "## Book of the Resurrection by Bartholomew", slug: "bartholomew-resurrection", until: "## Gospel of Thomas Greek fragments (P.Oxy. 1)" },
  { heading: "## Gospel of Thomas Greek fragments (P.Oxy. 1)", slug: "thomas-poxy-1", until: "## Gospel of Thomas Greek fragments (P.Oxy. 654)" },
  { heading: "## Gospel of Thomas Greek fragments (P.Oxy. 654)", slug: "thomas-poxy-654", until: "# PART I FULL" },
];

const PART_TITLES = [
  { match: /^The Gospel of the Egyptians$/m, slug: "egyptians-patristic" },
  { match: /^The Gospel of the Hebrews$/m, slug: "hebrews" },
  { match: /^The Apocalypse of Peter$/m, slug: "apocalypse-peter-greek" },
  { match: /^The Preaching of Peter$/m, slug: "preaching-peter" },
  { match: /^The Gospel of the Ebionites$/m, slug: "ebionites" },
  { match: /^The Traditions of Matthias$/m, slug: "matthias" },
  { match: /^The Epistula Apostolorum$/m, slug: "epistula-apostolorum" },
  { match: /^The Acts of Peter$/m, slug: "acts-peter" },
  { match: /^The Acts of John$/m, slug: "acts-john" },
  { match: /^The Acts of Paul$/m, slug: "acts-paul" },
  { match: /^The Acts of Andrew$/m, slug: "acts-andrew" },
  { match: /^The Acts of Thomas$/m, slug: "acts-thomas" },
  { match: /^The Gospel of Nicodemus/m, slug: "nicodemus" },
  { match: /^The Report of Pilate$/m, slug: "report-pilate" },
  { match: /^Basilides/m, slug: "basilides" },
  { match: /^The Naassene Fragment$/m, slug: "naassene" },
  { match: /^Epiphanes/m, slug: "epiphanes" },
  { match: /^Ptolemy, Letter to Flora$/m, slug: "ptolemy-flora" },
  { match: /^Excerpts of Theodotus$/m, slug: "theodotus" },
  { match: /^Fragments of Heracleon$/m, slug: "heracleon" },
  { match: /^Marcion, The Gospel of the Lord$/m, slug: "marcion-gospel" },
  { match: /Visio Pauli|APOCALYPSE OF PAUL$/m, slug: "visio-pauli" },
  { match: /Apocalypse of Thomas|REVELATIO THOMAE/i, slug: "apocalypse-thomas" },
  { match: /Apocalypse of the Virgin/i, slug: "apocalypse-virgin" },
  { match: /Shepherd of Hermas/i, slug: "hermas" },
  { match: /Life of John the Baptist/i, slug: "life-of-john" },
  { match: /Letter of Pilate to Tiberius/i, slug: "pilate-tiberius" },
  { match: /Giving Up of Pontius Pilate/i, slug: "giving-up-pilate" },
  { match: /Death of Pilate|Mors Pilati/i, slug: "death-pilate" },
  { match: /Avenging of the Saviour|Vindicta Salvatoris/i, slug: "vindicta" },
  { match: /Third Epistle to the Corinthians/i, slug: "3-corinthians" },
  { match: /Pseudo-Clementine Recognitions/i, slug: "clementine-recognitions" },
  { match: /Pseudo-Clementine Homilies/i, slug: "clementine-homilies" },
  { match: /Acts of Saint Philip/i, slug: "acts-philip" },
  { match: /Acts of Barnabas/i, slug: "acts-barnabas" },
  { match: /Acts of Peter and Paul/i, slug: "acts-peter-paul" },
  { match: /Acts of Andrew and Matthias/i, slug: "acts-andrew-matthias" },
  { match: /Letters of Christ and Abgarus|Abgar/i, slug: "abgar" },
  { match: /Epistle to the Laodiceans/i, slug: "laodiceans" },
  { match: /Paul and Seneca/i, slug: "paul-seneca" },
];

function clean(text) {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/\{messages:\d+\}/g, "")
    .replace(/\{[^|]+\s*\|\s*\/bible\/[^}]+\}/g, "")
    .replace(/<quote>/gi, "“")
    .replace(/<\/quote>/gi, "”")
    .replace(/<center>/gi, "")
    .replace(/<\/center>/gi, "")
    .replace(/\u200b/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function toSections(raw) {
  const text = clean(raw);
  const chunks = text.split(/\n(?=#{2,3} )/);
  const sections = [];
  for (const chunk of chunks) {
    const lines = chunk.split("\n");
    const first = lines[0] ?? "";
    const heading = first.startsWith("#")
      ? first.replace(/^#+\s+/, "").replace(/\*+/g, "").trim()
      : undefined;
    const body = (heading ? lines.slice(1) : lines).join("\n").trim();
    if (body.length < 40 && !heading) continue;
    if (body.length || heading) sections.push({ heading, body });
  }
  if (sections.length === 0 && text.length > 40) {
    return [{ body: text }];
  }
  return sections;
}

function writeBody(slug, meta, raw) {
  const sections = toSections(raw);
  const chars = sections.reduce((n, s) => n + s.body.length, 0);
  if (chars < 400) return null;
  const doc = {
    slug,
    title: meta.title ?? slug,
    translator: meta.translator ?? "",
    source: meta.source ?? "",
    license: meta.license ?? "Public Domain",
    chars,
    sections,
  };
  writeFileSync(join(outDir, `${slug}.json`), JSON.stringify(doc));
  return doc;
}

function parseMaster() {
  const src = readFileSync(join(sourceRoot, "VISAS_PD_KORPUSAS.md"), "utf8");
  const re = /<a id="([^"]+)"><\/a>\s*\n## ([^\n]+)\n\*Translator \/ edition:\* ([^*]+)\s+\*Source:\* (\S+)\s+\*License:\* ([^*]+)/g;
  const seen = new Set();
  const written = [];
  let match;
  const starts = [];
  while ((match = re.exec(src))) {
    starts.push({
      index: match.index,
      end: match.index + match[0].length,
      id: match[1],
      title: match[2].trim(),
      translator: match[3].trim(),
      source: match[4].trim(),
      license: match[5].trim(),
    });
  }
  for (let i = 0; i < starts.length; i++) {
    const item = starts[i];
    if (FIRST_ONLY.has(item.id) && seen.has(item.id)) continue;
    seen.add(item.id);
    const slug = ANCHOR_TO_SLUG[item.id];
    if (slug === null || slug === undefined) continue;
    const from = src.indexOf("\n---\n", item.end);
    const startBody = from === -1 ? item.end : from + 5;
    const next = starts[i + 1]?.index ?? src.length;
    const raw = src.slice(startBody, next);
    const doc = writeBody(slug, item, raw);
    if (doc) written.push(doc);
  }
  return written;
}

function parsePriedas() {
  const src = readFileSync(join(sourceRoot, "PRIEDAS_IS_DOCX.md"), "utf8");
  const written = [];
  for (const item of PRIEDAS) {
    const start = src.indexOf(item.heading);
    if (start === -1) continue;
    const after = src.indexOf("\n", start);
    const end = src.indexOf(item.until, after);
    let raw = src.slice(after + 1, end === -1 ? src.length : end);
    if (item.slug === "zostrianos") {
      const z = raw.indexOf("Zostrianos\nhttps://othergospels.com/zostrianos/");
      if (z !== -1) raw = raw.slice(z);
    }
    const doc = writeBody(
      item.slug,
      {
        title: item.heading.replace(/^##\s+/, ""),
        translator: "Public-domain edition (see source note)",
        source: "VISAS_PD_KORPUSAS/PRIEDAS_IS_DOCX.md",
        license: "Public Domain",
      },
      raw,
    );
    if (doc) written.push(doc);
  }
  return written;
}

function parseParts() {
  const src = readFileSync(join(sourceRoot, "PRIEDAS_IS_DOCX.md"), "utf8");
  const partStart = src.indexOf("# PART I FULL");
  if (partStart === -1) return [];
  const blob = src.slice(partStart);
  const hits = [];
  for (const item of PART_TITLES) {
    const found = item.match.exec(blob);
    if (!found) continue;
    hits.push({ slug: item.slug, index: found.index, title: found[0] });
  }
  hits.sort((a, b) => a.index - b.index);
  const written = [];
  for (let i = 0; i < hits.length; i++) {
    const item = hits[i];
    const raw = blob.slice(item.index, hits[i + 1]?.index ?? blob.length);
    const doc = writeBody(
      item.slug,
      {
        title: item.title,
        translator: "M. R. James / ANF / Lightfoot (PD)",
        source: "VISAS_PD_KORPUSAS/PRIEDAS_IS_DOCX.md",
        license: "Public Domain",
      },
      raw,
    );
    if (doc) written.push(doc);
  }
  return written;
}

const written = [...parseMaster(), ...parsePriedas(), ...parseParts()];
const bySlug = new Map();
for (const doc of written) bySlug.set(doc.slug, doc);

const manifest = [...bySlug.values()].map((doc) => ({
  slug: doc.slug,
  title: doc.title,
  translator: doc.translator,
  source: doc.source,
  license: doc.license,
  chars: doc.chars,
  sections: doc.sections.length,
  completeness: doc.chars >= 2500 ? "full" : "excerpt",
  chapters: doc.sections.slice(0, 40).map((section, i) => ({
    id: String(i + 1),
    titleEn: section.heading || `Section ${i + 1}`,
    titleLt: section.heading || `Skyrius ${i + 1}`,
  })),
}));

writeFileSync(join(outDir, "_manifest.json"), JSON.stringify(manifest, null, 2));
console.log(`wrote ${manifest.length} bodies`);
for (const item of manifest) {
  console.log(`${item.completeness.padEnd(8)} ${String(item.chars).padStart(7)}  ${item.slug}`);
}
