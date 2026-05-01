
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutGrid, 
  BarChart3, 
  Wallet, 
  Plus, 
  History, 
  Settings, 
  ChevronRight, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  AlertTriangle,
  ArrowRightLeft,
  Calendar,
  Zap,
  CreditCard,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Tag
} from 'lucide-react';
import { CashflowState, Transaction, TransactionDirection, TransactionStatus, PaymentType } from '../../src/types/finance';
import { storageService } from '../../src/services/storageService';
import { cashflowEngine } from '../../src/services/cashflowEngine';
import OmegaDashboard from './OmegaDashboard';
import OmegaTransactions from './OmegaTransactions';
import OmegaTransactionForm from './OmegaTransactionForm';
import OmegaDebts from './OmegaDebts';
import OmegaCategoryManager from './OmegaCategoryManager';
import OmegaTimeline from './OmegaTimeline';
import { cn } from '../../src/lib/utils';
import { AIFreelancerLogo } from '../AIFreelancerLogo';

export type OmegaView = 'dashboard' | 'transactions' | 'debts' | 'categories' | 'timeline' | 'settings';

const OmegaProtocol: React.FC = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<CashflowState>(storageService.loadState());
  const [activeView, setActiveView] = useState<OmegaView>('dashboard');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    storageService.saveState(state);
  }, [state]);

  const stats = cashflowEngine.calculateTotals(state);

  const addTransaction = (transaction: Transaction) => {
    setState(prev => ({
      ...prev,
      transactions: [transaction, ...prev.transactions],
      currentBalance: transaction.direction === TransactionDirection.INCOME 
        ? prev.currentBalance + transaction.amount 
        : prev.currentBalance - transaction.amount
    }));
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'transactions', label: 'Transakcie', icon: ArrowRightLeft },
    { id: 'timeline', label: 'Timeline', icon: Calendar },
    { id: 'debts', label: 'Dlhy & Záväzky', icon: CreditCard },
    { id: 'categories', label: 'Kategórie', icon: Tag },
  ];

  return (
    <div className="min-h-screen bg-[#0F172A] flex font-inter text-slate-200">
      {/* Sidebar */}
      <aside className="w-[280px] bg-[#020617] flex flex-col border-r border-white/5 h-screen sticky top-0 shrink-0">
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Zap size={18} className="text-white fill-white" />
            </div>
            <span className="font-black tracking-tighter text-lg uppercase italic">Omega</span>
          </div>
          <button onClick={() => navigate('/dashboard-v1')} className="text-slate-500 hover:text-white transition-colors">
            <History size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-8 px-6 space-y-8 custom-scrollbar">
          {/* User Balance Brief */}
          <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Aktuálny zostatok</p>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-black text-white">{state.currentBalance.toLocaleString()}</span>
              <span className="text-xs font-bold text-slate-400">EUR</span>
            </div>
          </div>

          <nav className="space-y-1">
            <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Navigácia</p>
            {menuItems.map(item => (
              <button 
                key={item.id}
                onClick={() => setActiveView(item.id as OmegaView)}
                className={cn(
                  "w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-left",
                  activeView === item.id 
                    ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20" 
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon size={18} />
                <span className="text-sm font-bold">{item.label}</span>
                {activeView === item.id && <div className="flex-1 flex justify-end"><div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div></div>}
              </button>
            ))}
          </nav>

          <div className="pt-4">
             <button 
              onClick={() => {
                setEditingTransaction(null);
                setIsFormOpen(true);
              }}
              className="w-full flex items-center justify-center space-x-2 px-4 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 transition-all font-bold text-sm"
             >
                <Plus size={18} />
                <span>Pridať transakciu</span>
             </button>
          </div>
        </div>

        <div className="p-6 border-t border-white/5 space-y-4">
           <div className="flex items-center space-x-3 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
              <AIFreelancerLogo size={20} variant="light" />
              <p className="text-[9px] font-bold text-slate-400 leading-tight">Vyvinuté s <br/> Decision Intelligence</p>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-[#0F172A] overflow-y-auto custom-scrollbar relative">
        <header className="sticky top-0 z-20 px-10 py-6 border-b border-white/5 bg-[#0F172A]/80 backdrop-blur-xl flex items-center justify-between">
           <div className="flex items-center space-x-3 text-sm text-slate-400 font-bold uppercase tracking-widest">
              <span>Omega Protocol</span>
              <ChevronRight size={14} />
              <span className="text-indigo-400">{activeView}</span>
           </div>
           
           {/* Quick Status Bar */}
           <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
                 <span className="text-[10px] font-black uppercase tracking-widest">System Stable</span>
              </div>
              <div className="h-4 w-[1px] bg-white/10"></div>
              <div className="flex items-center space-x-2">
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Days to Zero:</p>
                 <span className={cn("text-xs font-black", stats.daysToZero < 10 ? "text-red-500" : "text-white")}>
                   {stats.daysToZero}
                 </span>
              </div>
           </div>
        </header>

        <div className="p-10 max-w-7xl mx-auto space-y-10">
          <AnimatePresence mode="wait">
            {activeView === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <OmegaDashboard stats={stats} state={state} />
              </motion.div>
            )}
            {activeView === 'transactions' && (
              <motion.div
                key="transactions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <OmegaTransactions state={state} />
              </motion.div>
            )}
            {activeView === 'debts' && (
              <motion.div
                key="debts"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <OmegaDebts state={state} />
              </motion.div>
            )}
            {activeView === 'categories' && (
              <motion.div
                key="categories"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <OmegaCategoryManager state={state} onUpdateState={setState} />
              </motion.div>
            )}
            {activeView === 'timeline' && (
              <motion.div
                key="timeline"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <OmegaTimeline state={state} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Transaction Modal */}
      {isFormOpen && (
        <OmegaTransactionForm 
          onClose={() => setIsFormOpen(false)} 
          onSave={addTransaction}
          paymentTypes={state.paymentTypes}
        />
      )}
    </div>
  );
};

export default OmegaProtocol;
