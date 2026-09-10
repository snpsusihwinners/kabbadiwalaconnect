import React, { useState } from 'react';
import { 
  X, 
  Scale, 
  CheckCircle2, 
  ArrowRight
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

interface GateInModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedLotId?: string;
}

export const GateInModal: React.FC<GateInModalProps> = ({
  isOpen,
  onClose,
  preselectedLotId
}) => {
  const { lots, materials, updateLot, addTransaction } = useAppContext();

  const [lotSearch, setLotSearch] = useState(preselectedLotId || 'L1');
  const [scaleGross, setScaleGross] = useState('9.4');
  const [scaleTare, setScaleTare] = useState('1.2');
  const [paymentMode, setPaymentMode] = useState<'UPI' | 'Cash' | 'IMPS'>('UPI');
  const [step, setStep] = useState<'scan' | 'verified'>('scan');

  if (!isOpen) return null;

  const targetLot = lots.find(l => l.id.toLowerCase() === lotSearch.trim().toLowerCase()) || lots[0];
  const material = materials.find(m => m.id === targetLot.materialId);

  const grossNum = parseFloat(scaleGross) || 0;
  const tareNum = parseFloat(scaleTare) || 0;
  const netWeight = Math.max(0, parseFloat((grossNum - tareNum).toFixed(2)));
  const rate = targetLot.ratePerKg || (material ? material.basePrice : 200);
  const payoutTotal = Math.round(netWeight * rate);

  const handleConfirmGateIn = () => {
    updateLot(targetLot.id, {
      status: 'Handover Completed',
      weight: netWeight,
      grossWeight: grossNum,
      tareWeight: tareNum,
      finalPrice: payoutTotal,
      recyclerId: 'r1'
    });

    addTransaction({
      id: `t${Math.floor(100 + Math.random() * 900)}`,
      ticketNo: `KP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      lotId: targetLot.id,
      materialId: targetLot.materialId,
      grossWeight: grossNum,
      tareWeight: tareNum,
      weight: netWeight,
      ratePerKg: rate,
      amount: payoutTotal,
      date: new Date().toISOString(),
      status: 'Paid',
      method: paymentMode,
      utrRef: `${paymentMode}/UTR-${Math.floor(10000000 + Math.random() * 90000000)}/MH`
    });

    setStep('verified');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-industrial-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-paper-300 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-industrial-900 text-white p-5 flex items-center justify-between border-b border-industrial-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-forest-800 text-emerald-300 border border-forest-700">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-white">
                Weighbridge Gate-In Terminal
              </h3>
              <p className="text-[11px] text-industrial-400 font-mono">
                Scale 01 (Calibrated: 10-Sept-2026 • Accuracy ±0.05kg)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-industrial-800 text-industrial-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'scan' ? (
          <div className="p-6 space-y-5">
            {/* Quick Lot Selector Input */}
            <div>
              <label className="text-xs font-bold text-industrial-700 block mb-1">
                Scan QR or Select Lot ID
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={lotSearch}
                  onChange={(e) => setLotSearch(e.target.value)}
                  className="flex-1 uppercase font-mono font-bold text-sm bg-paper-100 border border-paper-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. L1, L2, L3"
                />
                <select
                  value={targetLot.id}
                  onChange={(e) => setLotSearch(e.target.value)}
                  className="text-xs bg-paper-100 border border-paper-300 rounded-xl px-2 font-medium"
                >
                  {lots.map(l => (
                    <option key={l.id} value={l.id}>
                      {l.id.toUpperCase()} ({l.weight}kg)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Target Lot Info Card */}
            <div className="bg-paper-50 rounded-2xl p-4 border border-paper-300 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-industrial-500">Manifest / Lot</span>
                <span className="font-mono font-bold text-industrial-900">{targetLot.manifestNo}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-industrial-500">Material Grade</span>
                <span className="font-bold text-industrial-950">{material?.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-industrial-500">Declared Collector</span>
                <span className="font-medium text-industrial-800">{targetLot.collectorName} ({targetLot.collectorId})</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-industrial-500">Agreed Rate</span>
                <span className="font-mono font-bold text-emerald-800">₹{rate}/kg</span>
              </div>
            </div>

            {/* Scale Telemetry Inputs */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-industrial-700 block mb-1">
                  Scale Gross Reading (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={scaleGross}
                  onChange={(e) => setScaleGross(e.target.value)}
                  className="w-full text-lg font-mono font-bold bg-white border border-paper-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-industrial-700 block mb-1">
                  Tare Deduction (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={scaleTare}
                  onChange={(e) => setScaleTare(e.target.value)}
                  className="w-full text-lg font-mono font-bold bg-white border border-paper-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Computed Net & Payout */}
            <div className="bg-forest-900 text-white rounded-2xl p-4 flex items-center justify-between border border-forest-800">
              <div>
                <span className="text-[10px] font-mono text-emerald-300 uppercase block">NET WEIGHT</span>
                <span className="text-2xl font-black font-mono">{netWeight} kg</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-emerald-300 uppercase block">SETTLEMENT PAYOUT</span>
                <span className="text-2xl font-black font-mono text-amber-300">₹{payoutTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="text-xs font-bold text-industrial-700 block mb-1">
                Disbursement Method
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs font-bold">
                {(['UPI', 'Cash', 'IMPS'] as const).map(mode => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setPaymentMode(mode)}
                    className={`py-2 rounded-xl border transition-all ${
                      paymentMode === mode 
                        ? 'bg-industrial-900 text-white border-industrial-900 shadow-sm' 
                        : 'bg-paper-100 text-industrial-600 border-paper-300 hover:bg-paper-200'
                    }`}
                  >
                    {mode === 'UPI' ? 'UPI Direct' : mode === 'Cash' ? 'Cash Voucher' : 'Bank IMPS'}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={onClose}
                className="flex-1 bg-paper-200 hover:bg-paper-300 text-industrial-700 py-3 rounded-xl font-display font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmGateIn}
                className="flex-1 bg-emerald-700 hover:bg-emerald-600 text-white py-3 rounded-xl font-display font-bold text-xs shadow-tactile flex items-center justify-center gap-1.5"
              >
                <span>Approve & Settle Payout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="font-display font-black text-xl text-industrial-950">
                Gate-In Approved & Payout Settled
              </h3>
              <p className="text-xs text-industrial-500 font-mono mt-1">
                Manifest {targetLot.manifestNo} • ₹{payoutTotal.toLocaleString('en-IN')} via {paymentMode}
              </p>
            </div>

            <div className="bg-paper-50 rounded-2xl p-4 text-left text-xs font-mono border border-paper-300 space-y-1.5">
              <p>Lot: <strong>{targetLot.id.toUpperCase()}</strong></p>
              <p>Certified Net Weight: <strong>{netWeight} kg</strong></p>
              <p>Collector: <strong>{targetLot.collectorName}</strong></p>
              <p>CPCB Form-6 Manifest Generated ✓</p>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-industrial-900 hover:bg-industrial-950 text-white font-display font-bold text-xs py-3.5 rounded-xl shadow-tactile"
            >
              Close Terminal
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
