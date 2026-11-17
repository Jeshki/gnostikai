import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = pageMeta({
  title: "Žemėlapis — Biblija, kodeksai, sąvokos",
  description:
    "Etiopijos Biblijos dalys, Nag Hammadi kodeksai ir sąvokos su nuorodomis į lietuviškus tekstus.",
  path: "/map",
  titleEn: "Map — aeons and themes",
  descriptionEn:
    "Not geography — a field of terms: Pleroma, Sophia, archons, salvation, baptism, and the soul’s ascent, linked to the texts.",
});

export default function MapLayout({ children }: { children: React.ReactNode }) {
  return children;
}
