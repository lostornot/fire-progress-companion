"use client";

import { formatCurrency, formatPercent, formatDate } from "@/lib/formatters";
import { useAppStore } from "@/store/app-store";
import { calculateFireMetrics } from "@/features/fire/calculations";
import { dictionaries } from "@/lib/i18n/dictionaries";

export function ProgressSummary() {
  const { plan, checkins, settings } = useAppStore();
  const copy = dictionaries[settings.language];

  if (!plan || checkins.length === 0) {
    return (
      <section className="glass-card p-8 text-center">
        <p className="text-lg text-[var(--muted)]">{copy.noDataYet}</p>
      </section>
    );
  }

  const latest = checkins[checkins.length - 1];
  const metrics = calculateFireMetrics({
    annualSpending: latest.annualSpending,
    currentNetWorth: latest.currentNetWorth,
    withdrawalRate: plan.withdrawalRate,
  });

  const cards = [
    [copy.target, formatCurrency(metrics.targetAmount, settings.currency, settings.language)],
    [copy.currentNetWorth, formatCurrency(latest.currentNetWorth, settings.currency, settings.language)],
    [copy.progress, formatPercent(metrics.progress, settings.language)],
    [copy.gap, formatCurrency(metrics.gap, settings.currency, settings.language)],
    [copy.updated, formatDate(plan.updatedAt, settings.language)],
  ];

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      {cards.map(([label, value], i) => (
        <article key={label} className="glass-card animate-slide-up p-5" style={{ "--delay": i } as React.CSSProperties}>
          <p className="text-sm text-[var(--muted)]">{label}</p>
          <p className="mt-2 text-2xl font-semibold">{value}</p>
        </article>
      ))}
    </section>
  );
}
