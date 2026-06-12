import { calculateFireMetrics, getMilestoneState } from "@/features/fire/calculations";
import { sortCheckins } from "@/features/checkins/checkin-helpers";
import type { Checkin, FirePlan, Language } from "@/types/domain";
import { dictionaries } from "@/lib/i18n/dictionaries";

export type Insight = {
  id: string;
  kind: "growth" | "spending" | "target" | "milestone";
  title: string;
  body: string;
};

export function buildInsights(plan: FirePlan, checkins: Checkin[], language: Language): Insight[] {
  const copy = dictionaries[language];
  const sorted = sortCheckins(checkins);
  const latest = sorted[sorted.length - 1];
  const previous = sorted[sorted.length - 2];
  const metrics = calculateFireMetrics({
    annualSpending: latest.annualSpending,
    currentNetWorth: latest.currentNetWorth,
    withdrawalRate: plan.withdrawalRate,
  });

  const growthDelta = latest.currentNetWorth - previous.currentNetWorth;
  const priorGrowthDelta = previous.currentNetWorth - sorted[Math.max(sorted.length - 3, 0)].currentNetWorth;
  const milestones = getMilestoneState(metrics.progress).filter((item) => item.reached);
  const insights: Insight[] = [];

  if (growthDelta > priorGrowthDelta) {
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

  insights.push({
    id: "target",
    kind: "target",
    title: copy.targetUpdated,
    body: `${copy.target}: ${latest.annualSpending}`,
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
