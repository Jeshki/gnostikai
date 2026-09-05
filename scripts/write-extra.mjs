import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import manifest from "../content/bodies/_manifest.json" with { type: "json" };

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const core = new Set([
  "thomas", "philip", "truth", "egyptians-sethian", "john", "secret-james", "adam",
  "apocalypse-peter-nhc", "1james", "2james", "archons", "origin", "thunder",
  "protennoia", "norea", "soul", "authoritative", "rheginos", "tripartite",
  "valentinus-exposition", "mary", "sophia-jesus", "dialogue-savior", "contender",
  "peter-twelve", "peter-philip", "melchizedek", "marsanes", "allogenes",
  "zostrianos", "three-steles", "hypsiphrone", "sextus", "silvanus",
  "plato-republic", "prayer-paul", "thanksgiving", "eighth-ninth", "asclepius",
  "eugnostos", "interpretation-knowledge", "valentinus-liturgy", "judas",
  "infancy-thomas", "james-infancy", "peter-gospel", "nicodemus", "pistis-sophia",
  "books-of-jeu", "great-seth", "great-power", "shem", "act-peter",
]);

const meta = {
  egerton: ["Unknown Gospel (Egerton)", "Nežinoma evangelija (Egerton)", "fragments", "P.Egerton 2", "sayings"],
  "gospel-q": ["Gospel of Q", "Q evangelija", "nt-apocrypha", "reconstruction", "sayings"],
  "poxy-5575": ["Sayings of Jesus (P.Oxy. 5575)", "Jėzaus posakiai (P.Oxy. 5575)", "fragments", "P.Oxy. 5575", "sayings"],
  "secret-mark": ["Secret Gospel of Mark", "Slaptoji Morkaus evangelija", "nt-apocrypha", "Mar Saba letter", "sayings"],
  "stranger-tchacos": ["The Stranger’s Book", "Svetimojo knyga", "nt-apocrypha", "Codex Tchacos", "revelation"],
  "melchizedek-2": ["2 Melchizedek", "2 Melchizedekas", "nag-hammadi", "NHC IX?", "revelation"],
  "apocalypse-paul": ["Revelation of Paul (NHC)", "Pauliaus apreiškimas (NHC)", "nag-hammadi", "NHC V,2", "ascent"],
  "testimony-truth": ["Testimony of Truth", "Tiesos liudijimas", "nag-hammadi", "NHC IX,3", "salvation"],
  apelles: ["Apelles", "Apelėjas", "patristic", "Mead", "pleroma"],
  "valentinian-movement": ["The Valentinian Movement", "Valentinianų sąjūdis", "patristic", "Mead 1900", "pleroma"],
  valentinus: ["Valentinus", "Valentinas", "patristic", "Mead 1900", "pleroma"],
  "james-fragments": ["Fragments of Early Gospels", "Ankstyvųjų evangelijų fragmentai", "fragments", "James 1924", "sayings"],
  "lost-heretical": ["Lost Heretical Books", "Prarastos eretikų knygos", "fragments", "James 1924", "revelation"],
  "against-marcion-1": ["Against Marcion I", "Prieš Markioną I", "patristic", "ANF 1885", "salvation"],
  "against-marcion-2": ["Against Marcion II", "Prieš Markioną II", "patristic", "ANF 1885", "salvation"],
  "against-marcion-3": ["Against Marcion III", "Prieš Markioną III", "patristic", "ANF 1885", "salvation"],
  "against-marcion-4": ["Against Marcion IV", "Prieš Markioną IV", "patristic", "ANF 1885", "salvation"],
  "against-marcion-5": ["Against Marcion V", "Prieš Markioną V", "patristic", "ANF 1885", "salvation"],
  "poxy-1224": ["P.Oxy. 1224", "P.Oxy. 1224", "fragments", "Grenfell & Hunt", "sayings"],
  "poxy-840": ["P.Oxy. 840", "P.Oxy. 840", "fragments", "Grenfell & Hunt", "sayings"],
  "melchizedek-qumran": ["Melchizedek (11Q13)", "Melchizedekas (11Q13)", "fragments", "Qumran", "revelation"],
  "odes-solomon": ["Odes of Solomon", "Saliamono odės", "nt-apocrypha", "Syriac", "salvation"],
  "untitled-bruce": ["Untitled Text (Bruce)", "Bevardis tekstas (Bruce)", "askew-bruce", "Bruce Codex", "pleroma"],
  "pseudo-matthew": ["Gospel of Pseudo-Matthew", "Pseudo-Mato evangelija", "nt-apocrypha", "Latin infancy", "infancy"],
  "arabic-infancy": ["Arabic Infancy Gospel", "Arabiškoji vaikystės evangelija", "nt-apocrypha", "Arabic", "infancy"],
  "joseph-carpenter": ["History of Joseph the Carpenter", "Juozapo dailidės istorija", "nt-apocrypha", "Coptic/Arabic", "infancy"],
  bartholomew: ["Questions of Bartholomew", "Baltramiejaus klausimai", "nt-apocrypha", "James 1924", "revelation"],
  fayyum: ["Fayyum Gospel Fragment", "Fajumo fragmentas", "fragments", "papyrus", "sayings"],
  "bartholomew-resurrection": ["Book of the Resurrection (Bartholomew)", "Prisikėlimo knyga (Baltramiejus)", "nt-apocrypha", "Budge 1913", "revelation"],
  "thomas-poxy-1": ["Thomas Greek fragments (P.Oxy. 1)", "Tomo graikų fragmentai (P.Oxy. 1)", "fragments", "Grenfell & Hunt", "sayings"],
  "thomas-poxy-654": ["Thomas Greek fragments (P.Oxy. 654)", "Tomo graikų fragmentai (P.Oxy. 654)", "fragments", "Grenfell & Hunt", "sayings"],
  "egyptians-patristic": ["Gospel of the Egyptians (patristic)", "Egiptiečių evangelija (patristinė)", "fragments", "James 1924", "sayings"],
  hebrews: ["Gospel of the Hebrews", "Hebrajų evangelija", "nt-apocrypha", "James 1924", "sayings"],
  "apocalypse-peter-greek": ["Apocalypse of Peter (Akhmim)", "Petro apokalipsė (Achmimas)", "nt-apocrypha", "James 1924", "revelation"],
  hermas: ["Shepherd of Hermas", "Herma ganytojas", "nt-apocrypha", "Lightfoot", "revelation"],
  "preaching-peter": ["Preaching of Peter", "Petro skelbimas", "fragments", "James 1924", "sayings"],
  ebionites: ["Gospel of the Ebionites", "Ebionitų evangelija", "fragments", "James 1924", "sayings"],
  matthias: ["Traditions of Matthias", "Matijo tradicijos", "fragments", "James 1924", "sayings"],
  "epistula-apostolorum": ["Epistula Apostolorum", "Apaštalų laiškas", "nt-apocrypha", "James 1924", "revelation"],
  "acts-peter": ["Acts of Peter", "Petro aktai", "nt-apocrypha", "James 1924", "salvation"],
  "acts-john": ["Acts of John", "Jono aktai", "nt-apocrypha", "James 1924", "salvation"],
  "acts-paul": ["Acts of Paul", "Pauliaus aktai", "nt-apocrypha", "James 1924", "salvation"],
  "3-corinthians": ["Third Corinthians", "Trečiasis laiškas korintiečiams", "nt-apocrypha", "James 1924", "salvation"],
  "acts-andrew": ["Acts of Andrew", "Andriejaus aktai", "nt-apocrypha", "James 1924", "salvation"],
  "acts-andrew-matthias": ["Acts of Andrew and Matthias", "Andriejaus ir Matijo aktai", "nt-apocrypha", "ANF", "salvation"],
  "acts-thomas": ["Acts of Thomas", "Tomo aktai", "nt-apocrypha", "James 1924", "ascent"],
  "report-pilate": ["Report of Pilate", "Piloto pranešimas", "nt-apocrypha", "James 1924", "revelation"],
  basilides: ["Basilides", "Bazilidas", "patristic", "patristic fragments", "pleroma"],
  naassene: ["Naassene Fragment", "Naasenų fragmentas", "patristic", "Hippolytus", "pleroma"],
  epiphanes: ["Epiphanes, On Righteousness", "Epifanas, Apie teisumą", "patristic", "Clement", "salvation"],
  "ptolemy-flora": ["Ptolemy, Letter to Flora", "Ptolemėjo laiškas Florai", "patristic", "Epiphanius", "pleroma"],
  theodotus: ["Excerpts of Theodotus", "Teodoto ištraukos", "patristic", "Clement", "pleroma"],
  heracleon: ["Fragments of Heracleon", "Herakleono fragmentai", "patristic", "Origen", "pleroma"],
  "marcion-gospel": ["Marcion, Gospel of the Lord", "Markiono Viešpaties evangelija", "patristic", "reconstruction", "salvation"],
  "visio-pauli": ["Apocalypse of Paul (Visio Pauli)", "Pauliaus apokalipsė (Visio Pauli)", "nt-apocrypha", "James 1924", "ascent"],
  "apocalypse-virgin": ["Apocalypse of the Virgin", "Mergelės apokalipsė", "nt-apocrypha", "James 1924", "revelation"],
  "apocalypse-thomas": ["Apocalypse of Thomas", "Tomo apokalipsė", "nt-apocrypha", "James 1924", "revelation"],
  "life-of-john": ["Life of John the Baptist", "Jono Krikštytojo gyvenimas", "nt-apocrypha", "Mingana 1927", "infancy"],
  "pilate-tiberius": ["Letter of Pilate to Tiberius", "Piloto laiškas Tiberijui", "nt-apocrypha", "James 1924", "revelation"],
  "giving-up-pilate": ["Giving Up of Pontius Pilate", "Piloto atidavimas", "nt-apocrypha", "James 1924", "revelation"],
  "death-pilate": ["Death of Pilate", "Piloto mirtis", "nt-apocrypha", "James 1924", "revelation"],
  vindicta: ["Avenging of the Saviour", "Išgelbėtojo kerštas", "nt-apocrypha", "James 1924", "revelation"],
  "clementine-recognitions": ["Clementine Recognitions", "Klementinų atpažinimai", "nt-apocrypha", "ANF", "salvation"],
  "clementine-homilies": ["Clementine Homilies", "Klementinų homilijos", "nt-apocrypha", "ANF", "salvation"],
  "acts-philip": ["Acts of Philip", "Pilypo aktai", "nt-apocrypha", "ANF", "salvation"],
  "acts-barnabas": ["Acts of Barnabas", "Barnabo aktai", "nt-apocrypha", "ANF", "salvation"],
  "acts-peter-paul": ["Acts of Peter and Paul", "Petro ir Pauliaus aktai", "nt-apocrypha", "ANF", "salvation"],
  abgar: ["Letters of Christ and Abgar", "Kristo ir Abgaro laiškai", "nt-apocrypha", "Eusebius HE I.13", "revelation"],
  laodiceans: ["Epistle to the Laodiceans", "Laiškas laodikiečiams", "nt-apocrypha", "James 1924", "salvation"],
  "paul-seneca": ["Paul and Seneca", "Paulius ir Seneka", "nt-apocrypha", "James 1924", "salvation"],
};

