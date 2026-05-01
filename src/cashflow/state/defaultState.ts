import type { AppState } from "@/cashflow/types/finance";

export const APP_STATE_VERSION = 1;

export function createDefaultAppState(): AppState {
  return {
    version: APP_STATE_VERSION,
    settings: {
      currentBalance: 0,
      safetyBuffer: 0,
      monthlyDebtBudgetPercent: null,
    },
    transactions: [],
    paymentTypes: [],
    debts: [],
    paymentPlanItems: [],
  };
}
