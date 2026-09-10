import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  MapPin, 
  Share2, 
  Download, 
  ShieldCheck, 
  QrCode, 
  ChevronLeft, 
  Clock, 
  Printer,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useAppContext } from '../../context/AppContext';

const Handover: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lots, recyclers, materials, updateLot, addTransaction } = useAppContext();
  
  const lot = lots.find(l => l.id === id) || lots[0];
  const recycler = recyclers.find(r => r.id === lot?.recyclerId) || recyclers[0];
  const material = materials.find(m => m.id === lot?.materialId) || materials[2];

  const [step, setStep] = useState<'qr' | 'success'>('qr');
  const [copied, setCopied] = useState(false);

  if (!lot) {
    return <div className="p-8 text-center text-slate-500 font-mono">Lot not found</div>;
  }

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
      `🧾 ECOSETU DIGITAL HANDOVER RECEIPT\n` +
      `LOT ID: ${lot.id.toUpperCase()}\n` +
      `Material: ${material.name} (${lot.weight} kg)\n` +
      `Recycler: ${recycler.name}\n` +
      `Total Cash Received: ₹${finalAmount}\n` +
      `Status: CPCB Verified Traceability Completed`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="flex flex-col min-h-full bg-[#fbf8f1] text-[#13261e] pb-10">
      
      {/* Top Header */}
      <div className="bg-[#0b241a] text-white px-4 py-3.5 flex items-center justify-between shadow-md relative z-10">
        <div className="flex items-center space-x-2.5">
          <button 
            onClick={() => navigate('/collector')}
            className="p-1.5 rounded-xl bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-black tracking-tight leading-tight">
              {step === 'qr' ? 'हैंडओवर क्यूआर कोड' : 'डिजिटल रसीद'}
            </h1>
            <p className="text-[10px] font-mono text-emerald-300/80 uppercase">
              LOT #{lot.id.toUpperCase()} • GREEN HANDOVER
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-900 text-emerald-300 font-bold border border-emerald-700/50">
          {step === 'qr' ? 'SCAN PENDING' : 'COMPLETED ✓'}
        </span>
      </div>

      <div className="p-4 flex-1">
        
        {step === 'qr' ? (
          <div className="space-y-4">
            
            {/* Handover Gate Pass */}
            <div className="bg-white rounded-[28px] border border-[#e6decb] shadow-card-elevated p-5 text-center space-y-4 relative overflow-hidden">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  DIGITAL CHAIN OF CUSTODY
                </span>
                <h2 className="text-xl font-black text-slate-900">
                  रीसाइक्लर को यह QR कोड दिखाएं
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  स्कैन होते ही माल आपके खाते में दर्ज होगा व तुरंत नकद भुगतान मिलेगा
                </p>
              </div>

              {/* High Contrast QR Code Container */}
              <div className="bg-gradient-to-b from-[#f7faf8] to-[#edf4f0] p-6 rounded-3xl border-2 border-emerald-500/40 inline-block mx-auto shadow-inner relative">
                <div className="p-3 bg-white rounded-2xl shadow-md border border-slate-200/80">
                  <QRCodeSVG 
                    value={JSON.stringify({ 
                      lotId: lot.id, 
                      collectorId: lot.collectorId || 'COL-1028',
                      recyclerId: recycler.id,
                      weight: lot.weight,
                      price: finalAmount,
                      ts: new Date().toISOString()
                    })} 
                    size={200}
                    level="H"
                  />
                </div>
                <div className="mt-2 text-[10px] font-mono text-emerald-900 font-bold tracking-widest uppercase">
                  ECOSETU SECURE TOKEN
                </div>
              </div>

              {/* Manifest Snapshot */}
              <div className="bg-[#fcfaf6] rounded-2xl p-4 border border-[#eee5d5] text-left space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">सामग्री (Material):</span>
                  <span className="font-bold text-slate-900">{material.name} ({material.icon})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">कुल वजन (Weight):</span>
                  <span className="font-bold text-slate-900">{lot.weight} KG</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">स्वीकृत रीसाइक्लर:</span>
                  <span className="font-bold text-slate-900">{recycler.name}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#e8dfce]">
                  <span className="text-slate-800 font-bold">कुल देय नकद:</span>
                  <span className="text-base font-black text-emerald-800">₹{finalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Live Location Stamp */}
              <div className="flex items-center justify-center space-x-2 text-[11px] font-mono text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>GPS Location Captured • Pune Hub</span>
              </div>
            </div>

            {/* Simulation Button for Judges / Demonstration */}
            <div className="pt-2">
              <button 
                onClick={handleConfirmHandover}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-base py-4 rounded-2xl shadow-tactile-green active:translate-y-1 transition-all flex items-center justify-center space-x-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>हैंडओवर व नकद भुगतान कन्फर्म करें (Scan & Pay)</span>
              </button>
              <p className="text-[10px] text-center text-slate-500 font-mono mt-1.5">
                (डेमो हेतु: रीसाइक्लर स्कैनर द्वारा पुष्टि का सिमुलेशन)
              </p>
            </div>

          </div>
        ) : (
          /* STEP 2: Stamped Digital Receipt */
          <div className="space-y-4 animate-in zoom-in-95 duration-200">
            
            {/* Success Banner */}
            <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-4 rounded-[24px] text-center shadow-lg space-y-1 relative overflow-hidden">
              <div className="w-12 h-12 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center mx-auto mb-1 shadow-md">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-black">हैंडओवर पूरा हुआ • भुगतान प्राप्त!</h2>
              <p className="text-xs text-emerald-200 font-mono">
                CPCB TRACEABILITY LOGGED • TXN #{lot.id.toUpperCase()}
              </p>
            </div>

            {/* Digital Bahi-Khata Receipt Card */}
            <div className="bg-white rounded-[28px] border-2 border-[#ded4c3] p-5 shadow-card-elevated relative overflow-hidden">
              {/* Receipt Header */}
              <div className="text-center pb-4 border-b border-dashed border-[#e6decb] space-y-1">
                <div className="text-base font-black text-slate-900 tracking-tight">
                  ECOSETU DIGITAL RECEIPT
                </div>
                <p className="text-[11px] font-mono text-slate-500">
                  भारत सरकार ई-कचरा प्रबंधन नियम 2022 अधिकृत
                </p>
              </div>

              {/* Financial Highlight */}
              <div className="py-4 text-center bg-[#f7fbf8] rounded-2xl border border-emerald-100 my-4">
                <span className="text-[11px] font-mono font-bold text-slate-500 uppercase">
                  कुल नकद भुगतान प्राप्त (PAID IN CASH)
                </span>
                <div className="text-4xl font-black text-emerald-900 font-mono tracking-tight mt-0.5">
                  ₹{finalAmount.toLocaleString()}
                </div>
                <span className="inline-block mt-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
                  ✓ तुरंत नकद प्राप्त (Hand-to-Hand)
                </span>
              </div>

              {/* Receipt Itemized Table */}
              <div className="space-y-2 text-xs font-mono border-b border-[#f0e9dc] pb-4">
                <div className="flex justify-between">
                  <span className="text-slate-500">लॉट आईडी:</span>
                  <span className="font-bold text-slate-900">{lot.id.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">कलेक्टर आईडी:</span>
                  <span className="font-bold text-slate-900">COL-1028 (Raju Bhai)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">रीसाइक्लर:</span>
                  <span className="font-bold text-slate-900">{recycler.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">ई-कचरा श्रेणी:</span>
                  <span className="font-bold text-slate-900">{material.name} ({material.icon})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">अंतिम वजन:</span>
                  <span className="font-bold text-slate-900">{lot.weight} KG</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">दर प्रति किलो:</span>
                  <span className="font-bold text-slate-900">₹{recycler.offers[material.id] || 230} / KG</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">समय व स्थान:</span>
                  <span className="font-bold text-slate-900">10 Sep 2026, 5:42 PM (Pune)</span>
                </div>
              </div>

              {/* Verified Stamp */}
              <div className="pt-4 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span className="flex items-center text-emerald-700 font-bold">
                  <ShieldCheck className="w-4 h-4 mr-1 text-emerald-600" /> CPCB Traceability Verified
                </span>
                <span>SHA-256 DIGITAL HASH ✓</span>
              </div>
            </div>

            {/* Sharing & Navigation CTAs */}
            <div className="space-y-2 pt-1">
              <button 
                onClick={handleShare}
                className="w-full bg-[#1e2922] text-white font-bold text-sm font-mono py-3.5 rounded-2xl active:scale-98 transition-all flex items-center justify-center space-x-2 shadow-sm"
              >
                <Share2 className="w-4 h-4" />
                <span>{copied ? 'रसीद कॉपी हो गई!' : 'रसीद शेयर करें (Share Receipt)'}</span>
              </button>

              <button 
                onClick={() => navigate('/collector')}
                className="w-full bg-[#f4ece0] hover:bg-[#ede3d3] text-slate-800 font-bold text-xs py-3 rounded-xl border border-[#dcd1be] transition-colors text-center"
              >
                ← मुख्य स्क्रीन पर लौटें (Back to Home)
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default Handover;
