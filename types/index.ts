
export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'NGN' | 'INR' | 'JPY' | 'CAD' | 'AUD';

export type Transaction = {
  id: string;
  type: 'in' | 'out';
  amount: number;
  note?: string;
  createdAt: number;
};

export type Account = {
  id: string;
  name: string;
  balance: number;
};

export type Profile = {
  name: string;
  email: string;
  logoUri?: string;
};

export type BankInfo = {
  accountNumber?: string;
  routingNumber?: string;
  iban?: string;
};

export type BankState = {
  currency: CurrencyCode;
  accounts: Account[];
  transactions: Transaction[];
  profile: Profile;
  bankInfo: BankInfo;
};
