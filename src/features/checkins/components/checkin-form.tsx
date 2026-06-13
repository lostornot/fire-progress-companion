"use client";

import { useState } from "react";
import { useAppStore } from "@/store/app-store";
import { dictionaries } from "@/lib/i18n/dictionaries";
import { SmartCurrencyInput } from "@/components/smart-currency-input";

export function CheckinForm() {
  const upsertCheckin = useAppStore((state) => state.upsertCheckin);
  const { language, currency } = useAppStore((state) => state.settings);
  const copy = dictionaries[language];
  const [form, setForm] = useState({
    checkinDate: new Date().toISOString().slice(0, 10),
    currentNetWorth: 1750000,
    annualSpending: 180000,
    note: "",
  });

  const handleSubmit = async () => {
    await upsertCheckin({
      checkinDate: form.checkinDate,
      currentNetWorth: form.currentNetWorth,
      annualSpending: form.annualSpending,
      note: form.note,
    });
    setForm({ ...form, note: "" });
  };

  return (
    <section className="glass-card space-y-4">
      <h2 className="text-2xl font-semibold">{copy.addCheckin}</h2>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm text-[var(--muted)]">{copy.checkinDate}</span>
          <input type="date" value={form.checkinDate} onChange={(event) => setForm({ ...form, checkinDate: event.target.value })} className="w-full rounded-2xl border border-[var(--line)] px-4 py-3" />
        </label>
        <SmartCurrencyInput label={copy.currentNetWorth} value={form.currentNetWorth} onChange={(v) => setForm({ ...form, currentNetWorth: v })} language={language} currency={currency} />
        <SmartCurrencyInput label={copy.annualSpending} value={form.annualSpending} onChange={(v) => setForm({ ...form, annualSpending: v })} language={language} currency={currency} />
        <label className="space-y-1">
          <span className="text-sm text-[var(--muted)]">{copy.note}</span>
          <input type="text" value={form.note} placeholder={copy.optionalNote} onChange={(event) => setForm({ ...form, note: event.target.value })} className="w-full rounded-2xl border border-[var(--line)] px-4 py-3" />
        </label>
      </div>
      <button type="button" className="rounded-full bg-[var(--accent)] px-5 py-3 text-white" onClick={handleSubmit}>
        {copy.saveCheckin}
      </button>
    </section>
  );
}
