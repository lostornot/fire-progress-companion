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

  it("converts 3.5 into 0.035", () => {
    expect(normalizeWithdrawalRate(3.5)).toBeCloseTo(0.035);
  });

  it("preserves decimal input", () => {
    expect(normalizeWithdrawalRate(0.035)).toBe(0.035);
  });

  it("preserves 0.04", () => {
    expect(normalizeWithdrawalRate(0.04)).toBe(0.04);
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

  it("handles percentage withdrawal rate input (4 instead of 0.04)", () => {
    const result = calculateFireMetrics({
      annualSpending: 120000,
      currentNetWorth: 1500000,
      withdrawalRate: 4,
    });
    expect(result.targetAmount).toBe(3000000);
  });

  it("progress is 1.0 at exact FIRE target", () => {
    const result = calculateFireMetrics({
      annualSpending: 100000,
      currentNetWorth: 2500000,
      withdrawalRate: 0.04,
    });
    expect(result.progress).toBe(1.0);
    expect(result.gap).toBe(0);
  });

  it("progress exceeds 1.0 when above FIRE target", () => {
    const result = calculateFireMetrics({
      annualSpending: 100000,
      currentNetWorth: 3000000,
      withdrawalRate: 0.04,
    });
    expect(result.progress).toBeGreaterThan(1.0);
  });

  it("handles zero current net worth", () => {
    const result = calculateFireMetrics({
      annualSpending: 100000,
      currentNetWorth: 0,
      withdrawalRate: 0.04,
    });
    expect(result.progress).toBe(0);
    expect(result.gap).toBe(result.targetAmount);
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

  it("all milestones reached at 100%", () => {
    const milestones = getMilestoneState(1.0);
    expect(milestones.every((m) => m.reached)).toBe(true);
  });

  it("no milestones reached at 0%", () => {
    const milestones = getMilestoneState(0);
    expect(milestones.every((m) => !m.reached)).toBe(true);
  });

  it("exactly 25% reaches first milestone", () => {
    const milestones = getMilestoneState(0.25);
    expect(milestones[0].reached).toBe(true);
    expect(milestones[1].reached).toBe(false);
  });
});
