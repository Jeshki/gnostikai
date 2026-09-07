import { HomeView } from "@/components/HomeView";
import { JsonLd } from "@/components/JsonLd";
import { corpus } from "@/lib/corpus";
import { websiteJsonLd } from "@/lib/seo";
import { siteUrl } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={[
          websiteJsonLd(),
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "AEON korpusas",
            numberOfItems: corpus.length,
            itemListElement: corpus.slice(0, 20).map((item, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: item.titleLt,
              url: `${siteUrl}/text/${item.slug}`,
            })),
          },
        ]}
      />
      <HomeView />
    </>
  );
}
