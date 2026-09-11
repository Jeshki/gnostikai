import { ogImage, ogContentType, ogSize } from "@/lib/og";
import { siteDescriptionLt, siteName } from "@/lib/site";

export const alt = `${siteName} — ${siteDescriptionLt}`;
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  return ogImage({
    title: "Gnostiniai tekstai ir apokrifinės evangelijos",
    subtitle: "The light the canon hid. Thomas, Mary, Judas, Nag Hammadi.",
  });
}
