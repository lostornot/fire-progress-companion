"use client";

import { useAppStore } from "@/store/app-store";
import { sortCheckins } from "@/features/checkins/checkin-helpers";
import { dictionaries } from "@/lib/i18n/dictionaries";
import { formatCurrency } from "@/lib/formatters";

export function CheckinHistory() {
  const checkins = useAppStore((state) => state.checkins);
  const { language, currency } = useAppStore((state) => state.settings);
  const copy = dictionaries[language];
  const items = sortCheckins(checkins).reverse();

  const translateNote = (note: string) => {
    if (note in copy) return copy[note];
    return note;
  };

  return (
    <section className="glass-card space-y-4">
      <h2 className="text-2xl font-semibold">{copy.history}</h2>
      <div className="space-y-3">
        {items.length === 0 ? (
          <article className="rounded-2xl bg-[var(--surface)] p-6 text-[var(--muted)]">
            {copy.noCheckins}
          </article>
        ) : (
          items.map((item) => (
            <article key={item.id} className="rounded-2xl bg-[var(--surface)] p-4">
              <div className="flex items-center justify-between">
                <p className="font-medium">{item.checkinDate}</p>
                <p className="text-sm text-[var(--muted)]">{formatCurrency(item.currentNetWorth, currency, language)}</p>
              </div>
              <p className="mt-1 text-sm text-[var(--muted)]">{translateNote(item.note) || copy.noNote}</p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
