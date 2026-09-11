import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  MapPin, 
  Share2, 
  ShieldCheck, 
  ChevronLeft
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useAppContext } from '../../context/AppContext';
import { translations } from '../../utils/translations';
import type { Material } from '../../data/mockData';

const Handover: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lots, recyclers, materials, updateLot, addTransaction, language } = useAppContext();
  const t = translations[language] || translations.en;
  
  const lot = lots.find(l => l.id === id) || lots[0];
  const recycler = recyclers.find(r => r.id === lot?.recyclerId) || recyclers[0];
  const material = materials.find(m => m.id === lot?.materialId) || materials[2];

  const [step, setStep] = useState<'qr' | 'success'>('qr');
  const [copied, setCopied] = useState(false);

  if (!lot) {
    return <div className="p-8 text-center text-slate-500">Lot not found</div>;
  }

  const getMaterialName = (m?: Material) => {
    if (!m) return '';
    return (t.materials as Record<string, string>)[m.id] || m.name;
  };

  const finalAmount = lot.finalPrice || Math.round(lot.weight * (recycler.offers[material.id] || 230));

  const handleConfirmHandover = () => {
    updateLot(lot.id, { 
      status: 'Handover Completed',
      finalPrice: finalAmount
    });
    addTransaction({
      id: `t${Math.floor(100 + Math.random() * 900)}`,
      lotId: lot.id,
      materialId: material.id,
      weight: lot.weight,
      amount: finalAmount,
      date: new Date().toISOString(),
      status: 'Paid',
      method: 'Cash'
    });
    setStep('success');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(
      `🧾 REGAIN DIGITAL HANDOVER RECEIPT\n` +
      `LOT ID: ${lot.id.toUpperCase()}\n` +
      `Material: ${getMaterialName(material)} (${lot.weight} kg)\n` +
      `Recycler: ${recycler.name}\n` +
      `Total Cash Received: ₹${finalAmount}\n` +
      `Status: CPCB Verified Traceability Completed`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="p-4 space-y-4 pb-8">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <button 
            onClick={() => navigate('/collector')}
            className="p-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-base font-extrabold text-slate-900 leading-tight">
              {step === 'qr' ? t.handoverQrTitle : t.digitalReceiptTitle}
            </h2>
            <p className="text-[11px] text-slate-500 font-medium">
              #{lot.id.toUpperCase()} • {t.custodyPassSub}
            </p>
          </div>
        </div>

        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
          step === 'qr' ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
        }`}>
          {step === 'qr' ? t.pendingScanBadge : t.completedBadge}
        </span>
      </div>

      {step === 'qr' ? (
        <div className="space-y-4">
          
          {/* Handover Gate Pass */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 text-center space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                DIGITAL CHAIN OF CUSTODY
              </span>
              <h3 className="text-lg font-black text-slate-900 pt-1">
                {t.showQrHeader}
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                {t.showQrInstructions}
              </p>
            </div>

            {/* Clean QR Code Container */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 inline-block mx-auto shadow-inner">
              <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-200">
                <QRCodeSVG 
                  value={JSON.stringify({ 
                    lotId: lot.id, 
                    collectorId: lot.collectorId || 'COL-1028',
                    recyclerId: recycler.id,
                    weight: lot.weight,
                    price: finalAmount,
                    ts: new Date().toISOString()
                  })} 
                  size={190}
                  level="H"
                />
              </div>
              <div className="mt-2 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                {t.secureTokenBadge}
              </div>
            </div>

            {/* Manifest Details */}
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">{t.lotMaterialLabel}</span>
                <span className="font-bold text-slate-900">{getMaterialName(material)} ({material.icon})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t.lotWeightLabel}</span>
                <span className="font-bold text-slate-900">{lot.weight} KG</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t.lotBuyerLabel}</span>
                <span className="font-bold text-slate-900">{recycler.name}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200">
                <span className="text-slate-700 font-bold">{t.confirmedPayoutLabel}</span>
                <span className="text-base font-black text-emerald-700">₹{finalAmount.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-1.5 text-xs text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>GPS Location: Hinjewadi Pune Center</span>
            </div>
          </div>

          {/* Verification CTA */}
          <div className="space-y-1.5 pt-1">
            <button 
              onClick={handleConfirmHandover}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-3.5 rounded-xl shadow-sm transition-all flex items-center justify-center space-x-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>{t.confirmHandoverBtn}</span>
            </button>
            <p className="text-[11px] text-center text-slate-400">
              {t.demoSimulationNote}
            </p>
          </div>

        </div>
      ) : (
        /* STEP 2: Stamped Digital Receipt */
        <div className="space-y-4">
          
          <div className="bg-emerald-700 text-white p-4 rounded-2xl text-center shadow-sm space-y-1">
            <div className="w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center mx-auto mb-1">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black">{t.handoverSuccessTitle}</h3>
            <p className="text-xs text-emerald-100">
              {t.cpcbLoggedSub} • #{lot.id.toUpperCase()}
            </p>
          </div>

          {/* Digital Receipt Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="text-center pb-3 border-b border-dashed border-slate-200 space-y-0.5">
              <div className="text-base font-black text-slate-900">
                REGAIN DIGITAL RECEIPT
              </div>
              <p className="text-[11px] text-slate-500">
                {t.govtRuleCompliance}
              </p>
            </div>

            {/* Financial Amount */}
            <div className="py-3 text-center bg-emerald-50 rounded-xl border border-emerald-100">
              <span className="text-[11px] font-bold text-emerald-800 uppercase">
                {t.cashReceivedTitle}
              </span>
              <div className="text-3xl font-black text-emerald-900 mt-0.5">
                ₹{finalAmount.toLocaleString()}
              </div>
              <span className="inline-block mt-1 text-[11px] font-semibold text-emerald-700 bg-white px-2.5 py-0.5 rounded-full border border-emerald-200">
                {t.handToHandBadge}
              </span>
            </div>

            {/* Receipt Table */}
            <div className="space-y-2 text-xs border-b border-slate-100 pb-3">
              <div className="flex justify-between">
                <span className="text-slate-500">{t.lotIdLabel}</span>
                <span className="font-bold text-slate-900">{lot.id.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t.collectorIdLabel}</span>
                <span className="font-bold text-slate-900">COL-1028 (Ramdas)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t.buyerNameLabel}</span>
                <span className="font-bold text-slate-900">{recycler.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t.lotMaterialLabel}</span>
                <span className="font-bold text-slate-900">{getMaterialName(material)} ({material.icon})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t.lotWeightLabel}</span>
                <span className="font-bold text-slate-900">{lot.weight} KG</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t.ratePerKgLabel}</span>
                <span className="font-bold text-slate-900">₹{recycler.offers[material.id] || 230} / KG</span>
              </div>
            </div>

            {/* Stamp footer */}
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center text-emerald-700 font-semibold">
                <ShieldCheck className="w-4 h-4 mr-1 text-emerald-600" /> {t.traceabilityVerified}
              </span>
              <span>SHA-256 DIGITAL HASH ✓</span>
            </div>
          </div>

          {/* Navigation CTAs */}
          <div className="space-y-2 pt-1">
            <button 
              onClick={handleShare}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-xl transition-all flex items-center justify-center space-x-2"
            >
              <Share2 className="w-4 h-4" />
              <span>{copied ? 'Copied ✓' : t.shareReceiptBtn}</span>
            </button>

            <button 
              onClick={() => navigate('/collector')}
              className="w-full bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs py-2.5 rounded-xl border border-slate-200 transition-colors text-center"
            >
              ← {t.backToHomeBtn}
            </button>
          </div>

        </div>
      )}

    </div>
  );
};

export default Handover;
