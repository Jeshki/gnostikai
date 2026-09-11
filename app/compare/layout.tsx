import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = pageMeta({
  title: "Gretinimas — du tekstai greta",
  description:
    "Skaityk Tomą šalia Marijos, Joną šalia Judo. Viešosios nuosavybės gnostiniai ir apokrifiniai tekstai greta.",
  path: "/compare",
  titleEn: "Compare — two texts side by side",
  descriptionEn:
    "Read Thomas beside Mary, John beside Judas. Public-domain Gnostic and apocryphal texts in parallel.",
});

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return children;
}
