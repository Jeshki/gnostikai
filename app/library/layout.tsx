import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = pageMeta({
  title: "Korpusas — Nag Hammadi ir apokrifai",
  description:
    "Visas AEON katalogas: Nag Hammadi kodeksai, Berlyno kodeksas, Naujojo Testamento apokrifai, Askew ir Bruce, patristika ir fragmentai.",
  path: "/library",
  titleEn: "Corpus — Nag Hammadi and apocrypha",
});

export default function LibraryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
