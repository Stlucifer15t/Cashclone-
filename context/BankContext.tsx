
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';
import { v4 as uuidv4 } from './uuid';
import { BankState, Transaction, Profile, BankInfo } from '../types';
import { convertAmount } from '../utils/currency';
import { loadState, saveState } from '../utils/storage';

const initialState: BankState = {
  currency: 'USD',
  accounts: [
    { id: 'main', name: 'Main', balance: 1200 },
  ],
  transactions: [],
  profile: {
    name: 'User',
    email: 'user@example.com',
  },
  bankInfo: {},
};

type Ctx = {
  state: BankState;
  setCurrency: (c: string) => void;
  addTransaction: (amount: number, note?: string) => void;
  receiveTransaction: (amount: number, note?: string) => void;
  updateProfile: (p: Partial<Profile>) => void;
  updateBankInfo: (p: Partial<BankInfo>) => void;
};

const BankContext = createContext<Ctx | null>(null);

export const BankProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<BankState>(initialState);

  // Load persisted state on web
  useEffect(() => {
    (async () => {
      const persisted = await loadState();
      if (persisted) {
        console.log('Loaded persisted state');
        setState(persisted);
      }
    })();
  }, []);

  // Persist on web
  useEffect(() => {
    (async () => {
      await saveState(state);
    })();
  }, [state]);

  const setCurrency = (c: string) => {
    setState((prev) => {
      // Convert account balances to new currency (demo conversion)
      const convertedAccounts = prev.accounts.map((a) => ({
        ...a,
        balance: convertAmount(a.balance, prev.currency, c),
      }));
      const convertedTx = prev.transactions.map((t) => ({
        ...t,
        amount: convertAmount(t.amount, prev.currency, c),
      }));
      return { ...prev, currency: c, accounts: convertedAccounts, transactions: convertedTx };
    });
  };

  const addTransaction = (amount: number, note?: string) => {
    setState((prev) => {
      const tx: Transaction = {
        id: uuidv4(),
        type: 'out',
        amount,
        note: note || 'Added money (outgoing)',
        createdAt: Date.now(),
      };
      const accounts = prev.accounts.map((a) =>
        a.id === 'main' ? { ...a, balance: a.balance - amount } : a
      );
      return { ...prev, accounts, transactions: [tx, ...prev.transactions] };
    });
  };

  const receiveTransaction = (amount: number, note?: string) => {
    setState((prev) => {
      const tx: Transaction = {
        id: uuidv4(),
        type: 'in',
        amount,
        note: note || 'Received money',
        createdAt: Date.now(),
      };
      const accounts = prev.accounts.map((a) =>
        a.id === 'main' ? { ...a, balance: a.balance + amount } : a
      );
      return { ...prev, accounts, transactions: [tx, ...prev.transactions] };
    });
  };

  const updateProfile = (p: Partial<Profile>) => {
    setState((prev) => ({ ...prev, profile: { ...prev.profile, ...p } }));
  };

  const updateBankInfo = (p: Partial<BankInfo>) => {
    setState((prev) => ({ ...prev, bankInfo: { ...prev.bankInfo, ...p } }));
  };

  const value = useMemo(
    () => ({ state, setCurrency, addTransaction, receiveTransaction, updateProfile, updateBankInfo }),
    [state]
  );

  return <BankContext.Provider value={value}>{children}</BankContext.Provider>;
};

export const useBank = () => {
  const ctx = useContext(BankContext);
  if (!ctx) {
    throw new Error('useBank must be used within BankProvider');
  }
  return ctx;
};
