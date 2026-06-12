"use client";

import { useAppStore } from "@/store/app-store";
import { dictionaries } from "@/lib/i18n/dictionaries";

export function SettingsForm() {
  const { settings, updateSettings, resetDemo, signOutDemo } = useAppStore();
  const copy = dictionaries[settings.language];

  return (
    <section className="glass-card space-y-5">
      <h1 className="text-3xl font-semibold">{copy.settings}</h1>
      <label className="block space-y-2">
        <span className="text-sm text-[var(--muted)]">{copy.defaultWithdrawalRate}</span>
        <input
          type="number"
          step="0.1"
          value={settings.defaultWithdrawalRate * 100}
          onChange={(event) => updateSettings({ defaultWithdrawalRate: Number(event.target.value) / 100 })}
          className="w-full rounded-2xl border border-[var(--line)] px-4 py-3"
        />
      </label>
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={resetDemo} className="rounded-full bg-[var(--warning)] px-5 py-3 text-white">
          {copy.resetDemo}
        </button>
        <button type="button" onClick={signOutDemo} className="rounded-full border border-[var(--line)] px-5 py-3">
          {copy.clearSession}
        </button>
      </div>
    </section>
  );
}
