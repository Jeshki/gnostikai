"use client";

import { PageFade } from "@/components/PageFade";
import { useLocale } from "@/components/providers";
import { useTranslations } from "next-intl";
import Link from "next/link";

const events = [
  {
    year: "1896–97",
    lt: "Berlyno kodeksas (BG 8502) įsigyjamas Kaire. Marijos evangelija, trumpasis Jono apokrifas.",
    en: "The Berlin Codex (BG 8502) is acquired in Cairo: Gospel of Mary, short Apocryphon of John.",
  },
  {
    year: "1897 / 1903",
    lt: "Oksirinho fragmentai (P.Oxy. 1, 654, 655) — graikiškas Tomas dar prieš Nag Hammadi.",
    en: "Oxyrhynchus fragments (P.Oxy. 1, 654, 655): Greek Thomas before Nag Hammadi.",
  },
  {
    year: "1945",
    lt: "Nag Hammadi: trylika kodeksų, palaidotų apie IV a., rasti Aukštutiniame Egipte.",
    en: "Nag Hammadi: thirteen codices, buried in the fourth century, found in Upper Egypt.",
  },
  {
    year: "1955–",
    lt: "Pirmosios mokslinės publikacijos. Korpusas pamažu išeina iš saugyklų.",
    en: "First scholarly publications. The corpus slowly leaves the storerooms.",
  },
  {
    year: "1977",
    lt: "The Nag Hammadi Library in English. Plačiai skaitoma, bet autorių teisės saugomos.",
    en: "The Nag Hammadi Library in English. Widely read; the translations remain in copyright.",
  },
  {
    year: "2006",
    lt: "Judo evangelijos koptų kodeksas skelbiamas plačiajai auditorijai.",
    en: "The Coptic Gospel of Judas is presented to a wide public.",
  },
];

export default function TimelinePage() {
  const { locale } = useLocale();
  const t = useTranslations("timeline");

  return (
    <PageFade>
      <main id="content" className="mx-auto max-w-2xl px-6 pt-20 pb-28">
        <p className="text-[10px] tracking-[0.22em] text-gold uppercase">{t("kicker")}</p>
        <h1 className="font-display mt-3 mb-16 text-4xl">{t("title")}</h1>
        <ol className="space-y-12">
          {events.map((event) => (
            <li key={event.year} className="border-l border-gold/40 pl-6">
              <p className="text-[11px] tracking-[0.18em] text-gold uppercase">{event.year}</p>
              <p className="mt-2 leading-relaxed">{locale === "lt" ? event.lt : event.en}</p>
            </li>
          ))}
        </ol>
        <p className="mt-16 text-sm text-muted">
          <Link href="/about#isliko" className="hover:text-gold">
            {locale === "lt" ? "Kodėl šie atradimai svarbūs — Apie" : "Why these finds matter — About"}
          </Link>
        </p>
      </main>
    </PageFade>
  );
}
