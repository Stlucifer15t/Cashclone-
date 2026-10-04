import { Platform } from 'react-native';
import { BankState } from '../types';

const STORAGE_KEY = 'cashclone_bank_v2';
let memoryFallback: BankState | null = null;

export const saveState = async (state: BankState): Promise<void> => {
  try {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } else {
      memoryFallback = state;
    }
  } catch (e) {
    console.warn('Failed to persist bank state:', e);
  }
};

export const loadState = async (): Promise<BankState | null> => {
  try {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      const data = window.localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data) as BankState;
      }
    } else if (memoryFallback) {
      return memoryFallback;
    }
  } catch (e) {
    console.warn('Failed to load persisted bank state:', e);
  }
  return null;
};
