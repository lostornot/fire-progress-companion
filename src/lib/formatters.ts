import type { Currency, Language } from "@/types/domain";

const localeMap: Record<Language, string> = {
  zh: "zh-CN",
  en: "en-US",
};

export function formatCurrency(value: number, currency: Currency, language: Language) {
  return new Intl.NumberFormat(localeMap[language], {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number, language: Language) {
  return new Intl.NumberFormat(localeMap[language], {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatDate(value: string, language: Language) {
  return new Intl.DateTimeFormat(localeMap[language], {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}
