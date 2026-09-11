import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = pageMeta({
  title: "Chronologija — kaip tekstai išliko",
  description:
    "Atradimų linija: Berlyno kodeksas, Oksirinchas, Nag Hammadi 1945, Judo evangelija 2006. Ne dogma — proveniencija.",
  path: "/timeline",
  titleEn: "Timeline — how the texts survived",
  descriptionEn:
    "A line of discovery: the Berlin Codex, Oxyrhynchus, Nag Hammadi 1945, the Gospel of Judas 2006. Provenance, not dogma.",
});

export default function TimelineLayout({ children }: { children: React.ReactNode }) {
  return children;
}
