"use client";

import { useAppStore } from "@/store/app-store";
import { calculateFireMetrics } from "@/features/fire/calculations";
import { formatPercent } from "@/lib/formatters";
import { dictionaries } from "@/lib/i18n/dictionaries";

export function ProgressRingCard() {
  const { plan, checkins, settings } = useAppStore();
  const copy = dictionaries[settings.language];

  if (!plan || checkins.length === 0) return null;

  const latest = checkins[checkins.length - 1];
  const metrics = calculateFireMetrics({
    annualSpending: latest.annualSpending,
    currentNetWorth: latest.currentNetWorth,
    withdrawalRate: plan.withdrawalRate,
  });
  const progress = Math.min(metrics.progress, 1);
  const angle = progress * 360;

  return (
    <section className="glass-card flex flex-col items-center justify-center gap-4">
      <div
        className="grid h-56 w-56 place-items-center rounded-full"
        style={{
          background: `conic-gradient(var(--accent) ${angle}deg, rgba(31, 41, 51, 0.08) ${angle}deg)`,
        }}
      >
        <div className="grid h-40 w-40 place-items-center rounded-full bg-white">
          <div className="text-center">
            <p className="text-sm text-[var(--muted)]">{copy.currentProgress}</p>
            <p className="text-3xl font-semibold">{formatPercent(metrics.progress, settings.language)}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
