
import { CashflowState, TransactionDirection, TransactionStatus, PaymentKind, RepeatFrequency, DueFlexibility, DebtStatus } from '../types/finance';

const STORAGE_KEY = 'omega_protocol_state';

const INITIAL_STATE: CashflowState = {
  currentBalance: 1250,
  safetyBuffer: 500,
  transactions: [
    {
      id: '1',
      title: 'Výplata - Apríl',
      amount: 1850,
      direction: TransactionDirection.INCOME,
      typeId: 'type-income',
      date: new Date().toISOString().split('T')[0],
      status: TransactionStatus.DONE,
      createdAt: Date.now(),
      updatedAt: Date.now()
    },
    {
      id: '2',
      title: 'Nájomné',
      amount: 650,
      direction: TransactionDirection.EXPENSE,
      typeId: 'type-fixed',
      date: new Date().toISOString().split('T')[0],
      status: TransactionStatus.DONE,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
  ],
  debts: [
    {
      id: 'debt-1',
      name: 'Hypotéka',
      totalAmount: 120000,
      remainingAmount: 98500,
      preferredMonthlyAmount: 450,
      preferredMonthlyPercent: 25,
      priority: 1,
      dueFlexibility: DueFlexibility.FIXED,
      status: DebtStatus.ACTIVE,
      createdAt: Date.now(),
      updatedAt: Date.now()
    },
    {
      id: 'debt-2',
      name: 'Spotrebný úver',
      totalAmount: 5000,
      remainingAmount: 2100,
      preferredMonthlyAmount: 150,
      preferredMonthlyPercent: 10,
      priority: 3,
      dueFlexibility: DueFlexibility.FLEXIBLE,
      status: DebtStatus.ACTIVE,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
  ],
  paymentTypes: [
    { id: 'type-income', name: 'Príjem', kind: PaymentKind.INCOME, color: '#10b981', createdAt: Date.now() },
    { id: 'type-fixed', name: 'Bývanie', kind: PaymentKind.FIXED_EXPENSE, color: '#3b82f6', createdAt: Date.now() },
    { id: 'type-debt', name: 'Dlh', kind: PaymentKind.DEBT, color: '#ef4444', createdAt: Date.now() },
    { id: 'type-food', name: 'Jedlo', kind: PaymentKind.FLEXIBLE_EXPENSE, color: '#f59e0b', createdAt: Date.now() }
  ],
  planItems: []
};

export const storageService = {
  saveState: (state: CashflowState) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  },
  
  loadState: (): CashflowState => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return INITIAL_STATE;
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse state', e);
      return INITIAL_STATE;
    }
  },
  
  clearState: () => {
    localStorage.removeItem(STORAGE_KEY);
  }
};
