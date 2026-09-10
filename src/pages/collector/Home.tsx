import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { 
  Plus, 
  TrendingUp, 
  Building2, 
  ShieldCheck, 
  ArrowRight,
  Clock,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  QrCode
} from 'lucide-react';

const CollectorHome: React.FC = () => {
  const navigate = useNavigate();
  const { language, transactions } = useAppContext();

  const totalAmount = 14500;
  const pendingAmount = 3200;
  const recentTxn = transactions.length > 0 ? transactions[0] : null;

  return (
    <div className="p-4 space-y-4 pb-8">
      
      {/* Friendly Greeting Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">
            {language === 'mr' ? 'नमस्ते, रामदास जी 👋' : 
             language === 'hi' ? 'नमस्ते, रामदास जी 👋' : 
             'Hello, Ramdas 👋'}
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {language === 'mr' ? 'संकलन केंद्र: पुणे स्टेशन • ID: #CX-1028' : 
             'Collector ID: #CX-1028 • Pune Station'}
          </p>
        </div>
      </div>

      {/* Primary Action Hero Card - Very prominent and clear */}
      <button 
        onClick={() => navigate('/collector/create')}
        className="w-full text-left bg-gradient-to-br from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white p-5 rounded-2xl shadow-md transition-all active:scale-[0.99] relative overflow-hidden group"
      >
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center space-x-1.5 bg-white/20 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-xs font-semibold text-emerald-50">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{language === 'mr' ? 'नवीन माल नोंदणी' : 'New Scrap Entry'}</span>
          </div>

          <h3 className="text-2xl font-black tracking-tight text-white">
            {language === 'mr' ? 'नवीन लॉट बनवा' : 
             language === 'hi' ? 'नया लॉट बनाएं' : 
             'Create New Lot'}
          </h3>

          <p className="text-xs text-emerald-100 max-w-[260px] leading-relaxed">
            {language === 'mr' 
              ? 'वजन टाका, चालू बाजार भाव मिळवा आणि योग्य रिसायकलरला विका.' 
              : 'Add weight, get instant fair mandi valuation, and match with verified buyers.'}
          </p>

          <div className="pt-2 flex items-center space-x-2 text-xs font-bold text-white">
            <span className="bg-white text-emerald-800 px-3.5 py-1.5 rounded-xl shadow-sm flex items-center space-x-1.5 group-hover:bg-emerald-50 transition-colors">
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>{language === 'mr' ? 'लॉट जोडा' : 'Start Entry'}</span>
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
            {language === 'mr' ? 'कमाई आणि जमा (Passbook)' : 'Earnings Overview'}
          </span>
          <button 
            onClick={() => navigate('/collector/earnings')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center"
          >
            <span>{language === 'mr' ? 'खाते पहा' : 'View All'}</span>
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
                {language === 'mr' ? 'जमा रक्कम (Paid)' : 'Total Settled'}
              </span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-950 tracking-tight">
              ₹{totalAmount.toLocaleString()}
            </div>
            <span className="text-[10px] text-emerald-700 font-medium">
              {language === 'mr' ? 'थेट बँक / रोख' : 'Cash & UPI received'}
            </span>
          </div>

          {/* Pending Settlement */}
          <div 
            onClick={() => navigate('/collector/earnings')}
            className="bg-amber-50/60 hover:bg-amber-50 p-3.5 rounded-xl border border-amber-100 cursor-pointer transition-colors"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold text-amber-900">
                {language === 'mr' ? 'येणे बाकी (Pending)' : 'Pending'}
              </span>
              <Clock className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <div className="text-2xl font-black text-amber-950 tracking-tight">
              ₹{pendingAmount.toLocaleString()}
            </div>
            <span className="text-[10px] text-amber-700 font-medium">
              {language === 'mr' ? 'हँडओव्हर झाल्यावर' : 'On handover'}
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
              {language === 'mr' ? 'चालू भाव' : 'Live Rates'}
            </p>
            <p className="text-[10px] text-slate-400">Mandi Board</p>
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
              {language === 'mr' ? 'खरेदीदार' : 'Recyclers'}
            </p>
            <p className="text-[10px] text-slate-400">CPCB Verified</p>
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
              {language === 'mr' ? 'सुरक्षितता' : 'Safety Guide'}
            </p>
            <p className="text-[10px] text-slate-400">Best Practices</p>
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
                {language === 'mr' ? 'शेवटचा व्यवहार' : 'Latest Transaction'}
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">
              {new Date(recentTxn.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-xl">
                {recentTxn.materialId === 'm3' ? '💻' : recentTxn.materialId === 'm5' ? '🔌' : '🔋'}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  {recentTxn.weight} KG • {recentTxn.materialId === 'm3' ? 'PCB Board' : 'Copper Wire'}
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
                {recentTxn.status === 'Paid' ? 'Paid ✓' : 'Pending'}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>TXN #{recentTxn.id.toUpperCase()}</span>
            <button 
              onClick={() => navigate(`/collector/handover/${recentTxn.lotId || 'l1'}`)}
              className="text-emerald-700 font-semibold hover:underline flex items-center"
            >
              <span>{language === 'mr' ? 'पावती पहा' : 'View Receipt'}</span>
              <QrCode className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default CollectorHome;
