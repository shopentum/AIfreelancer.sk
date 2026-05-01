
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Save, TrendingUp, TrendingDown, Calendar, Tag, FileText, CheckCircle2, RotateCcw, CreditCard } from 'lucide-react';
import { Transaction, TransactionDirection, TransactionStatus, PaymentType, PaymentKind } from '../../src/types/finance';
import { cn } from '../../src/lib/utils';

interface Props {
  onClose: () => void;
  onSave: (transaction: Transaction) => void;
  paymentTypes: PaymentType[];
}

const OmegaTransactionForm: React.FC<Props> = ({ onClose, onSave, paymentTypes }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    direction: TransactionDirection.EXPENSE,
    typeId: paymentTypes[1]?.id || '',
    date: new Date().toISOString().split('T')[0],
    status: TransactionStatus.DONE,
    note: '',
    isRecurring: false,
    totalDebt: '',
    remainingDebt: ''
  });

  const selectedType = paymentTypes.find(t => t.id === formData.typeId);
  const isDebt = selectedType?.kind === PaymentKind.DEBT;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) return;

    const transaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      title: formData.title,
      amount: parseFloat(formData.amount),
      direction: formData.direction,
      typeId: formData.typeId,
      date: formData.date,
      status: formData.status,
      note: formData.note,
      isRecurring: formData.isRecurring,
      totalDebt: isDebt ? parseFloat(formData.totalDebt) || undefined : undefined,
      remainingDebt: isDebt ? parseFloat(formData.remainingDebt) || undefined : undefined,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    onSave(transaction);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 sm:p-10">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#020617]/90 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-xl bg-[#0F172A] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden overflow-y-auto max-h-[90vh] custom-scrollbar"
      >
        <div className="p-8 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#0F172A] z-10">
            <h2 className="text-xl font-black text-white italic uppercase tracking-tighter">Nová položka</h2>
            <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-all bg-white/5 rounded-xl">
              <X size={20} />
            </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
           {/* Direction Toggle */}
           <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
              <button 
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, direction: TransactionDirection.EXPENSE }))}
                className={cn(
                  "flex-1 flex items-center justify-center space-x-2 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                  formData.direction === TransactionDirection.EXPENSE ? "bg-red-500 text-white shadow-lg shadow-red-500/20" : "text-slate-500 hover:text-white"
                )}
              >
                <TrendingDown size={18} />
                <span>Výdavok</span>
              </button>
              <button 
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, direction: TransactionDirection.INCOME }))}
                className={cn(
                  "flex-1 flex items-center justify-center space-x-2 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                  formData.direction === TransactionDirection.INCOME ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "text-slate-500 hover:text-white"
                )}
              >
                <TrendingUp size={18} />
                <span>Príjem</span>
              </button>
           </div>

           {/* Recurring Toggle */}
           <button 
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, isRecurring: !prev.isRecurring }))}
            className={cn(
              "w-full flex items-center justify-between p-5 rounded-2xl border transition-all",
              formData.isRecurring ? "bg-indigo-600/10 border-indigo-500/30 text-indigo-400" : "bg-white/5 border-white/10 text-slate-500"
            )}
           >
              <div className="flex items-center space-x-3">
                 <div className={cn("p-2 rounded-lg", formData.isRecurring ? "bg-indigo-600/20" : "bg-white/10")}>
                    <RotateCcw size={18} className={formData.isRecurring ? "animate-spin-slow" : ""} />
                 </div>
                 <div className="text-left">
                    <p className="text-xs font-black uppercase tracking-widest leading-none mb-1">Pravidelná platba</p>
                    <p className="text-[10px] font-medium opacity-60">Hypotéka, výplata, nájom...</p>
                 </div>
              </div>
              <div className={cn("w-10 h-6 rounded-full relative transition-all", formData.isRecurring ? "bg-indigo-600" : "bg-white/10")}>
                 <div className={cn("absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm", formData.isRecurring ? "left-5" : "left-1")} />
              </div>
           </button>

           <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2 space-y-2">
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Názov transakcie</p>
                 <div className="relative">
                    <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      autoFocus
                      required
                      type="text" 
                      placeholder="Napr. Nákup v Tesco"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold text-white outline-none focus:border-indigo-500/50 transition-all uppercase tracking-widest placeholder:text-slate-700"
                    />
                 </div>
              </div>

              <div className="space-y-2">
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Suma (EUR)</p>
                 <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">€</span>
                    <input 
                      required
                      type="number" 
                      step="0.01"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-sm font-black text-white outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-700 flex-1 min-w-0"
                    />
                 </div>
              </div>

              <div className="space-y-2">
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Kategória</p>
                 <div className="relative">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <select 
                      value={formData.typeId}
                      onChange={(e) => setFormData(prev => ({ ...prev, typeId: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold text-white outline-none focus:border-indigo-500/50 transition-all appearance-none uppercase tracking-widest"
                    >
                      {paymentTypes.map(pt => (
                        <option key={pt.id} value={pt.id} className="bg-[#0F172A]">{pt.name}</option>
                      ))}
                    </select>
                 </div>
              </div>

              {/* Debt specific fields */}
              {isDebt && formData.direction === TransactionDirection.EXPENSE && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="col-span-2 grid grid-cols-2 gap-6 pt-4 border-t border-white/5"
                >
                   <div className="space-y-2">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Celkový dlh (EUR)</p>
                      <div className="relative">
                         <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                         <input 
                           type="number" 
                           placeholder="0.00"
                           value={formData.totalDebt}
                           onChange={(e) => setFormData(prev => ({ ...prev, totalDebt: e.target.value }))}
                           className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold text-white outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-700"
                         />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Zostáva splatiť (EUR)</p>
                      <div className="relative">
                         <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">€</span>
                         <input 
                           type="number" 
                           placeholder="0.00"
                           value={formData.remainingDebt}
                           onChange={(e) => setFormData(prev => ({ ...prev, remainingDebt: e.target.value }))}
                           className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold text-white outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-700"
                         />
                      </div>
                   </div>
                </motion.div>
              )}

              <div className="space-y-2">
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Dátum</p>
                 <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      type="date" 
                      value={formData.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold text-white outline-none focus:border-indigo-500/50 transition-all uppercase tracking-widest"
                    />
                 </div>
              </div>

              <div className="space-y-2">
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Stav platby</p>
                 <div className="relative">
                    <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <select 
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as TransactionStatus }))}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold text-white outline-none focus:border-indigo-500/50 transition-all appearance-none uppercase tracking-widest"
                    >
                      <option value={TransactionStatus.DONE} className="bg-[#0F172A]">Realizované</option>
                      <option value={TransactionStatus.PLANNED} className="bg-[#0F172A]">Plánované</option>
                    </select>
                 </div>
              </div>
           </div>

           <div className="flex items-center space-x-4 pt-4">
              <button 
                type="button" 
                onClick={onClose}
                className="flex-1 py-4 rounded-2xl border border-white/10 text-slate-400 font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-all"
              >
                Zrušiť
              </button>
              <button 
                type="submit"
                className="flex-[2] py-4 rounded-2xl bg-indigo-600 text-white font-bold text-xs uppercase tracking-widest hover:bg-indigo-500 shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center space-x-2"
              >
                <Save size={16} />
                <span>Uložiť položku</span>
              </button>
           </div>
        </form>
      </motion.div>
    </div>
  );
};

export default OmegaTransactionForm;
