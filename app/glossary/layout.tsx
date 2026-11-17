import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, glossaryJsonLd, pageCrumbs, pageMeta } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = pageMeta({
  title: "Žodynas — pilnatvė, Sofija, archontai",
  description:
    "160 žodžių leksikonas iš Etiopijos Biblijos ir Nag Hammadi: vardai, angelai, vietos ir sąvokos su nuorodomis į tekstus.",
  path: "/glossary",
  titleEn: "Glossary — Pleroma, Sophia, archons",
  descriptionEn:
    "The lexicon the codices use of one another: Pleroma, kenoma, Sophia, the demiurge, aeons, Sethians, and Valentinians.",
  keywords: ["pleroma", "Sofija", "Sophia", "archontai", "demiurgas", "eonai", "gnosis"],
});

export default function GlossaryLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={[glossaryJsonLd(), breadcrumbJsonLd(pageCrumbs("Žodynas", "Glossary", "/glossary"))]} />
      {children}
    </>
  );
}
