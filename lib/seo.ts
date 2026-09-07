import type { Metadata } from "next";
import { collections } from "./corpus";
import { siteDescriptionEn, siteDescriptionLt, siteName, siteUrl } from "./site";
import type { CollectionId, CorpusText } from "./types";

export type Crumb = { name: string; path: string };

export function abs(path = "/") {
  if (!path || path === "/") return siteUrl;
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function pageMeta({
  title,
  description,
  path,
  titleEn,
  descriptionEn,
  type = "website",
  index = true,
  keywords,
}: {
  title: string;
  description: string;
  path: string;
  titleEn?: string;
  descriptionEn?: string;
  type?: "website" | "article";
  index?: boolean;
  keywords?: string[];
}): Metadata {
  const url = abs(path);
  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    robots: index
      ? { index: true, follow: true }
      : { index: false, follow: true },
    openGraph: {
      title: `${title} · ${siteName}`,
      description,
      url,
      siteName,
      locale: "lt_LT",
      alternateLocale: ["en_US"],
      type,
    },
    twitter: {
      card: "summary",
      title: `${title} · ${siteName}`,
      description,
    },
    other: titleEn
      ? { "og:title:en": titleEn, "og:description:en": descriptionEn ?? siteDescriptionEn }
      : undefined,
  };
}

export function jsonLd(data: Record<string, unknown> | Array<Record<string, unknown>>) {
  return JSON.stringify(data);
}

export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: abs(crumb.path),
    })),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    alternateName: ["gnostikai", siteDescriptionLt],
    url: siteUrl,
    description: siteDescriptionLt,
    inLanguage: ["lt", "en"],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function bookJsonLd(text: CorpusText) {
  return {
    "@context": "https://schema.org",
    "@type": "Book",
    name: text.titleLt,
    alternateName: text.titleEn,
    description: text.introLt,
    inLanguage: ["lt", "cop", "grc"],
    url: abs(`/text/${text.slug}`),
    isAccessibleForFree: true,
    license: "https://creativecommons.org/publicdomain/zero/1.0/",
    author: text.translator
      ? { "@type": "Person", name: text.translator }
      : undefined,
    isPartOf: {
      "@type": "Collection",
      name: collections[text.collection].titleLt,
      url: abs(`/library/${text.collection}`),
    },
  };
}

export function collectionCrumbs(id: CollectionId): Crumb[] {
  return [
    { name: "Pradžia", path: "/" },
    { name: "Biblioteka", path: "/library" },
    { name: collections[id].titleLt, path: `/library/${id}` },
  ];
}

export function textCrumbs(text: CorpusText): Crumb[] {
  return [...collectionCrumbs(text.collection), { name: text.titleLt, path: `/text/${text.slug}` }];
}
