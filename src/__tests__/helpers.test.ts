/**
 * Tests for pure utility functions in src/core/utils/formatters/helpers.ts
 */

import { describe, it, expect } from "vitest";
import { colorIcon, sectionSeparator, textToHtml, linkify } from "../core/utils/formatters/helpers";

describe("colorIcon", () => {
  it("wraps icon text in a span with the correct hex color", () => {
    const result = colorIcon(">>", "green");
    expect(result).toBe('<span style="color:#00ff00">>></span>');
  });

  it("handles all supported colors", () => {
    const colors = ["green", "orange", "red", "blue", "yellow", "white", "cyan"] as const;
    const expectedHex: Record<string, string> = {
      green: "#00ff00",
      orange: "#ff9900",
      red: "#ff3333",
      blue: "#3399ff",
      yellow: "#ffff66",
      white: "#ffffff",
      cyan: "#00ffcc",
    };

    for (const color of colors) {
      const result = colorIcon("X", color);
      expect(result).toContain(expectedHex[color]);
      expect(result).toContain("X");
    }
  });
});

describe("sectionSeparator", () => {
  it("returns a consistent separator string", () => {
    const sep = sectionSeparator();
    expect(sep).toBe("-----------------------------------------");
    // Should be pure — same output every time
    expect(sectionSeparator()).toBe(sep);
  });
});

describe("textToHtml", () => {
  it("converts newlines to <br> tags", () => {
    expect(textToHtml("line1\nline2")).toBe("line1<br>line2");
  });

  it("handles multiple consecutive newlines", () => {
    expect(textToHtml("a\n\nb")).toBe("a<br><br>b");
  });

  it("returns the same string when no newlines are present", () => {
    expect(textToHtml("no newlines here")).toBe("no newlines here");
  });
});

describe("linkify", () => {
  it("converts http URLs to clickable anchor tags", () => {
    const result = linkify("Visit http://example.com for more");
    expect(result).toContain('<a href="http://example.com"');
    expect(result).toContain('target="_blank"');
    expect(result).toContain('rel="noopener noreferrer"');
  });

  it("converts https URLs to clickable anchor tags", () => {
    const result = linkify("Check https://github.com/foo");
    expect(result).toContain('<a href="https://github.com/foo"');
  });

  it("leaves text without URLs unchanged", () => {
    const input = "no links here";
    expect(linkify(input)).toBe(input);
  });

  it("handles multiple URLs in the same string", () => {
    const result = linkify("See https://a.com and https://b.com end");
    const anchors = result.match(/<a /g);
    expect(anchors).toHaveLength(2);
  });
});
