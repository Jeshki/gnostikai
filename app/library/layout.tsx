import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Korpusas",
  description: "Nag Hammadi, Berlyno kodeksas, Naujojo Testamento apokrifai.",
};

export default function LibraryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
