import { BibleShelf } from "@/components/BibleShelf";
import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = pageMeta({
  title: "Etiopijos Biblija",
  description: "Etiopijos Biblija lietuvių kalba: skyriai ir knygos.",
  path: "/bible",
  keywords: ["Etiopijos Biblija", "Henochas", "Jubiliejų knyga"],
});

export default function BiblePage() {
  return <BibleShelf />;
}
