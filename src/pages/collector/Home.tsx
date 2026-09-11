import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { translations } from '../../utils/translations';
import { 
  Plus, 
  TrendingUp, 
  Building2, 
  ShieldCheck, 
  CheckCircle2,
  Clock,
  ChevronRight,
  Sparkles,
  QrCode
} from 'lucide-react';

const CollectorHome: React.FC = () => {
  const navigate = useNavigate();
  const { language, transactions, materials } = useAppContext();
  const t = translations[language] || translations.en;

  const totalAmount = 14500;
  const pendingAmount = 3200;
  const recentTxn = transactions.length > 0 ? transactions[0] : null;
  const recentMaterial = recentTxn ? materials.find(m => m.id === recentTxn.materialId) : null;

  return (
    <div className="p-4 space-y-4 pb-8">
      
      {/* Friendly Greeting Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">
            {t.greeting}
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {t.collectorBadge}
          </p>
        </div>
      </div>

      {/* Primary Action Hero Card */}
      <button 
        onClick={() => navigate('/collector/create')}
        className="w-full text-left bg-gradient-to-br from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white p-5 rounded-2xl shadow-md transition-all active:scale-[0.99] relative overflow-hidden group"
      >
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center space-x-1.5 bg-white/20 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-xs font-semibold text-emerald-50">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{t.newScrapBadge}</span>
          </div>

          <h3 className="text-2xl font-black tracking-tight text-white">
            {t.createLotTitle}
          </h3>

          <p className="text-xs text-emerald-100 max-w-[260px] leading-relaxed">
            {t.createLotSubtitle}
          </p>

          <div className="pt-2 flex items-center space-x-2 text-xs font-bold text-white">
            <span className="bg-white text-emerald-800 px-3.5 py-1.5 rounded-xl shadow-sm flex items-center space-x-1.5 group-hover:bg-emerald-50 transition-colors">
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>{t.startEntryBtn}</span>
            </span>
          </div>
        </div>

        {/* Decorative background shape */}
        <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none group-hover:scale-110 transition-transform" />
      </button>

      {/* Financial Passbook Summary Cards */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {t.earningsOverview}
          </span>
          <button 
            onClick={() => navigate('/collector/earnings')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center"
          >
            <span>{t.viewAll}</span>
            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Settled / Paid */}
          <div 
            onClick={() => navigate('/collector/earnings')}
            className="bg-emerald-50/60 hover:bg-emerald-50 p-3.5 rounded-xl border border-emerald-100 cursor-pointer transition-colors"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold text-emerald-800">
                {t.totalSettled}
              </span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-950 tracking-tight">
              ₹{totalAmount.toLocaleString()}
            </div>
            <span className="text-[10px] text-emerald-700 font-medium">
              {t.settledSub}
            </span>
          </div>

          {/* Pending Settlement */}
          <div 
            onClick={() => navigate('/collector/earnings')}
            className="bg-amber-50/60 hover:bg-amber-50 p-3.5 rounded-xl border border-amber-100 cursor-pointer transition-colors"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold text-amber-900">
                {t.pendingPayment}
              </span>
              <Clock className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <div className="text-2xl font-black text-amber-950 tracking-tight">
              ₹{pendingAmount.toLocaleString()}
            </div>
            <span className="text-[10px] text-amber-700 font-medium">
              {t.pendingSub}
            </span>
          </div>
        </div>
      </div>

      {/* 3 Quick Action Shortcuts */}
      <div className="grid grid-cols-3 gap-2.5">
        <button 
          onClick={() => navigate('/collector/prices')}
          className="bg-white p-3 rounded-2xl border border-slate-200 hover:border-emerald-300 shadow-sm transition-all text-center space-y-1.5 group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800 leading-tight">
              {t.liveRates}
            </p>
            <p className="text-[10px] text-slate-400">{t.mandiBoard}</p>
          </div>
        </button>

        <button 
          onClick={() => navigate('/collector/recyclers')}
          className="bg-white p-3 rounded-2xl border border-slate-200 hover:border-emerald-300 shadow-sm transition-all text-center space-y-1.5 group"
        >
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800 leading-tight">
              {t.buyersTitle}
            </p>
            <p className="text-[10px] text-slate-400">{t.cpcbVerified}</p>
          </div>
        </button>

        <button 
          onClick={() => navigate('/collector/profile')}
          className="bg-white p-3 rounded-2xl border border-slate-200 hover:border-emerald-300 shadow-sm transition-all text-center space-y-1.5 group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800 leading-tight">
              {t.safetyGuide}
            </p>
            <p className="text-[10px] text-slate-400">{t.bestPractices}</p>
          </div>
        </button>
      </div>

      {/* Recent Handover Manifest Ticket */}
      {recentTxn && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                {t.latestTxn}
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">
              {new Date(recentTxn.date).toLocaleDateString(language === 'en' ? 'en-IN' : (language === 'hi' ? 'hi-IN' : 'mr-IN'), { day: '2-digit', month: 'short' })}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-xl">
                {recentMaterial?.icon || '📦'}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  {recentTxn.weight} KG • {(t.materials as Record<string, string>)[recentTxn.materialId] || recentMaterial?.name}
                </h4>
                <p className="text-xs text-slate-500">
                  GreenCycle Recycling Facility
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-base font-extrabold text-slate-900">
                ₹{recentTxn.amount.toLocaleString()}
              </p>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {recentTxn.status === 'Paid' ? t.paidStatus : t.pendingStatus}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>TXN #{recentTxn.id.toUpperCase()}</span>
            <button 
              onClick={() => navigate(`/collector/handover/${recentTxn.lotId || 'l1'}`)}
              className="text-emerald-700 font-semibold hover:underline flex items-center"
            >
              <span>{t.viewReceipt}</span>
              <QrCode className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default CollectorHome;
