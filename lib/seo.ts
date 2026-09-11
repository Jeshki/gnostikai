import type { Metadata } from "next";
import { about } from "@/content/about";
import { collections, corpus, textsByCollection } from "./corpus";
import { glossary } from "./glossary";
import type { Locale } from "./i18n";
import {
  keywords as defaultKeywords,
  siteDescriptionEn,
  siteDescriptionLt,
  siteName,
  siteTitleEn,
  siteTitleLt,
  siteUrl,
} from "./site";
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
    keywords: keywords?.length ? [...keywords, ...defaultKeywords] : defaultKeywords,
    alternates: {
      canonical: url,
      languages: {
        lt: url,
        en: url,
        "x-default": url,
      },
    },
    robots: index
      ? {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        }
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
      card: "summary_large_image",
      title: `${title} · ${siteName}`,
      description,
    },
    other: {
      "og:title:en": titleEn ?? title,
      "og:description:en": descriptionEn ?? siteDescriptionEn,
    },
  };
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

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Library",
    name: siteName,
    alternateName: ["gnostikai", siteTitleLt, siteTitleEn],
    url: siteUrl,
    description: siteDescriptionLt,
    disambiguatingDescription: siteDescriptionEn,
    inLanguage: ["lt", "en"],
    isAccessibleForFree: true,
    knowsLanguage: ["lt", "en", "cop", "grc"],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    alternateName: ["gnostikai", siteTitleLt, siteTitleEn],
    url: siteUrl,
    description: siteDescriptionLt,
    disambiguatingDescription: siteDescriptionEn,
    inLanguage: ["lt", "en"],
    publisher: { "@type": "Organization", name: siteName, url: siteUrl },
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

export function homeItemListJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "AEON korpusas / AEON corpus",
    numberOfItems: corpus.length,
    itemListElement: corpus.slice(0, 24).map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.titleLt,
      alternateName: item.titleEn,
      url: abs(`/text/${item.slug}`),
    })),
  };
}

export function bookJsonLd(text: CorpusText) {
  return {
    "@context": "https://schema.org",
    "@type": "Book",
    name: text.titleLt,
    alternateName: [text.titleEn, text.originalTitle].filter(Boolean),
    description: text.introLt,
    disambiguatingDescription: text.introEn,
    inLanguage: ["lt", "en"],
    url: abs(`/text/${text.slug}`),
    isAccessibleForFree: true,
    license: text.license ?? "https://creativecommons.org/publicdomain/zero/1.0/",
    genre: ["Gnosticism", "Apocrypha", "Religious literature"],
    author: text.translator ? { "@type": "Person", name: text.translator } : undefined,
    publisher: { "@type": "Organization", name: siteName, url: siteUrl },
    dateCreated: text.dateApprox,
    locationCreated: text.provenance,
    isPartOf: {
      "@type": "Collection",
      name: collections[text.collection].titleLt,
      alternateName: collections[text.collection].titleEn,
      url: abs(`/library/${text.collection}`),
    },
  };
}

export function chapterJsonLd(text: CorpusText, chapterId: string, chapterTitleLt: string, chapterTitleEn?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${text.titleLt} — ${chapterTitleLt}`,
    alternativeHeadline: chapterTitleEn ? `${text.titleEn} — ${chapterTitleEn}` : text.titleEn,
    isAccessibleForFree: true,
    inLanguage: ["lt", "en"],
    url: abs(`/text/${text.slug}/${chapterId}`),
    isPartOf: {
      "@type": "Book",
      name: text.titleLt,
      url: abs(`/text/${text.slug}`),
    },
    publisher: { "@type": "Organization", name: siteName, url: siteUrl },
  };
}

export function collectionJsonLd(id: CollectionId) {
  const meta = collections[id];
  const texts = textsByCollection(id);
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: meta.titleLt,
    alternateName: meta.titleEn,
    description: meta.blurbLt,
    disambiguatingDescription: meta.blurbEn,
    url: abs(`/library/${id}`),
    inLanguage: ["lt", "en"],
    isPartOf: { "@type": "WebSite", name: siteName, url: siteUrl },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: texts.length,
      itemListElement: texts.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.titleLt,
        alternateName: item.titleEn,
        url: abs(`/text/${item.slug}`),
      })),
    },
  };
}

export function libraryJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "AEON korpusas",
    alternateName: "AEON corpus",
    description: siteDescriptionLt,
    url: abs("/library"),
    inLanguage: ["lt", "en"],
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: corpus.length,
      itemListElement: (Object.keys(collections) as CollectionId[]).map((id, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: collections[id].titleLt,
        alternateName: collections[id].titleEn,
        url: abs(`/library/${id}`),
      })),
    },
  };
}

export function glossaryJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "AEON žodynas / Glossary",
    url: abs("/glossary"),
    inLanguage: ["lt", "en"],
    hasDefinedTerm: glossary.map((term) => ({
      "@type": "DefinedTerm",
      name: term.term,
      description: term.defLt,
      disambiguatingDescription: term.defEn,
      inDefinedTermSet: abs("/glossary"),
      url: abs(`/glossary#${term.slug}`),
    })),
  };
}

export function aboutJsonLd() {
  const lt = about.lt;
  const en = about.en;
  return [
    {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      name: lt.title,
      alternateName: en.title,
      description: lt.lede,
      disambiguatingDescription: en.lede,
      url: abs("/about"),
      inLanguage: ["lt", "en"],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      inLanguage: "lt",
      mainEntity: lt.sections.map((section, index) => ({
        "@type": "Question",
        name: section.title,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${section.paragraphs.join(" ")} ${en.sections[index]?.paragraphs.join(" ") ?? ""}`.trim(),
        },
      })),
    },
  ];
}

export function collectionCrumbs(id: CollectionId, locale: Locale = "lt"): Crumb[] {
  const home = locale === "lt" ? "Pradžia" : "Home";
  const library = locale === "lt" ? "Biblioteka" : "Library";
  const title = locale === "lt" ? collections[id].titleLt : collections[id].titleEn;
  return [
    { name: home, path: "/" },
    { name: library, path: "/library" },
    { name: title, path: `/library/${id}` },
  ];
}

export function textCrumbs(text: CorpusText, locale: Locale = "lt"): Crumb[] {
  const title = locale === "lt" ? text.titleLt : text.titleEn;
  return [...collectionCrumbs(text.collection, locale), { name: title, path: `/text/${text.slug}` }];
}

export function pageCrumbs(nameLt: string, nameEn: string, path: string, locale: Locale = "lt"): Crumb[] {
  return [
    { name: locale === "lt" ? "Pradžia" : "Home", path: "/" },
    { name: locale === "lt" ? nameLt : nameEn, path },
  ];
}
