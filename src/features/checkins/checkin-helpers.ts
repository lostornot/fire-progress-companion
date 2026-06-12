import type { Checkin } from "@/types/domain";

export function sortCheckins(checkins: Checkin[]) {
  return [...checkins].sort((a, b) => a.checkinDate.localeCompare(b.checkinDate));
}

export function buildNetWorthSeries(checkins: Checkin[]) {
  return sortCheckins(checkins).map((item) => ({
    date: item.checkinDate,
    netWorth: item.currentNetWorth,
    annualSpending: item.annualSpending,
  }));
}
