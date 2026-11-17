import { beforeEach, describe, expect, it } from "vitest";

class MemoryStorage {
  private map = new Map<string, string>();
  getItem(key: string) {
    return this.map.has(key) ? this.map.get(key)! : null;
  }
  setItem(key: string, value: string) {
    this.map.set(key, value);
  }
  removeItem(key: string) {
    this.map.delete(key);
  }
  clear() {
    this.map.clear();
  }
}

describe("saved places", () => {
  beforeEach(() => {
    Object.assign(globalThis, { window: { localStorage: new MemoryStorage() } });
  });

  it("starts empty", async () => {
    const { readSaved } = await import("@/lib/storage");
    expect(readSaved()).toEqual({ texts: [], sayings: [], highlights: [], places: [] });
  });

  it("saves a text and removes it on the second press", async () => {
    const { isPlaceSaved, togglePlace } = await import("@/lib/storage");
    const place = { href: "/nh/tomo-evangelija", title: "Tomo evangelija", kicker: "KODEKSAS II" };
    expect(togglePlace(place).places).toEqual([place]);
    expect(isPlaceSaved(place.href)).toBe(true);
    expect(togglePlace(place).places).toEqual([]);
    expect(isPlaceSaved(place.href)).toBe(false);
  });

  it("keeps the newest place first", async () => {
    const { togglePlace } = await import("@/lib/storage");
    togglePlace({ href: "/nh/a", title: "A" });
    const next = togglePlace({ href: "/bible/genesis/1", title: "Pradžios knyga · 1 skyrius", kicker: "Etiopijos Biblija" });
    expect(next.places.map((item) => item.href)).toEqual(["/bible/genesis/1", "/nh/a"]);
  });

  it("removes one place without touching the others", async () => {
    const { removePlace, togglePlace } = await import("@/lib/storage");
    togglePlace({ href: "/nh/a", title: "A" });
    togglePlace({ href: "/nh/b", title: "B" });
    expect(removePlace("/nh/a").places.map((item) => item.href)).toEqual(["/nh/b"]);
  });

  it("reads an older record that has no places list", async () => {
    const { readSaved } = await import("@/lib/storage");
    window.localStorage.setItem("aeon-saved", JSON.stringify({ texts: ["thomas"], sayings: [], highlights: [] }));
    expect(readSaved().places).toEqual([]);
    expect(readSaved().texts).toEqual(["thomas"]);
  });

  it("returns an empty shelf when the stored value is broken", async () => {
    const { readSaved } = await import("@/lib/storage");
    window.localStorage.setItem("aeon-saved", "{");
    expect(readSaved().places).toEqual([]);
  });

  it("toggles a text and a saying without duplicating them", async () => {
    const { toggleSaying, toggleText } = await import("@/lib/storage");
    expect(toggleText("thomas").texts).toEqual(["thomas"]);
    expect(toggleText("thomas").texts).toEqual([]);
    expect(toggleSaying("thomas", 3).sayings).toEqual([{ slug: "thomas", n: 3 }]);
    expect(toggleSaying("thomas", 3).sayings).toEqual([]);
  });

  it("appends a highlight", async () => {
    const { addHighlight } = await import("@/lib/storage");
    const saved = addHighlight("thomas", "Karalystė yra jumyse");
    expect(saved.highlights).toHaveLength(1);
    expect(saved.highlights[0]?.quote).toBe("Karalystė yra jumyse");
  });
});

describe("saved places without a browser", () => {
  it("does not throw when window is missing", async () => {
    const previous = globalThis.window;
    // @ts-expect-error the server path has no window
    delete globalThis.window;
    const { readSaved } = await import("@/lib/storage");
    expect(readSaved().places).toEqual([]);
    globalThis.window = previous;
  });
});
