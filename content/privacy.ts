export type PrivacyLocale = "lt" | "en";

export type PrivacyCopy = {
  kicker: string;
  title: string;
  updated: string;
  sections: Array<{ id: string; title: string; paragraphs: string[] }>;
};

export const privacy: Record<PrivacyLocale, PrivacyCopy> = {
  lt: {
    kicker: "Skaidrumas",
    title: "Privatumas ir slapukai",
    updated: "Atnaujinta 2026 m. rugsėjo 11 d.",
    sections: [
      {
        id: "kas",
        title: "Kas mes esame",
        paragraphs: [
          "AEON yra vieša skaitmeninė gnostinių ir apokrifinių tekstų biblioteka. Mes nerenkame paskyrų, neprašome el. pašto ir neprekiaujame lankytojų duomenimis.",
          "Ši politika paaiškina, kokius techninius duomenis matome, kad suprastume lankomumą: kiek žmonių skaito, kurie tekstai domina, iš kokių šalių ir Lietuvos miestų ateinama.",
        ],
      },
      {
        id: "vercel",
        title: "Vercel Analytics — be slapukų",
        paragraphs: [
          "Svetainė veikia Vercel infrastruktūroje. Vercel Web Analytics ir Speed Insights matuoja puslapių peržiūras, populiariausius maršrutus, šalis ir svetainės spartą. Šie įrankiai nenaudoja reklaminių slapukų ir nesiunčia duomenų Meta ar kitoms reklamų platformoms.",
          "Tai leidžia matyti, kurie tekstai skaitomi dažniausiai ir iš kurių šalių ateinama, neidentifikuojant jūsų asmens.",
        ],
      },
      {
        id: "ga",
        title: "Google Analytics — tik su sutikimu",
        paragraphs: [
          "Jei sutinkate, įjungiame Google Analytics 4. Jis papildo Vercel duomenis miestų lygiu (pavyzdžiui Vilnius, Kaunas, Klaipėda), įrenginio tipu ir srauto šaltiniu. Be sutikimo GA skriptas neįkeliamas.",
          "Google gali nustatyti šiuos slapukus: `_ga`, `_ga_*`. Jie saugo atsitiktinį identifikatorių, ne vardą ir ne el. paštą. Duomenys apdorojami Google, pagal jų privatumo politiką.",
        ],
      },
      {
        id: "irenginyje",
        title: "Kas lieka jūsų įrenginyje",
        paragraphs: [
          "Kalbos, temos, dvikalbio skaitymo ir žymių pasirinkimai saugomi naršyklės localStorage. Tai ne reklamos slapukai — jie reikalingi, kad biblioteka atsimintų jūsų skaitymo būdą šiame įrenginyje.",
          "Sutikimo pasirinkimas (`aeon-analytics-consent`) taip pat lieka localStorage, kad baneris neatsirastų kiekvieną kartą.",
        ],
      },
      {
        id: "ne",
        title: "Ko nenaudojame",
        paragraphs: [
          "Nėra Meta (Facebook) pikselio, TikTok, LinkedIn ar kitų reklaminių sekiklių. Nėra remarketingo ir nėra trečiųjų šalių skelbimų.",
          "Mes nesiekiame sudaryti asmeninio profilio reklamai. Analitika skirta tik archyvo lankomumui: kiek skaito, kur gilinamasi, iš kur ateinama.",
        ],
      },
      {
        id: "teises",
        title: "Jūsų teisės",
        paragraphs: [
          "Galite bet kada atmesti Google Analytics — tada lieka tik Vercel matavimas be slapukų. Sutikimą pakeisite porašte: „Slapukų nustatymai“.",
          "Pagal BDAR galite prašyti informacijos apie tvarkymą ir nesutikti su analitika. Kadangi nerenkame paskyrų, mes negalime susieti statistikos su konkrečiu asmeniu pagal vardą ar el. paštą.",
        ],
      },
    ],
  },
  en: {
    kicker: "Transparency",
    title: "Privacy and cookies",
    updated: "Updated 11 September 2026.",
    sections: [
      {
        id: "kas",
        title: "Who we are",
        paragraphs: [
          "AEON is a public digital library of Gnostic and apocryphal texts. We do not create accounts, ask for email, or sell visitor data.",
          "This policy explains the technical data we see so we can understand traffic: how many people read, which texts draw interest, and which countries and Lithuanian cities visits come from.",
        ],
      },
      {
        id: "vercel",
        title: "Vercel Analytics — cookieless",
        paragraphs: [
          "The site runs on Vercel. Vercel Web Analytics and Speed Insights measure page views, popular routes, countries, and site speed. They do not use advertising cookies and do not send data to Meta or other ad platforms.",
          "This shows which texts are read most and which countries visits come from, without identifying you as a person.",
        ],
      },
      {
        id: "ga",
        title: "Google Analytics — only with consent",
        paragraphs: [
          "If you agree, we enable Google Analytics 4. It adds city-level geography (Vilnius, Kaunas, Klaipėda, and others), device type, and traffic source. Without consent the GA script is not loaded.",
          "Google may set `_ga` and `_ga_*` cookies. They store a random identifier, not a name or email. Data is processed by Google under their privacy policy.",
        ],
      },
      {
        id: "irenginyje",
        title: "What stays on your device",
        paragraphs: [
          "Language, theme, bilingual reading, and bookmarks are stored in localStorage. These are not advertising cookies — they remember how you read on this device.",
          "Your consent choice (`aeon-analytics-consent`) also stays in localStorage so the banner does not return on every visit.",
        ],
      },
      {
        id: "ne",
        title: "What we do not use",
        paragraphs: [
          "There is no Meta (Facebook) pixel, TikTok, LinkedIn, or other advertising trackers. No remarketing, no third-party ads.",
          "We do not build personal profiles for advertising. Analytics exists only for the archive: how many read, where they linger, and where they come from.",
        ],
      },
      {
        id: "teises",
        title: "Your rights",
        paragraphs: [
          "You may refuse Google Analytics at any time — Vercel’s cookieless measurement remains. Change your choice from the footer: “Cookie settings”.",
          "Under the GDPR you may ask about processing and object to analytics. Because we keep no accounts, we cannot match statistics to a named person by email.",
        ],
      },
    ],
  },
};
