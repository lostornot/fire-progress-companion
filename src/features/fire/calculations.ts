export function normalizeWithdrawalRate(value: number) {
  return value > 1 ? value / 100 : value;
}

export function calculateFireMetrics(input: {
  annualSpending: number;
  currentNetWorth: number;
  withdrawalRate: number;
}) {
  const normalizedRate = normalizeWithdrawalRate(input.withdrawalRate);
  const targetAmount = input.annualSpending / normalizedRate;
  const progress = input.currentNetWorth / targetAmount;
  const gap = Math.max(targetAmount - input.currentNetWorth, 0);

  return {
    targetAmount,
    progress,
    gap,
  };
}

export function getMilestoneState(progress: number) {
  return [0.25, 0.5, 0.75, 1].map((threshold) => ({
    label: `${threshold * 100}%`,
    reached: progress >= threshold,
  }));
}
