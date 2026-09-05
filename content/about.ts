export type AboutLocale = "lt" | "en";

export type AboutCopy = {
  kicker: string;
  title: string;
  lede: string;
  tocLabel: string;
  enter: string;
  textsIn: string;
  sections: Array<{
    id: string;
    title: string;
    paragraphs: string[];
  }>;
  currentsTitle: string;
  currents: Array<{
    id: string;
    term: string;
    title: string;
    body: string;
    slugs: string[];
  }>;
  survivalTitle: string;
  survival: Array<{
    year: string;
    body: string;
    href: string;
  }>;
  paths: Array<{
    href: string;
    title: string;
    blurb: string;
  }>;
};

const currentsShared = {
  sethian: ["john", "archons", "origin", "thunder", "egyptians-sethian"],
  valentinian: ["truth", "philip", "tripartite", "valentinus-exposition"],
  thomas: ["thomas", "contender", "acts-thomas"],
  voices: ["mary", "judas", "dialogue-savior"],
  askew: ["pistis-sophia", "books-of-jeu", "untitled-bruce"],
} as const;

export const about: Record<AboutLocale, AboutCopy> = {
  lt: {
    kicker: "Įėjimas",
    title: "Kas yra gnosticizmas?",
    lede: "„Gnosticizmas“ yra šiuolaikinis mokslinis skėtis, o ne vienos senovės bažnyčios savivardis. Po juo telpa II–IV a. srovės, kurių raštai kalba apie pažinimą — gnosis — pleromą ir pasaulio kūrėjo ribotumą. AEON juos rodo kaip dokumentus: kopijuotus, verstus, slėptus, rastus.",
    tocLabel: "Skyriai",
    enter: "Įeiti į korpusą",
    textsIn: "Tekstai",
    sections: [
      {
        id: "zodis",
        title: "Žodis, ne bažnyčia",
        paragraphs: [
          "Irenėjas ir kiti eresiologai rašė prieš „erezijas“. Tie, kurių tekstus skaitome, dažniau vadinosi krikščionimis, Seto sėkla, dvasiniais — ne „gnostikais“. AEON vartoja šį žodį kaip katalogo raktą, ne kaip tikėjimo išpažinimą.",
          "Gnosis čia nėra slaptas klubas ir ne prekė. Tai pažinimas, keičiantis pažįstantįjį: kas esi, iš kur atėjai, kam priklausai. Šalia tikėjimo (pistis) jis stoja kaip kitas kelias — kartais kartu, kartais prieš.",
          "Pleroma — dieviškoji pilnatvė. Kenoma — tuštuma po jos ribos. Sofija — išmintis, kurios aistra ar klaida pradeda medžiagos istoriją. Demiurgas — pasaulio amatininkas, setianų ir valentinianų tekstuose dažnai aklas. Šie vardai nėra dogma; jie yra leksikonas, kuriuo tekstai kalba vienas apie kitą.",
        ],
      },
      {
        id: "kanonas",
        title: "Kanonas ir apokrifas",
        paragraphs: [
          "Apokrifas reiškia „paslėptas“, ne „netikras“. Naujojo Testamento kanonas susiformavo lėtai. Šalia jo — ir kartais prieš jį — buvo rašomos evangelijos be kančios pasakojimo, aktai, apokalipsės, dialogai. Jos nėra kanono parodija ir nėra jo pakaitalas.",
          "AEON kanono neišjuokia ir neapgina. Žyma „už kanono“ tėra istorinis slenkstis: tekstas gyveno kitoje lentynoje. Skaityk jį greta, ne vietoj.",
        ],
      },
      {
        id: "skaityti",
        title: "Kaip skaityti AEON",
        paragraphs: [
          "Tomo evangelija čia visa lietuviškai — 114 posakių per DeepL, kaip ir kitos evangelijos. Rankinis sluoksnis paliktas archyve. Kūnai verčiami per DeepL API iš viešosios nuosavybės anglų tekstų: Mattison, James, ANF, Mead. Angliškas šaltinis lieka per EN arba LT+EN.",
          "Žemėlapis yra sąvokų laukas, ne geografija. Chronologija — atradimų linija, ne dogma. Gretinimas deda du tekstus greta. Žodynas laiko vardus, kuriais kodeksai kalba.",
        ],
      },
      {
        id: "saltiniai",
        title: "Šaltiniai ir teisės",
        paragraphs: [
          "Čia tik viešoji nuosavybė. Markas M. Mattisonas (gospels.net) — Tomas, Marija, Judas ir kitos ištraukos. M. R. Jamesas, 1924 — Naujojo Testamento apokrifai. Ante-Nicene Fathers — patristika, aktai, Klementinai. G. R. S. Meadas — Pistis Sophia.",
          "Brill Coptic Gnostic Library, Robinsono Nag Hammadi Library in English ir Lambdino Tomas nekartojami. Jeu knygos lieka stubu: pilno PD angliško vertimo nėra. Tai ne spraga dizaine — tai teisės slenkstis.",
        ],
      },
      {
        id: "ne",
        title: "Kas tai nėra",
        paragraphs: [
          "Tai ne bažnyčia ir ne iniciacija. Ne New Age parduotuvė ir ne slaptas ordinas. Istorinė ir religinė literatūra, rodoma kaip muziejaus vitrina: šviesa, stiklas, kortelė su proveniencija.",
          "Tekstai gali būti keisti, rūstūs, gražūs. Jie neprašo tikėti. Jie prašo būti skaitomi.",
        ],
      },
    ],
    currentsTitle: "Srovės",
    currents: [
      {
        id: "sethian",
        term: "sethians",
        title: "Setianai",
        body: "Šiuolaikinis vardas tekstams, kur Setas yra dvasinės giminės tėvas. Barbelo, Yaldabaothas, trys Pronoios nusileidimai. Branduolys — Jono apokrifas.",
        slugs: [...currentsShared.sethian],
      },
      {
        id: "valentinian",
        term: "valentinians",
        title: "Valentinianai",
        body: "Valentinus mokyklos: eonų poros, trys žmonijos rūšys, vestuvių kambarys. Tiesos evangelija kalba kaip homilija; Pilypas — kaip sakramentų sąsiuvinis.",
        slugs: [...currentsShared.valentinian],
      },
      {
        id: "thomas",
        term: "gnosis",
        title: "Tomas",
        body: "114 posakių be kančios pasakojimo. Artimas sinoptikams ir Q, bet eina savo keliu: karalystė jau išskleista ant žemės, jei matai.",
        slugs: [...currentsShared.thomas],
      },
      {
        id: "voices",
        term: "sophia",
        title: "Balsai iš šalies",
        body: "Marija pasakoja sielos kilimą. Judas išvedamas į šalį. Gelbėtojo dialogas klausia, kas lieka, kai forma ištirpsta.",
        slugs: [...currentsShared.voices],
      },
      {
        id: "askew",
        term: "pistis",
        title: "Askew ir Bruce",
        body: "Koptų knygos, žinomos dar prieš Nag Hammadi. Pistis Sophia — ilgas dialogas apie Sofijos pakilimą. Jeu knygos čia tik kaip stubas.",
        slugs: [...currentsShared.askew],
      },
    ],
    survivalTitle: "Kaip tekstai išliko",
    survival: [
      {
        year: "XVIII–XIX a.",
        body: "Askew ir Bruce kodeksai patenka į Londoną. Pistis Sophia skaitoma dar prieš dykumos ąsočius.",
        href: "/library/askew-bruce",
      },
      {
        year: "1896–97",
        body: "Berlyno kodeksas (BG 8502) įsigyjamas Kaire: Marija, trumpasis Jonas, Sofija, Petro aktas.",
        href: "/library/berlin-codex",
      },
      {
        year: "1897 / 1903",
        body: "Oksirinho papirusai. Graikiškas Tomas jau prieš Nag Hammadi — posakiai be koptų kodekso.",
        href: "/library/fragments",
      },
      {
        year: "1945",
        body: "Nag Hammadi: trylika kodeksų, palaidotų apie IV a., rasti Aukštutiniame Egipte.",
        href: "/library/nag-hammadi",
      },
      {
        year: "2006",
        body: "Judo evangelijos koptų kodeksas skelbiamas plačiajai auditorijai. Tchacos — dar viena lentyna.",
        href: "/text/judas",
      },
    ],
    paths: [
      {
        href: "/library",
        title: "Biblioteka",
        blurb: "Visas katalogas pagal kodeksą, temą ir pilnumą.",
      },
      {
        href: "/map",
        title: "Žemėlapis",
        blurb: "Eonai, archontai, Sofija, pleroma — sąvokų laukas.",
      },
      {
        href: "/glossary",
        title: "Žodynas",
        blurb: "Vardai, kuriais kodeksai kalba vienas apie kitą.",
      },
      {
        href: "/timeline",
        title: "Chronologija",
        blurb: "Atradimai, ne doktrina.",
      },
      {
        href: "/compare",
        title: "Gretinimas",
        blurb: "Du tekstai greta — Tomas ir Marija, Jonas ir Judas.",
      },
      {
        href: "/text/thomas",
        title: "Tomo evangelija",
        blurb: "Pilnas lietuviškas kūnas — 114 posakių.",
      },
    ],
  },
  en: {
    kicker: "Threshold",
    title: "What is Gnosticism?",
    lede: "“Gnosticism” is a modern scholarly umbrella, not the self-name of a single ancient church. Under it sit second- to fourth-century currents whose writings speak of knowledge — gnosis — the Pleroma, and the limits of the world-maker. AEON shows them as documents: copied, translated, hidden, found.",
    tocLabel: "Sections",
    enter: "Enter the corpus",
    textsIn: "Texts",
    sections: [
      {
        id: "zodis",
        title: "A word, not a church",
        paragraphs: [
          "Irenaeus and other heresiologists wrote against “heresies.” The people whose texts we read more often called themselves Christians, the seed of Seth, the spiritual — not “Gnostics.” AEON uses the word as a catalogue key, not a confession.",
          "Gnosis here is not a secret club and not a product. It is a knowing that changes the knower: who you are, where you came from, whom you belong to. Beside faith (pistis) it stands as another path — sometimes with it, sometimes against it.",
          "Pleroma — divine fullness. Kenoma — the emptiness below its limit. Sophia — wisdom, whose passion or error begins the story of matter. The demiurge — the world-craftsman, often blind in Sethian and Valentinian texts. These names are not dogma; they are the lexicon the texts use to speak of one another.",
        ],
      },
      {
        id: "kanonas",
        title: "Canon and apocryphon",
        paragraphs: [
          "Apocryphon means “hidden,” not “fake.” The New Testament canon formed slowly. Beside it — and sometimes against it — gospels without a passion narrative, acts, apocalypses, dialogues were written. They are neither a parody of the canon nor a replacement for it.",
          "AEON neither mocks nor defends the canon. The mark “extra canon” is only a historical threshold: the text lived on another shelf. Read it beside, not instead.",
        ],
      },
      {
        id: "skaityti",
        title: "How to read AEON",
        paragraphs: [
          "The Gospel of Thomas is here in full Lithuanian — 114 sayings through DeepL, like the other gospels. The hand layer is kept in the archive. Bodies are passed through the DeepL API from public-domain English: Mattison, James, ANF, Mead. The English source remains under EN or LT+EN.",
          "The map is a field of terms, not geography. The timeline is a line of discoveries, not dogma. Compare sets two texts side by side. The glossary holds the names the codices use.",
        ],
      },
      {
        id: "saltiniai",
        title: "Sources and rights",
        paragraphs: [
          "Public domain only. Mark M. Mattison (gospels.net) — Thomas, Mary, Judas, and other excerpts. M. R. James, 1924 — New Testament apocrypha. Ante-Nicene Fathers — patristic witnesses, acts, the Clementines. G. R. S. Mead — Pistis Sophia.",
          "Brill’s Coptic Gnostic Library, Robinson’s Nag Hammadi Library in English, and Lambdin’s Thomas are not reproduced. The Books of Jeu remain a stub: no complete public-domain English translation exists. That is not a design gap — it is a rights threshold.",
        ],
      },
      {
        id: "ne",
        title: "What this is not",
        paragraphs: [
          "Not a church and not an initiation. Not a New Age shop and not a secret order. Historical and religious literature, shown as a museum vitrine: light, glass, a card with provenance.",
          "The texts can be strange, severe, beautiful. They do not ask to be believed. They ask to be read.",
        ],
      },
    ],
    currentsTitle: "Currents",
    currents: [
      {
        id: "sethian",
        term: "sethians",
        title: "Sethians",
        body: "A modern name for texts in which Seth is the father of the spiritual race. Barbelo, Yaldabaoth, three descents of Pronoia. The core is the Apocryphon of John.",
        slugs: [...currentsShared.sethian],
      },
      {
        id: "valentinian",
        term: "valentinians",
        title: "Valentinians",
        body: "Schools after Valentinus: aeonic pairs, three kinds of humanity, the bridal chamber. The Gospel of Truth speaks as a homily; Philip as a notebook of sacraments.",
        slugs: [...currentsShared.valentinian],
      },
      {
        id: "thomas",
        term: "gnosis",
        title: "Thomas",
        body: "One hundred and fourteen sayings without a passion narrative. Close to the Synoptics and Q, but it takes its own road: the kingdom already spread on the earth, if you see.",
        slugs: [...currentsShared.thomas],
      },
      {
        id: "voices",
        term: "sophia",
        title: "Voices from the side",
        body: "Mary recounts the soul’s ascent. Judas is taken aside. The Dialogue of the Savior asks what remains when form dissolves.",
        slugs: [...currentsShared.voices],
      },
      {
        id: "askew",
        term: "pistis",
        title: "Askew and Bruce",
        body: "Coptic books known before Nag Hammadi. Pistis Sophia is a long dialogue on the ascent of Wisdom. The Books of Jeu stand here only as a stub.",
        slugs: [...currentsShared.askew],
      },
    ],
    survivalTitle: "How the texts survived",
    survival: [
      {
        year: "18th–19th c.",
        body: "The Askew and Bruce codices reach London. Pistis Sophia is read before the jars in the desert.",
        href: "/library/askew-bruce",
      },
      {
        year: "1896–97",
        body: "The Berlin Codex (BG 8502) is acquired in Cairo: Mary, the short John, Sophia, the Act of Peter.",
        href: "/library/berlin-codex",
      },
      {
        year: "1897 / 1903",
        body: "The Oxyrhynchus papyri. Greek Thomas already exists before Nag Hammadi — sayings without the Coptic codex.",
        href: "/library/fragments",
      },
      {
        year: "1945",
        body: "Nag Hammadi: thirteen codices, buried in the fourth century, found in Upper Egypt.",
        href: "/library/nag-hammadi",
      },
      {
        year: "2006",
        body: "The Coptic Gospel of Judas is presented to a wide public. Tchacos is another shelf.",
        href: "/text/judas",
      },
    ],
    paths: [
      {
        href: "/library",
        title: "Library",
        blurb: "The full catalogue by codex, theme, and completeness.",
      },
      {
        href: "/map",
        title: "Map",
        blurb: "Aeons, archons, Sophia, the Pleroma — a field of terms.",
      },
      {
        href: "/glossary",
        title: "Glossary",
        blurb: "The names the codices use to speak of one another.",
      },
      {
        href: "/timeline",
        title: "Timeline",
        blurb: "Discoveries, not doctrine.",
      },
      {
        href: "/compare",
        title: "Compare",
        blurb: "Two texts side by side — Thomas and Mary, John and Judas.",
      },
      {
        href: "/text/thomas",
        title: "Gospel of Thomas",
        blurb: "The complete Lithuanian body — 114 sayings.",
      },
    ],
  },
};

export const aboutTerms = [
  "gnosis",
  "pleroma",
  "kenoma",
  "sophia",
  "demiurge",
  "sethians",
  "valentinians",
  "pistis",
  "aeon",
  "archon",
] as const;
