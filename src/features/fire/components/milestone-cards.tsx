"use client";

import { getMilestoneState, calculateFireMetrics } from "@/features/fire/calculations";
import { useAppStore } from "@/store/app-store";
import { dictionaries } from "@/lib/i18n/dictionaries";

export function MilestoneCards() {
  const { plan, checkins, settings } = useAppStore();
  const copy = dictionaries[settings.language];

  if (!plan || checkins.length === 0) return null;

  const latest = checkins[checkins.length - 1];
  const metrics = calculateFireMetrics({
    annualSpending: latest.annualSpending,
    currentNetWorth: latest.currentNetWorth,
    withdrawalRate: plan.withdrawalRate,
  });

  return (
    <section className="grid gap-3 md:grid-cols-4">
      {getMilestoneState(metrics.progress).map((item) => (
        <article
          key={item.label}
          className={item.reached ? "glass-card border-[var(--accent)] bg-[var(--accent-soft)]" : "glass-card"}
        >
          <p className="text-sm text-[var(--muted)]">{copy.milestone}</p>
          <p className="mt-2 text-2xl font-semibold">{item.label}</p>
          <p className="mt-1 text-sm">{item.reached ? copy.reached : copy.inProgress}</p>
        </article>
      ))}
    </section>
  );
}
