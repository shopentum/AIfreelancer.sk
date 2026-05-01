
import React from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  BarChart3, 
  CreditCard,
  Zap,
  Clock,
  ArrowRightLeft,
  PieChart as PieIcon
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { CashflowState, TransactionDirection } from '../../src/types/finance';
import { cn } from '../../src/lib/utils';

interface Props {
  stats: any;
  state: CashflowState;
}

const OmegaDashboard: React.FC<Props> = ({ stats, state }) => {
  // Prepare data for pie chart
  const expenseByCategory = state.paymentTypes
    .filter(pt => pt.kind !== 'income')
    .map(pt => {
      const amount = state.transactions
        .filter(t => t.typeId === pt.id && t.direction === TransactionDirection.EXPENSE)
        .reduce((sum, t) => sum + t.amount, 0);
      return { name: pt.name, value: amount, color: pt.color };
    })
    .filter(d => d.value > 0);

  const totalExpenses = stats.expenses || 1; // avoid div by zero

  const cards = [
    {
      label: 'Mesačný príjem',
      value: stats.income,
      icon: TrendingUp,
      color: 'emerald',
      trend: '+12%',
      trendUp: true,
      desc: 'Očakávaný vs reálny'
    },
    {
      label: 'Fixné platby',
      value: stats.fixedExpenses,
      icon: ShieldCheck,
      color: 'blue',
      trend: '0%',
      trendUp: null,
      desc: 'Povinné záväzky'
    },
    {
      label: 'Voľné na život',
      value: stats.availableCash,
      icon: Wallet,
      color: 'indigo',
      trend: '-5%',
      trendUp: false,
      desc: 'Po odpočítaní rezervy'
    },
    {
      label: 'Splátky dlhov',
      value: stats.debtPayments,
      icon: CreditCard,
      color: 'red',
      trend: '+250€',
      trendUp: true,
      desc: 'Mimoriadne splátky'
    }
  ];

  const warnings = [];
  if (stats.availableCash < state.safetyBuffer) {
    warnings.push({
      type: 'critical',
      message: `Pozor: Voľná rezerva klesla pod nastavený limit ${state.safetyBuffer} EUR.`,
      action: 'Upraviť plán'
    });
  }
  if (stats.daysToZero < 15) {
    warnings.push({
      type: 'warning',
      message: `Likvidita: Pri aktuálnom tempe narazíš na dno za ${stats.daysToZero} dní.`,
      action: 'Analyzovať výdavky'
    });
  }

  return (
    <div className="space-y-10 pb-20">
      {/* Welcome & Quick Summary */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-2">Decision Intelligence</p>
           <h1 className="text-4xl font-black text-white tracking-tight">Finančný prehľad</h1>
        </div>
        
        <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1 shrink-0">
          <button className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold transition-all">Mesačný pohľad</button>
          <button className="px-5 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-bold transition-all">Timeline</button>
        </div>
      </div>

      {/* Warning Center */}
      {warnings.length > 0 && (
        <div className="grid gap-4">
          {warnings.map((w, i) => (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              key={i}
              className={cn(
                "p-5 rounded-2xl border flex items-center justify-between",
                w.type === 'critical' ? "bg-red-500/10 border-red-500/30" : "bg-amber-500/10 border-amber-500/30"
              )}
            >
              <div className="flex items-center space-x-4">
                 <div className={cn("p-2 rounded-lg", w.type === 'critical' ? "bg-red-500/20 text-red-500" : "bg-amber-500/20 text-amber-500")}>
                    {w.type === 'critical' ? <AlertTriangle size={20} /> : <Zap size={20} />}
                 </div>
                 <p className="font-bold text-sm text-slate-200">{w.message}</p>
              </div>
              <button className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-widest transition-all">
                {w.action}
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -5 }}
            className="p-6 rounded-[2rem] bg-white/5 border border-white/10 flex flex-col justify-between h-48 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 blur-3xl rounded-full translate-x-12 -translate-y-12 group-hover:bg-indigo-500/10 transition-all duration-700"></div>
            
            <div className="flex items-start justify-between relative z-10">
               <div className={cn("p-3 rounded-2xl bg-opacity-10", 
                 card.color === 'emerald' ? "bg-emerald-500 text-emerald-400" :
                 card.color === 'blue' ? "bg-blue-500 text-blue-400" :
                 card.color === 'indigo' ? "bg-indigo-500 text-indigo-400" :
                 "bg-red-500 text-red-400"
               )}>
                  <card.icon size={22} />
               </div>
               
               {card.trendUp !== null && (
                 <div className={cn("flex items-center space-x-1 px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                   card.trendUp ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                 )}>
                   {card.trendUp ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                   <span>{card.trend}</span>
                 </div>
               )}
            </div>

            <div className="space-y-1 relative z-10">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{card.label}</p>
              <div className="flex items-baseline space-x-1">
                <span className="text-3xl font-black text-white">{card.value.toLocaleString()}</span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-none">Eur</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">{card.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Data Visualization Section */}
      <div className="grid grid-cols-12 gap-8">
        {/* Context Stats */}
        <div className="col-span-12 lg:col-span-7 p-10 rounded-[3rem] bg-white/5 border border-white/10 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.1),transparent_40%)]"></div>
           
           <div className="relative z-10 space-y-8">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-white">Zostáva po pláne</h3>
                  <p className="text-slate-400 text-sm font-medium">Projekcia tvojho zostatku na konci mesiaca.</p>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-black text-emerald-400 leading-none">+{stats.remainingAfterPlan.toLocaleString()}€</p>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">Vklady a platby započítané</p>
                </div>
              </div>

              <div className="h-[1px] bg-white/5"></div>

              <div className="grid grid-cols-3 gap-8">
                 <div className="space-y-3">
                   <div className="flex items-center space-x-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      <ShieldCheck size={12} />
                      <span>Rezerva</span>
                   </div>
                   <p className="text-lg font-bold text-white">{state.safetyBuffer}€</p>
                   <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full w-[100%]" />
                   </div>
                 </div>
                 
                 <div className="space-y-3">
                   <div className="flex items-center space-x-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      <Zap size={12} />
                      <span>Likvidita</span>
                   </div>
                   <p className="text-lg font-bold text-white">{stats.daysToZero} dní</p>
                   <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={cn("h-full", stats.daysToZero > 20 ? "bg-emerald-500" : stats.daysToZero > 10 ? "bg-amber-500" : "bg-red-500")} 
                        style={{ width: `${Math.min(100, (stats.daysToZero / 30) * 100)}%` }} 
                      />
                   </div>
                 </div>

                 <div className="space-y-3">
                   <div className="flex items-center space-x-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      <BarChart3 size={12} />
                      <span>Dlhový limit</span>
                   </div>
                   <p className="text-lg font-bold text-white">25%</p>
                   <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-red-500 h-full w-1/4" />
                   </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Pie Chart Card */}
        <div className="col-span-12 lg:col-span-5 p-10 rounded-[3rem] bg-white/5 border border-white/10 relative overflow-hidden flex flex-col">
           <div className="flex items-center justify-between mb-8">
              <div className="space-y-1">
                 <h3 className="text-xl font-black text-white">Distribúcia výdavkov</h3>
                 <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Podľa kategórií</p>
              </div>
              <div className="p-2 bg-white/5 rounded-xl text-indigo-400">
                 <PieIcon size={20} />
              </div>
           </div>

           <div className="flex-1 min-h-[250px]">
              {expenseByCategory.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                      <Pie
                        data={expenseByCategory}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {expenseByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#0F172A', 
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '12px',
                          color: '#fff'
                        }}
                      />
                      <Legend 
                        layout="vertical" 
                        verticalAlign="middle" 
                        align="right"
                        wrapperStyle={{ paddingLeft: '20px' }}
                        formatter={(value) => <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{value}</span>}
                      />
                   </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-500 text-xs font-bold uppercase tracking-widest">
                   Žiadne dáta na zobrazenie
                </div>
              )}
           </div>
        </div>
      </div>

      {/* Next Step Card */}
      <div className="p-8 rounded-[3rem] bg-indigo-600 flex flex-col md:flex-row items-center justify-between text-white relative overflow-hidden">
         <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl rounded-full translate-x-16 -translate-y-16"></div>
         
         <div className="relative z-10 flex items-center space-x-6">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <Clock size={32} />
            </div>
            <div className="space-y-1">
               <h4 className="text-2xl font-black italic uppercase tracking-tighter">Najbližšia veľká platba</h4>
               <p className="text-indigo-100 text-sm font-medium opacity-80">Hypotéka TB (450,00 €) o 4 dni. Priprav si strednú likviditu.</p>
            </div>
         </div>

         <button className="relative z-10 mt-6 md:mt-0 px-8 py-4 rounded-2xl bg-white text-indigo-600 font-bold text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all flex items-center justify-center space-x-2 shrink-0">
            <span>Upraviť splátky</span>
            <ArrowRightLeft size={14} />
         </button>
      </div>
    </div>
  );
};

export default OmegaDashboard;
