import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = pageMeta({
  title: "Žemėlapis — eonai ir temos",
  description:
    "Ne geografija — sąvokų laukas: pleroma, Sofija, archontai, išganymas, krikštas ir sielos kilimas, su nuorodomis į tekstus.",
  path: "/map",
  titleEn: "Map — aeons and themes",
});

export default function MapLayout({ children }: { children: React.ReactNode }) {
  return children;
}
