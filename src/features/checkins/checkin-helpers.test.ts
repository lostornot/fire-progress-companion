import { describe, expect, it } from "vitest";
import { demoCheckins } from "@/mock/demo-data";
import { buildNetWorthSeries } from "@/features/checkins/checkin-helpers";

describe("buildNetWorthSeries", () => {
  it("sorts points chronologically", () => {
    const series = buildNetWorthSeries([demoCheckins[2], demoCheckins[0], demoCheckins[1]]);
    expect(series.map((item) => item.date)).toEqual(["2026-03-01", "2026-04-01", "2026-05-01"]);
  });
});
