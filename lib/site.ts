export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.evangelijos.com").replace(
  /\/$/,
  "",
);

export const siteName = "AEON";
export const siteTitleLt = "AEON — Gnostiniai tekstai ir apokrifinės evangelijos";
export const siteDescriptionLt =
  "Šviesa, kurią slėpė kanonas. Etiopijos Biblija ir Nag Hammadi biblioteka lietuvių kalba.";

export const keywordsLt = [
  "gnostiniai tekstai",
  "apokrifinės evangelijos",
  "Tomo evangelija",
  "Marijos evangelija",
  "Judo evangelija",
  "Nag Hammadi",
  "gnosticizmas",
  "Pistis Sophia",
  "apokrifai",
  "koptų tekstai",
  "Berlyno kodeksas",
  "viešoji nuosavybė",
  "gnostinė biblioteka",
  "Sofija",
  "pleroma",
];

export const keywords = keywordsLt;

export const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || "G-GJVS8RZBMX";
export const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim() ?? "";
export const bingSiteVerification = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION?.trim() ?? "";
export const yandexVerification = process.env.NEXT_PUBLIC_YANDEX_VERIFICATION?.trim() ?? "";
