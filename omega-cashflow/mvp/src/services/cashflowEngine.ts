
import { CashflowState, TransactionDirection, TransactionStatus, PaymentKind } from '../types/finance';

export const cashflowEngine = {
  calculateTotals: (state: CashflowState) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyTransactions = state.transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const income = monthlyTransactions
      .filter(t => t.direction === TransactionDirection.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = monthlyTransactions
      .filter(t => t.direction === TransactionDirection.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);

    // Fixed vs Flexible
    const fixedExpenses = monthlyTransactions.filter(t => {
      const type = state.paymentTypes.find(pt => pt.id === t.typeId);
      return type?.kind === PaymentKind.FIXED_EXPENSE && t.direction === TransactionDirection.EXPENSE;
    }).reduce((sum, t) => sum + t.amount, 0);

    const flexibleExpenses = monthlyTransactions.filter(t => {
      const type = state.paymentTypes.find(pt => pt.id === t.typeId);
      return type?.kind === PaymentKind.FLEXIBLE_EXPENSE && t.direction === TransactionDirection.EXPENSE;
    }).reduce((sum, t) => sum + t.amount, 0);

    const debtPayments = monthlyTransactions.filter(t => {
      const type = state.paymentTypes.find(pt => pt.id === t.typeId);
      return type?.kind === PaymentKind.DEBT && t.direction === TransactionDirection.EXPENSE;
    }).reduce((sum, t) => sum + t.amount, 0);

    const remainingAfterPlan = income - expenses;
    const availableCash = state.currentBalance + income - expenses - state.safetyBuffer;

    // Days to Zero calculation (simplified)
    const dailyBurnRate = (fixedExpenses + flexibleExpenses) / 30; // Average per day
    const daysToZero = dailyBurnRate > 0 ? Math.floor(state.currentBalance / dailyBurnRate) : 999;

    return {
      income,
      expenses,
      fixedExpenses,
      flexibleExpenses,
      debtPayments,
      remainingAfterPlan,
      availableCash,
      daysToZero
    };
  }
};
