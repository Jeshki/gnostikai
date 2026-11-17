const ENDPOINT = "https://translation.googleapis.com/language/translate/v2";

export function googleTranslateKey() {
  return process.env.GOOGLE_TRANSLATE_API_KEY?.trim() || "";
}

export async function googleTranslateNmt(texts: string[], key = googleTranslateKey()) {
  if (texts.length === 0) return [];
  if (!key) throw new Error("Nėra GOOGLE_TRANSLATE_API_KEY");

  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": key,
    },
    body: JSON.stringify({
      q: texts,
      source: "en",
      target: "lt",
      format: "html",
      model: "nmt",
    }),
    signal: AbortSignal.timeout(120000),
  });

  const raw = await response.text();
  if (response.status === 429) {
    const wait = Number(response.headers.get("retry-after") ?? 8);
    const error = new Error("429") as Error & { retryAfter: number };
    error.retryAfter = Number.isFinite(wait) ? wait : 8;
    throw error;
  }
  if (!response.ok) {
    let detail = raw.slice(0, 400);
    try {
      const parsed = JSON.parse(raw) as { error?: { message?: string } };
      if (parsed.error?.message) detail = parsed.error.message;
    } catch {
      /* keep raw */
    }
    throw new Error(`Google Translate ${response.status}: ${detail}`);
  }

  const data = JSON.parse(raw) as {
    data?: { translations?: Array<{ translatedText?: string; model?: string }> };
  };
  const translations = data.data?.translations ?? [];
  if (translations.length !== texts.length) {
    throw new Error(`Google Translate grąžino ${translations.length} iš ${texts.length}`);
  }
  return translations.map((item) => item.translatedText ?? "");
}
