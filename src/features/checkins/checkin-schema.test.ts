import { describe, expect, it } from "vitest";
import { checkinSchema } from "@/features/checkins/checkin-schema";

const validCheckin = {
  id: "c4",
  planId: "demo-plan",
  checkinDate: "2026-06-12",
  currentNetWorth: 1800000,
  annualSpending: 180000,
  note: "New high-water mark",
  createdAt: "2026-06-12T10:00:00.000Z",
};

describe("checkinSchema", () => {
  it("accepts a valid check-in", () => {
    expect(checkinSchema.safeParse(validCheckin).success).toBe(true);
  });

  it("accepts zero net worth", () => {
    expect(checkinSchema.safeParse({ ...validCheckin, currentNetWorth: 0 }).success).toBe(true);
  });

  it("rejects negative net worth", () => {
    expect(checkinSchema.safeParse({ ...validCheckin, currentNetWorth: -1 }).success).toBe(false);
  });

  it("rejects zero annual spending", () => {
    expect(checkinSchema.safeParse({ ...validCheckin, annualSpending: 0 }).success).toBe(false);
  });

  it("rejects negative annual spending", () => {
    expect(checkinSchema.safeParse({ ...validCheckin, annualSpending: -100 }).success).toBe(false);
  });

  it("rejects empty id", () => {
    expect(checkinSchema.safeParse({ ...validCheckin, id: "" }).success).toBe(false);
  });

  it("rejects empty planId", () => {
    expect(checkinSchema.safeParse({ ...validCheckin, planId: "" }).success).toBe(false);
  });

  it("rejects empty checkinDate", () => {
    expect(checkinSchema.safeParse({ ...validCheckin, checkinDate: "" }).success).toBe(false);
  });

  it("accepts empty note", () => {
    expect(checkinSchema.safeParse({ ...validCheckin, note: "" }).success).toBe(true);
  });

  it("rejects missing fields", () => {
    expect(checkinSchema.safeParse({}).success).toBe(false);
  });
});
