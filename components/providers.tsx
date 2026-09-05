"use client";

import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "next-themes";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Locale, Messages } from "@/lib/i18n";
import { defaultLocale } from "@/lib/i18n";

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
  locale,
}: {
  children: React.ReactNode;
  messages: Messages;
  locale: Locale;
}) {
  const [current, setCurrent] = useState<Locale>(locale);
  const [bundle, setBundle] = useState(messages);
  const [bilingual, setBilingualState] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("aeon-locale") as Locale | null;
    if (stored && stored !== current) {
      void import(`@/messages/${stored}.json`).then((mod) => {
        setBundle(mod.default);
        setCurrent(stored);
      });
    }
    setBilingualState(window.localStorage.getItem("aeon-bilingual") === "1");
  }, [current]);

  useEffect(() => {
    document.documentElement.lang = current;
  }, [current]);

  const value = useMemo(
    () => ({
      locale: current,
      bilingual,
      setBilingual: (next: boolean) => {
        window.localStorage.setItem("aeon-bilingual", next ? "1" : "0");
        setBilingualState(next);
      },
      setLocale: (next: Locale) => {
        window.localStorage.setItem("aeon-locale", next);
        window.localStorage.setItem("aeon-bilingual", "0");
        setBilingualState(false);
        void import(`@/messages/${next}.json`).then((mod) => {
          setBundle(mod.default);
          setCurrent(next);
        });
      },
    }),
    [current, bilingual],
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
