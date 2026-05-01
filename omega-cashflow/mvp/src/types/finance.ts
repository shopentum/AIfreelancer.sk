
export enum TransactionDirection {
  INCOME = 'income',
  EXPENSE = 'expense'
}

export enum TransactionStatus {
  PLANNED = 'planned',
  DONE = 'done',
  SKIPPED = 'skipped',
  MOVED = 'moved'
}

export enum PaymentKind {
  INCOME = 'income',
  FIXED_EXPENSE = 'fixed_expense',
  FLEXIBLE_EXPENSE = 'flexible_expense',
  DEBT = 'debt',
  SAVINGS = 'savings',
  OTHER = 'other'
}

export enum DebtStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  PAID = 'paid'
}

export enum DueFlexibility {
  FIXED = 'fixed',
  FLEXIBLE = 'flexible'
}

export enum RepeatFrequency {
  NONE = 'none',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  CUSTOM = 'custom'
}

export interface PaymentType {
  id: string;
  name: string;
  kind: PaymentKind;
  color: string;
  createdAt: number;
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  direction: TransactionDirection;
  typeId: string;
  date: string; // ISO format
  status: TransactionStatus;
  note?: string;
  isRecurring?: boolean;
  totalDebt?: number;
  remainingDebt?: number;
  createdAt: number;
  updatedAt: number;
}

export interface Debt {
  id: string;
  name: string;
  totalAmount: number;
  remainingAmount: number;
  preferredMonthlyAmount: number;
  preferredMonthlyPercent: number;
  priority: number; // 1-5
  dueFlexibility: DueFlexibility;
  note?: string;
  status: DebtStatus;
  createdAt: number;
  updatedAt: number;
}

export interface PaymentPlanItem {
  id: string;
  title: string;
  amount: number;
  typeId: string;
  dueDate: string;
  repeat: RepeatFrequency;
  isFlexible: boolean;
  linkedDebtId?: string;
  plannedOccurrences: number;
  actualOccurrences: number;
  actualAmountOverride?: number;
  status: TransactionStatus;
  note?: string;
}

export interface CashflowState {
  currentBalance: number;
  safetyBuffer: number;
  transactions: Transaction[];
  debts: Debt[];
  paymentTypes: PaymentType[];
  planItems: PaymentPlanItem[];
}
