import { describe, expect, it } from "vitest";
import { formatCurrency, formatPercent } from "@/lib/formatters";

describe("formatCurrency", () => {
  it("formats CNY values", () => {
    expect(formatCurrency(120000, "CNY", "zh")).toContain("¥");
  });

  it("formats USD values", () => {
    expect(formatCurrency(120000, "USD", "en")).toContain("$");
  });
});

describe("formatPercent", () => {
  it("formats percentages with one decimal place", () => {
    expect(formatPercent(0.523, "en")).toBe("52.3%");
  });
});