const lines = [
  `import type { CorpusText } from "./types";`,
  ``,
  `function x(`,
  `  slug: string,`,
  `  titleEn: string,`,
  `  titleLt: string,`,
  `  collection: CorpusText["collection"],`,
  `  provenance: string,`,
  `  tags: CorpusText["tags"],`,
  `): CorpusText {`,
  `  return {`,
  `    slug,`,
  `    titleEn,`,
  `    titleLt,`,
  `    collection,`,
  `    provenance,`,
  `    originalLanguage: "Greek / Coptic / Latin",`,
  `    discovery: "manuscript tradition",`,
  `    dateApprox: "2nd–5th c.",`,
  `    introEn: "Public-domain English from the AEON source corpus (Mattison, Zinner, James, ANF, Mead).",`,
  `    introLt: "Viešosios nuosavybės anglų tekstas iš AEON šaltinių korpuso (Mattison, Zinner, James, ANF, Mead).",`,
  `    chapters: [{ id: "1", titleEn: "Full text", titleLt: "Visas tekstas" }],`,
  `    tags,`,
  `    related: [],`,
  `    completeness: "full",`,
  `    license: "Public Domain",`,
  `  };`,
  `}`,
  ``,
  `export const extraCorpus: CorpusText[] = [`,
];

for (const item of manifest) {
  if (core.has(item.slug)) continue;
  const row = meta[item.slug];
  if (!row) {
    console.warn("missing meta", item.slug);
    continue;
  }
  const [en, lt, col, prov, tag] = row;
  lines.push(
    `  x(${JSON.stringify(item.slug)}, ${JSON.stringify(en)}, ${JSON.stringify(lt)}, ${JSON.stringify(col)}, ${JSON.stringify(prov)}, [${JSON.stringify(tag)}]),`,
  );
}
lines.push(`];`, ``);

writeFileSync(join(root, "lib", "corpus-extra.ts"), lines.join("\n"));
console.log("wrote corpus-extra.ts");
