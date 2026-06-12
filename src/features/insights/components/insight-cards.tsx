"use client";

import { useAppStore } from "@/store/app-store";
import { buildInsights } from "@/features/insights/insight-rules";

export function InsightCards() {
  const { plan, checkins, settings } = useAppStore();
  const insights = buildInsights(plan, checkins, settings.language);

  return (
    <div className="grid gap-4">
      {insights.map((item) => (
        <article key={item.id} className="glass-card">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">{item.kind}</p>
          <h2 className="mt-3 text-2xl font-semibold">{item.title}</h2>
          <p className="mt-2 text-[var(--muted)]">{item.body}</p>
        </article>
      ))}
    </div>
  );
}
