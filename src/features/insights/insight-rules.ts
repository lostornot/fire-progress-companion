import { calculateFireMetrics, getMilestoneState } from "@/features/fire/calculations";
import { sortCheckins } from "@/features/checkins/checkin-helpers";
import type { Checkin, FirePlan, Language } from "@/types/domain";
import { dictionaries } from "@/lib/i18n/dictionaries";
import { formatCurrency } from "@/lib/formatters";

export type Insight = {
  id: string;
  kind: "growth" | "spending" | "target" | "milestone";
  title: string;
  body: string;
};

export function buildInsights(plan: FirePlan, checkins: Checkin[], language: Language): Insight[] {
  const copy = dictionaries[language];
  const sorted = sortCheckins(checkins);

  if (sorted.length === 0) return [];

  const latest = sorted[sorted.length - 1];
  const metrics = calculateFireMetrics({
    annualSpending: latest.annualSpending,
    currentNetWorth: latest.currentNetWorth,
    withdrawalRate: plan.withdrawalRate,
  });

  const milestones = getMilestoneState(metrics.progress).filter((item) => item.reached);
  const insights: Insight[] = [];

  if (sorted.length >= 2) {
    const previous = sorted[sorted.length - 2];
    const growthDelta = latest.currentNetWorth - previous.currentNetWorth;
    const priorIndex = Math.max(sorted.length - 3, 0);
    const priorGrowthDelta = previous.currentNetWorth - sorted[priorIndex].currentNetWorth;

    if (growthDelta > priorGrowthDelta && sorted.length >= 3) {
      insights.push({
        id: "growth",
        kind: "growth",
        title: copy.growthSpeedUp,
        body: copy.growthSpeedUpDesc,
      });
    }

    if (latest.annualSpending > previous.annualSpending) {
      insights.push({
        id: "spending",
        kind: "spending",
        title: copy.spendingUp,
        body: copy.spendingUpDesc,
      });
    }
  }

  insights.push({
    id: "target",
    kind: "target",
    title: copy.targetUpdated,
    body: `${copy.target}: ${formatCurrency(metrics.targetAmount, plan.currency, language)}`,
  });

  insights.push({
    id: "milestone",
    kind: "milestone",
    title: copy.milestoneReached,
    body: milestones.length > 0
      ? `${copy.reached} ${milestones[milestones.length - 1].label}`
      : copy.milestoneApproaching,
  });

  return insights;
}
