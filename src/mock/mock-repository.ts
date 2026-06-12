import { demoCheckins, demoPlan, demoProfile, demoSettings } from "@/mock/demo-data";
import { readStorage, writeStorage } from "@/lib/storage";
import type { AppSettings, Checkin, FirePlan, Profile } from "@/types/domain";

export type DemoState = {
  profile: Profile;
  plan: FirePlan;
  checkins: Checkin[];
  settings: AppSettings;
};

const STORAGE_KEY = "fire-demo-state";

export function loadDemoState(): DemoState {
  return readStorage(STORAGE_KEY, {
    profile: demoProfile,
    plan: demoPlan,
    checkins: demoCheckins,
    settings: demoSettings,
  });
}

export function saveDemoState(state: DemoState) {
  writeStorage(STORAGE_KEY, state);
}
