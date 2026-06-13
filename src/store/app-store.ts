"use client";

import { create } from "zustand";
import { calculateFireMetrics } from "@/features/fire/calculations";
import type { AppSettings, Checkin, FirePlan, Profile } from "@/types/domain";

type Session = { provider: string; userId: string } | null;

type AppState = {
  ready: boolean;
  mode: "supabase" | "demo";
  session: Session;
  profile: Profile;
  plan: FirePlan | null;
  checkins: Checkin[];
  settings: AppSettings;
  bootstrap: () => Promise<void>;
  signInDemo: (provider: "google" | "apple") => Promise<void>;
  signOut: () => Promise<void>;
  updateSettings: (partial: Partial<AppSettings>) => Promise<void>;
  upsertCheckin: (input: Omit<Checkin, "id" | "createdAt" | "planId"> & { id?: string; planId?: string }) => Promise<void>;
  resetDemo: () => void;
};

const defaultProfile: Profile = {
  id: "demo-user",
  displayName: "Demo User",
  avatarUrl: "",
  preferredLanguage: "zh",
  preferredCurrency: "CNY",
};

const defaultSettings: AppSettings = {
  language: "zh",
  currency: "CNY",
  defaultWithdrawalRate: 0.04,
  demoMode: true,
};

const defaultPlan: FirePlan = {
  id: "demo-plan",
  userId: "demo-user",
  annualSpending: 180000,
  withdrawalRate: 0.04,
  targetAmount: 4500000,
  currency: "CNY",
  updatedAt: new Date().toISOString(),
};

const defaultCheckins: Checkin[] = [
  { id: "c1", planId: "demo-plan", checkinDate: "2026-03-01", currentNetWorth: 1420000, annualSpending: 170000, note: "noteSteady", createdAt: "2026-03-01T10:00:00.000Z" },
  { id: "c2", planId: "demo-plan", checkinDate: "2026-04-01", currentNetWorth: 1515000, annualSpending: 175000, note: "noteBonus", createdAt: "2026-04-01T10:00:00.000Z" },
  { id: "c3", planId: "demo-plan", checkinDate: "2026-05-01", currentNetWorth: 1650000, annualSpending: 180000, note: "noteTravel", createdAt: "2026-05-01T10:00:00.000Z" },
];

const STORAGE_KEY = "fire-demo-state";
const SESSION_KEY = "fire-demo-session";

function loadDemoFromStorage() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveDemoToStorage(data: { profile: Profile; plan: FirePlan; checkins: Checkin[]; settings: AppSettings }) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

const isSupabaseConfigured =
  typeof window !== "undefined" &&
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-supabase");

