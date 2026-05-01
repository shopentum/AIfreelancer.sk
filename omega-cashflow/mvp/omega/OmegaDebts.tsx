
import React from 'react';
import { motion } from 'motion/react';
import { CreditCard, ArrowRight, ShieldCheck, AlertTriangle, TrendingUp } from 'lucide-react';
import { CashflowState, DebtStatus } from '../../src/types/finance';
import { cn } from '../../src/lib/utils';

interface Props {
  state: CashflowState;
}

const OmegaDebts: React.FC<Props> = ({ state }) => {
  return (
    <div className="space-y-10">
      <div className="flex items-end justify-between">
        <div>
           <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-2">Liability Management</p>
           <h1 className="text-4xl font-black text-white tracking-tight">Dlhy a záväzky</h1>
        </div>
      </div>

      <div className="grid gap-6">
        {state.debts.map((debt, i) => (
          <motion.div 
            key={debt.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 hover:border-white/20 transition-all flex flex-col md:flex-row items-center gap-8"
          >
             <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-400 shrink-0">
                <CreditCard size={32} />
             </div>
             
             <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-3">
                   <h3 className="text-xl font-black text-white uppercase tracking-tight">{debt.name}</h3>
                   <div className={cn("px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest", 
                     debt.status === DebtStatus.ACTIVE ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-500/10 text-slate-400"
                   )}>
                      {debt.status}
                   </div>
                </div>
                <div className="flex items-center space-x-6 text-xs font-bold text-slate-500">
                   <p>Priorita: <span className="text-white">{debt.priority}/5</span></p>
                   <p>Flexibilita: <span className="text-white uppercase">{debt.dueFlexibility}</span></p>
                </div>
             </div>

             <div className="flex-1 space-y-3 w-full md:w-auto">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                   <span className="text-slate-500">Zostáva splatiť</span>
                   <span className="text-white">{(debt.remainingAmount / debt.totalAmount * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${(debt.remainingAmount / debt.totalAmount * 100)}%` }}
                     className="bg-indigo-500 h-full"
                   />
                </div>
                <div className="flex justify-between text-[10px] font-bold">
                   <span className="text-slate-400">{debt.remainingAmount.toLocaleString()}€</span>
                   <span className="text-slate-600">z {debt.totalAmount.toLocaleString()}€</span>
                </div>
             </div>

             <div className="shrink-0 text-right space-y-1">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Plánovaná splátka</p>
                <div className="flex items-baseline justify-end space-x-1">
                   <span className="text-2xl font-black text-white">{debt.preferredMonthlyAmount}</span>
                   <span className="text-xs font-bold text-slate-500 uppercase">Eur</span>
                </div>
                <button className="flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 transition-all text-[10px] font-black uppercase tracking-[0.2em] ml-auto">
                   <span>Upraviť</span>
                   <ArrowRight size={12} />
                </button>
             </div>
          </motion.div>
        ))}
      </div>

      {/* Debt Strategy Brief */}
      <div className="p-10 rounded-[3rem] bg-emerald-500/10 border border-emerald-500/20 text-emerald-100">
         <div className="flex items-start justify-between gap-10">
            <div className="space-y-4">
               <div className="flex items-center space-x-3 text-emerald-400">
                  <TrendingUp size={24} />
                  <h3 className="text-xl font-black uppercase tracking-tight">Debt-Free Projekcia</h3>
               </div>
               <p className="max-w-xl text-sm font-medium opacity-80 italic">
                  Pri zachovaní aktuálneho splátkového kalendára a nezmenených príjmoch budeš bez dlhov o <b>8 rokov a 4 mesiace</b>.
                  Navýšením splátok o 150€ mesačne skrátiš tento čas o <b>2 roky</b>.
               </p>
            </div>
            <button className="px-8 py-4 rounded-2xl bg-emerald-500 text-white font-black text-xs uppercase tracking-widest hover:bg-emerald-400 transition-all shrink-0">
               Spustiť simuláciu
            </button>
         </div>
      </div>
    </div>
  );
};

export default OmegaDebts;
