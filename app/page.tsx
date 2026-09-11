import { HomeView } from "@/components/HomeView";
import { JsonLd } from "@/components/JsonLd";
import { homeItemListJsonLd } from "@/lib/seo";

export default function HomePage() {
  return (
    <>
      <JsonLd data={homeItemListJsonLd()} />
      <HomeView />
    </>
  );
}