export const useAppStore = create<AppState>((set, get) => ({
  ready: false,
  mode: "demo",
  session: null,
  profile: defaultProfile,
  plan: defaultPlan,
  checkins: defaultCheckins,
  settings: defaultSettings,

  bootstrap: async () => {
    if (isSupabaseConfigured) {
      try {
        const api = await import("@/lib/supabase/api");
        const user = await api.getUser();
        if (user) {
          const [profile, plan, checkins] = await Promise.all([
            api.getProfile(user.id),
            api.getFirePlan(user.id),
            api.getCheckins(user.id),
          ]);
          set({
            ready: true,
            mode: "supabase",
            session: { provider: "supabase", userId: user.id },
            profile: profile ? {
              id: profile.id,
              displayName: profile.display_name,
              avatarUrl: profile.avatar_url,
              preferredLanguage: profile.preferred_language as Profile["preferredLanguage"],
              preferredCurrency: profile.preferred_currency as Profile["preferredCurrency"],
            } : defaultProfile,
            plan: plan ? {
              id: plan.id,
              userId: plan.user_id,
              annualSpending: Number(plan.annual_spending),
              withdrawalRate: Number(plan.withdrawal_rate),
              targetAmount: Number(plan.target_amount),
              currency: plan.currency as FirePlan["currency"],
              updatedAt: plan.updated_at,
            } : null,
            checkins: checkins.map((c) => ({
              id: c.id,
              planId: c.plan_id,
              checkinDate: c.checkin_date,
              currentNetWorth: Number(c.current_net_worth),
              annualSpending: Number(c.annual_spending),
              note: c.note,
              createdAt: c.created_at,
            })),
            settings: profile ? {
              language: profile.preferred_language as AppSettings["language"],
              currency: profile.preferred_currency as AppSettings["currency"],
              defaultWithdrawalRate: 0.04,
              demoMode: false,
            } : defaultSettings,
          });

          api.onAuthStateChange(async (newUser: unknown) => {
            const u = newUser as { id: string } | null;
            if (u) {
              const [p, pl, c] = await Promise.all([
                api.getProfile(u.id),
                api.getFirePlan(u.id),
                api.getCheckins(u.id),
              ]);
              set({
                session: { provider: "supabase", userId: u.id },
                profile: p ? { id: p.id, displayName: p.display_name, avatarUrl: p.avatar_url, preferredLanguage: p.preferred_language as Profile["preferredLanguage"], preferredCurrency: p.preferred_currency as Profile["preferredCurrency"] } : defaultProfile,
                plan: pl ? { id: pl.id, userId: pl.user_id, annualSpending: Number(pl.annual_spending), withdrawalRate: Number(pl.withdrawal_rate), targetAmount: Number(pl.target_amount), currency: pl.currency as FirePlan["currency"], updatedAt: pl.updated_at } : null,
                checkins: c.map((ci) => ({ id: ci.id, planId: ci.plan_id, checkinDate: ci.checkin_date, currentNetWorth: Number(ci.current_net_worth), annualSpending: Number(ci.annual_spending), note: ci.note, createdAt: ci.created_at })),
              });
            } else {
              set({ session: null, profile: defaultProfile, plan: null, checkins: [], settings: defaultSettings });
            }
          });
          return;
        }
      } catch (e) {
        console.warn("Supabase bootstrap failed, falling back to demo:", e);
      }
    }

    // Demo mode fallback
    const stored = loadDemoFromStorage();
    const raw = typeof window !== "undefined" ? localStorage.getItem(SESSION_KEY) : null;
    let session = null;
    try {
      session = raw ? JSON.parse(raw) : null;
    } catch {
      session = null;
    }
    set({
      ready: true,
      mode: "demo",
      session,
      profile: stored?.profile ?? defaultProfile,
      plan: stored?.plan ?? defaultPlan,
      checkins: stored?.checkins ?? defaultCheckins,
      settings: stored?.settings ?? defaultSettings,
    });
  },

  signInDemo: async (provider) => {
    if (isSupabaseConfigured) {
      const { signInWithProvider } = await import("@/lib/supabase/api");
      await signInWithProvider(provider);
    } else {
      const session = { provider, userId: "demo-user" };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      set({ session, mode: "demo" });
    }
  },

  signOut: async () => {
    if (get().mode === "supabase") {
      const { signOut } = await import("@/lib/supabase/api");
      await signOut();
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
    set({ session: null, plan: null, checkins: [] });
  },

  updateSettings: async (partial) => {
    const nextSettings = { ...get().settings, ...partial };
    const { profile, plan, checkins } = get();

    if (get().mode === "supabase" && get().session) {
      const { updateProfile } = await import("@/lib/supabase/api");
      await updateProfile(get().session!.userId, {
        preferred_language: nextSettings.language,
        preferred_currency: nextSettings.currency,
      });
    } else if (plan) {
      saveDemoToStorage({ profile, plan, checkins, settings: nextSettings });
    }

    set({ settings: nextSettings });
  },

  upsertCheckin: async (input) => {
    const { plan, checkins, settings, session } = get();
    const latest = input;

    const metrics = calculateFireMetrics({
      annualSpending: latest.annualSpending,
      currentNetWorth: latest.currentNetWorth,
      withdrawalRate: plan?.withdrawalRate ?? 0.04,
    });

    if (get().mode === "supabase" && session) {
      const api = await import("@/lib/supabase/api");

      // Create plan first if none exists
      let currentPlanId = plan?.id;
      if (!currentPlanId) {
        await api.upsertFirePlan({
          user_id: session.userId,
          annual_spending: latest.annualSpending,
          withdrawal_rate: 0.04,
          target_amount: metrics.targetAmount,
          currency: settings.currency,
        });
        const newPlan = await api.getFirePlan(session.userId);
        currentPlanId = newPlan?.id;
      }

      await api.upsertCheckin({
        plan_id: currentPlanId!,
        user_id: session.userId,
        checkin_date: latest.checkinDate,
        current_net_worth: latest.currentNetWorth,
        annual_spending: latest.annualSpending,
        note: latest.note,
      });

      await api.upsertFirePlan({
        id: currentPlanId!,
        user_id: session.userId,
        annual_spending: latest.annualSpending,
        target_amount: metrics.targetAmount,
      });

      const freshCheckins = await api.getCheckins(session.userId);
      const freshPlan = await api.getFirePlan(session.userId);

      set({
        checkins: freshCheckins.map((c) => ({
          id: c.id, planId: c.plan_id, checkinDate: c.checkin_date,
          currentNetWorth: Number(c.current_net_worth), annualSpending: Number(c.annual_spending),
          note: c.note, createdAt: c.created_at,
        })),
        plan: freshPlan ? {
          id: freshPlan.id, userId: freshPlan.user_id,
          annualSpending: Number(freshPlan.annual_spending), withdrawalRate: Number(freshPlan.withdrawal_rate),
          targetAmount: Number(freshPlan.target_amount), currency: freshPlan.currency as FirePlan["currency"],
          updatedAt: freshPlan.updated_at,
        } : null,
      });
    } else {
      // Demo mode
      const newCheckin: Checkin = {
        id: input.id ?? crypto.randomUUID(),
        planId: plan?.id ?? "demo-plan",
        checkinDate: latest.checkinDate,
        currentNetWorth: latest.currentNetWorth,
        annualSpending: latest.annualSpending,
        note: latest.note,
        createdAt: new Date().toISOString(),
      };
      const updatedCheckins = [...checkins.filter((c) => c.id !== newCheckin.id), newCheckin]
        .sort((a, b) => a.checkinDate.localeCompare(b.checkinDate));
      const updatedPlan: FirePlan = {
        ...defaultPlan,
        ...plan,
        annualSpending: latest.annualSpending,
        targetAmount: metrics.targetAmount,
        updatedAt: new Date().toISOString(),
      };
      saveDemoToStorage({ profile: get().profile, plan: updatedPlan, checkins: updatedCheckins, settings });
      set({ checkins: updatedCheckins, plan: updatedPlan });
    }
  },

  resetDemo: () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SESSION_KEY);
    set({
      session: null,
      profile: defaultProfile,
      plan: defaultPlan,
      checkins: defaultCheckins,
      settings: defaultSettings,
    });
  },
}));
