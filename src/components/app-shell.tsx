"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppStore } from "@/store/app-store";
import { dictionaries } from "@/lib/i18n/dictionaries";
import { LanguageSwitcher } from "@/components/language-switcher";
import { CurrencySwitcher } from "@/components/currency-switcher";

const routes = [
  { href: "/", key: "appName" },
  { href: "/dashboard", key: "dashboard" },
  { href: "/checkins", key: "checkins" },
  { href: "/insights", key: "insights" },
  { href: "/settings", key: "settings" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const bootstrap = useAppStore((state) => state.bootstrap);
  const ready = useAppStore((state) => state.ready);
  const session = useAppStore((state) => state.session);
  const signOut = useAppStore((state) => state.signOut);
  const language = useAppStore((state) => state.settings.language);
  const copy = dictionaries[language];

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
          <p className="mt-4 text-sm text-[var(--muted)]">{copy.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <header className="border-b border-[var(--line)] bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <nav className="flex flex-wrap items-center gap-3">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={pathname === route.href ? "nav-link nav-link-active" : "nav-link"}
              >
                {copy[route.key]}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <CurrencySwitcher />
            {session && (
              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-full border border-[var(--line)] px-3 py-1.5 text-sm text-[var(--muted)] transition hover:bg-[var(--surface)] hover:text-[var(--fg)]"
              >
                {copy.signOut}
              </button>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
