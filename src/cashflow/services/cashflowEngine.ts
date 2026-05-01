import type { AppState, CashflowEngineResult } from "@/cashflow/types/finance";
import { roundMoney } from "@/cashflow/utils/moneyUtils";

/**
 * Full cashflow + timeline + warnings. Replace stub with spec logic (mvp_cashflow_spec).
 */
export function runCashflowEngine(
  _state: AppState,
  _horizonDays: 30,
): CashflowEngineResult {
  const emptySummary = {
    totalIncomeInPeriod: 0,
    totalFixedExpenses: 0,
    totalFlexibleExpenses: 0,
    totalPlannedDebtPayments: 0,
    availableCash: 0,
    safeToUseCash: 0,
    remainingAfterPlannedPayments: 0,
  };

  const balance = roundMoney(_state.settings.currentBalance);
  const summary = {
    ...emptySummary,
    availableCash: balance,
    safeToUseCash: balance,
    remainingAfterPlannedPayments: balance,
  };

  return {
    summary7: summary,
    summary14: summary,
    summary30: summary,
    timeline: [],
    warnings: [],
    daysToZeroDate: null,
  };
}
