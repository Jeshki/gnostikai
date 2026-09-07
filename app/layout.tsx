import { AppDock } from "@/components/AppDock";
import { Palette } from "@/components/Palette";
import { SiteFooter } from "@/components/SiteFooter";
import { Providers } from "@/components/providers";
import { getMessages } from "@/lib/i18n";
import { siteDescriptionLt, siteName, siteTitleLt, siteUrl } from "@/lib/site";
import type { Metadata } from "next";
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
  keywords: [
    "gnostiniai tekstai",
    "apokrifinės evangelijos",
    "Tomo evangelija",
    "Nag Hammadi",
    "gnosticizmas",
    "Pistis Sophia",
    "Marijos evangelija",
  ],
  alternates: { canonical: siteUrl },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
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
    card: "summary",
    title: siteTitleLt,
    description: siteDescriptionLt,
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
        </Providers>
      </body>
    </html>
  );
}
