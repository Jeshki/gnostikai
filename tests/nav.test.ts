import { navActive, navLinks } from "@/lib/nav";
import { describe, expect, it } from "vitest";

describe("navActive", () => {
  it("marks home only on the home page", () => {
    expect(navActive("/", "/")).toBe(true);
    expect(navActive("/bible", "/")).toBe(false);
  });

  it("marks a section and its nested pages", () => {
    expect(navActive("/bible", "/bible")).toBe(true);
    expect(navActive("/bible/genesis/1", "/bible")).toBe(true);
    expect(navActive("/library", "/bible")).toBe(false);
    expect(navActive("/nh/tomo-evangelija", "/library")).toBe(false);
  });
});

describe("navLinks", () => {
  it("lists the public sections once", () => {
    const hrefs = navLinks.map((item) => item.href);
    expect(hrefs).toEqual(["/bible", "/library", "/map", "/glossary", "/about", "/compare", "/search", "/saved"]);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });
});
