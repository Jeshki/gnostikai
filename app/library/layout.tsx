import { JsonLd } from "@/components/JsonLd";
import { libraryJsonLd, pageMeta } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = pageMeta({
  title: "Korpusas — Nag Hammadi ir apokrifai",
  description:
    "Visas AEON katalogas: Nag Hammadi kodeksai, Berlyno kodeksas, Naujojo Testamento apokrifai, Askew ir Bruce, patristika ir fragmentai.",
  path: "/library",
  titleEn: "Corpus — Nag Hammadi and apocrypha",
  descriptionEn:
    "The full AEON catalogue: Nag Hammadi codices, the Berlin Codex, New Testament apocrypha, Askew and Bruce, patristic witnesses, and fragments.",
});

export default function LibraryLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={libraryJsonLd()} />
      {children}
    </>
  );
}
