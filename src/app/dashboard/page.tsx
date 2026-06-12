"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useAppStore } from "@/store/app-store";
import { buildNetWorthSeries } from "@/features/checkins/checkin-helpers";
import { ProgressSummary } from "@/features/fire/components/progress-summary";
import { ProgressRingCard } from "@/features/fire/components/progress-ring-card";
import { MilestoneCards } from "@/features/fire/components/milestone-cards";
import { dictionaries } from "@/lib/i18n/dictionaries";

export default function DashboardPage() {
  const checkins = useAppStore((state) => state.checkins);
  const language = useAppStore((state) => state.settings.language);
  const copy = dictionaries[language];
  const series = buildNetWorthSeries(checkins);

  return (
    <div className="space-y-6">
      <ProgressSummary />
      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <section className="glass-card">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold">{copy.assetTrend}</h2>
            <p className="text-sm text-[var(--muted)]">{copy.assetTrendDesc}</p>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={series}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="netWorth" stroke="#1f9d7a" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
        <ProgressRingCard />
      </div>
      <MilestoneCards />
    </div>
  );
}
