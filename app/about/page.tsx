import { AboutView } from "@/components/AboutView";
import { JsonLd } from "@/components/JsonLd";
import { aboutJsonLd, breadcrumbJsonLd, pageCrumbs, pageMeta } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = pageMeta({
  title: "Apie šias bibliotekas",
  description:
    "Etiopijos Biblija yra gyvas bažnyčios kanonas. Nag Hammadi yra 1945 metų gnostinių tekstų radinys. Abu rinkiniai čia skaitomi lietuvių kalba.",
  path: "/about",
  titleEn: "What is Gnosticism?",
  descriptionEn:
    "Gnosticism as a scholarly umbrella: Sethians, Valentinians, Thomas, Nag Hammadi, and a public-domain corpus. AEON is not a church and not an initiation.",
  keywords: ["kas yra gnosticizmas", "What is Gnosticism", "setianai", "valentinianai", "Sethians", "Valentinians"],
});

export default function AboutPage() {
  return (
    <>
      <JsonLd data={[...aboutJsonLd(), breadcrumbJsonLd(pageCrumbs("Apie", "About", "/about"))]} />
      <AboutView />
    </>
  );
}
