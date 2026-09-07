import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = pageMeta({
  title: "Žodynas — pleroma, Sofija, archontai",
  description:
    "Leksikonas, kuriuo kodeksai kalba vienas apie kitą: pleroma, kenoma, Sofija, demiurgas, eonai, setianai ir valentinianai.",
  path: "/glossary",
  titleEn: "Glossary — Pleroma, Sophia, archons",
});

export default function GlossaryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
