import { AboutView } from "@/components/AboutView";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, pageMeta } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = pageMeta({
  title: "Kas yra gnosticizmas?",
  description:
    "Gnosticizmas kaip mokslinis skėtis: setianai, valentinianai, Tomas, Nag Hammadi ir viešosios nuosavybės korpusas. AEON — ne bažnyčia ir ne iniciacija.",
  path: "/about",
  titleEn: "What is Gnosticism?",
});

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: "Kas yra gnosticizmas?",
            description: metadata.description as string,
          },
          breadcrumbJsonLd([
            { name: "Pradžia", path: "/" },
            { name: "Apie", path: "/about" },
          ]),
        ]}
      />
      <AboutView />
    </>
  );
}
