import { AppDock } from "@/components/AppDock";
import { CookieBanner } from "@/components/CookieBanner";
import { JsonLd } from "@/components/JsonLd";
import { PageTracker } from "@/components/PageTracker";
import { Palette } from "@/components/Palette";
import { SiteAnalytics } from "@/components/SiteAnalytics";
import { SiteFooter } from "@/components/SiteFooter";
import { Providers } from "@/components/providers";
import { getMessages } from "@/lib/i18n";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import {
  bingSiteVerification,
  googleSiteVerification,
  keywords,
  siteDescriptionEn,
  siteDescriptionLt,
  siteName,
  siteTitleEn,
  siteTitleLt,
  siteUrl,
  yandexVerification,
} from "@/lib/site";
import type { Metadata, Viewport } from "next";
import { Fraunces, Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin", "latin-ext"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "latin-ext"],
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#07070a" },
    { media: "(prefers-color-scheme: light)", color: "#f3ecd8" },
  ],
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitleLt,
    template: `%s · ${siteName}`,
  },
  description: siteDescriptionLt,
  applicationName: siteName,
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  category: "literature",
  keywords,
  alternates: {
    canonical: siteUrl,
    languages: {
      lt: siteUrl,
      en: siteUrl,
      "x-default": siteUrl,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: { telephone: false, address: false, email: false },
  openGraph: {
    title: siteTitleLt,
    description: siteDescriptionLt,
    url: siteUrl,
    siteName,
    locale: "lt_LT",
    alternateLocale: ["en_US"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitleLt,
    description: siteDescriptionLt,
  },
  ...(googleSiteVerification || yandexVerification || bingSiteVerification
    ? {
        verification: {
          ...(googleSiteVerification ? { google: googleSiteVerification } : {}),
          ...(yandexVerification ? { yandex: yandexVerification } : {}),
          ...(bingSiteVerification ? { other: { "msvalidate.01": bingSiteVerification } } : {}),
        },
      }
    : {}),
  other: {
    "og:title:en": siteTitleEn,
    "og:description:en": siteDescriptionEn,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const messages = getMessages("lt");

  return (
    <html
      lang="lt"
      className={`${geist.variable} ${fraunces.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-bg font-sans text-ink">
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        <Providers messages={messages} locale="lt">
          <a
            href="#content"
            className="bg-elevated text-gold sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:px-3 focus:py-2"
          >
            {messages.nav.skip}
          </a>
          <AppDock />
          <Palette />
          {children}
          <SiteFooter />
          <CookieBanner />
          <PageTracker />
        </Providers>
        <SiteAnalytics />
      </body>
    </html>
  );
}
