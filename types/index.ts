export type BankCountry = 'USA' | 'CANADA' | 'GERMANY' | 'UK' | 'NIGERIA' | 'JAPAN';

export type CurrencyCode = 'USD' | 'CAD' | 'EUR' | 'GBP' | 'NGN' | 'JPY';

export type TransactionCategory =
  | 'Shopping'
  | 'Food & Drinks'
  | 'Bills & Utilities'
  | 'Entertainment'
  | 'Transfers'
  | 'Deposits'
  | 'Income'
  | 'Vault Savings';

export type VirtualCard = {
  cardNumber: string;
  cardholder: string;
  expiry: string;
  cvv: string;
  isFrozen: boolean;
  cardType: string;
  onlinePaymentsEnabled: boolean;
  contactlessEnabled: boolean;
};

export type BankAccount = {
  id: string;
  country: BankCountry;
  countryName: string;
  flag: string;
  bankName: string;
  currency: CurrencyCode;
  symbol: string;
  balance: number;
  accountNumber: string;
  identifierType: string;
  identifierValue: string;
  swiftBic: string;
  card: VirtualCard;
  color: string;
  accentColor: string;
};

export type Transaction = {
  id: string;
  type: 'in' | 'out' | 'transfer';
  amount: number;
  currency: CurrencyCode;
  bankId: string;
  bankName: string;
  category: TransactionCategory;
  recipient: string;
  note?: string;
  createdAt: number;
  status: 'completed' | 'pending';
  referenceId?: string;
};

export type Vault = {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  currency: CurrencyCode;
  icon: string;
  color: string;
};

export type BillProvider = {
  id: string;
  name: string;
  category: string;
  icon: string;
  accountLabel: string;
};

export type AppNotification = {
  id: string;
  title: string;
  message: string;
  createdAt: number;
  read: boolean;
  type: 'security' | 'transaction' | 'reward';
};

export type AppSettings = {
  biometricsEnabled: boolean;
  pinCode: string;
  isPinRequired: boolean;
  isBalanceHidden: boolean;
  atmDailyLimit: number;
  onlineMonthlyLimit: number;
  internationalPayments: boolean;
  contactlessNFC: boolean;
  language: string;
  notifications: {
    transactions: boolean;
    security: boolean;
    marketing: boolean;
    lowBalance: boolean;
  };
};

export type Profile = {
  name: string;
  cashtag: string;
  email: string;
  phone: string;
  avatarUri?: string;
  tier: 'Diamond Reserve' | 'Platinum Premier' | 'Standard';
};

export type BankState = {
  activeBankId: string;
  accounts: BankAccount[];
  transactions: Transaction[];
  vaults: Vault[];
  notifications: AppNotification[];
  profile: Profile;
  settings: AppSettings;
};
