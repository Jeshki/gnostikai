import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = pageMeta({
  title: "Išsaugota",
  description: "Žymės šiame įrenginyje. Asmeninis sąrašas, ne katalogas.",
  path: "/saved",
  index: false,
});

export default function SavedLayout({ children }: { children: React.ReactNode }) {
  return children;
}
