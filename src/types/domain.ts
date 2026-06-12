export type Language = "zh" | "en";
export type Currency = "CNY" | "USD";

export type Profile = {
  id: string;
  displayName: string;
  avatarUrl: string;
  preferredLanguage: Language;
  preferredCurrency: Currency;
};

export type FirePlan = {
  id: string;
  userId: string;
  annualSpending: number;
  withdrawalRate: number;
  targetAmount: number;
  currency: Currency;
  updatedAt: string;
};

export type Checkin = {
  id: string;
  planId: string;
  checkinDate: string;
  currentNetWorth: number;
  annualSpending: number;
  note: string;
  createdAt: string;
};

export type AppSettings = {
  language: Language;
  currency: Currency;
  defaultWithdrawalRate: number;
  demoMode: boolean;
};
