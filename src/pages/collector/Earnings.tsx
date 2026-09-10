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
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const Earnings: React.FC = () => {
  const { transactions, materials, language } = useAppContext();
  const [filter, setFilter] = useState<'All' | 'Paid' | 'Pending'>('All');

  const filteredTransactions = transactions.filter(t => filter === 'All' || t.status === filter);
  
  const totalEarned = transactions.filter(t => t.status === 'Paid').reduce((sum, t) => sum + t.amount, 0);
  const totalPending = transactions.filter(t => t.status === 'Pending').reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="flex flex-col min-h-screen bg-khata-paper text-khata-ink bg-ruled-pattern pb-10">
      
      {/* Header */}
      <div className="bg-khata-red text-khata-paper p-4 brutal-border-b border-b-2 border-khata-ink shadow-brutal-sm">
        <div className="flex items-center space-x-2 mb-2">
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px] font-mono uppercase tracking-widest font-bold">
            {language === 'mr' ? 'बाही-खाता' : 'DIGITAL BAHI-KHATA'}
          </span>
        </div>
        <h1 className="font-vernacular text-3xl font-black mb-1">
          {language === 'mr' ? 'खाते पुस्तक' : 'LEDGER'}
        </h1>
        <p className="text-xs font-mono font-bold bg-khata-ink text-khata-paper inline-block px-2 py-0.5 mt-1">
          {language === 'mr' ? 'सर्व व्यवहार आणि पेमेंट्स' : 'ALL TRANSACTIONS & PAYMENTS'}
        </p>
      </div>

      <div className="p-4 space-y-6 flex-1">
        
        {/* Ledger Summary */}
        <div className="brutal-card p-4 relative overflow-hidden bg-white">
          <div className="flex justify-between items-start mb-4 border-b-2 border-khata-ink pb-2">
            <div>
              <p className="text-xs font-mono font-bold text-khata-ink/60">
                {language === 'mr' ? 'एकूण जमा' : 'TOTAL SETTLED'}
              </p>
              <p className="text-4xl font-black font-mono">
                ₹{totalEarned.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <span className="khata-stamp">PAID</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center text-sm font-bold font-mono text-khata-red">
            <span>{language === 'mr' ? 'येणे बाकी' : 'PENDING:'}</span>
            <span className="text-lg">₹{totalPending.toLocaleString()}</span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-2 border-b-2 border-khata-ink pb-2">
          {[
            { id: 'All', label: language === 'mr' ? 'सर्व' : 'ALL' },
            { id: 'Paid', label: language === 'mr' ? 'जमा' : 'SETTLED' },
            { id: 'Pending', label: language === 'mr' ? 'बाकी' : 'PENDING' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              className={`px-3 py-1 font-mono text-sm font-bold transition-all border-2 border-transparent ${
                filter === f.id
                  ? 'border-khata-ink bg-khata-ink text-khata-paper'
                  : 'text-khata-ink/60 hover:text-khata-ink'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Transactions List */}
        <div className="space-y-4">
          {filteredTransactions.map((t) => {
            const material = materials.find(m => m.id === t.materialId);
            const isPaid = t.status === 'Paid';

            return (
              <div 
                key={t.id}
                className="brutal-card p-3 relative flex items-center justify-between group cursor-pointer"
              >
                {/* Red stripe for pending */}
                {!isPaid && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-khata-red"></div>
                )}
                
                <div className="flex items-center space-x-4 pl-2">
                  <div>
                    <h4 className="font-vernacular text-lg leading-none mb-1">
                      {material?.name}
                    </h4>
                    <p className="text-xs font-mono font-bold text-khata-ink/70">
                      {t.weight} KG • {new Date(t.date).toLocaleDateString('en-GB')}
                    </p>
                  </div>
                </div>

                <div className="text-right flex flex-col items-end">
                  <span className="text-xl font-black font-mono">
                    ₹{t.amount.toLocaleString()}
                  </span>
                  
                  {isPaid ? (
                     <span className="text-[10px] font-mono font-bold text-khata-green border border-khata-green px-1 mt-1">
                       {t.method || 'CASH'}
                     </span>
                  ) : (
                     <span className="text-[10px] font-mono font-bold text-khata-red border border-khata-red px-1 mt-1">
                       PENDING
                     </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default Earnings;
