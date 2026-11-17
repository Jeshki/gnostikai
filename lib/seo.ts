import type { Metadata } from "next";
import { about } from "@/content/about";
import { collections, corpus, textsByCollection } from "./corpus";
import { glossary } from "./glossary";
import type { Locale } from "./i18n";
import { keywords as defaultKeywords, siteDescriptionLt, siteName, siteTitleLt, siteUrl } from "./site";
import { nhCatalog } from "./nh";
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
  titleEn: _titleEn,
  descriptionEn: _descriptionEn,
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
      type,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · ${siteName}`,
      description,
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
    alternateName: ["gnostikai", siteTitleLt],
    url: siteUrl,
    description: siteDescriptionLt,
    inLanguage: "lt",
    isAccessibleForFree: true,
    knowsLanguage: ["lt", "cop", "grc"],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    alternateName: ["gnostikai", siteTitleLt],
    url: siteUrl,
    description: siteDescriptionLt,
    inLanguage: "lt",
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
    name: "Nag Hammadi biblioteka",
    numberOfItems: nhCatalog.length,
    itemListElement: nhCatalog.slice(0, 24).map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.title,
      url: abs(`/nh/${item.slug}`),
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
    name: "Nag Hammadi biblioteka",
    description: siteDescriptionLt,
    url: abs("/library"),
    inLanguage: "lt",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: nhCatalog.length,
      itemListElement: nhCatalog.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.title,
        url: abs(`/nh/${item.slug}`),
      })),
    },
  };
}

export function glossaryJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "AEON žodynas",
    url: abs("/glossary"),
    inLanguage: "lt",
    hasDefinedTerm: glossary.map((term) => ({
      "@type": "DefinedTerm",
      name: term.term,
      description: term.defLt,
      inDefinedTermSet: abs("/glossary"),
      url: abs(`/glossary#${term.slug}`),
    })),
  };
}

export function aboutJsonLd() {
  const lt = about.lt;
  return [
    {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      name: lt.title,
      description: lt.lede,
      url: abs("/about"),
      inLanguage: "lt",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      inLanguage: "lt",
      mainEntity: lt.sections.map((section) => ({
        "@type": "Question",
        name: section.title,
        acceptedAnswer: {
          "@type": "Answer",
          text: section.paragraphs.join(" "),
        },
      })),
    },
  ];
}

export function collectionCrumbs(id: CollectionId, _locale: Locale = "lt"): Crumb[] {
  const home = "Pradžia";
  const library = "Biblioteka";
  const title = collections[id].titleLt;
  return [
    { name: home, path: "/" },
    { name: library, path: "/library" },
    { name: title, path: `/library/${id}` },
  ];
}

export function textCrumbs(text: CorpusText, locale: Locale = "lt"): Crumb[] {
  return [...collectionCrumbs(text.collection, locale), { name: text.titleLt, path: `/text/${text.slug}` }];
}

export function pageCrumbs(nameLt: string, _nameEn: string, path: string, _locale: Locale = "lt"): Crumb[] {
  return [
    { name: "Pradžia", path: "/" },
    { name: nameLt, path },
  ];
}
