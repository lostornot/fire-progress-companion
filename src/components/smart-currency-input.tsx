"use client";

import type { Currency, Language } from "@/types/domain";
import { formatCurrency } from "@/lib/formatters";

type Props = {
  value: number;
  onChange: (value: number) => void;
  label: string;
  language: Language;
  currency: Currency;
};

function getStep(value: number): number {
  if (value >= 1_000_000) return 100_000;
  if (value >= 100_000) return 10_000;
  if (value >= 10_000) return 1_000;
  return 100;
}

export function SmartCurrencyInput({ value, onChange, label, language, currency }: Props) {
  const step = getStep(value);

  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm text-[var(--muted)]">{label}</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--surface)] text-lg font-semibold text-[var(--foreground)] transition-colors hover:bg-[var(--line)]"
          onClick={() => onChange(Math.max(0, value - step))}
        >
          −
        </button>
        <div className="flex-1 rounded-2xl border border-[var(--line)] px-4 py-3 text-center font-medium tabular-nums">
          {formatCurrency(value, currency, language)}
        </div>
        <button
          type="button"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--surface)] text-lg font-semibold text-[var(--foreground)] transition-colors hover:bg-[var(--line)]"
          onClick={() => onChange(value + step)}
        >
          +
        </button>
      </div>
    </label>
  );
}
