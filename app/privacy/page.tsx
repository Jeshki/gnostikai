import { JsonLd } from "@/components/JsonLd";
import { PrivacyView } from "@/components/PrivacyView";
import { abs, breadcrumbJsonLd, pageCrumbs, pageMeta } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = pageMeta({
  title: "Privatumas ir slapukai",
  description:
    "AEON privatumo politika: Vercel Analytics be slapukų, Google Analytics tik su sutikimu, be Meta pikselio ir reklaminių sekiklių.",
  path: "/privacy",
  titleEn: "Privacy and cookies",
  descriptionEn:
    "AEON privacy policy: cookieless Vercel Analytics, Google Analytics only with consent, no Meta pixel or advertising trackers.",
});

export default function PrivacyPage() {
  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Privatumas ir slapukai",
            alternateName: "Privacy and cookies",
            url: abs("/privacy"),
          },
          breadcrumbJsonLd(pageCrumbs("Privatumas", "Privacy", "/privacy")),
        ]}
      />
      <PrivacyView />
    </>
  );
}
