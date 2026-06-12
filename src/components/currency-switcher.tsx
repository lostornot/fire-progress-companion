"use client";

import { useAppStore } from "@/store/app-store";

export function CurrencySwitcher() {
  const currency = useAppStore((state) => state.settings.currency);
  const updateSettings = useAppStore((state) => state.updateSettings);

  return (
    <div className="inline-flex rounded-full bg-[var(--surface)] p-1">
      {(["CNY", "USD"] as const).map((value) => (
        <button
          key={value}
          className={currency === value ? "chip chip-active" : "chip"}
          onClick={() => updateSettings({ currency: value })}
          type="button"
        >
          {value}
        </button>
      ))}
    </div>
  );
}
