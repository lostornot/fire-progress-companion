import { describe, expect, it } from "vitest";
import { checkinSchema } from "@/features/checkins/checkin-schema";

describe("checkinSchema", () => {
  it("accepts a valid check-in", () => {
    expect(
      checkinSchema.safeParse({
        id: "c4",
        planId: "demo-plan",
        checkinDate: "2026-06-12",
        currentNetWorth: 1800000,
        annualSpending: 180000,
        note: "New high-water mark",
        createdAt: "2026-06-12T10:00:00.000Z",
      }).success,
    ).toBe(true);
  });

  it("rejects negative net worth values", () => {
    expect(
      checkinSchema.safeParse({
        id: "c4",
        planId: "demo-plan",
        checkinDate: "2026-06-12",
        currentNetWorth: -1,
        annualSpending: 180000,
        note: "",
        createdAt: "2026-06-12T10:00:00.000Z",
      }).success,
    ).toBe(false);
  });
});
