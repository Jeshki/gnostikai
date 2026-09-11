import { getText } from "@/lib/corpus";
import { ogContentType, ogImage, ogSize } from "@/lib/og";
import { siteName } from "@/lib/site";

export const alt = siteName;
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const text = getText(slug);
  return ogImage({
    kicker: text?.codex ?? siteName,
    title: text?.titleLt ?? siteName,
    subtitle: text?.titleEn,
  });
}
