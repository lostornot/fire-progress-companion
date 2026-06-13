"use client";

import { useState } from "react";
import { calculateFireMetrics, normalizeWithdrawalRate } from "@/features/fire/calculations";
import { useAppStore } from "@/store/app-store";
import { formatCurrency, formatPercent } from "@/lib/formatters";
import { dictionaries } from "@/lib/i18n/dictionaries";
import { SmartCurrencyInput } from "@/components/smart-currency-input";

export function QuickCalcCard() {
  const { language, currency, defaultWithdrawalRate } = useAppStore((state) => state.settings);
  const copy = dictionaries[language];
  const [annualSpending, setAnnualSpending] = useState(180000);
  const [currentNetWorth, setCurrentNetWorth] = useState(1650000);
  const [withdrawalRate, setWithdrawalRate] = useState(defaultWithdrawalRate * 100);

  const metrics = calculateFireMetrics({
    annualSpending,
    currentNetWorth,
    withdrawalRate: normalizeWithdrawalRate(withdrawalRate),
  });

  return (
    <section className="glass-card space-y-4">
      <h2 className="text-2xl font-semibold">FIRE</h2>
      <div className="grid gap-3 md:grid-cols-3">
        <SmartCurrencyInput label={copy.annualSpending} value={annualSpending} onChange={setAnnualSpending} language={language} currency={currency} />
        <SmartCurrencyInput label={copy.currentNetWorth} value={currentNetWorth} onChange={setCurrentNetWorth} language={language} currency={currency} />
        <label className="space-y-2">
          <span className="text-sm text-[var(--muted)]">{copy.withdrawalRate}</span>
          <input
            className="w-full rounded-2xl border border-[var(--line)] px-4 py-3"
            type="number"
            value={withdrawalRate}
            step="0.1"
            onChange={(event) => setWithdrawalRate(Number(event.target.value))}
          />
        </label>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl bg-[var(--surface)] p-4">
          <p className="text-sm text-[var(--muted)]">{copy.target}</p>
          <p className="text-xl font-semibold">{formatCurrency(metrics.targetAmount, currency, language)}</p>
        </div>
        <div className="rounded-2xl bg-[var(--surface)] p-4">
          <p className="text-sm text-[var(--muted)]">{copy.progress}</p>
          <p className="text-xl font-semibold">{formatPercent(metrics.progress, language)}</p>
        </div>
        <div className="rounded-2xl bg-[var(--surface)] p-4">
          <p className="text-sm text-[var(--muted)]">{copy.gap}</p>
          <p className="text-xl font-semibold">{formatCurrency(metrics.gap, currency, language)}</p>
        </div>
      </div>
    </section>
  );
}
