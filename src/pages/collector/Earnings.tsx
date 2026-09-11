import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Download,
  Wallet,
  FileText
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { translations } from '../../utils/translations';
import { DownloadPassbookModal } from '../../components/ui/DownloadPassbookModal';
import type { Material } from '../../data/mockData';

const Earnings: React.FC = () => {
  const { transactions, materials, language } = useAppContext();
  const t = translations[language] || translations.en;
  
  const [filter, setFilter] = useState<'All' | 'Paid' | 'Pending'>('All');
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  const filteredTransactions = transactions.filter(tr => filter === 'All' || tr.status === filter);
  
  const totalEarned = transactions.filter(tr => tr.status === 'Paid').reduce((sum, tr) => sum + tr.amount, 0);
  const totalPending = transactions.filter(tr => tr.status === 'Pending').reduce((sum, tr) => sum + tr.amount, 0);

  const getMaterialName = (m?: Material) => {
    if (!m) return '';
    return (t.materials as Record<string, string>)[m.id] || m.name;
  };

  return (
    <div className="p-4 space-y-4 pb-8">
      
      {/* Passbook Header Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                {t.digitalPassbookBadge}
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 leading-tight">
                {t.ledgerHeaderTitle}
              </h2>
            </div>
          </div>
          
          <button 
            onClick={() => setShowDownloadModal(true)}
            className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center space-x-1.5 transition-all shadow-sm active:scale-95"
            title="Download Statement"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PDF</span>
          </button>
        </div>

        {/* Big Balance Display */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-500">
              {t.totalSettledAmount}
            </span>
            <span className="inline-flex items-center text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3 mr-1" /> {t.verifiedPill}
            </span>
          </div>
          <div className="text-3xl font-black text-slate-900 tracking-tight">
            ₹{totalEarned.toLocaleString()}
          </div>
        </div>

        {/* 2-Column Split: Pending & Completed */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-100">
            <span className="text-[11px] font-semibold text-amber-800 block">
              {t.pendingPaymentLabel}
            </span>
            <span className="text-lg font-bold text-amber-950">₹{totalPending.toLocaleString()}</span>
          </div>
          <div className="p-3 bg-slate-100 rounded-xl border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-600 block">
              {t.completedLotsLabel}
            </span>
            <span className="text-lg font-bold text-slate-900">{transactions.length} {t.lotsCountSuffix}</span>
          </div>
        </div>

        {/* Passbook Audit Download Action Bar */}
        <div className="pt-1">
          <button
            onClick={() => setShowDownloadModal(true)}
            className="w-full py-2.5 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white text-xs font-bold flex items-center justify-between transition-all shadow-sm group"
          >
            <div className="flex items-center space-x-2.5">
              <div className="w-6 h-6 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
                <FileText className="w-3.5 h-3.5" />
              </div>
              <span className="text-left">
                <span className="block leading-tight text-white">
                  {language === 'mr' ? 'पासबुक अहवाल डाउनलोड करा' : language === 'hi' ? 'पासबुक रिपोर्ट डाउनलोड करें' : 'Download Passbook Statement'}
                </span>
                <span className="text-[10px] text-slate-400 font-normal">
                  {language === 'mr' ? '१ महिना किंवा १ वर्ष सांख्यिकी PDF' : language === 'hi' ? '1 महीना या 1 वर्ष सांख्यिकी PDF' : 'Past 1 Month / 1 Year Statistical PDF'}
                </span>
              </span>
            </div>
            <span className="text-emerald-400 group-hover:translate-x-0.5 transition-transform text-xs font-bold flex items-center space-x-1 bg-white/10 px-2 py-1 rounded-lg">
              <span>PDF</span>
              <Download className="w-3 h-3" />
            </span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2">
        {[
          { id: 'All', label: t.filterAll },
          { id: 'Paid', label: t.filterPaid },
          { id: 'Pending', label: t.filterPending },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id as any)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === f.id
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Transaction Records List */}
      <div className="space-y-2.5">
        {filteredTransactions.map((tr) => {
          const material = materials.find(m => m.id === tr.materialId);
          const isPaid = tr.status === 'Paid';

          return (
            <div 
              key={tr.id}
              className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between group hover:border-emerald-300 transition-all"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                  isPaid ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                }`}>
                  {material?.icon || '📦'}
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{getMaterialName(material)}</h4>
                  <p className="text-xs text-slate-500 font-medium">
                    {tr.weight} KG • {new Date(tr.date).toLocaleDateString(language === 'en' ? 'en-IN' : (language === 'hi' ? 'hi-IN' : 'mr-IN'), { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                  <div className="flex items-center space-x-2 pt-1">
                    <span className="text-[10px] text-slate-400 font-mono">
                      #{tr.id.toUpperCase()}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`/bill/${tr.lotId || tr.id}`, '_blank');
                      }}
                      className="text-[10px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-1.5 py-0.5 rounded-md border border-emerald-200 transition-all flex items-center space-x-1"
                      title="Open Official Tax Invoice & Bill"
                    >
                      <FileText className="w-2.5 h-2.5" />
                      <span>Bill PDF</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="text-right flex flex-col items-end space-y-1">
                <span className="text-lg font-black text-slate-900">
                  ₹{tr.amount.toLocaleString()}
                </span>
                
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                  isPaid ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}>
                  {isPaid ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                      {tr.method || 'Cash'}
                    </>
                  ) : (
                    <>
                      <Clock className="w-3 h-3 mr-1 text-amber-600" />
                      {t.pendingStatus}
                    </>
                  )}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust & Guarantee Note */}
      <div className="bg-slate-100 rounded-xl p-3.5 border border-slate-200 flex items-center space-x-3 text-xs text-slate-600">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
        <p className="leading-relaxed">
          {t.guaranteeFooter}
        </p>
      </div>

      {/* Download Passbook Statistical Analysis Modal */}
      <DownloadPassbookModal 
        isOpen={showDownloadModal} 
        onClose={() => setShowDownloadModal(false)} 
      />

    </div>
  );
};

export default Earnings;
