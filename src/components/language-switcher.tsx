"use client";

import { useAppStore } from "@/store/app-store";

export function LanguageSwitcher() {
  const language = useAppStore((state) => state.settings.language);
  const updateSettings = useAppStore((state) => state.updateSettings);

  return (
    <div className="inline-flex rounded-full bg-[var(--surface)] p-1">
      {(["zh", "en"] as const).map((value) => (
        <button
          key={value}
          className={language === value ? "chip chip-active" : "chip"}
          onClick={() => updateSettings({ language: value })}
          type="button"
        >
          {value.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
