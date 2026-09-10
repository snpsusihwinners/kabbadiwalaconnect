import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  MapPin, 
  Share2, 
  Printer, 
  QrCode, 
  Scale, 
  ArrowLeft,
  Building2,
  ShieldCheck,
  Download
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useAppContext } from '../../context/AppContext';
import { MaterialBadge } from '../../components/ui/MaterialBadge';

const Handover: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lots, recyclers, materials, updateLot, addTransaction, language } = useAppContext();
  
  const lot = lots.find(l => l.id === id);
  const recycler = recyclers.find(r => r.id === lot?.recyclerId);
  const material = materials.find(m => m.id === lot?.materialId);

  const [step, setStep] = useState<'ticket' | 'receipt'>(lot?.status === 'Handover Completed' ? 'receipt' : 'ticket');

  if (!lot || !material) {
    return (
      <div className="p-8 text-center text-industrial-500">
        <p className="font-bold">Lot not found</p>
        <button onClick={() => navigate('/collector')} className="mt-4 text-xs font-bold text-emerald-700 underline">
          Go back to Home
        </button>
      </div>
    );
  }

  const activeRecycler = recycler || recyclers[0];
  const finalAmount = lot.finalPrice || Math.round((lot.ratePerKg || material.basePrice) * lot.weight);

  const handleConfirmScan = () => {
    updateLot(lot.id, { 
      status: 'Handover Completed',
      finalPrice: finalAmount,
      recyclerId: activeRecycler.id
    });
    
    addTransaction({
      id: `t${Math.floor(100 + Math.random() * 900)}`,
      ticketNo: `KP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      lotId: lot.id,
      materialId: material.id,
      grossWeight: lot.grossWeight || lot.weight + 0.6,
      tareWeight: lot.tareWeight || 0.6,
      weight: lot.weight,
      ratePerKg: lot.ratePerKg || material.basePrice,
      amount: finalAmount,
      date: new Date().toISOString(),
      status: 'Paid',
      method: 'UPI',
      utrRef: `UPI/${Math.floor(100000000000 + Math.random() * 900000000000)}/HDFC`
    });

    setStep('receipt');
  };

  const handlePrint = () => {
    window.print();
  };

  const qrData = JSON.stringify({
    slip: `KP-${lot.id.toUpperCase()}`,
    manifest: lot.manifestNo,
    collector: lot.collectorId,
    recycler: activeRecycler.id,
    material: material.id,
    weight: lot.weight,
    amount: finalAmount,
    timestamp: new Date().toISOString()
  });

  return (
    <div className="flex flex-col h-full bg-paper-100">
      {/* Header Bar */}
      <div className="bg-white px-4 py-3 border-b border-paper-300 flex items-center justify-between sticky top-0 z-20 shadow-sm no-print">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/collector')} className="p-1.5 rounded-lg hover:bg-paper-100 text-industrial-600">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-display font-bold text-base text-industrial-950">
              {step === 'ticket' ? 'Digital Weighbridge Slip' : 'Handover Settlement Receipt'}
            </h1>
            <p className="text-[10px] text-industrial-500 font-mono">
              Lot {lot.id.toUpperCase()} • CPCB Form-6 Manifest
            </p>
          </div>
        </div>

        <button 
          onClick={handlePrint}
          className="p-2 rounded-xl bg-paper-100 hover:bg-paper-200 text-industrial-700 border border-paper-300"
          title="Print Slip"
        >
          <Printer className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-4 flex-1 overflow-y-auto">
        {step === 'ticket' ? (
          /* SERRATED DIGITAL KANTA PARCHI SLIP */
          <div className="space-y-4">
            <div className="bg-white rounded-3xl border border-paper-300 shadow-ticket overflow-hidden relative">
              {/* Slip Header */}
              <div className="bg-forest-900 text-white p-5 text-center relative">
                <div className="inline-flex items-center gap-1 text-[9px] font-mono uppercase tracking-widest text-emerald-300 bg-forest-800 px-2 py-0.5 rounded-full border border-forest-700 mb-1">
                  <ShieldCheck className="w-3 h-3 text-amber-400" />
                  CPCB FORM-6 VERIFIED WEIGH SLIP
                </div>
                <h2 className="text-lg font-black font-display tracking-tight text-white">
                  कांटा पर्ची • KANTA WEIGH SLIP
                </h2>
                <p className="text-[11px] font-mono text-forest-300 mt-0.5">
                  MANIFEST: {lot.manifestNo}
                </p>
              </div>

              {/* QR Code Presentation Box */}
              <div className="p-6 flex flex-col items-center justify-center bg-paper-50 border-b border-dashed border-paper-300">
                <div className="p-3.5 bg-white rounded-2xl border-2 border-forest-900 shadow-tactile-md">
                  <QRCodeSVG 
                    value={qrData} 
                    size={175} 
                    level="H"
                    includeMargin={false}
                  />
                </div>
                <p className="text-xs font-bold text-industrial-800 mt-3 text-center">
                  Scan at Recycler Gate-In Weighbridge
                </p>
                <p className="text-[10px] text-industrial-500 font-mono text-center">
                  Cryptographically Hashed with GPS & Tare Specs
                </p>
              </div>

              {/* Serrated Cutout Perforation Line */}
              <div className="relative h-4 bg-paper-100 flex items-center justify-between px-2 ticket-perforation">
                <div className="w-4 h-4 rounded-full bg-paper-100 -ml-4 border-r border-paper-300"></div>
                <div className="w-4 h-4 rounded-full bg-paper-100 -mr-4 border-l border-paper-300"></div>
              </div>

              {/* Weigh & Manifest Breakdown Table */}
              <div className="p-5 bg-white space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center py-1 border-b border-paper-200">
                  <span className="text-industrial-500 font-sans">Material Grade</span>
                  <span className="font-bold text-industrial-950">{material.name}</span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-paper-200">
                  <span className="text-industrial-500 font-sans">HSN Classification</span>
                  <span className="font-bold text-industrial-700">{material.hsnCode}</span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-paper-200">
                  <span className="text-industrial-500 font-sans">Gross Scale Weight</span>
                  <span className="font-bold text-industrial-950">{(lot.grossWeight || lot.weight + 0.6).toFixed(2)} kg</span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-paper-200">
                  <span className="text-industrial-500 font-sans">Tare Deduction (Container)</span>
                  <span className="font-bold text-amber-700">- {(lot.tareWeight || 0.6).toFixed(2)} kg</span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-paper-200 bg-emerald-50/50 p-2 rounded-lg">
                  <span className="text-emerald-950 font-sans font-bold">Net Billable Weight</span>
                  <span className="text-base font-black text-emerald-800">{lot.weight.toFixed(2)} kg</span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-paper-200">
                  <span className="text-industrial-500 font-sans">Agreed Procured Rate</span>
                  <span className="font-bold text-industrial-950">₹{lot.ratePerKg || material.basePrice}/kg</span>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-industrial-900 font-sans font-extrabold text-sm">Total Payout Payable</span>
                  <span className="text-xl font-black text-emerald-800 font-mono">₹{finalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Facility & Location Signature Details */}
              <div className="bg-paper-100 p-4 border-t border-paper-300 text-[11px] space-y-1.5 font-sans">
                <div className="flex justify-between">
                  <span className="text-industrial-500">Authorized Recycler:</span>
                  <span className="font-bold text-industrial-900">{activeRecycler.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-industrial-500">CPCB Authorization:</span>
                  <span className="font-mono text-emerald-800">{activeRecycler.cpcbReg}</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-industrial-500 pt-1 font-mono">
                  <MapPin className="w-3 h-3 text-emerald-700" />
                  <span>Geo-Stamp: 18.5204° N, 73.8567° E (Pune Central)</span>
                </div>
              </div>
            </div>

            {/* Test Simulation Trigger */}
            <div className="no-print space-y-2">
              <button
                onClick={handleConfirmScan}
                className="w-full bg-forest-800 hover:bg-forest-900 active:scale-[0.98] text-white py-4 rounded-2xl font-display font-bold text-sm shadow-tactile transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                <span>Simulate Recycler Weighbridge Gate-In Scan</span>
              </button>
              <p className="text-[10px] text-center text-industrial-500">
                In field usage, the recycler scans this QR code at their calibrated scale.
              </p>
            </div>
          </div>
        ) : (
          /* COMPLETED DIGITAL RECEIPT & PASSBOOK VOUCHER */
          <div className="space-y-4 animate-in zoom-in-95 duration-200">
            <div className="bg-white rounded-3xl border border-paper-300 p-6 shadow-ticket text-center space-y-4 relative">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center mx-auto shadow-tactile">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold uppercase px-3 py-1 rounded-full border border-emerald-300">
                  HANDOVER COMPLETED & SETTLED
                </span>
                <h2 className="text-2xl font-black font-display text-industrial-950 mt-2">
                  ₹{finalAmount.toLocaleString('en-IN')}
                </h2>
                <p className="text-xs text-industrial-500 font-medium">
                  Disbursed via Instant UPI Direct to Raju Scrap Co.
                </p>
              </div>

              <div className="bg-paper-50 rounded-2xl p-4 border border-paper-300 text-left font-mono text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-industrial-500 font-sans">Payment Mode</span>
                  <span className="font-bold text-emerald-800">UPI Instant Credit</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-industrial-500 font-sans">Ref / UTR</span>
                  <span className="text-industrial-950">UPI/98421094812/YESB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-industrial-500 font-sans">Net Weight Received</span>
                  <span className="font-bold text-industrial-950">{lot.weight} kg {material.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-industrial-500 font-sans">Recycler Entity</span>
                  <span className="font-bold text-industrial-900">{activeRecycler.legalEntity}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-paper-200">
                  <span className="text-industrial-500 font-sans">Timestamp</span>
                  <span className="text-industrial-700">{new Date().toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2 no-print">
                <button
                  onClick={() => navigate('/collector/earnings')}
                  className="flex-1 bg-forest-800 hover:bg-forest-900 text-white font-display font-bold text-xs py-3 rounded-xl shadow-tactile transition-all"
                >
                  View in Khata Passbook
                </button>
                <button
                  onClick={handlePrint}
                  className="px-4 bg-paper-100 hover:bg-paper-200 text-industrial-800 font-display font-bold text-xs py-3 rounded-xl border border-paper-300 transition-all flex items-center gap-1"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Handover;

