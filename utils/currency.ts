
import { CurrencyCode } from '../types';

const CURRENCY_SYMBOL: Record<CurrencyCode, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  NGN: '₦',
  INR: '₹',
  JPY: '¥',
  CAD: 'CA$',
  AUD: 'A$',
};

// Simple demo exchange rates relative to USD
const RATES_TO_USD: Record<CurrencyCode, number> = {
  USD: 1,
  EUR: 1.08,
  GBP: 1.27,
  NGN: 0.00075,
  INR: 0.012,
  JPY: 0.0064,
  CAD: 0.74,
  AUD: 0.67,
};

export const convertAmount = (amount: number, from: CurrencyCode, to: CurrencyCode) => {
  if (from === to) return amount;
  const usd = amount * RATES_TO_USD[from];
  const toRate = 1 / RATES_TO_USD[to];
  const converted = usd * toRate;
  return Math.round(converted * 100) / 100;
};

export const formatAmount = (amount: number, currency: CurrencyCode) => {
  try {
    return `${CURRENCY_SYMBOL[currency]}${amount.toFixed(2)}`;
  } catch {
    return `${currency} ${amount}`;
  }
};
