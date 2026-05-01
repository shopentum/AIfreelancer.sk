
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, ArrowUpRight, ArrowDownRight, Tag, Calendar, MoreHorizontal, CheckCircle2, Clock, XCircle, FastForward, RotateCcw, CreditCard } from 'lucide-react';
import { CashflowState, TransactionDirection, TransactionStatus, PaymentKind } from '../../src/types/finance';
import { cn } from '../../src/lib/utils';

interface Props {
  state: CashflowState;
}

const OmegaTransactions: React.FC<Props> = ({ state }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');

  const filteredTransactions = state.transactions.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || t.direction === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.DONE: return <CheckCircle2 size={16} className="text-emerald-500" />;
      case TransactionStatus.PLANNED: return <Clock size={16} className="text-amber-500" />;
      case TransactionStatus.SKIPPED: return <XCircle size={16} className="text-slate-500" />;
      case TransactionStatus.MOVED: return <FastForward size={16} className="text-indigo-500" />;
      default: return null;
    }
  };

  const getStatusText = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.DONE: return 'Uhradené';
      case TransactionStatus.PLANNED: return 'Plánované';
      case TransactionStatus.SKIPPED: return 'Preskočené';
      case TransactionStatus.MOVED: return 'Presunuté';
      default: return '';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <h1 className="text-3xl font-black text-white tracking-tight">Pohyby a platby</h1>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Hľadať platbu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl pl-12 pr-6 py-3 text-sm font-bold text-white outline-none focus:border-indigo-500/50 transition-all w-64 uppercase tracking-widest placeholder:text-slate-600"
            />
          </div>
          
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
            <button 
              onClick={() => setFilter('all')}
              className={cn("px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all", filter === 'all' ? "bg-white/10 text-white" : "text-slate-500 hover:text-slate-300")}
            >
              Všetko
            </button>
            <button 
              onClick={() => setFilter('income')}
              className={cn("px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all", filter === 'income' ? "bg-emerald-500/20 text-emerald-400" : "text-slate-500 hover:text-slate-300")}
            >
              Príjmy
            </button>
            <button 
              onClick={() => setFilter('expense')}
              className={cn("px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all", filter === 'expense' ? "bg-red-500/20 text-red-400" : "text-slate-500 hover:text-slate-300")}
            >
              Výdavky
            </button>
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden min-h-[400px]">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5 bg-white/20">
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Dátum</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Položka</th>
              <th className="px-8 py-5 text-[10px) font-black text-slate-400 uppercase tracking-[0.2em]">Kategória</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Stav</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Suma</th>
              <th className="px-8 py-5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredTransactions.map((t, i) => (
              <motion.tr 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                key={t.id} 
                className="group hover:bg-white/[0.02] transition-all cursor-default"
              >
                <td className="px-8 py-6">
                  <div className="flex items-center space-x-3">
                    <Calendar size={14} className="text-slate-500" />
                    <span className="text-sm font-bold text-slate-300">
                      {new Date(t.date).toLocaleDateString('sk-SK')}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-black text-white uppercase tracking-tight">{t.title}</p>
                    {t.isRecurring && <RotateCcw size={12} className="text-indigo-400" />}
                    {t.totalDebt && <CreditCard size={12} className="text-amber-400" title="Dlhový záväzok" />}
                  </div>
                  {t.note && <p className="text-[10px] text-slate-500 font-medium">{t.note}</p>}
                  {t.remainingDebt !== undefined && (
                    <div className="mt-1 flex items-center space-x-2">
                       <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="bg-amber-500 h-full" 
                            style={{ width: `${Math.min(100, (1 - t.remainingDebt / (t.totalDebt || 1)) * 100)}%` }}
                          />
                       </div>
                       <span className="text-[8px] font-bold text-slate-500 uppercase">
                         Zostáva: {t.remainingDebt.toLocaleString()}€
                       </span>
                    </div>
                  )}
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: state.paymentTypes.find(pt => pt.id === t.typeId)?.color || '#94a3b8' }}
                    />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                      {state.paymentTypes.find(pt => pt.id === t.typeId)?.name || 'Iné'}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(t.status)}
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{getStatusText(t.status)}</span>
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                   <div className={cn("inline-flex items-center space-x-2", t.direction === TransactionDirection.INCOME ? "text-emerald-400" : "text-white")}>
                      <span className="text-sm font-black italic">{t.direction === TransactionDirection.INCOME ? '+' : '-'}{t.amount.toLocaleString()}</span>
                      <span className="text-[10px] font-bold opacity-50 uppercase tracking-widest">Eur</span>
                      {t.direction === TransactionDirection.INCOME ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                   </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <button className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                    <MoreHorizontal size={18} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        
        {filteredTransactions.length === 0 && (
          <div className="p-20 text-center space-y-4">
             <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto text-slate-500">
                <History size={32} />
             </div>
             <div>
                <p className="text-white font-bold tracking-tight">Žiadne transakcie</p>
                <p className="text-slate-500 text-sm font-medium">Skús zadať iný vyhľadávací dopyt.</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OmegaTransactions;
