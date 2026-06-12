import type { AppSettings, Checkin, FirePlan, Profile } from "@/types/domain";
import { calculateFireMetrics } from "@/features/fire/calculations";

export const demoProfile: Profile = {
  id: "demo-user",
  displayName: "Demo User",
  avatarUrl: "/avatar-demo.png",
  preferredLanguage: "zh",
  preferredCurrency: "CNY",
};

const annualSpending = 180000;
const withdrawalRate = 0.04;
const currentNetWorth = 1650000;

export const demoPlan: FirePlan = {
  id: "demo-plan",
  userId: demoProfile.id,
  annualSpending,
  withdrawalRate,
  targetAmount: calculateFireMetrics({
    annualSpending,
    currentNetWorth,
    withdrawalRate,
  }).targetAmount,
  currency: "CNY",
  updatedAt: "2026-06-12T09:00:00.000Z",
};

export const demoCheckins: Checkin[] = [
  {
    id: "c1",
    planId: demoPlan.id,
    checkinDate: "2026-03-01",
    currentNetWorth: 1420000,
    annualSpending: 170000,
    note: "noteSteady",
    createdAt: "2026-03-01T10:00:00.000Z",
  },
  {
    id: "c2",
    planId: demoPlan.id,
    checkinDate: "2026-04-01",
    currentNetWorth: 1515000,
    annualSpending: 175000,
    note: "noteBonus",
    createdAt: "2026-04-01T10:00:00.000Z",
  },
  {
    id: "c3",
    planId: demoPlan.id,
    checkinDate: "2026-05-01",
    currentNetWorth: currentNetWorth,
    annualSpending: annualSpending,
    note: "noteTravel",
    createdAt: "2026-05-01T10:00:00.000Z",
  },
];

export const demoSettings: AppSettings = {
  language: "zh",
  currency: "CNY",
  defaultWithdrawalRate: 0.04,
  demoMode: true,
};
