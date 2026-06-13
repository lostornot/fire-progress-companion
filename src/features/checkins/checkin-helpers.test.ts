import { describe, expect, it } from "vitest";
import { demoCheckins } from "@/mock/demo-data";
import { buildNetWorthSeries, sortCheckins } from "@/features/checkins/checkin-helpers";

describe("sortCheckins", () => {
  it("sorts by checkinDate ascending", () => {
    const sorted = sortCheckins([demoCheckins[2], demoCheckins[0], demoCheckins[1]]);
    expect(sorted.map((c) => c.checkinDate)).toEqual(["2026-03-01", "2026-04-01", "2026-05-01"]);
  });

  it("returns empty array for empty input", () => {
    expect(sortCheckins([])).toEqual([]);
  });

  it("handles single item", () => {
    const sorted = sortCheckins([demoCheckins[0]]);
    expect(sorted).toHaveLength(1);
    expect(sorted[0].id).toBe("c1");
  });

  it("does not mutate the original array", () => {
    const original = [demoCheckins[1], demoCheckins[0]];
    const originalIds = original.map((c) => c.id);
    sortCheckins(original);
    expect(original.map((c) => c.id)).toEqual(originalIds);
  });
});

describe("buildNetWorthSeries", () => {
  it("sorts points chronologically", () => {
    const series = buildNetWorthSeries([demoCheckins[2], demoCheckins[0], demoCheckins[1]]);
    expect(series.map((item) => item.date)).toEqual(["2026-03-01", "2026-04-01", "2026-05-01"]);
  });

  it("maps netWorth and annualSpending correctly", () => {
    const series = buildNetWorthSeries([demoCheckins[0]]);
    expect(series[0]).toEqual({
      date: "2026-03-01",
      netWorth: 1420000,
      annualSpending: 170000,
    });
  });

  it("returns empty array for empty input", () => {
    expect(buildNetWorthSeries([])).toEqual([]);
  });
});
