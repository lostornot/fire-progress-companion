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

  it("always includes target and milestone insights", () => {
    const insights = buildInsights(demoPlan, demoCheckins, "zh");
    expect(insights.some((i) => i.kind === "target")).toBe(true);
    expect(insights.some((i) => i.kind === "milestone")).toBe(true);
  });

  it("target insight body contains formatted currency, not raw number", () => {
    const insights = buildInsights(demoPlan, demoCheckins, "zh");
    const targetInsight = insights.find((i) => i.kind === "target");
    expect(targetInsight).toBeTruthy();
    // Should contain ¥ or currency symbol, not just raw digits
    expect(targetInsight!.body).toMatch(/[¥$]/);
  });

  it("returns bilingual output for zh", () => {
    const insights = buildInsights(demoPlan, demoCheckins, "zh");
    const milestoneInsight = insights.find((i) => i.kind === "milestone");
    expect(milestoneInsight!.title).toBe("已达成阶段里程碑");
  });

  it("returns bilingual output for en", () => {
    const insights = buildInsights(demoPlan, demoCheckins, "en");
    const milestoneInsight = insights.find((i) => i.kind === "milestone");
    expect(milestoneInsight!.title).toBe("Milestone reached");
  });

  it("detects spending increase between last two checkins", () => {
    const insights = buildInsights(demoPlan, demoCheckins, "en");
    // demoCheckins: c1=170000, c2=175000, c3=180000
    // c3 > c2, so spending insight should appear
    expect(insights.some((i) => i.kind === "spending")).toBe(true);
  });
});
