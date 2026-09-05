export type CollectionId =
  | "nag-hammadi"
  | "berlin-codex"
  | "nt-apocrypha"
  | "askew-bruce"
  | "patristic"
  | "fragments";

export type Completeness = "full" | "excerpt" | "stub";

export type BodySection = {
  heading?: string;
  headingLt?: string;
  body: string;
  bodyLt?: string;
};

export type ThemeTag =
  | "sophia"
  | "archons"
  | "salvation"
  | "baptism"
  | "pleroma"
  | "revelation"
  | "sayings"
  | "infancy"
  | "ritual"
  | "ascent";

export type Chapter = {
  id: string;
  titleEn: string;
  titleLt: string;
};

export type CorpusText = {
  slug: string;
  titleEn: string;
  titleLt: string;
  originalTitle?: string;
  collection: CollectionId;
  codex?: string;
  provenance: string;
  originalLanguage: string;
  discovery: string;
  dateApprox: string;
  introEn: string;
  introLt: string;
  chapters: Chapter[];
  tags: ThemeTag[];
  related: string[];
  completeness: Completeness;
  translator?: string;
  sourceUrl?: string;
  license?: string;
  featured?: boolean;
  bannedBadge?: boolean;
};
