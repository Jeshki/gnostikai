import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, glossaryJsonLd, pageCrumbs, pageMeta } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = pageMeta({
  title: "Žodynas — pleroma, Sofija, archontai",
  description:
    "Leksikonas, kuriuo kodeksai kalba vienas apie kitą: pleroma, kenoma, Sofija, demiurgas, eonai, setianai ir valentinianai.",
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
