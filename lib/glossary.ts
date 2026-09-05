export type GlossaryTerm = {
  slug: string;
  term: string;
  greek?: string;
  defLt: string;
  defEn: string;
  related: string[];
};

export const glossary: GlossaryTerm[] = [
  {
    slug: "pleroma",
    term: "Pleroma",
    greek: "πλήρωμα",
    defLt: "Dieviškoji pilnatvė — eonų visuma virš kūrimo. Priešingybė kenomai.",
    defEn: "Divine fullness — the totality of aeons above the created world. Opposed to the kenoma.",
    related: ["kenoma", "aeon", "sophia"],
  },
  {
    slug: "kenoma",
    term: "Kenoma",
    greek: "κένωμα",
    defLt: "Tuštuma po pleromos ribos; erdvė, kurioje veikia demiurgas.",
    defEn: "The emptiness below the limit of the Pleroma; the space of the demiurge.",
    related: ["pleroma", "demiurge"],
  },
  {
    slug: "aeon",
    term: "Aeon",
    greek: "αἰών",
    defLt: "Amžinas dieviškas aspektas ar pora pleromoje, ne tik laiko amžius.",
    defEn: "An eternal divine aspect or pair within the Pleroma — not merely an age of time.",
    related: ["pleroma", "ogdoad", "autogenes"],
  },
  {
    slug: "archon",
    term: "Archon",
    greek: "ἄρχων",
    defLt: "Valdovas — kosminė jėga, dažnai priešiška sielos kilimui.",
    defEn: "A ruler — a cosmic power, often hostile to the soul’s ascent.",
    related: ["yaldabaoth", "demiurge"],
  },
  {
    slug: "demiurge",
    term: "Demiurge",
    greek: "δημιουργός",
    defLt: "Pasaulio amatininkas. Setianų ir valentinianų tekstuose dažnai neišmanantis ar aklas.",
    defEn: "The world-craftsman. In Sethian and Valentinian texts often ignorant or blind.",
    related: ["yaldabaoth", "archon", "sophia"],
  },
  {
    slug: "sophia",
    term: "Sophia",
    greek: "σοφία",
    defLt: "Išmintis — eonas, kurio aistra ar klaida pradeda medžiagos istoriją.",
    defEn: "Wisdom — the aeon whose passion or error begins the story of matter.",
    related: ["pistis", "pleroma", "yaldabaoth"],
  },
  {
    slug: "barbelo",
    term: "Barbelo",
    defLt: "Pirmoji mintis, Forethought; dažnai motiniškas pirmasis eonas po Neregimojoje Dvasioje.",
    defEn: "First Thought, Forethought; often the maternal first aeon after the Invisible Spirit.",
    related: ["pronoia", "autogenes", "aeon"],
  },
  {
    slug: "yaldabaoth",
    term: "Yaldabaoth",
    defLt: "Liūtagalvis archontas, Sofijos sūnus be tėvo; setianų demiurgas.",
    defEn: "Lion-faced archon, Sophia’s fatherless son; the Sethian demiurge.",
    related: ["demiurge", "archon", "sophia"],
  },
  {
    slug: "sethians",
    term: "Sethians",
    defLt: "Šiuolaikinis pavadinimas tekstams, kur Setas yra dvasinės giminės tėvas.",
    defEn: "A modern name for texts in which Seth is the father of the spiritual race.",
    related: ["valentinians", "barbelo"],
  },
  {
    slug: "valentinians",
    term: "Valentinians",
    defLt: "Valentinus mokyklos srovės: eonų poros, trys žmonijos rūšys, vestuvių kambarys.",
    defEn: "Schools after Valentinus: aeonic pairs, three kinds of humanity, the bridal chamber.",
    related: ["sethians", "pleroma", "sophia"],
  },
  {
    slug: "pistis",
    term: "Pistis",
    greek: "πίστις",
    defLt: "Tikėjimas / ištikimybė. Pistis Sophia — Sofija kaip ištikimybė ir išmintis.",
    defEn: "Faith or fidelity. Pistis Sophia names Wisdom as both faithfulness and insight.",
    related: ["sophia", "gnosis"],
  },
  {
    slug: "gnosis",
    term: "Gnosis",
    greek: "γνῶσις",
    defLt: "Pažinimas — ne vien doktrina, o pažinimas, keičiantis pažįstantįjį.",
    defEn: "Knowledge — not mere doctrine, but a knowing that changes the knower.",
    related: ["pistis", "pleroma"],
  },
  {
    slug: "bronte",
    term: "Brontē",
    greek: "βροντή",
    defLt: "Griaustinis. Nag Hammadi VI,2 veikėjos balsas.",
    defEn: "Thunder. The voice of the speaker in Nag Hammadi VI,2.",
    related: ["sophia", "pronoia"],
  },
  {
    slug: "ogdoad",
    term: "Ogdoad",
    greek: "ὀγδοάς",
    defLt: "Aštuntainė — aštuonių eonų grupė; taip pat dangus virš septynių planetų.",
    defEn: "The Eight — a set of eight aeons, or the heaven above the seven planets.",
    related: ["aeon", "pleroma"],
  },
  {
    slug: "autogenes",
    term: "Autogenes",
    greek: "αὐτογενής",
    defLt: "Savaime gimęs — setianų Kristaus / žodžio figūra po Barbelo.",
    defEn: "Self-begotten — the Sethian Christ / Word figure after Barbelo.",
    related: ["barbelo", "aeon"],
  },
  {
    slug: "pronoia",
    term: "Pronoia",
    greek: "πρόνοια",
    defLt: "Apvaizda / pirminė mintis. Jono apokrife Pronoia leidžiasi tris kartus.",
    defEn: "Forethought. In the Apocryphon of John, Pronoia descends three times.",
    related: ["barbelo", "sophia"],
  },
];

export function getTerm(slug: string) {
  return glossary.find((item) => item.slug === slug);
}
