import { ImageResponse } from "next/og";
import { siteName } from "./site";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const fontUrl =
  "https://cdn.jsdelivr.net/fontsource/fonts/source-serif-4@5.2.8/latin-ext-400-normal.ttf";

let fontPromise: Promise<ArrayBuffer> | null = null;

async function loadFont() {
  if (!fontPromise) {
    fontPromise = fetch(fontUrl).then((res) => {
      if (!res.ok) throw new Error("OG font failed");
      return res.arrayBuffer();
    });
  }
  return fontPromise;
}

export async function ogImage({
  kicker = siteName,
  title,
  subtitle,
}: {
  kicker?: string;
  title: string;
  subtitle?: string;
}) {
  let fonts: { name: string; data: ArrayBuffer; weight: 400; style: "normal" }[] | undefined;
  try {
    fonts = [{ name: "Source Serif", data: await loadFont(), weight: 400, style: "normal" }];
  } catch {
    fonts = undefined;
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#07070a",
          color: "#e8e4d9",
          padding: "72px 80px",
          fontFamily: fonts ? "Source Serif" : "serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 18,
            letterSpacing: "0.42em",
            textTransform: "uppercase",
            color: "#c4a574",
          }}
        >
          {kicker}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              display: "flex",
              fontSize: title.length > 48 ? 52 : 64,
              lineHeight: 1.12,
              maxWidth: 980,
            }}
          >
            {title}
          </div>
          {subtitle ? (
            <div
              style={{
                display: "flex",
                fontSize: 28,
                color: "#8a8578",
                maxWidth: 860,
                lineHeight: 1.3,
              }}
            >
              {subtitle}
            </div>
          ) : null}
        </div>
        <div style={{ display: "flex", height: 1, width: 96, background: "#c4a574" }} />
      </div>
    ),
    { ...ogSize, fonts },
  );
}
