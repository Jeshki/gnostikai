import lt from "@/messages/lt.json";
import en from "@/messages/en.json";

export const locales = ["lt", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "lt";

export type Messages = typeof lt;

const all: Record<Locale, Messages> = { lt, en };

export function getMessages(locale: Locale): Messages {
  return all[locale] ?? lt;
}

export function tGet(messages: Messages, path: string): string {
  const parts = path.split(".");
  let node: unknown = messages;
  for (const part of parts) {
    if (typeof node !== "object" || node === null || !(part in node)) return path;
    node = (node as Record<string, unknown>)[part];
  }
  return typeof node === "string" ? node : path;
}
