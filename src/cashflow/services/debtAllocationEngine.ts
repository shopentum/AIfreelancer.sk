import type {
  DebtAllocationInput,
  DebtAllocationResult,
} from "@/cashflow/types/finance";
import { roundMoney } from "@/cashflow/utils/moneyUtils";

/**
 * Splits monthly debt budget across debts respecting prefs + manual overrides.
 */
export function runDebtAllocation(input: DebtAllocationInput): DebtAllocationResult {
  const budgetCap =
    input.debtBudgetPercent != null && input.debtBudgetPercent > 0
      ? roundMoney((input.incomeAmount * input.debtBudgetPercent) / 100)
      : null;

  let totalAllocated = 0;
  const lines = input.debts
    .filter((d) => d.status === "active")
    .map((d) => {
      const manual = input.manualByDebtId[d.id];
      const applied =
        manual != null && manual >= 0
          ? roundMoney(manual)
          : roundMoney(d.preferredMonthlyAmount ?? 0);
      totalAllocated += applied;
      return {
        debtId: d.id,
        suggestedAmount: roundMoney(d.preferredMonthlyAmount ?? 0),
        appliedAmount: applied,
      };
    });

  const unallocatedBudget =
    budgetCap != null ? roundMoney(Math.max(0, budgetCap - totalAllocated)) : 0;

  return {lines, totalAllocated: roundMoney(totalAllocated), unallocatedBudget};
}
