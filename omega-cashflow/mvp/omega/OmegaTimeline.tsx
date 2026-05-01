
import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight, 
  AlertTriangle, 
  ShieldCheck, 
  Zap, 
  TrendingUp, 
  Clock,
  ChevronRight
} from 'lucide-react';
import { CashflowState, TransactionDirection } from '../../src/types/finance';
import { cn } from '../../src/lib/utils';

interface Props {
  state: CashflowState;
}

const OmegaTimeline: React.FC<Props> = ({ state }) => {
  const timelineData = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Group transactions by day
    const grouped: Record<string, any[]> = {};
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Initialize days
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
      grouped[dateStr] = [];
    }

    // Fill with transactions
    state.transactions.forEach(t => {
      if (grouped[t.date]) {
        grouped[t.date].push(t);
      }
    });

    // Calculate running balance
    let runningBalance = state.currentBalance;
    const items = Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, transactions]) => {
        const netChange = transactions.reduce((acc, t) => {
          return t.direction === TransactionDirection.INCOME ? acc + t.amount : acc - t.amount;
        }, 0);
        
        const balanceBefore = runningBalance;
        runningBalance += netChange;
        
        return {
          date,
          day: new Date(date).getDate(),
          transactions,
          balance: runningBalance,
          netChange,
          isLow: runningBalance < state.safetyBuffer,
          isCritical: runningBalance < 0
        };
      });

    return items;
  }, [state]);

  const criticalPoints = timelineData.filter(d => d.isCritical);
  const lowPoints = timelineData.filter(d => d.isLow && !d.isCritical);

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-2">Liquidity Projection</p>
           <h1 className="text-4xl font-black text-white tracking-tight">Timeline Cashflow</h1>
        </div>
      </div>

      {/* Timeline Alerts */}
      <div className="space-y-4">
        {criticalPoints.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-[2rem] bg-red-500/10 border border-red-500/30 flex items-center space-x-6"
          >
             <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-500 flex items-center justify-center shrink-0">
                <AlertTriangle size={24} />
             </div>
             <div className="space-y-1">
                <h4 className="text-lg font-black text-white uppercase tracking-tight">Kritický deficit zistený</h4>
                <p className="text-red-400 text-sm font-medium">Systém predikuje negatívny zostatok od {new Date(criticalPoints[0].date).toLocaleDateString('sk-SK')}. Je nevyhnutné presunúť platby alebo zvýšiť príjem.</p>
             </div>
          </motion.div>
        )}

        {lowPoints.length > 0 && criticalPoints.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-[2rem] bg-amber-500/10 border border-amber-500/30 flex items-center space-x-6"
          >
             <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
                <Zap size={24} />
             </div>
             <div className="space-y-1">
                <h4 className="text-lg font-black text-white uppercase tracking-tight">Nízka bezpečná rezerva</h4>
                <p className="text-amber-400 text-sm font-medium">Tvoj zostatok klesne pod hranicu {state.safetyBuffer}€ koncom mesiaca. Odporúčame obmedziť flexibilné výdavky.</p>
             </div>
          </motion.div>
        )}
      </div>

      {/* Visual Timeline Strip */}
      <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 overflow-x-auto custom-scrollbar">
         <div className="min-w-[1200px] space-y-12">
            {/* Balance Curve & Transaction Bubbles */}
            <div className="h-64 flex items-end justify-between px-4 relative">
               {timelineData.map((d, i) => {
                 const height = Math.max(10, Math.min(100, (d.balance / 5000) * 100)); // Normalized to 5000€ max for viz
                 return (
                   <div key={i} className="flex flex-col items-center group relative cursor-pointer h-full justify-end" style={{ width: `${100 / timelineData.length}%` }}>
                      
                      {/* Transaction Boxes */}
                      <div className="absolute bottom-0 mb-40 flex flex-col items-center space-y-1 z-20">
                         {d.transactions.map((t, ti) => (
                           <motion.div 
                             key={ti}
                             initial={{ opacity: 0, scale: 0.8 }}
                             animate={{ opacity: 1, scale: 1 }}
                             className={cn(
                               "px-2 py-1 rounded-lg text-[9px] font-black whitespace-nowrap shadow-xl border backdrop-blur-md",
                               t.direction === TransactionDirection.INCOME 
                                 ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400" 
                                 : "bg-white/5 border-white/10 text-white"
                             )}
                           >
                              {t.direction === TransactionDirection.INCOME ? '+' : '-'}{t.amount.toLocaleString()}€
                           </motion.div>
                         ))}
                      </div>

                      <div 
                        className={cn(
                          "w-1 rounded-full transition-all duration-500 mb-2 relative z-10",
                          d.isCritical ? "bg-red-500 h-24" : d.isLow ? "bg-amber-500 h-16" : "bg-indigo-500/40 group-hover:bg-indigo-400 h-12"
                        )}
                        style={{ height: `${height * 1.5}px` }}
                      ></div>
                      <span className="text-[8px] font-black text-slate-600 group-hover:text-white transition-all">{d.day}.</span>
                      
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 bg-indigo-600 text-white rounded-lg p-2 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap z-30 shadow-xl">
                         {d.balance.toLocaleString()} €
                      </div>
                   </div>
                 );
               })}
            </div>

            {/* Daily Events List */}
            <div className="space-y-4">
               {timelineData.filter(d => d.transactions.length > 0).map((d, i) => (
                 <div key={i} className="flex items-start space-x-8 py-4 border-t border-white/5 group hover:bg-white/[0.01] transition-all">
                    <div className="w-24 shrink-0 pt-1">
                       <span className="text-xs font-black text-indigo-400 uppercase tracking-widest">{new Date(d.date).toLocaleDateString('sk-SK', { day: 'numeric', month: 'short' })}</span>
                    </div>
                    
                    <div className="flex-1 space-y-3">
                       {d.transactions.map((t, ti) => (
                         <div key={ti} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                               <div className={cn("p-1.5 rounded-lg", t.direction === TransactionDirection.INCOME ? "bg-emerald-500/20 text-emerald-400" : "bg-white/10 text-slate-400")}>
                                  {t.direction === TransactionDirection.INCOME ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                               </div>
                               <span className="text-sm font-bold text-white uppercase tracking-tight">{t.title}</span>
                            </div>
                            <div className={cn("text-sm font-black italic", t.direction === TransactionDirection.INCOME ? "text-emerald-400" : "text-white")}>
                               {t.direction === TransactionDirection.INCOME ? '+' : '-'}{t.amount.toLocaleString()} €
                            </div>
                         </div>
                       ))}
                    </div>

                    <div className="w-32 text-right">
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Zostatok</p>
                       <p className={cn("text-sm font-black", d.isCritical ? "text-red-500" : d.isLow ? "text-amber-500" : "text-indigo-400")}>
                          {d.balance.toLocaleString()} €
                       </p>
                    </div>

                    <div className="w-8 flex justify-center">
                       <ChevronRight size={16} className="text-slate-600" />
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>

      {/* Summary Footer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 space-y-4">
            <div className="p-3 bg-indigo-500/10 text-indigo-400 w-12 h-12 rounded-2xl flex items-center justify-center">
               <ShieldCheck size={24} />
            </div>
            <h5 className="text-lg font-black text-white uppercase tracking-tight">Koniec mesiaca</h5>
            <div className="flex items-baseline space-x-2">
               <span className="text-3xl font-black text-indigo-400">{timelineData[timelineData.length - 1].balance.toLocaleString()}€</span>
               <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Projektovaný stav</span>
            </div>
         </div>

         <div className="p-8 rounded-[2.5rem] bg-indigo-600 col-span-2 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full translate-x-32 -translate-y-32"></div>
            <div className="relative z-10 flex h-full items-center justify-between">
               <div className="space-y-2">
                  <h4 className="text-xl font-bold uppercase tracking-tight">Strategické odporúčanie</h4>
                  <p className="text-indigo-100 opacity-80 text-sm max-w-md">Tvoj cashflow je nateraz stabilný. Ak chceš dosiahnuť finančnú slobodu skôr, zváž zvýšenie splátky dlhu o 10% (cca 45€ navyše).</p>
               </div>
               <button className="px-6 py-3 rounded-xl bg-white text-indigo-600 font-bold text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all">
                  Spustiť simuláciu
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default OmegaTimeline;
