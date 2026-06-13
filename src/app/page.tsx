"use client";

import Link from "next/link";
import { useAppStore } from "@/store/app-store";
import { dictionaries } from "@/lib/i18n/dictionaries";
import { QuickCalcCard } from "@/features/fire/components/quick-calc-card";

export default function HomePage() {
  const language = useAppStore((state) => state.settings.language);
  const copy = dictionaries[language];

  return (
    <div className="space-y-10">
      <section className="flex flex-col items-center gap-6 text-center">
        <span className="animate-float rounded-full bg-[var(--accent-soft)] px-4 py-2 text-sm text-[var(--fg)]">
          {copy.appName}
        </span>
        <h1 className="animate-slide-up max-w-2xl bg-gradient-to-r from-[var(--accent)] to-[#34d399] bg-clip-text text-4xl font-semibold leading-tight text-transparent md:text-5xl">
          {copy.heroTitle}{copy.heroSubtitle}
        </h1>
        <p className="max-w-xl text-lg text-[var(--muted)]">
          {copy.heroBody}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/login" className="rounded-full bg-[var(--accent)] px-6 py-3 text-white">
            {copy.enterDemo}
          </Link>
          <Link href="/dashboard" className="rounded-full border border-[var(--line)] px-6 py-3">
            {copy.viewDemo}
          </Link>
        </div>
      </section>
      <QuickCalcCard />
    </div>
  );
}
