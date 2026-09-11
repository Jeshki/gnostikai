import { AboutView } from "@/components/AboutView";
import { JsonLd } from "@/components/JsonLd";
import { aboutJsonLd, breadcrumbJsonLd, pageCrumbs, pageMeta } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = pageMeta({
  title: "Kas yra gnosticizmas?",
  description:
    "Gnosticizmas kaip mokslinis skėtis: setianai, valentinianai, Tomas, Nag Hammadi ir viešosios nuosavybės korpusas. AEON — ne bažnyčia ir ne iniciacija.",
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
