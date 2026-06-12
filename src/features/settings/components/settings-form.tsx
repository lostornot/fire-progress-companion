"use client";

import { useAppStore } from "@/store/app-store";
import { dictionaries } from "@/lib/i18n/dictionaries";

export function SettingsForm() {
  const { settings, updateSettings, resetDemo, signOut, mode } = useAppStore();
  const copy = dictionaries[settings.language];

  return (
    <section className="glass-card space-y-5">
      <h1 className="text-3xl font-semibold">{copy.settings}</h1>
      {mode === "supabase" && (
        <p className="text-sm text-[var(--muted)]">Account mode — data is saved to the cloud.</p>
      )}
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
        {mode === "demo" && (
          <button type="button" onClick={resetDemo} className="rounded-full bg-[var(--warning)] px-5 py-3 text-white">
            {copy.resetDemo}
          </button>
        )}
        <button type="button" onClick={signOut} className="rounded-full border border-[var(--line)] px-5 py-3">
          {mode === "supabase" ? copy.clearSession : copy.clearSession}
        </button>
      </div>
    </section>
  );
}
