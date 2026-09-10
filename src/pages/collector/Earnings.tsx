import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  IndianRupee, 
  FileSpreadsheet, 
  ArrowDownLeft, 
  CreditCard, 
  Download,
  Filter
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { MaterialBadge } from '../../components/ui/MaterialBadge';

const Earnings: React.FC = () => {
  const { transactions, materials, language } = useAppContext();
  const [filter, setFilter] = useState<'All' | 'Paid' | 'Pending'>('All');

  const filteredTransactions = transactions.filter(t => filter === 'All' || t.status === filter);
  
  const totalEarned = transactions.filter(t => t.status === 'Paid').reduce((sum, t) => sum + t.amount, 0);
  const upiTotal = transactions.filter(t => t.status === 'Paid' && t.method === 'UPI').reduce((sum, t) => sum + t.amount, 0);
  const cashTotal = transactions.filter(t => t.status === 'Paid' && t.method === 'Cash').reduce((sum, t) => sum + t.amount, 0);
  const totalPending = transactions.filter(t => t.status === 'Pending').reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="p-4 space-y-4">
      {/* Passbook Header */}
      <div className="bg-white rounded-2xl p-4 border border-paper-300 shadow-tactile flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-base text-industrial-950">
            {language === 'hi' ? 'डिजिटल खाता बही' : language === 'mr' ? 'डिजिटल खातावही' : 'Collector Passbook & Ledger'}
          </h1>
          <p className="text-xs text-industrial-500 font-medium">
            Verified transactions with UTR & Weighbridge slips
          </p>
        </div>

        <div className="w-9 h-9 rounded-xl bg-forest-50 border border-forest-200 flex items-center justify-center text-forest-800">
          <FileSpreadsheet className="w-5 h-5" />
        </div>
      </div>

      {/* Passbook Hero Balance Card */}
      <div className="bg-gradient-to-br from-forest-900 via-forest-850 to-forest-950 rounded-3xl p-5 text-white shadow-tactile-md border border-forest-800 space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-xl pointer-events-none"></div>

        <div>
          <span className="text-[10px] font-mono tracking-widest uppercase text-emerald-300 bg-forest-800/80 px-2.5 py-0.5 rounded-full border border-forest-700">
            KHATA PASSBOOK BALANCE
          </span>
          <h2 className="text-3xl font-black font-mono text-white mt-1">
            ₹{totalEarned.toLocaleString('en-IN')}
          </h2>
          <p className="text-xs text-forest-200 mt-0.5">
            Total Disbursed directly to Raju Scrap Co.
          </p>
        </div>

        {/* Sub-breakdown Row */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-forest-800 text-[11px] font-mono">
          <div className="bg-forest-950/60 p-2 rounded-xl border border-forest-800">
            <span className="text-forest-400 block text-[9px] uppercase">UPI Transfer</span>
            <span className="font-bold text-emerald-300">₹{upiTotal.toLocaleString('en-IN')}</span>
          </div>
          <div className="bg-forest-950/60 p-2 rounded-xl border border-forest-800">
            <span className="text-forest-400 block text-[9px] uppercase">Cash Slips</span>
            <span className="font-bold text-amber-300">₹{cashTotal.toLocaleString('en-IN')}</span>
          </div>
          <div className="bg-forest-950/60 p-2 rounded-xl border border-forest-800">
            <span className="text-forest-400 block text-[9px] uppercase">Pending</span>
            <span className="font-bold text-rose-300">₹{totalPending.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex justify-between items-center">
        <div className="flex gap-1.5 text-xs">
          {(['All', 'Paid', 'Pending'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-xl font-bold border transition-all ${
                filter === f 
                  ? 'bg-forest-800 text-white border-forest-700 shadow-sm' 
                  : 'bg-white text-industrial-600 border-paper-300 hover:bg-paper-50'
              }`}
            >
              {f === 'All' ? 'All Slips' : f === 'Paid' ? 'Settled (Paid)' : 'Pending Gate-In'}
            </button>
          ))}
        </div>

        <span className="text-xs text-industrial-500 font-mono">
          {filteredTransactions.length} records
        </span>
      </div>

      {/* Transaction Ledger Slips */}
      <div className="space-y-3">
        {filteredTransactions.map(t => {
          const material = materials.find(m => m.id === t.materialId);
          const isPaid = t.status === 'Paid';

          return (
            <div 
              key={t.id} 
              className="bg-white rounded-2xl p-4 border border-paper-300 shadow-tactile space-y-2.5 transition-all hover:border-paper-400"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <MaterialBadge 
                    iconKey={material?.icon} 
                    category={material?.category} 
                    size="md" 
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-display font-bold text-sm text-industrial-950">
                        {material?.name}
                      </h4>
                    </div>
                    <p className="text-xs text-industrial-500 font-mono">
                      SLIP: {t.ticketNo} • {new Date(t.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-base font-black font-mono text-industrial-950">
                    ₹{t.amount.toLocaleString('en-IN')}
                  </p>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                    isPaid ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}>
                    {isPaid ? `✓ ${t.method || 'PAID'}` : '⏳ PENDING'}
                  </span>
                </div>
              </div>

              {/* Weight & UTR Subrow */}
              <div className="pt-2 border-t border-paper-200 flex items-center justify-between text-[11px] font-mono text-industrial-600">
                <span>
                  Net: <strong>{t.weight} kg</strong> (Gross: {t.grossWeight}kg - Tare: {t.tareWeight}kg)
                </span>
                {t.utrRef && (
                  <span className="text-[10px] text-emerald-800 font-medium truncate max-w-[140px]">
                    {t.utrRef}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Earnings;

