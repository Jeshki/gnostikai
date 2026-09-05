export type DeepLUsage = {
  character_count: number;
  character_limit: number;
};

export type DeepLTranslateResult = {
  text: string;
  billedCharacters: number;
};

function hostForKey(key: string) {
  return key.endsWith(":fx") ? "https://api-free.deepl.com" : "https://api.deepl.com";
}

export function deeplKey() {
  return process.env.DEEPL_API_KEY?.trim() || process.env.DEEPL_AUTH_KEY?.trim() || "";
}

export function deeplHost(key = deeplKey()) {
  return process.env.DEEPL_API_URL?.replace(/\/$/, "") || hostForKey(key);
}

async function deeplFetch(path: string, init: RequestInit, key = deeplKey()) {
  if (!key) throw new Error("Trūksta DEEPL_API_KEY. Įrašyk į aeon/.env.local");
  const response = await fetch(`${deeplHost(key)}${path}`, {
    ...init,
    headers: {
      Authorization: `DeepL-Auth-Key ${key}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  if (response.status === 429) {
    const wait = Number(response.headers.get("Retry-After") ?? 5);
    const error = new Error(`DeepL 429 — palauk ${wait}s`) as Error & { retryAfter: number };
    error.retryAfter = Number.isFinite(wait) ? wait : 5;
    throw error;
  }
  if (response.status === 456) {
    throw new Error("DeepL kvota baigėsi šį mėnesį.");
  }
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`DeepL ${response.status}: ${detail.slice(0, 400)}`);
  }
  return response;
}

export async function deeplUsage(key = deeplKey()): Promise<DeepLUsage> {
  const response = await deeplFetch("/v2/usage", { method: "GET" }, key);
  return (await response.json()) as DeepLUsage;
}

export async function ensureGlossary(key = deeplKey(), entriesTsv: string) {
  const existing = process.env.DEEPL_GLOSSARY_ID?.trim();
  if (existing) return existing;
  const response = await deeplFetch(
    "/v2/glossaries",
    {
      method: "POST",
      body: JSON.stringify({
        name: "aeon-en-lt",
        source_lang: "en",
        target_lang: "lt",
        entries: entriesTsv,
        entries_format: "tsv",
      }),
    },
    key,
  );
  const data = (await response.json()) as { glossary_id: string };
  return data.glossary_id;
}

export async function translateTexts(
  texts: string[],
  options: { glossaryId?: string; context?: string } = {},
  key = deeplKey(),
): Promise<DeepLTranslateResult[]> {
  if (texts.length === 0) return [];
  const response = await deeplFetch(
    "/v2/translate",
    {
      method: "POST",
      body: JSON.stringify({
        text: texts,
        source_lang: "EN",
        target_lang: "LT",
        preserve_formatting: true,
        split_sentences: "1",
        model_type: "quality_optimized",
        show_billed_characters: true,
        context:
          options.context ??
          "Public-domain translation of an early Christian / Gnostic text. Keep poetic line breaks. Keep names: Pleroma, Barbelo, Yaldabaoth, Autogenes.",
        ...(options.glossaryId ? { glossary_id: options.glossaryId } : {}),
      }),
    },
    key,
  );
  const data = (await response.json()) as {
    translations: Array<{ text: string; billed_characters?: number }>;
  };
  return data.translations.map((item) => ({
    text: item.text,
    billedCharacters: item.billed_characters ?? 0,
  }));
}
