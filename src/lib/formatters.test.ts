import { describe, expect, it } from "vitest";
import { formatCurrency, formatPercent, formatDate } from "@/lib/formatters";

describe("formatCurrency", () => {
  it("formats CNY values with ¥ symbol", () => {
    expect(formatCurrency(120000, "CNY", "zh")).toContain("¥");
  });

  it("formats USD values with $ symbol", () => {
    expect(formatCurrency(120000, "USD", "en")).toContain("$");
  });

  it("formats zero correctly", () => {
    const result = formatCurrency(0, "CNY", "zh");
    expect(result).toContain("0");
  });

  it("formats large numbers without decimals", () => {
    const result = formatCurrency(4500000, "CNY", "zh");
    expect(result).not.toContain(".");
  });

  it("formats same value differently for CNY vs USD", () => {
    const cny = formatCurrency(100000, "CNY", "zh");
    const usd = formatCurrency(100000, "USD", "en");
    expect(cny).not.toEqual(usd);
  });
});

describe("formatPercent", () => {
  it("formats percentages with one decimal place", () => {
    expect(formatPercent(0.523, "en")).toBe("52.3%");
  });

  it("formats 0% correctly", () => {
    expect(formatPercent(0, "en")).toBe("0.0%");
  });

  it("formats 100% correctly", () => {
    expect(formatPercent(1, "en")).toBe("100.0%");
  });

  it("formats in Chinese locale", () => {
    const result = formatPercent(0.5, "zh");
    expect(result).toContain("50");
  });
});

describe("formatDate", () => {
  it("formats a date string", () => {
    const result = formatDate("2026-06-12T09:00:00.000Z", "en");
    expect(result).toContain("2026");
  });

  it("formats in Chinese locale", () => {
    const result = formatDate("2026-06-12T09:00:00.000Z", "zh");
    expect(result).toBeTruthy();
  });
});
