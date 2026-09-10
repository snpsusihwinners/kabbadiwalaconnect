import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  IndianRupee, 
  Coins, 
  Download, 
  ArrowUpRight, 
  FileSpreadsheet, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const Earnings: React.FC = () => {
  const { transactions, materials } = useAppContext();
  const [filter, setFilter] = useState<'All' | 'Paid' | 'Pending'>('All');

  const filteredTransactions = transactions.filter(t => filter === 'All' || t.status === filter);
  
  const totalEarned = transactions.filter(t => t.status === 'Paid').reduce((sum, t) => sum + t.amount, 0);
  const totalPending = transactions.filter(t => t.status === 'Pending').reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="flex flex-col min-h-full bg-[#fbf8f1] text-[#13261e] pb-10">
      
      {/* Header */}
      <div className="bg-[#0b241a] text-white px-5 pt-4 pb-5 rounded-b-[30px] shadow-md relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center space-x-1.5">
            <Coins className="w-4 h-4 text-amber-400" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-300 font-bold">
              DIGITAL BAHI-KHATA • बहीखाता
            </span>
          </div>
          <h1 className="text-xl font-black text-white">मेरी कमाई व पासबुक</h1>
          <p className="text-xs text-emerald-200/80 mt-0.5">
            हर सौदे का पारदर्शी डिजिटल हिसाब • नकद व UPI
          </p>
        </div>

        {/* Passbook Master Card */}
        <div className="mt-4 bg-gradient-to-tr from-[#082015] via-[#0e3b2b] to-[#144f3b] border-2 border-emerald-400/30 rounded-[26px] p-5 shadow-tactile-green text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 w-36 h-36 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center justify-between mb-1 text-emerald-200 text-xs font-mono font-bold">
            <span>कुल सुरक्षित कमाई (SETTLED)</span>
            <span className="text-amber-400">PASSED ✓</span>
          </div>

          <div className="text-4xl font-black font-mono tracking-tight text-white mb-4">
            ₹{totalEarned.toLocaleString()}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-emerald-700/50 text-xs font-mono">
            <div className="bg-black/25 p-2 rounded-xl border border-emerald-900/50">
              <span className="text-[10px] text-slate-400 block">बकाया (Pending):</span>
              <span className="text-base font-bold text-amber-300">₹{totalPending.toLocaleString()}</span>
            </div>
            <div className="bg-black/25 p-2 rounded-xl border border-emerald-900/50">
              <span className="text-[10px] text-slate-400 block">कुल सौदे (Handovers):</span>
              <span className="text-base font-bold text-emerald-300">{transactions.length} लॉट</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3.5 flex-1">
        
        {/* Filter Pills */}
        <div className="flex space-x-2">
          {[
            { id: 'All', label: 'सभी सौदे (All)' },
            { id: 'Paid', label: '✓ नकद प्राप्त (Paid)' },
            { id: 'Pending', label: '⏳ बाकी (Pending)' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all ${
                filter === f.id
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-white border border-[#e6decb] text-slate-600 hover:bg-slate-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Transaction Ledger Records */}
        <div className="space-y-2.5">
          {filteredTransactions.map((t) => {
            const material = materials.find(m => m.id === t.materialId);
            const isPaid = t.status === 'Paid';

            return (
              <div 
                key={t.id}
                className="bg-white rounded-[22px] p-4 border border-[#e6decb] shadow-card-elevated flex items-center justify-between group hover:border-emerald-500/40 transition-all"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 border ${
                    isPaid ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-amber-50 border-amber-200 text-amber-700'
                  }`}>
                    {material?.icon || '📦'}
                  </div>

                  <div>
                    <h4 className="font-black text-slate-900 text-base flex items-center space-x-1.5">
                      <span>{material?.name}</span>
                    </h4>
                    <p className="text-[11px] font-mono text-slate-500">
                      {t.weight} KG • {new Date(t.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                    <span className="text-[10px] text-slate-400 font-mono">
                      TXN #{t.id.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="text-right flex flex-col items-end space-y-1">
                  <span className="text-xl font-black text-slate-900 font-mono tracking-tight">
                    ₹{t.amount.toLocaleString()}
                  </span>
                  
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                    isPaid ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-amber-100 text-amber-800 border-amber-300'
                  }`}>
                    {isPaid ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 mr-0.5 text-emerald-600" />
                        {t.method || 'Cash'} मिला ✓
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3 mr-0.5 text-amber-600" />
                        हैंडओवर बाकी
                      </>
                    )}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bankless Assurance Footer */}
        <div className="bg-[#f2ecde] rounded-2xl p-3.5 border border-[#dfd5c2] flex items-center space-x-3 text-xs text-slate-700">
          <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
          <p className="leading-snug">
            ECOSETU खाता बही में बैंक खाते की अनिवार्यता नहीं है। हर रीसाइक्लर से आपको मौके पर 100% पक्का नकद या UPI दिया जाता है।
          </p>
        </div>

      </div>
    </div>
  );
};

export default Earnings;
