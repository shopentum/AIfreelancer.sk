/** Domain model - OMEGA cashflow / docs/mvp_cashflow_spec.md */

export type TransactionDirection = "income" | "expense";

export type TransactionStatus = "planned" | "done" | "skipped" | "moved";

export type PaymentTypeKind =
  | "income"
  | "fixed_expense"
  | "flexible_expense"
  | "debt"
  | "savings"
  | "other";

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  direction: TransactionDirection;
  typeId: string;
  date: string;
  status: TransactionStatus;
  note: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentType {
  id: string;
  name: string;
  kind: PaymentTypeKind;
  color: string;
  createdAt: string;
}

export type DebtStatus = "active" | "paused" | "paid";

export type DueFlexibility = "fixed" | "flexible";

export interface Debt {
  id: string;
  name: string;
  totalAmount: number;
  remainingAmount: number;
  preferredMonthlyAmount: number | null;
  preferredMonthlyPercent: number | null;
  priority: 1 | 2 | 3 | 4 | 5;
  dueFlexibility: DueFlexibility;
  note: string;
  status: DebtStatus;
  createdAt: string;
  updatedAt: string;
}

export type PlanRepeat = "none" | "monthly" | "weekly" | "custom";

export type PlanItemStatus = "planned" | "paid" | "skipped" | "moved";

export interface PaymentPlanItem {
  id: string;
  title: string;
  amount: number;
  typeId: string;
  dueDate: string;
  repeat: PlanRepeat;
  isFlexible: boolean;
  linkedDebtId: string | null;
  plannedOccurrences: number | null;
  actualOccurrences: number | null;
  actualAmountOverride: number | null;
  status: PlanItemStatus;
  note: string;
}

export interface CashflowSettings {
  /** Current account balance (user-maintained for MVP). */
  currentBalance: number;
  /** Minimum cushion after planned outflows. */
  safetyBuffer: number;
  /** Optional cap as % of monthly income for debt bucket. */
  monthlyDebtBudgetPercent: number | null;
}

export interface AppState {
  version: number;
  settings: CashflowSettings;
  transactions: Transaction[];
  paymentTypes: PaymentType[];
  debts: Debt[];
  paymentPlanItems: PaymentPlanItem[];
}

export type RiskSeverity = "info" | "caution" | "critical";

export interface RiskWarning {
  id: string;
  severity: RiskSeverity;
  message: string;
}

export interface CashflowSummary {
  totalIncomeInPeriod: number;
  totalFixedExpenses: number;
  totalFlexibleExpenses: number;
  totalPlannedDebtPayments: number;
  availableCash: number;
  safeToUseCash: number;
  remainingAfterPlannedPayments: number;
}

export interface TimelinePoint {
  date: string;
  label: string;
  balanceAfter: number;
  transactionIds: string[];
  planItemIds: string[];
}

export interface CashflowEngineResult {
  summary7: CashflowSummary;
  summary14: CashflowSummary;
  summary30: CashflowSummary;
  timeline: TimelinePoint[];
  warnings: RiskWarning[];
  /** Calendar date (ISO) when balance hits zero or buffer, or null if not in horizon. */
  daysToZeroDate: string | null;
}

export interface DebtAllocationInput {
  incomeAmount: number;
  debtBudgetPercent: number | null;
  debts: Debt[];
  /** debtId -> EUR override for this month */
  manualByDebtId: Record<string, number | null>;
}

export interface DebtAllocationLine {
  debtId: string;
  suggestedAmount: number;
  appliedAmount: number;
}

export interface DebtAllocationResult {
  lines: DebtAllocationLine[];
  totalAllocated: number;
  unallocatedBudget: number;
}
