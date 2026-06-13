import { describe, expect, it } from "vitest";
import { dictionaries } from "@/lib/i18n/dictionaries";

describe("dictionaries", () => {
  it("zh and en have identical keys", () => {
    const zhKeys = Object.keys(dictionaries.zh).sort();
    const enKeys = Object.keys(dictionaries.en).sort();
    expect(zhKeys).toEqual(enKeys);
  });

  it("has no empty values in zh", () => {
    for (const [key, value] of Object.entries(dictionaries.zh)) {
      expect(value, `zh key "${key}" is empty`).toBeTruthy();
    }
  });

  it("has no empty values in en", () => {
    for (const [key, value] of Object.entries(dictionaries.en)) {
      expect(value, `en key "${key}" is empty`).toBeTruthy();
    }
  });

  it("contains all required UI keys", () => {
    const required = [
      "appName", "dashboard", "checkins", "insights", "settings",
      "loading", "signOut", "signedInStatus", "demoModeStatus",
      "annualSpending", "currentNetWorth", "withdrawalRate",
      "target", "progress", "gap",
      "saveCheckin", "history", "noCheckins",
      "growthSpeedUp", "spendingUp", "targetUpdated", "milestoneReached",
      "noteSteady", "noteBonus", "noteTravel",
    ];
    for (const key of required) {
      expect(dictionaries.zh).toHaveProperty(key);
      expect(dictionaries.en).toHaveProperty(key);
    }
  });
});
