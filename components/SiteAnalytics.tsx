"use client";

import { CONSENT_EVENT, readConsent, type ConsentValue } from "@/lib/consent";
import { gaMeasurementId } from "@/lib/site";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { useEffect, useState } from "react";

function GoogleGate() {
  const [consent, setConsent] = useState<ConsentValue | null>(null);

  useEffect(() => {
    setConsent(readConsent());
    const onChange = (event: Event) => {
      const detail = (event as CustomEvent<ConsentValue | "prompt">).detail;
      if (detail === "granted" || detail === "denied") setConsent(detail);
    };
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);

  if (!gaMeasurementId || consent !== "granted") return null;
  return <GoogleAnalytics gaId={gaMeasurementId} />;
}

export function SiteAnalytics() {
  return (
    <>
      <Analytics />
      <SpeedInsights />
      <GoogleGate />
    </>
  );
}
