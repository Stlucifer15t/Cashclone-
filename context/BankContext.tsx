import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { v4 as uuidv4 } from './uuid';
import {
  BankState,
  BankAccount,
  Transaction,
  Profile,
  TransactionCategory,
  Vault,
  AppNotification,
  AppSettings,
} from '../types';
import { convertAmount } from '../utils/currency';
import { loadState, saveState } from '../utils/storage';

export const INITIAL_ACCOUNTS: BankAccount[] = [
  {
    id: 'bank-usa',
    country: 'USA',
    countryName: 'United States',
    flag: '🇺🇸',
    bankName: 'Chase Federal Bank',
    currency: 'USD',
    symbol: '$',
    balance: 8450.5,
    accountNumber: '8392019482',
    identifierType: 'Routing Number (ABA)',
    identifierValue: '021000021',
    swiftBic: 'CHASUS33XXX',
    color: '#0A2540',
    accentColor: '#00D632',
    card: {
      cardNumber: '4532 8920 1938 9012',
      cardholder: 'ALEXANDER MORGAN',
      expiry: '08/28',
      cvv: '382',
      isFrozen: false,
      cardType: 'Visa Infinite Private',
      onlinePaymentsEnabled: true,
      contactlessEnabled: true,
    },
  },
  {
    id: 'bank-canada',
    country: 'CANADA',
    countryName: 'Canada',
    flag: '🇨🇦',
    bankName: 'Royal Bank of Canada (RBC)',
    currency: 'CAD',
    symbol: 'CA$',
    balance: 6200.0,
    accountNumber: '4029184',
    identifierType: 'Transit & Institution',
    identifierValue: '00002 - 003',
    swiftBic: 'ROYCCAT2XXX',
    color: '#3B0A0A',
    accentColor: '#EF4444',
    card: {
      cardNumber: '5230 4819 2847 3810',
      cardholder: 'ALEXANDER MORGAN',
      expiry: '11/27',
      cvv: '741',
      isFrozen: false,
      cardType: 'Mastercard World Elite',
      onlinePaymentsEnabled: true,
      contactlessEnabled: true,
    },
  },
  {
    id: 'bank-germany',
    country: 'GERMANY',
    countryName: 'Germany (EU)',
    flag: '🇩🇪',
    bankName: 'Deutsche Bundesbank / N26',
    currency: 'EUR',
    symbol: '€',
    balance: 4450.25,
    accountNumber: '0044053201',
    identifierType: 'IBAN',
    identifierValue: 'DE89 3704 0044 0532 0130 00',
    swiftBic: 'DEUTDEDBFXX',
    color: '#1C1917',
    accentColor: '#F59E0B',
    card: {
      cardNumber: '4920 3829 4019 5582',
      cardholder: 'ALEXANDER MORGAN',
      expiry: '03/29',
      cvv: '925',
      isFrozen: false,
      cardType: 'Visa Platinum Metal',
      onlinePaymentsEnabled: true,
      contactlessEnabled: true,
    },
  },
  {
    id: 'bank-uk',
    country: 'UK',
    countryName: 'United Kingdom',
    flag: '🇬🇧',
    bankName: 'Barclays London',
    currency: 'GBP',
    symbol: '£',
    balance: 3890.8,
    accountNumber: '83928174',
    identifierType: 'Sort Code',
    identifierValue: '20-45-89',
    swiftBic: 'BARCGB22XXX',
    color: '#082F49',
    accentColor: '#06B6D4',
    card: {
      cardNumber: '4890 2819 4019 1928',
      cardholder: 'ALEXANDER MORGAN',
      expiry: '09/27',
      cvv: '614',
      isFrozen: false,
      cardType: 'Barclays Premier Debit',
      onlinePaymentsEnabled: true,
      contactlessEnabled: true,
    },
  },
  {
    id: 'bank-nigeria',
    country: 'NIGERIA',
    countryName: 'Nigeria',
    flag: '🇳🇬',
    bankName: 'Apex Bank of Nigeria',
    currency: 'NGN',
    symbol: '₦',
    balance: 2450000.0,
    accountNumber: '0129482019',
    identifierType: 'NUBAN Account',
    identifierValue: '0129482019 (Bank: 057)',
    swiftBic: 'APEXNGLAXXX',
    color: '#064E3B',
    accentColor: '#10B981',
    card: {
      cardNumber: '5061 0928 4910 2938',
      cardholder: 'ALEXANDER MORGAN',
      expiry: '05/28',
      cvv: '492',
      isFrozen: false,
      cardType: 'Mastercard Black',
      onlinePaymentsEnabled: true,
      contactlessEnabled: true,
    },
  },
  {
    id: 'bank-japan',
    country: 'JAPAN',
    countryName: 'Japan',
    flag: '🇯🇵',
    bankName: 'Sumitomo Tokyo Bank',
    currency: 'JPY',
    symbol: '¥',
    balance: 620000.0,
    accountNumber: '8392018',
    identifierType: 'Branch & Account',
    identifierValue: 'Branch: 108 / No: 8392018',
    swiftBic: 'SMITJPJTXXX',
    color: '#2E1065',
    accentColor: '#EC4899',
    card: {
      cardNumber: '3528 9201 4910 2948',
      cardholder: 'ALEXANDER MORGAN',
      expiry: '12/28',
      cvv: '183',
      isFrozen: false,
      cardType: 'JCB The Class',
      onlinePaymentsEnabled: true,
      contactlessEnabled: true,
    },
  },
];

