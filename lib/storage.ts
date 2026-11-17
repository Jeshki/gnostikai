export type SavedSaying = { slug: string; n: number };
export type SavedHighlight = { slug: string; quote: string; at: number };
export type SavedPlace = { href: string; title: string; kicker?: string };

export type SavedState = {
  texts: string[];
  sayings: SavedSaying[];
  highlights: SavedHighlight[];
  places: SavedPlace[];
};

const KEY = "aeon-saved";

const empty: SavedState = { texts: [], sayings: [], highlights: [], places: [] };

export function readSaved(): SavedState {
  if (typeof window === "undefined") return empty;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as SavedState;
    return {
      texts: parsed.texts ?? [],
      sayings: parsed.sayings ?? [],
      highlights: parsed.highlights ?? [],
      places: parsed.places ?? [],
    };
  } catch {
    return empty;
  }
}

export function writeSaved(next: SavedState) {
  window.localStorage.setItem(KEY, JSON.stringify(next));
}

export function isPlaceSaved(href: string) {
  return readSaved().places.some((item) => item.href === href);
}

export function removePlace(href: string): SavedState {
  const current = readSaved();
  const next = { ...current, places: current.places.filter((item) => item.href !== href) };
  writeSaved(next);
  return next;
}

export function togglePlace(place: SavedPlace): SavedState {
  const current = readSaved();
  const places = current.places.some((item) => item.href === place.href)
    ? current.places.filter((item) => item.href !== place.href)
    : [place, ...current.places];
  const next = { ...current, places };
  writeSaved(next);
  return next;
}

export function toggleText(slug: string): SavedState {
  const current = readSaved();
  const texts = current.texts.includes(slug)
    ? current.texts.filter((item) => item !== slug)
    : [...current.texts, slug];
  const next = { ...current, texts };
  writeSaved(next);
  return next;
}

export function toggleSaying(slug: string, n: number): SavedState {
  const current = readSaved();
  const exists = current.sayings.some((item) => item.slug === slug && item.n === n);
  const sayings = exists
    ? current.sayings.filter((item) => !(item.slug === slug && item.n === n))
    : [...current.sayings, { slug, n }];
  const next = { ...current, sayings };
  writeSaved(next);
  return next;
}

export function addHighlight(slug: string, quote: string): SavedState {
  const current = readSaved();
  const next = {
    ...current,
    highlights: [...current.highlights, { slug, quote, at: Date.now() }],
  };
  writeSaved(next);
  return next;
}
