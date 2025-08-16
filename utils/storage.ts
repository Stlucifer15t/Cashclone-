
import { Platform } from 'react-native';
import { BankState } from '../types';

const STORAGE_KEY = 'bank_state_v1';

// Persist only on web using localStorage, no-op on native
export const saveState = async (state: BankState) => {
  try {
    if (typeof window !== 'undefined' && Platform.OS === 'web') {
      const json = JSON.stringify(state);
      localStorage.setItem(STORAGE_KEY, json);
    }
  } catch (e) {
    console.log('Failed to save state', e);
  }
};

export const loadState = async (): Promise<BankState | null> => {
  try {
    if (typeof window !== 'undefined' && Platform.OS === 'web') {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return null;
      return JSON.parse(data);
    }
  } catch (e) {
    console.log('Failed to load state', e);
  }
  return null;
};
