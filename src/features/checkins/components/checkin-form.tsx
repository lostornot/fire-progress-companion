"use client";

import { useState } from "react";
import { useAppStore } from "@/store/app-store";
import { checkinSchema } from "@/features/checkins/checkin-schema";
import { dictionaries } from "@/lib/i18n/dictionaries";

export function CheckinForm() {
  const plan = useAppStore((state) => state.plan);
  const upsertCheckin = useAppStore((state) => state.upsertCheckin);
  const language = useAppStore((state) => state.settings.language);
  const copy = dictionaries[language];
  const [form, setForm] = useState({
    checkinDate: "2026-06-12",
    currentNetWorth: 1750000,
    annualSpending: 180000,
    note: "",
  });

  const handleSubmit = () => {
    const payload = {
      id: crypto.randomUUID(),
      planId: plan.id,
      createdAt: new Date().toISOString(),
      ...form,
    };

    const parsed = checkinSchema.safeParse(payload);
    if (!parsed.success) return;
    upsertCheckin(parsed.data);
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
        <label className="space-y-1">
          <span className="text-sm text-[var(--muted)]">{copy.currentNetWorth}</span>
          <input type="number" value={form.currentNetWorth} onChange={(event) => setForm({ ...form, currentNetWorth: Number(event.target.value) })} className="w-full rounded-2xl border border-[var(--line)] px-4 py-3" />
        </label>
        <label className="space-y-1">
          <span className="text-sm text-[var(--muted)]">{copy.annualSpending}</span>
          <input type="number" value={form.annualSpending} onChange={(event) => setForm({ ...form, annualSpending: Number(event.target.value) })} className="w-full rounded-2xl border border-[var(--line)] px-4 py-3" />
        </label>
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
