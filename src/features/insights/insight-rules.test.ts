import { describe, expect, it } from "vitest";
import { demoCheckins, demoPlan } from "@/mock/demo-data";
import { buildInsights } from "@/features/insights/insight-rules";

describe("buildInsights", () => {
  it("returns milestone and spending insights with multiple checkins", () => {
    const insights = buildInsights(demoPlan, demoCheckins, "zh");
    expect(insights.length).toBeGreaterThan(0);
    expect(insights.some((item) => item.kind === "milestone")).toBe(true);
  });

  it("does not crash with only one checkin", () => {
    const single = [demoCheckins[0]];
    const insights = buildInsights(demoPlan, single, "zh");
    expect(insights.length).toBeGreaterThanOrEqual(2);
  });

  it("does not crash with empty checkins", () => {
    const insights = buildInsights(demoPlan, [], "zh");
    expect(insights).toEqual([]);
  });
});
