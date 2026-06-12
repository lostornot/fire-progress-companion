"use client";

import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/app-store";
import { dictionaries } from "@/lib/i18n/dictionaries";

export default function LoginPage() {
  const router = useRouter();
  const signInDemo = useAppStore((state) => state.signInDemo);
  const language = useAppStore((state) => state.settings.language);
  const copy = dictionaries[language];

  const handleLogin = (provider: "google" | "apple") => {
    signInDemo(provider);
    router.push("/dashboard");
  };

  return (
    <div className="mx-auto max-w-xl">
      <section className="glass-card space-y-5">
        <h1 className="text-3xl font-semibold">{copy.loginTitle}</h1>
        <p className="text-[var(--muted)]">{copy.loginDesc}</p>
        <div className="grid gap-3">
          <button className="rounded-2xl bg-[var(--fg)] px-5 py-4 text-white" onClick={() => handleLogin("google")} type="button">
            {copy.continueGoogle}
          </button>
          <button className="rounded-2xl border border-[var(--line)] px-5 py-4" onClick={() => handleLogin("apple")} type="button">
            {copy.continueApple}
          </button>
        </div>
      </section>
    </div>
  );
}
