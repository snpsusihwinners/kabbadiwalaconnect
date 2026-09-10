import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, 
  IndianRupee, 
  Building2, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  Scale, 
  Clock, 
  CheckCircle2, 
  QrCode,
  Layers
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { MaterialBadge } from '../../components/ui/MaterialBadge';

const CollectorHome: React.FC = () => {
  const navigate = useNavigate();
  const { lots, transactions, materials, language } = useAppContext();
  
  const pendingAmount = transactions.filter(t => t.status === 'Pending').reduce((acc, t) => acc + t.amount, 0);
  const totalPaidAmount = transactions.filter(t => t.status === 'Paid').reduce((acc, t) => acc + t.amount, 0);
  
  // Find currently active lot
  const activeLot = lots.find(l => l.status === 'Offer Accepted' || l.status === 'Created') || lots[0];
  const activeMaterial = materials.find(m => m.id === activeLot?.materialId);

  return (
    <div className="p-4 space-y-4">
      {/* Aggregator Identification Card */}
      <div className="bg-white rounded-2xl p-4 border border-paper-300 shadow-tactile flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-forest-50 border border-forest-200 flex items-center justify-center text-forest-800 font-display font-extrabold text-lg">
            RS
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-display font-bold text-base text-industrial-950">
                {language === 'hi' ? 'नमस्ते, राजू भाई 👋' : language === 'mr' ? 'नमस्कार, राजू भाऊ 👋' : 'Welcome, Raju Bhai 👋'}
              </h2>
            </div>
            <p className="text-xs text-industrial-500 font-medium">
              Raju Scrap Co. • <span className="text-emerald-700 font-bold">Pune Central Mandi</span>
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-bold px-2 py-0.5 rounded-lg">
            <span>★ 4.9</span>
            <span className="text-[9px] text-amber-700 font-normal">(42 Handovers)</span>
          </div>
          <p className="text-[10px] text-emerald-800 font-mono mt-0.5">CPCB Verified</p>
        </div>
      </div>

      {/* Primary Action Hero: Create Scrap Lot */}
      <div className="relative rounded-3xl bg-gradient-to-br from-forest-900 via-forest-850 to-forest-950 p-5 text-white shadow-tactile-md overflow-hidden border border-forest-700">
        <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-emerald-500/10 rounded-full blur-xl pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold font-mono tracking-wider text-emerald-300 uppercase bg-forest-800/80 px-2.5 py-1 rounded-full border border-forest-700">
              <Sparkles className="w-3 h-3 text-amber-400" />
              {language === 'hi' ? 'स्मार्ट कांटा व बोली' : language === 'mr' ? 'स्मार्ट काटा व बोली' : 'SMART WEIGH & BID'}
            </span>
            <span className="text-[11px] text-forest-300 font-mono">
              Live Mandi Matched
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black font-display tracking-tight text-white mb-1">
            {language === 'hi' ? 'नया स्क्रैप लॉट बनाएं' : language === 'mr' ? 'नवीन स्क्रॅप लॉट तयार करा' : 'Create New Scrap Lot'}
          </h3>
          <p className="text-xs text-forest-200 mb-4 max-w-[260px] leading-relaxed">
            {language === 'hi'
              ? 'कैमरे से फोटो लें, सकल व बारदान वजन डालें और स्थानीय रीसाइक्लर्स से सर्वोच्च बोली पाएं।'
              : 'Log net weight with container tare deduction and get instant bids from licensed recyclers.'}
          </p>

          <button
            onClick={() => navigate('/collector/create')}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 active:scale-[0.98] text-industrial-950 font-display font-black text-sm py-3.5 px-4 rounded-xl shadow-tactile transition-all flex items-center justify-center gap-2"
          >
            <Camera className="w-4 h-4 text-industrial-950" />
            <span>{language === 'hi' ? 'स्क्रैप वजन व फोटो शुरू करें' : 'Start Scrap Lot Ingestion'}</span>
            <ArrowRight className="w-4 h-4 text-industrial-950" />
          </button>
        </div>
      </div>

      {/* Financial Passbook Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div 
          onClick={() => navigate('/collector/earnings')}
          className="bg-white p-3.5 rounded-2xl border border-paper-300 shadow-tactile cursor-pointer active:scale-95 transition-all"
        >
          <div className="flex items-center justify-between text-industrial-500 text-[11px] font-bold uppercase mb-1">
            <span>{language === 'hi' ? 'कुल भुगतान प्राप्त' : 'Settled Earnings'}</span>
            <span className="text-emerald-700 font-mono">PAID</span>
          </div>
          <p className="text-xl font-black font-mono text-industrial-950">
            ₹{totalPaidAmount.toLocaleString('en-IN')}
          </p>
          <p className="text-[10px] text-emerald-800 font-medium mt-1">
            ✓ Direct UPI & Cash
          </p>
        </div>

        <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200/80 shadow-tactile">
          <div className="flex items-center justify-between text-amber-800 text-[11px] font-bold uppercase mb-1">
            <span>{language === 'hi' ? 'प्रक्रिया में राशि' : 'In Pipeline'}</span>
            <Clock className="w-3 h-3 text-amber-600" />
          </div>
          <p className="text-xl font-black font-mono text-amber-900">
            ₹{pendingAmount.toLocaleString('en-IN')}
          </p>
          <p className="text-[10px] text-amber-800 font-medium mt-1">
            Awaiting Handover Scan
          </p>
        </div>
      </div>

      {/* Live Mandi Mini Rate Board */}
      <div className="bg-white rounded-2xl p-4 border border-paper-300 shadow-tactile">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-700" />
            <h3 className="font-display font-bold text-sm text-industrial-950">
              {language === 'hi' ? 'आज के मुख्य मंडी भाव' : language === 'mr' ? 'आजचे मुख्य बाजार भाव' : "Today's Mandi Benchmarks"}
            </h3>
          </div>
          <button
            onClick={() => navigate('/collector/prices')}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-0.5"
          >
            <span>{language === 'hi' ? 'सभी देखें' : 'View All'}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {materials.slice(0, 3).map((m) => (
            <div key={m.id} className="bg-paper-100 rounded-xl p-2.5 border border-paper-300 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs">{m.icon === 'zap' ? '⚡' : m.icon === 'circuit-board' ? '🔌' : '🔋'}</span>
                <span className={`text-[9px] font-mono font-bold ${m.trend >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {m.trend >= 0 ? `+${m.trend}%` : `${m.trend}%`}
                </span>
              </div>
              <p className="text-[10px] text-industrial-600 font-semibold truncate">
                {language === 'hi' ? m.tagHindi : m.name}
              </p>
              <p className="text-xs font-black font-mono text-industrial-950 mt-0.5">
                ₹{m.basePrice}<span className="text-[9px] font-normal text-industrial-500">/{m.unit}</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Active Lot Status & Handover Trigger */}
      {activeLot && (
        <div className="bg-white rounded-2xl p-4 border border-paper-300 shadow-tactile space-y-3">
          <div className="flex items-center justify-between border-b border-paper-200 pb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              <h3 className="font-display font-bold text-sm text-industrial-950">
                {language === 'hi' ? 'सक्रिय लॉट की स्थिति' : 'Active Scrap Lot'}
              </h3>
            </div>
            <span className="font-mono text-[10px] font-bold text-industrial-600 bg-paper-200 px-2 py-0.5 rounded">
              {activeLot.id.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MaterialBadge 
                iconKey={activeMaterial?.icon} 
                category={activeMaterial?.category} 
                size="md" 
              />
              <div>
                <p className="font-bold text-sm text-industrial-900 leading-snug">
                  {activeMaterial?.name || 'Scrap Material'}
                </p>
                <p className="text-xs text-industrial-500 font-mono">
                  {activeLot.weight} kg Net • {activeLot.condition}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm font-black font-mono text-emerald-800">
                ₹{activeLot.finalPrice || `${activeLot.estimatedValueRange[0]} - ${activeLot.estimatedValueRange[1]}`}
              </p>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                activeLot.status === 'Handover Completed' 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : activeLot.status === 'Offer Accepted'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {activeLot.status}
              </span>
            </div>
          </div>

          {activeLot.status === 'Offer Accepted' && (
            <button
              onClick={() => navigate(`/collector/handover/${activeLot.id}`)}
              className="w-full bg-forest-800 hover:bg-forest-900 active:scale-[0.98] text-white py-2.5 px-3 rounded-xl font-display font-bold text-xs flex items-center justify-center gap-1.5 shadow-tactile transition-all"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'हैंडओवर कांटा पर्ची व QR खोलें' : 'Open Handover Weigh Slip & QR'}</span>
            </button>
          )}
        </div>
      )}

      {/* Quick Field Operations Grid */}
      <div className="grid grid-cols-4 gap-2 pt-1">
        <button
          onClick={() => navigate('/collector/prices')}
          className="bg-white p-2.5 rounded-xl border border-paper-300 shadow-tactile flex flex-col items-center justify-center text-center active:scale-95 transition-all"
        >
          <IndianRupee className="w-5 h-5 text-emerald-700 mb-1" />
          <span className="text-[10px] font-bold text-industrial-800">Mandi</span>
        </button>

        <button
          onClick={() => navigate('/collector/recyclers')}
          className="bg-white p-2.5 rounded-xl border border-paper-300 shadow-tactile flex flex-col items-center justify-center text-center active:scale-95 transition-all"
        >
          <Building2 className="w-5 h-5 text-amber-700 mb-1" />
          <span className="text-[10px] font-bold text-industrial-800">Buyers</span>
        </button>

        <button
          onClick={() => navigate('/collector/earnings')}
          className="bg-white p-2.5 rounded-xl border border-paper-300 shadow-tactile flex flex-col items-center justify-center text-center active:scale-95 transition-all"
        >
          <Scale className="w-5 h-5 text-forest-700 mb-1" />
          <span className="text-[10px] font-bold text-industrial-800">Khata</span>
        </button>

        <button
          onClick={() => navigate('/collector/profile')}
          className="bg-white p-2.5 rounded-xl border border-paper-300 shadow-tactile flex flex-col items-center justify-center text-center active:scale-95 transition-all"
        >
          <ShieldCheck className="w-5 h-5 text-blue-700 mb-1" />
          <span className="text-[10px] font-bold text-industrial-800">Safety</span>
        </button>
      </div>
    </div>
  );
};

export default CollectorHome;

