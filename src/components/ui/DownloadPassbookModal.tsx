import React, { useState, useMemo, useCallback } from 'react';
import { 
  X, 
  Download, 
  FileText, 
  CheckCircle2, 
  Calendar, 
  TrendingUp, 
  Scale, 
  Leaf, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { translations } from '../../utils/translations';
import { 
  computePassbookStats, 
  generatePassbookPdf, 
  type PassbookTimeframe 
} from '../../utils/generatePassbookPdf';
import type { Material } from '../../data/mockData';

interface DownloadPassbookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadPassbookModal: React.FC<DownloadPassbookModalProps> = ({ isOpen, onClose }) => {
  const { transactions, materials, language } = useAppContext();
  const t = translations[language] || translations.en;

  const [timeframe, setTimeframe] = useState<PassbookTimeframe>('1m');
  const [isGenerating, setIsGenerating] = useState(false);

  const getMaterialName = useCallback((m?: Material) => {
    if (!m) return '';
    return (t.materials as Record<string, string>)[m.id] || m.name;
  }, [t.materials]);

  // Compute live statistical analysis based on selected timeframe
  const { stats, filteredTransactions } = useMemo(() => {
    return computePassbookStats(transactions, materials, timeframe, getMaterialName);
  }, [transactions, materials, timeframe, getMaterialName]);

  if (!isOpen) return null;

  const handleDownload = async () => {
    try {
      setIsGenerating(true);
      // Small timeout to allow UI to show loading state
      await new Promise((resolve) => setTimeout(resolve, 350));
      await generatePassbookPdf(stats, filteredTransactions, materials, {
        name: 'Ramdas CX-1028',
        role: 'Certified Scrap Aggregator',
        station: 'Pune Station Node',
        serviceArea: 'Pune City Area, Maharashtra'
      });
      setIsGenerating(false);
      onClose();
    } catch (err) {
      console.error('Error generating PDF passbook:', err);
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4.5 flex items-center justify-between relative overflow-hidden">
          {/* Subtle green ambient background glow */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/20 blur-2xl rounded-full pointer-events-none" />

          <div className="flex items-center space-x-3 z-10">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-inner">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-base tracking-tight text-white">
                  {language === 'mr' ? 'डिजिटल पासबुक डाउनलोड' : language === 'hi' ? 'डिजिटल पासबुक डाउनलोड' : 'Digital Passbook Statement'}
                </h3>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  PDF
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {language === 'mr' ? 'सांख्यिकीय विश्लेषण व EPR प्रमाणपत्र अहवाल' : language === 'hi' ? 'सांख्यिकीय विश्लेषण और EPR ऑडिट रिपोर्ट' : 'Statistical audit & CPCB compliance report'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Period Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              {language === 'mr' ? 'कालावधी निवडा' : language === 'hi' ? 'अवधि चुनें' : 'Select Timeframe'}
            </label>

            <div className="grid grid-cols-2 gap-3">
              {/* Option: 1 Month */}
              <button
                type="button"
                onClick={() => setTimeframe('1m')}
                className={`p-3.5 rounded-2xl border-2 text-left transition-all relative ${
                  timeframe === '1m'
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="inline-flex items-center text-xs font-bold text-slate-900">
                    <Calendar className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                    {language === 'mr' ? 'मागील १ महिना' : language === 'hi' ? 'पिछला 1 महीना' : 'Past 1 Month'}
                  </span>
                  {timeframe === '1m' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">
                  {language === 'mr' ? 'मागील ३० दिवसांचे व्यवहार व दर अहवाल' : language === 'hi' ? 'पिछले 30 दिनों का खाता बही और मंडी भाव' : 'Last 30 days transactions & monthly ledger'}
                </p>
                <span className="mt-2 inline-block text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                  30-Day Audit
                </span>
              </button>

              {/* Option: 1 Year */}
              <button
                type="button"
                onClick={() => setTimeframe('1y')}
                className={`p-3.5 rounded-2xl border-2 text-left transition-all relative ${
                  timeframe === '1y'
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="inline-flex items-center text-xs font-bold text-slate-900">
                    <TrendingUp className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                    {language === 'mr' ? 'मागील १ वर्ष' : language === 'hi' ? 'पिछला 1 वर्ष' : 'Past 1 Year'}
                  </span>
                  {timeframe === '1y' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">
                  {language === 'mr' ? 'संपूर्ण वार्षिक वित्तीय व पर्यावरण ऑडिट' : language === 'hi' ? 'वार्षिक वित्तीय और पर्यावरण प्रभाव रिपोर्ट' : '12-Month annual financial & EPR eco-audit'}
                </p>
                <span className="mt-2 inline-block text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                  Annual Report
                </span>
              </button>
            </div>
          </div>

          {/* Statistical Live Preview Card */}
          <div className="bg-slate-50 rounded-2xl p-4.5 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 mr-1" />
                {language === 'mr' ? 'सांख्यिकी सारांश' : language === 'hi' ? 'सांख्यिकी सारांश' : 'Statistical Summary Preview'}
              </span>
              <span className="text-[11px] font-semibold text-slate-500">
                {stats.totalTransactions} {language === 'mr' ? 'नोंदी' : language === 'hi' ? 'लॉट' : 'Lots'}
              </span>
            </div>

            {/* Metrics 4-Box Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] font-semibold text-slate-500 block uppercase">
                  {language === 'mr' ? 'एकूण वजन' : language === 'hi' ? 'कुल वजन' : 'Total Scrap'}
                </span>
                <span className="text-sm font-black text-slate-900">
                  {stats.totalWeightKg.toLocaleString()} kg
                </span>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] font-semibold text-slate-500 block uppercase">
                  {language === 'mr' ? 'जमा रक्कम' : language === 'hi' ? 'कुल भुगतान' : 'Revenue'}
                </span>
                <span className="text-sm font-black text-emerald-700">
                  ₹{stats.totalSettledAmount.toLocaleString()}
                </span>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] font-semibold text-slate-500 block uppercase">
                  {language === 'mr' ? 'सरासरी दर' : language === 'hi' ? 'औसत भाव' : 'Avg Rate'}
                </span>
                <span className="text-sm font-black text-slate-900">
                  ₹{stats.avgRatePerKg}/kg
                </span>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] font-semibold text-slate-500 block uppercase flex items-center">
                  <Leaf className="w-2.5 h-2.5 text-emerald-600 mr-0.5" /> CO2 Offset
                </span>
                <span className="text-sm font-black text-emerald-800">
                  {stats.co2OffsetKg} kg
                </span>
              </div>
            </div>

            {/* Top Category Snippet */}
            {stats.materialStats.length > 0 && (
              <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
                <span className="flex items-center">
                  <Scale className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
                  {language === 'mr' ? 'प्रमुख सामग्री:' : language === 'hi' ? 'शीर्ष सामग्री:' : 'Top Contributor:'}
                  <strong className="text-slate-900 ml-1">{stats.materialStats[0].name}</strong>
                </span>
                <span className="text-emerald-700 font-bold">
                  {stats.materialStats[0].weightPercent}% ({stats.materialStats[0].weightKg} kg)
                </span>
              </div>
            )}
          </div>

          {/* Compliance & Format Badge */}
          <div className="flex items-start space-x-2.5 p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold block">
                {language === 'mr' ? 'CPCB आणि ई-कचरा नियम २०२२ प्रमाणित अहवाल' : language === 'hi' ? 'CPCB और ई-कचरा नियम 2022 प्रमाणित रिपोर्ट' : 'CPCB Verified EPR Audit Standard'}
              </span>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                {language === 'mr'
                  ? 'या PDF मध्ये सर्व व्यवहारांची डिजिटल पावती, श्रेणीनिहाय विश्लेषण, आणि अधिकृत रिसायकलर पडताळणी समाविष्ट आहे.'
                  : language === 'hi'
                  ? 'इस PDF में प्रत्येक लॉट का डिजिटल रिकॉर्ड, सामग्री वर्गीकरण और CPCB रीसाइक्लर सत्यापन शामिल है।'
                  : 'Includes complete transaction logs, material yield breakdown, environmental offset metrics, and digital verification seal.'}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isGenerating}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition-colors"
          >
            {language === 'mr' ? 'रद्द करा' : language === 'hi' ? 'रद्द करें' : 'Cancel'}
          </button>

          <button
            type="button"
            onClick={handleDownload}
            disabled={isGenerating}
            className="bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs py-2.5 px-5 rounded-xl shadow-md transition-all flex items-center space-x-2 disabled:opacity-60"
          >
            {isGenerating ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>
                  {language === 'mr' ? 'PDF तयार होत आहे...' : language === 'hi' ? 'PDF जनरेट हो रही है...' : 'Generating PDF Report...'}
                </span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>
                  {language === 'mr'
                    ? `PDF डाउनलोड करा (${timeframe === '1m' ? '१ महिना' : '१ वर्ष'})`
                    : language === 'hi'
                    ? `PDF डाउनलोड करें (${timeframe === '1m' ? '1 महीना' : '1 वर्ष'})`
                    : `Download PDF Report (${timeframe === '1m' ? '1 Month' : '1 Year'})`}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
