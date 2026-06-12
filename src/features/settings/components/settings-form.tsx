"use client";

import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/app-store";
import { dictionaries } from "@/lib/i18n/dictionaries";

export function SettingsForm() {
  const router = useRouter();
  const { settings, updateSettings, resetDemo, signOut, mode, session } = useAppStore();
  const copy = dictionaries[settings.language];

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <section className="glass-card space-y-5">
      <h1 className="text-3xl font-semibold">{copy.settings}</h1>

      {mode === "supabase" && (
        <div className="rounded-2xl bg-[var(--accent-soft)] p-4">
          <p className="text-sm text-[var(--fg)]">{copy.signedInStatus}</p>
        </div>
      )}

      {mode === "demo" && (
        <div className="rounded-2xl bg-[var(--surface)] p-4">
          <p className="text-sm text-[var(--muted)]">{copy.demoModeStatus}</p>
        </div>
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
        {session && (
          <button type="button" onClick={handleSignOut} className="rounded-full bg-[var(--fg)] px-5 py-3 text-white">
            {copy.signOut}
          </button>
        )}
        {mode === "demo" && (
          <button type="button" onClick={resetDemo} className="rounded-full bg-[var(--warning)] px-5 py-3 text-white">
            {copy.resetDemo}
          </button>
        )}
      </div>
    </section>
  );
}
