import glossaryJson from "@/content/glossary.json";

export type GlossaryRead = {
  href: string;
  label: string;
};

export type GlossaryTerm = {
  slug: string;
  term: string;
  greek?: string;
  defLt: string;
  related: string[];
  reads: GlossaryRead[];
};

export const glossary = glossaryJson as GlossaryTerm[];

export function getTerm(slug: string) {
  return glossary.find((item) => item.slug === slug);
}
