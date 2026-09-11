export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.evangelijos.com").replace(
  /\/$/,
  "",
);

export const siteName = "AEON";
export const siteTitleLt = "AEON — Gnostiniai tekstai ir apokrifinės evangelijos";
export const siteTitleEn = "AEON — Gnostic texts and apocryphal gospels";
export const siteDescriptionLt =
  "Šviesa, kurią slėpė kanonas. Muziejaus lygio skaitmeninė gnostinių ir apokrifinių tekstų biblioteka: Tomas, Marija, Judas, Nag Hammadi ir viešoji nuosavybė.";
export const siteDescriptionEn =
  "The light the canon hid. A museum-grade digital library of Gnostic and apocryphal texts: Thomas, Mary, Judas, Nag Hammadi, and the public domain.";

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

export const keywordsEn = [
  "Gnostic texts",
  "apocryphal gospels",
  "Gospel of Thomas",
  "Gospel of Mary",
  "Gospel of Judas",
  "Nag Hammadi library",
  "Gnosticism",
  "Pistis Sophia",
  "Coptic texts",
  "Berlin Codex",
  "public domain gospels",
  "Gnostic library",
  "Sophia",
  "Pleroma",
];

export const keywords = [...keywordsLt, ...keywordsEn];

export const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || "G-GJVS8RZBMX";
export const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim() ?? "";
export const bingSiteVerification = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION?.trim() ?? "";
export const yandexVerification = process.env.NEXT_PUBLIC_YANDEX_VERIFICATION?.trim() ?? "";
