import { CurrencyCode } from '../types';

export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  USD: '$',
  CAD: 'CA$',
  EUR: '€',
  GBP: '£',
  NGN: '₦',
  JPY: '¥',
};

// Rates relative to 1 USD
export const RATES_TO_USD: Record<CurrencyCode, number> = {
  USD: 1.0,
  CAD: 0.73,
  EUR: 1.09,
  GBP: 1.29,
  NGN: 0.00065,
  JPY: 0.0067,
};

export const convertAmount = (amount: number, from: CurrencyCode, to: CurrencyCode): number => {
  if (from === to) return amount;
  const inUSD = amount * RATES_TO_USD[from];
  const converted = inUSD / RATES_TO_USD[to];
  return to === 'JPY' ? Math.round(converted) : Math.round(converted * 100) / 100;
};

export const formatAmount = (amount: number, currency: CurrencyCode): string => {
  const symbol = CURRENCY_SYMBOLS[currency] || '$';
  if (currency === 'JPY') {
    return `${symbol}${Math.round(amount).toLocaleString()}`;
  }
  return `${symbol}${Number(amount).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};
