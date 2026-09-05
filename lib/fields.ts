import fieldsLt from "@/content/fields-lt.json";

const map = fieldsLt as Record<string, string>;

export function fieldLabel(value: string, locale: "lt" | "en") {
  if (locale === "en") return value;
  return map[value] ?? value;
}
