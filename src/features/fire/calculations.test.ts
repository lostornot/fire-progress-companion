import { describe, expect, it } from "vitest";
import {
  calculateFireMetrics,
  getMilestoneState,
  normalizeWithdrawalRate,
} from "@/features/fire/calculations";

describe("normalizeWithdrawalRate", () => {
  it("converts 4 into 0.04", () => {
    expect(normalizeWithdrawalRate(4)).toBe(0.04);
  });

  it("preserves decimal input", () => {
    expect(normalizeWithdrawalRate(0.035)).toBe(0.035);
  });
});

describe("calculateFireMetrics", () => {
  it("computes target, progress, and gap", () => {
    expect(
      calculateFireMetrics({
        annualSpending: 120000,
        currentNetWorth: 1500000,
        withdrawalRate: 0.04,
      }),
    ).toEqual({
      targetAmount: 3000000,
      progress: 0.5,
      gap: 1500000,
    });
  });

  it("clamps the gap at zero after reaching FIRE", () => {
    expect(
      calculateFireMetrics({
        annualSpending: 100000,
        currentNetWorth: 3000000,
        withdrawalRate: 0.04,
      }).gap,
    ).toBe(0);
  });
});

describe("getMilestoneState", () => {
  it("marks completed milestones up to current progress", () => {
    expect(getMilestoneState(0.52)).toEqual([
      { label: "25%", reached: true },
      { label: "50%", reached: true },
      { label: "75%", reached: false },
      { label: "100%", reached: false },
    ]);
  });
});
