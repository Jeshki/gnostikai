import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = pageMeta({
  title: "Chronologija — kaip tekstai išliko",
  description:
    "Atradimų linija: Berlyno kodeksas, Oksirinchas, Nag Hammadi 1945, Judo evangelija 2006. Ne dogma — proveniencija.",
  path: "/timeline",
  titleEn: "Timeline — how the texts survived",
});

export default function TimelineLayout({ children }: { children: React.ReactNode }) {
  return children;
}