export const INITIAL_VAULTS: Vault[] = [
  {
    id: 'vault-1',
    name: 'Emergency Reserve',
    targetAmount: 10000,
    currentAmount: 6400,
    currency: 'USD',
    icon: 'shield-checkmark',
    color: '#10B981',
  },
  {
    id: 'vault-2',
    name: 'Vacation to Tokyo',
    targetAmount: 4500,
    currentAmount: 3150,
    currency: 'USD',
    icon: 'airplane',
    color: '#3B82F6',
  },
  {
    id: 'vault-3',
    name: 'Tech Upgrade Fund',
    targetAmount: 2500,
    currentAmount: 1850,
    currency: 'USD',
    icon: 'laptop',
    color: '#8B5CF6',
  },
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Bi-Weekly Interest Payout',
    message: 'Your high-yield checking account earned +$14.20 in interest dividends.',
    createdAt: Date.now() - 3600 * 1000 * 2,
    read: false,
    type: 'reward',
  },
  {
    id: 'notif-2',
    title: 'New Device Recognized',
    message: 'Secure biometric login verified on iPhone 15 Pro Max (Munich, DE).',
    createdAt: Date.now() - 3600 * 1000 * 8,
    read: false,
    type: 'security',
  },
  {
    id: 'notif-3',
    title: 'Wire Settlement Completed',
    message: 'Incoming wire of $1,250.00 from Acme Corp Payroll settled successfully.',
    createdAt: Date.now() - 3600 * 1000 * 24,
    read: true,
    type: 'transaction',
  },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    type: 'in',
    amount: 1250.0,
    currency: 'USD',
    bankId: 'bank-usa',
    bankName: 'Chase Federal Bank',
    category: 'Income',
    recipient: 'Acme Corp Payroll',
    note: 'Direct Deposit Ref #9281',
    createdAt: Date.now() - 3600 * 1000 * 3,
    status: 'completed',
    referenceId: 'FED-WIRE-8829104',
  },
  {
    id: 'tx-2',
    type: 'out',
    amount: 85.5,
    currency: 'USD',
    bankId: 'bank-usa',
    bankName: 'Chase Federal Bank',
    category: 'Bills & Utilities',
    recipient: 'ConEdison Electric',
    note: 'Monthly clean energy utility bill',
    createdAt: Date.now() - 3600 * 1000 * 14,
    status: 'completed',
    referenceId: 'UTIL-NYC-92810',
  },
  {
    id: 'tx-3',
    type: 'out',
    amount: 42.8,
    currency: 'USD',
    bankId: 'bank-usa',
    bankName: 'Chase Federal Bank',
    category: 'Food & Drinks',
    recipient: 'Blue Bottle Coffee',
    note: 'Espresso & breakfast with team',
    createdAt: Date.now() - 3600 * 1000 * 22,
    status: 'completed',
    referenceId: 'POS-CHASE-0192',
  },
  {
    id: 'tx-4',
    type: 'in',
    amount: 450.0,
    currency: 'CAD',
    bankId: 'bank-canada',
    bankName: 'Royal Bank of Canada',
    category: 'Transfers',
    recipient: 'Emma Watson',
    note: 'Interac e-Transfer reimbursement',
    createdAt: Date.now() - 3600 * 1000 * 48,
    status: 'completed',
    referenceId: 'INTERAC-CA-9921',
  },
  {
    id: 'tx-5',
    type: 'out',
    amount: 120.0,
    currency: 'EUR',
    bankId: 'bank-germany',
    bankName: 'Deutsche Bundesbank',
    category: 'Shopping',
    recipient: 'Apple Store Berlin',
    note: 'Thunderbolt 4 cable & accessories',
    createdAt: Date.now() - 3600 * 1000 * 68,
    status: 'completed',
    referenceId: 'SEPA-DE-882190',
  },
  {
    id: 'tx-6',
    type: 'in',
    amount: 350000.0,
    currency: 'NGN',
    bankId: 'bank-nigeria',
    bankName: 'Apex Bank of Nigeria',
    category: 'Income',
    recipient: 'Global Dev Labs',
    note: 'Smart contract consulting fee',
    createdAt: Date.now() - 3600 * 1000 * 92,
    status: 'completed',
    referenceId: 'NIBSS-NG-77291',
  },
];

