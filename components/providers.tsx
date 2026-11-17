"use client";

import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "next-themes";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { defaultLocale, type Locale, type Messages } from "@/lib/i18n";

type LocaleCtx = {
  locale: Locale;
  setLocale: (next: Locale) => void;
  bilingual: boolean;
  setBilingual: (next: boolean) => void;
};

const LocaleContext = createContext<LocaleCtx>({
  locale: defaultLocale,
  setLocale: () => {},
  bilingual: false,
  setBilingual: () => {},
});

export function useLocale() {
  return useContext(LocaleContext);
}

export function Providers({
  children,
  messages,
  locale: _locale,
}: {
  children: React.ReactNode;
  messages: Messages;
  locale: Locale;
}) {
  const [current] = useState<Locale>(defaultLocale);
  const [bundle] = useState(messages);

  useEffect(() => {
    window.localStorage.setItem("aeon-locale", "lt");
    window.localStorage.setItem("aeon-bilingual", "0");
    document.documentElement.lang = "lt";
  }, []);

  const value = useMemo(
    () => ({
      locale: current,
      bilingual: false,
      setBilingual: (_next: boolean) => {},
      setLocale: (_next: Locale) => {},
    }),
    [current],
  );

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
      <LocaleContext.Provider value={value}>
        <NextIntlClientProvider locale={current} messages={bundle} timeZone="Europe/Vilnius">
          {children}
        </NextIntlClientProvider>
      </LocaleContext.Provider>
    </ThemeProvider>
  );
}
