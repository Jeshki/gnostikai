import { HomeView } from "@/components/HomeView";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "AEON",
  alternateName: "Gnostiniai tekstai ir apokrifinės evangelijos",
  description: "Šviesa, kurią slėpė kanonas.",
  inLanguage: ["lt", "en"],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeView />
    </>
  );
}