const INITIAL_PROFILE: Profile = {
  name: 'Alexander Morgan',
  cashtag: '$alexmorgan',
  email: 'alex.morgan@privatebank.com',
  phone: '+1 (555) 019-2834',
  tier: 'Diamond Reserve',
};

const INITIAL_SETTINGS: AppSettings = {
  biometricsEnabled: true,
  pinCode: '1234',
  isPinRequired: false,
  isBalanceHidden: false,
  atmDailyLimit: 1500,
  onlineMonthlyLimit: 8000,
  internationalPayments: true,
  contactlessNFC: true,
  language: 'English (US)',
  notifications: {
    transactions: true,
    security: true,
    marketing: false,
    lowBalance: true,
  },
};

const INITIAL_STATE: BankState = {
  activeBankId: 'bank-usa',
  accounts: INITIAL_ACCOUNTS,
  transactions: INITIAL_TRANSACTIONS,
  vaults: INITIAL_VAULTS,
  notifications: INITIAL_NOTIFICATIONS,
  profile: INITIAL_PROFILE,
  settings: INITIAL_SETTINGS,
};

type BankContextType = {
  state: BankState;
  activeAccount: BankAccount;
  switchBank: (bankId: string) => void;
  sendMoney: (
    amount: number,
    recipient: string,
    note?: string,
    category?: TransactionCategory
  ) => { success: boolean; message?: string };
  receiveMoney: (amount: number, sender: string, note?: string) => void;
  depositCash: (amount: number, method?: string) => void;
  transferBetweenBanks: (
    sourceBankId: string,
    destBankId: string,
    amount: number
  ) => { success: boolean; message?: string };
  payBill: (
    provider: string,
    category: string,
    accountNo: string,
    amount: number
  ) => { success: boolean; message?: string };
  depositToVault: (vaultId: string, amount: number) => { success: boolean; message?: string };
  withdrawFromVault: (vaultId: string, amount: number) => { success: boolean; message?: string };
  createVault: (name: string, target: number, icon: string, color: string) => void;
  toggleCardFreeze: (bankId?: string) => void;
  toggleHideBalance: () => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  updateProfile: (profile: Partial<Profile>) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
  resetDemoData: () => void;
};

const BankContext = createContext<BankContextType | null>(null);

