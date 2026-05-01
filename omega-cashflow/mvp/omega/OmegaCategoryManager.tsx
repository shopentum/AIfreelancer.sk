
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Tag, Plus, X, Trash2, Edit2, CheckCircle2, Circle } from 'lucide-react';
import { CashflowState, PaymentType, PaymentKind } from '../../src/types/finance';
import { cn } from '../../src/lib/utils';

interface Props {
  state: CashflowState;
  onUpdateState: (newState: CashflowState) => void;
}

const OmegaCategoryManager: React.FC<Props> = ({ state, onUpdateState }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newKind, setNewKind] = useState<PaymentKind>(PaymentKind.FLEXIBLE_EXPENSE);
  const [newColor, setNewColor] = useState('#6366f1');

  const colors = [
    '#6366f1', '#10b981', '#ef4444', '#f59e0b', '#3b82f6', 
    '#8b5cf6', '#ec4899', '#06b6d4', '#f97316', '#71717a'
  ];

  const handleAdd = () => {
    if (!newName) return;
    const newCategory: PaymentType = {
      id: `type-${Date.now()}`,
      name: newName,
      kind: newKind,
      color: newColor,
      createdAt: Date.now()
    };
    onUpdateState({
      ...state,
      paymentTypes: [...state.paymentTypes, newCategory]
    });
    setNewName('');
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    // Check if being used (optional, but good for UX)
    onUpdateState({
      ...state,
      paymentTypes: state.paymentTypes.filter(pt => pt.id !== id)
    });
  };

  const kinds = [
    { value: PaymentKind.INCOME, label: 'Príjem' },
    { value: PaymentKind.FIXED_EXPENSE, label: 'Fixný výdavok' },
    { value: PaymentKind.FLEXIBLE_EXPENSE, label: 'Flexibilný výdavok' },
    { value: PaymentKind.DEBT, label: 'Dlh / Splátka' },
    { value: PaymentKind.SAVINGS, label: 'Sporenie' },
    { value: PaymentKind.OTHER, label: 'Iné' },
  ];

  return (
    <div className="space-y-10">
      <div className="flex items-end justify-between">
        <div>
           <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-2">Category System</p>
           <h1 className="text-4xl font-black text-white tracking-tight">Správa kategórií</h1>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm flex items-center space-x-2 transition-all shadow-lg shadow-indigo-600/20"
        >
          <Plus size={18} />
          <span>Pridať kategóriu</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {isAdding && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="p-8 rounded-[2.5rem] bg-indigo-600 text-white col-span-1 md:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full translate-x-32 -translate-y-32"></div>
              
              <div className="space-y-4 relative z-10">
                 <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Názov kategórie</p>
                 <input 
                  autoFocus
                  type="text" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Napr. Auto, Kultúra..."
                  className="w-full bg-white/20 border border-white/20 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:bg-white/30 transition-all placeholder:text-white/40 uppercase tracking-widest"
                 />
              </div>

              <div className="space-y-4 relative z-10">
                 <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Typ platby</p>
                 <select 
                  value={newKind}
                  onChange={(e) => setNewKind(e.target.value as PaymentKind)}
                  className="w-full bg-white/20 border border-white/20 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:bg-white/30 transition-all appearance-none uppercase tracking-widest"
                 >
                   {kinds.map(k => (
                     <option key={k.value} value={k.value} className="bg-indigo-600 text-white">{k.label}</option>
                   ))}
                 </select>
              </div>

              <div className="space-y-4 relative z-10">
                 <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Farba</p>
                 <div className="flex flex-wrap gap-2">
                   {colors.map(c => (
                     <button 
                      key={c}
                      onClick={() => setNewColor(c)}
                      className={cn(
                        "w-8 h-8 rounded-full border-2 transition-all",
                        newColor === c ? "border-white scale-110 shadow-lg" : "border-transparent opacity-60 hover:opacity-100"
                      )}
                      style={{ backgroundColor: c }}
                     />
                   ))}
                 </div>
              </div>

              <div className="col-span-full flex justify-end space-x-4 pt-4 border-t border-white/10">
                 <button 
                  onClick={() => setIsAdding(false)}
                  className="px-6 py-3 rounded-xl hover:bg-white/10 text-white font-bold text-xs uppercase tracking-widest transition-all"
                 >
                   Zrušiť
                 </button>
                 <button 
                  onClick={handleAdd}
                  className="px-8 py-3 rounded-xl bg-white text-indigo-600 font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-xl"
                 >
                   Vytvoriť kategóriu
                 </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {state.paymentTypes.map((pt, i) => (
          <motion.div 
            key={pt.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-6 rounded-[2rem] bg-white/5 border border-white/10 hover:border-white/20 transition-all group"
          >
            <div className="flex items-center justify-between mb-6">
               <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: pt.color }}>
                  <Tag size={20} />
               </div>
               <div className="flex items-center space-x-2">
                  <button className="p-2 text-slate-500 hover:text-white rounded-lg hover:bg-white/5 transition-all opacity-0 group-hover:opacity-100">
                     <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(pt.id)}
                    className="p-2 text-slate-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                  >
                     <Trash2 size={16} />
                  </button>
               </div>
            </div>
            
            <div className="space-y-1">
               <h3 className="text-xl font-black text-white uppercase tracking-tight">{pt.name}</h3>
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                 {kinds.find(k => k.value === pt.kind)?.label || pt.kind}
               </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default OmegaCategoryManager;
