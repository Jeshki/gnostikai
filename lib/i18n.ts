import lt from "@/messages/lt.json";

export const locales = ["lt"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "lt";

export type Messages = typeof lt;

export function getMessages(_locale?: Locale): Messages {
  return lt;
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
