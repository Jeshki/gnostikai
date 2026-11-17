import { JsonLd } from "@/components/JsonLd";
import { libraryJsonLd, pageMeta } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = pageMeta({
  title: "Nag Hammadi biblioteka",
  description: "Nag Hammadi kodeksai ir traktatai lietuvių kalba.",
  path: "/library",
});

export default function LibraryLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={libraryJsonLd()} />
      {children}
    </>
  );
}
