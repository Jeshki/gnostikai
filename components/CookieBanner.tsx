"use client";

import { CONSENT_EVENT, readConsent, writeConsent, type ConsentValue } from "@/lib/consent";
import { gaMeasurementId } from "@/lib/site";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";

export function CookieBanner() {
  const t = useTranslations("cookies");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!gaMeasurementId) return;
    setOpen(readConsent() === null);
    const onChange = (event: Event) => {
      const detail = (event as CustomEvent<ConsentValue | "prompt">).detail;
      if (detail === "prompt") setOpen(true);
    };
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);

  if (!gaMeasurementId || !open) return null;

  const choose = (value: ConsentValue) => {
    const previous = readConsent();
    writeConsent(value);
    setOpen(false);
    if (previous === "granted" && value === "denied") window.location.reload();
  };

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-title"
      aria-describedby="cookie-body"
      className="fixed right-0 bottom-[calc(3.75rem+env(safe-area-inset-bottom))] left-0 z-50 border-t border-line bg-chrome px-4 py-4 backdrop-blur-md md:bottom-0 md:px-6"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p id="cookie-title" className="text-[10px] tracking-[0.2em] text-gold uppercase">
            {t("title")}
          </p>
          <p id="cookie-body" className="mt-2 text-sm leading-relaxed text-muted">
            {t("body")}{" "}
            <Link href="/privacy" className="text-gold hover:text-ink">
              {t("policy")}
            </Link>
            .
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => choose("denied")}
            className="min-h-11 border border-line px-4 text-[11px] tracking-[0.16em] uppercase"
          >
            {t("reject")}
          </button>
          <button
            type="button"
            onClick={() => choose("granted")}
            className="min-h-11 border border-gold/50 px-4 text-[11px] tracking-[0.16em] text-gold uppercase"
          >
            {t("accept")}
          </button>
        </div>
      </div>
    </div>
  );
}

export function reopenCookieSettings() {
  if (!gaMeasurementId) {
    window.location.assign("/privacy");
    return;
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: "prompt" }));
}
