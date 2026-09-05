import { AppDock } from "@/components/AppDock";
import { Palette } from "@/components/Palette";
import { Providers } from "@/components/providers";
import { getMessages } from "@/lib/i18n";
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
  metadataBase: new URL("https://aeon.library"),
  title: {
    default: "AEON — Gnostiniai tekstai ir apokrifinės evangelijos",
    template: "%s · AEON",
  },
  description: "Šviesa, kurią slėpė kanonas. Muziejaus lygio skaitmeninė gnostinių ir apokrifinių tekstų biblioteka.",
  openGraph: {
    title: "AEON",
    description: "Šviesa, kurią slėpė kanonas.",
    type: "website",
    locale: "lt_LT",
    alternateLocale: "en_US",
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
        </Providers>
      </body>
    </html>
  );
}