export const BankProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<BankState>(INITIAL_STATE);

  useEffect(() => {
    (async () => {
      const persisted = await loadState();
      if (persisted && persisted.accounts && persisted.accounts.length > 0) {
        setState({
          ...INITIAL_STATE,
          ...persisted,
          settings: { ...INITIAL_SETTINGS, ...(persisted.settings || {}) },
          vaults: persisted.vaults || INITIAL_VAULTS,
          notifications: persisted.notifications || INITIAL_NOTIFICATIONS,
        });
      }
    })();
  }, []);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const activeAccount = useMemo(() => {
    return (
      state.accounts.find((a) => a.id === state.activeBankId) || state.accounts[0]
    );
  }, [state.accounts, state.activeBankId]);

  const switchBank = (bankId: string) => {
    setState((prev) => {
      if (prev.accounts.some((a) => a.id === bankId)) {
        return { ...prev, activeBankId: bankId };
      }
      return prev;
    });
  };

  const toggleHideBalance = () => {
    setState((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        isBalanceHidden: !prev.settings.isBalanceHidden,
      },
    }));
  };

  const updateSettings = (partial: Partial<AppSettings>) => {
    setState((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...partial },
    }));
  };

  const sendMoney = (
    amount: number,
    recipient: string,
    note?: string,
    category: TransactionCategory = 'Transfers'
  ) => {
    if (amount <= 0) {
      return { success: false, message: 'Amount must be greater than 0' };
    }
    if (activeAccount.balance < amount) {
      return { success: false, message: 'Insufficient funds in this bank account' };
    }

    setState((prev) => {
      const updatedAccounts = prev.accounts.map((a) =>
        a.id === prev.activeBankId ? { ...a, balance: a.balance - amount } : a
      );

      const tx: Transaction = {
        id: uuidv4(),
        type: 'out',
        amount,
        currency: activeAccount.currency,
        bankId: activeAccount.id,
        bankName: activeAccount.bankName,
        category,
        recipient: recipient.trim() || '$unknown',
        note: note?.trim() || `Sent to ${recipient}`,
        createdAt: Date.now(),
        status: 'completed',
        referenceId: `TX-${Math.floor(1000000 + Math.random() * 9000000)}`,
      };

      const newNotif: AppNotification = {
        id: uuidv4(),
        title: 'Payment Sent',
        message: `Successfully transferred ${activeAccount.symbol}${amount.toFixed(2)} to ${recipient}.`,
        createdAt: Date.now(),
        read: false,
        type: 'transaction',
      };

      return {
        ...prev,
        accounts: updatedAccounts,
        transactions: [tx, ...prev.transactions],
        notifications: [newNotif, ...prev.notifications],
      };
    });

    return { success: true };
  };

  const receiveMoney = (amount: number, sender: string, note?: string) => {
    if (amount <= 0) return;

    setState((prev) => {
      const updatedAccounts = prev.accounts.map((a) =>
        a.id === prev.activeBankId ? { ...a, balance: a.balance + amount } : a
      );

      const tx: Transaction = {
        id: uuidv4(),
        type: 'in',
        amount,
        currency: activeAccount.currency,
        bankId: activeAccount.id,
        bankName: activeAccount.bankName,
        category: 'Income',
        recipient: sender.trim() || 'Payment Received',
        note: note?.trim() || `Received from ${sender}`,
        createdAt: Date.now(),
        status: 'completed',
        referenceId: `DEP-${Math.floor(1000000 + Math.random() * 9000000)}`,
      };

      const newNotif: AppNotification = {
        id: uuidv4(),
        title: 'Funds Received',
        message: `Received ${activeAccount.symbol}${amount.toFixed(2)} from ${sender}.`,
        createdAt: Date.now(),
        read: false,
        type: 'transaction',
      };

      return {
        ...prev,
        accounts: updatedAccounts,
        transactions: [tx, ...prev.transactions],
        notifications: [newNotif, ...prev.notifications],
      };
    });
  };

  const depositCash = (amount: number, method = 'Direct Deposit') => {
    if (amount <= 0) return;

    setState((prev) => {
      const updatedAccounts = prev.accounts.map((a) =>
        a.id === prev.activeBankId ? { ...a, balance: a.balance + amount } : a
      );

      const tx: Transaction = {
        id: uuidv4(),
        type: 'in',
        amount,
        currency: activeAccount.currency,
        bankId: activeAccount.id,
        bankName: activeAccount.bankName,
        category: 'Deposits',
        recipient: method,
        note: `Instant cash deposit via ${method}`,
        createdAt: Date.now(),
        status: 'completed',
        referenceId: `DEP-${Math.floor(1000000 + Math.random() * 9000000)}`,
      };

      return {
        ...prev,
        accounts: updatedAccounts,
        transactions: [tx, ...prev.transactions],
      };
    });
  };

  const payBill = (
    provider: string,
    category: string,
    accountNo: string,
    amount: number
  ) => {
    if (amount <= 0) return { success: false, message: 'Invalid bill amount' };
    if (activeAccount.balance < amount) {
      return { success: false, message: 'Insufficient funds to settle this bill' };
    }

    setState((prev) => {
      const updatedAccounts = prev.accounts.map((a) =>
        a.id === prev.activeBankId ? { ...a, balance: a.balance - amount } : a
      );

      const tx: Transaction = {
        id: uuidv4(),
        type: 'out',
        amount,
        currency: activeAccount.currency,
        bankId: activeAccount.id,
        bankName: activeAccount.bankName,
        category: 'Bills & Utilities',
        recipient: provider,
        note: `${category} Bill • Account: ${accountNo}`,
        createdAt: Date.now(),
        status: 'completed',
        referenceId: `BILL-${Math.floor(1000000 + Math.random() * 9000000)}`,
      };

      const newNotif: AppNotification = {
        id: uuidv4(),
        title: 'Bill Settled',
        message: `Paid ${activeAccount.symbol}${amount.toFixed(2)} to ${provider}.`,
        createdAt: Date.now(),
        read: false,
        type: 'transaction',
      };

      return {
        ...prev,
        accounts: updatedAccounts,
        transactions: [tx, ...prev.transactions],
        notifications: [newNotif, ...prev.notifications],
      };
    });

    return { success: true };
  };

  const transferBetweenBanks = (
    sourceBankId: string,
    destBankId: string,
    amount: number
  ) => {
    if (sourceBankId === destBankId) {
      return { success: false, message: 'Select different source and destination banks' };
    }
    const source = state.accounts.find((a) => a.id === sourceBankId);
    const dest = state.accounts.find((a) => a.id === destBankId);

    if (!source || !dest) {
      return { success: false, message: 'Invalid bank account selected' };
    }
    if (source.balance < amount) {
      return { success: false, message: `Insufficient balance in ${source.bankName}` };
    }

    const convertedAmount = convertAmount(amount, source.currency, dest.currency);

    setState((prev) => {
      const updatedAccounts = prev.accounts.map((a) => {
        if (a.id === sourceBankId) {
          return { ...a, balance: a.balance - amount };
        }
        if (a.id === destBankId) {
          return { ...a, balance: a.balance + convertedAmount };
        }
        return a;
      });

      const txOut: Transaction = {
        id: uuidv4(),
        type: 'transfer',
        amount,
        currency: source.currency,
        bankId: source.id,
        bankName: source.bankName,
        category: 'Transfers',
        recipient: `Transfer to ${dest.countryName} (${dest.bankName})`,
        note: `Inter-bank exchange to ${dest.currency}`,
        createdAt: Date.now(),
        status: 'completed',
        referenceId: `FX-${Math.floor(1000000 + Math.random() * 9000000)}`,
      };

      return {
        ...prev,
        accounts: updatedAccounts,
        transactions: [txOut, ...prev.transactions],
      };
    });

    return { success: true };
  };

  const depositToVault = (vaultId: string, amount: number) => {
    if (amount <= 0) return { success: false, message: 'Enter a valid amount' };
    if (activeAccount.balance < amount) {
      return { success: false, message: 'Insufficient balance in active bank' };
    }

    setState((prev) => {
      const updatedAccounts = prev.accounts.map((a) =>
        a.id === prev.activeBankId ? { ...a, balance: a.balance - amount } : a
      );
      const updatedVaults = prev.vaults.map((v) =>
        v.id === vaultId ? { ...v, currentAmount: v.currentAmount + amount } : v
      );

      const targetVault = prev.vaults.find((v) => v.id === vaultId);
      const tx: Transaction = {
        id: uuidv4(),
        type: 'out',
        amount,
        currency: activeAccount.currency,
        bankId: activeAccount.id,
        bankName: activeAccount.bankName,
        category: 'Vault Savings',
        recipient: `Vault: ${targetVault?.name || 'Savings Pocket'}`,
        note: `Dedicated savings deposit`,
        createdAt: Date.now(),
        status: 'completed',
        referenceId: `VLT-${Math.floor(1000000 + Math.random() * 9000000)}`,
      };

      return {
        ...prev,
        accounts: updatedAccounts,
        vaults: updatedVaults,
        transactions: [tx, ...prev.transactions],
      };
    });

    return { success: true };
  };

  const withdrawFromVault = (vaultId: string, amount: number) => {
    const targetVault = state.vaults.find((v) => v.id === vaultId);
    if (!targetVault) return { success: false, message: 'Vault not found' };
    if (amount <= 0) return { success: false, message: 'Enter a valid amount' };
    if (targetVault.currentAmount < amount) {
      return { success: false, message: 'Insufficient funds in this vault' };
    }

    setState((prev) => {
      const updatedVaults = prev.vaults.map((v) =>
        v.id === vaultId ? { ...v, currentAmount: v.currentAmount - amount } : v
      );
      const updatedAccounts = prev.accounts.map((a) =>
        a.id === prev.activeBankId ? { ...a, balance: a.balance + amount } : a
      );

      const tx: Transaction = {
        id: uuidv4(),
        type: 'in',
        amount,
        currency: activeAccount.currency,
        bankId: activeAccount.id,
        bankName: activeAccount.bankName,
        category: 'Vault Savings',
        recipient: `Withdrawal from ${targetVault.name}`,
        note: `Unlocked savings returned to balance`,
        createdAt: Date.now(),
        status: 'completed',
        referenceId: `VLT-W-${Math.floor(1000000 + Math.random() * 9000000)}`,
      };

      return {
        ...prev,
        accounts: updatedAccounts,
        vaults: updatedVaults,
        transactions: [tx, ...prev.transactions],
      };
    });

    return { success: true };
  };

  const createVault = (name: string, target: number, icon: string, color: string) => {
    const newVault: Vault = {
      id: uuidv4(),
      name,
      targetAmount: target,
      currentAmount: 0,
      currency: activeAccount.currency,
      icon: icon || 'shield',
      color: color || '#10B981',
    };
    setState((prev) => ({ ...prev, vaults: [...prev.vaults, newVault] }));
  };

  const toggleCardFreeze = (bankId?: string) => {
    const targetId = bankId || state.activeBankId;
    setState((prev) => {
      const accounts = prev.accounts.map((a) => {
        if (a.id === targetId) {
          return {
            ...a,
            card: {
              ...a.card,
              isFrozen: !a.card.isFrozen,
            },
          };
        }
        return a;
      });
      return { ...prev, accounts };
    });
  };

  const updateProfile = (data: Partial<Profile>) => {
    setState((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...data },
    }));
  };

  const markAllNotificationsRead = () => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, read: true })),
    }));
  };

  const clearNotifications = () => {
    setState((prev) => ({ ...prev, notifications: [] }));
  };

  const resetDemoData = () => {
    setState(INITIAL_STATE);
  };

  const value = useMemo(
    () => ({
      state,
      activeAccount,
      switchBank,
      sendMoney,
      receiveMoney,
      depositCash,
      transferBetweenBanks,
      payBill,
      depositToVault,
      withdrawFromVault,
      createVault,
      toggleCardFreeze,
      toggleHideBalance,
      updateSettings,
      updateProfile,
      markAllNotificationsRead,
      clearNotifications,
      resetDemoData,
    }),
    [state, activeAccount]
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
