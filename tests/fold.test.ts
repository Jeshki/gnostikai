import { flexPattern, fold, hasQuery, snippet } from "@/lib/fold";
import { describe, expect, it } from "vitest";

describe("fold", () => {
  it("strips Lithuanian marks", () => {
    expect(fold("Pradžioje")).toBe("pradzioje");
    expect(fold("Šviesa")).toBe("sviesa");
    expect(fold("ųū")).toBe("uu");
  });
});

describe("hasQuery", () => {
  it("rejects needles shorter than two letters", () => {
    expect(hasQuery("Pradžia", "a")).toBe(false);
    expect(hasQuery("Pradžia", " ")).toBe(false);
  });

  it("matches short words as a substring", () => {
    expect(hasQuery("Pradžios knyga", "pr")).toBe(true);
    expect(hasQuery("Pradžios knyga", "xyz")).toBe(false);
  });

  it("matches a name across Lithuanian endings", () => {
    expect(hasQuery("Didimas Judas Tomas", "Tomas")).toBe(true);
    expect(hasQuery("Tomo evangelija", "Tomas")).toBe(true);
    expect(hasQuery("Tomui tarė", "Tomas")).toBe(true);
  });

  it("does not match a name hidden inside another word", () => {
    expect(hasQuery("nematomas pasaulis", "Tomas")).toBe(false);
    expect(hasQuery("matomų dalykų", "Tomas")).toBe(false);
    expect(hasQuery("tomis dienomis", "Tomas")).toBe(false);
    expect(hasQuery("Sofonijas", "Sofija")).toBe(false);
  });

  it("matches Sofija in inflected forms", () => {
    expect(hasQuery("Jėzaus Kristaus Sofija", "Sofija")).toBe(true);
    expect(hasQuery("Sofijos išmintis", "Sofija")).toBe(true);
  });
});

describe("snippet", () => {
  it("returns an empty string when the word is absent", () => {
    expect(snippet("Tuščias sakinys.", "Henochas")).toBe("");
  });

  it("keeps the match and snaps to word edges", () => {
    const text = "Ilgas įžanginis sakinys prieš žodį Dievas ir tai, kas eina paskui jį toliau.";
    const piece = snippet(text, "Dievas", 8);
    expect(piece.startsWith("…")).toBe(true);
    expect(piece).toContain("Dievas");
    expect(piece.endsWith("…")).toBe(true);
    expect(piece.startsWith("…žodis")).toBe(false);
  });
});

describe("flexPattern", () => {
  it("treats Lithuanian lookalikes as the same letter", () => {
    expect(flexPattern("sventa").test("šventa")).toBe(true);
    expect(flexPattern("zeme").test("žemė")).toBe(true);
  });
});
