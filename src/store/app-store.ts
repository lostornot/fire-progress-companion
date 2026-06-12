"use client";

import { create } from "zustand";
import { calculateFireMetrics } from "@/features/fire/calculations";
import { createDemoSession, clearDemoSession, readDemoSession } from "@/mock/mock-auth";
import { loadDemoState, saveDemoState } from "@/mock/mock-repository";
import type { AppSettings, Checkin, FirePlan, Profile } from "@/types/domain";

type AppState = {
  session: { provider: "google" | "apple"; userId: string; createdAt: string } | null;
  profile: Profile;
  plan: FirePlan;
  checkins: Checkin[];
  settings: AppSettings;
  bootstrap: () => void;
  signInDemo: (provider: "google" | "apple") => void;
  signOutDemo: () => void;
  updateSettings: (partial: Partial<AppSettings>) => void;
  upsertCheckin: (input: Checkin) => void;
  resetDemo: () => void;
};

const seed = loadDemoState();

export const useAppStore = create<AppState>((set, get) => ({
  session: null,
  profile: seed.profile,
  plan: seed.plan,
  checkins: seed.checkins,
  settings: seed.settings,
  bootstrap: () => {
    const state = loadDemoState();
    set({
      profile: state.profile,
      plan: state.plan,
      checkins: state.checkins,
      settings: state.settings,
      session: readDemoSession(),
    });
  },
  signInDemo: (provider) => {
    const session = createDemoSession(provider);
    set({ session });
  },
  signOutDemo: () => {
    clearDemoSession();
    set({ session: null });
  },
  updateSettings: (partial) => {
    const nextSettings = { ...get().settings, ...partial };
    const nextState = { ...get(), settings: nextSettings };
    saveDemoState({
      profile: nextState.profile,
      plan: nextState.plan,
      checkins: nextState.checkins,
      settings: nextSettings,
    });
    set({ settings: nextSettings });
  },
  upsertCheckin: (input) => {
    const checkins = [...get().checkins.filter((item) => item.id !== input.id), input].sort((a, b) =>
      a.checkinDate.localeCompare(b.checkinDate),
    );
    const latest = checkins[checkins.length - 1];
    const metrics = calculateFireMetrics({
      annualSpending: latest.annualSpending,
      currentNetWorth: latest.currentNetWorth,
      withdrawalRate: get().plan.withdrawalRate,
    });
    const plan = {
      ...get().plan,
      annualSpending: latest.annualSpending,
      targetAmount: metrics.targetAmount,
      updatedAt: new Date().toISOString(),
    };

    saveDemoState({
      profile: get().profile,
      plan,
      checkins,
      settings: get().settings,
    });

    set({ checkins, plan });
  },
  resetDemo: () => {
    window.localStorage.removeItem("fire-demo-state");
    window.localStorage.removeItem("fire-demo-session");
    const fresh = loadDemoState();
    set({
      profile: fresh.profile,
      plan: fresh.plan,
      checkins: fresh.checkins,
      settings: fresh.settings,
      session: null,
    });
  },
}));
