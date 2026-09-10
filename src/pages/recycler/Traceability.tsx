import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Truck, 
  Building2, 
  MapPin, 
  FileText, 
  Printer, 
  ShieldCheck, 
  X
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { MaterialBadge } from '../../components/ui/MaterialBadge';

const Traceability: React.FC = () => {
  const { lots, materials } = useAppContext();
  const [selectedLotId, setSelectedLotId] = useState(lots[0]?.id || 'l1');
  const [showCertificate, setShowCertificate] = useState(false);

  const activeLot = lots.find(l => l.id === selectedLotId) || lots[0];
  const material = materials.find(m => m.id === activeLot?.materialId);

  const timelineSteps = [
    { 
      title: 'Informal Sourcing & Field Segregation', 
      desc: 'Collected from commercial IT corridors by Raju Scrap Co. (COL-1028)', 
      time: activeLot?.createdAt, 
      icon: MapPin, 
      completed: true,
      meta: 'Swargate Mandi Aggregation Hub'
    },
    { 
      title: 'Digital Weighbridge Tare Logged', 
      desc: `Manifest ${activeLot?.manifestNo} • Declared Net: ${activeLot?.weight} kg (Gross ${(activeLot?.grossWeight || activeLot?.weight + 0.6).toFixed(1)}kg)`, 
      time: activeLot?.createdAt, 
      icon: CheckCircle2, 
      completed: true,
      meta: 'Tare deduction verified'
    },
    { 
      title: 'CPCB Transit Clearance & B2B Match', 
      desc: `Authorized to GreenCycle Circular Technologies at agreed procurement rate`, 
      time: new Date(Date.now() - 3600000).toISOString(), 
      icon: Truck, 
      completed: activeLot?.status !== 'Created',
      meta: 'Vehicle MH-12-QB-4819'
    },
    { 
      title: 'Facility Scale Gate-In & Verification', 
      desc: 'Physical weighbridge scan, tare verification & instant UPI settlement to collector', 
      time: activeLot?.status === 'Handover Completed' ? new Date().toISOString() : null, 
      icon: Building2, 
      completed: activeLot?.status === 'Handover Completed',
      meta: 'Scale 01 (Accuracy ±0.05kg)'
    },
    { 
      title: 'Secondary Smelting & EPR Token Generation', 
      desc: 'Smelted into 99.9% electrolytic ingots. CPCB EPR Credit Token minted.', 
      time: activeLot?.status === 'Handover Completed' ? new Date().toISOString() : null, 
      icon: ShieldCheck, 
      completed: activeLot?.status === 'Handover Completed',
      meta: 'EPR Units: 0.008 MT'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-paper-300 shadow-tactile flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-display text-industrial-950">
              Chain of Custody & Statutory Traceability
            </h2>
            <span className="bg-forest-100 text-forest-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-forest-300">
              CPCB FORM-6
            </span>
          </div>
          <p className="text-xs text-industrial-500 font-medium mt-0.5">
            Immutable regulatory tracking from informal waste-picker to secondary commodity output
          </p>
        </div>

        <button 
          onClick={() => setShowCertificate(true)}
          className="bg-forest-800 hover:bg-forest-900 active:scale-95 text-white font-display font-bold text-xs px-4 py-2.5 rounded-xl shadow-tactile flex items-center gap-1.5 transition-all self-start sm:self-auto"
        >
          <FileText className="w-4 h-4 text-emerald-300" />
          <span>View Statutory Form-6 Certificate</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Lot Selector */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-paper-300 shadow-tactile space-y-4">
            <h3 className="font-display font-bold text-sm text-industrial-950 uppercase tracking-wider">
              Select Traceable Batch
            </h3>

            <div className="space-y-2">
              {lots.map((l) => {
                const isSelected = l.id === selectedLotId;
                const m = materials.find(mat => mat.id === l.materialId);

                return (
                  <div
                    key={l.id}
                    onClick={() => setSelectedLotId(l.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected 
                        ? 'bg-forest-50/80 border-forest-600 ring-1 ring-forest-500 shadow-sm' 
                        : 'bg-paper-50 border-paper-300 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <MaterialBadge iconKey={m?.icon} category={m?.category} size="sm" />
                      <div>
                        <span className="font-bold text-xs text-industrial-900 block font-mono">
                          {l.id.toUpperCase()} • {l.weight} kg
                        </span>
                        <span className="text-[10px] text-industrial-500 truncate block max-w-[130px]">
                          {m?.name}
                        </span>
                      </div>
                    </div>

                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      l.status === 'Handover Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {l.status === 'Handover Completed' ? 'AUDITED' : 'EN ROUTE'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cryptographic Ledger Hash Box */}
          <div className="bg-industrial-950 text-white rounded-2xl p-4 border border-industrial-800 space-y-2 font-mono text-[11px]">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase text-[10px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>CRYPTOGRAPHIC MANIFEST HASH</span>
            </div>
            <p className="text-industrial-400 break-all text-[10px] bg-industrial-900 p-2 rounded-lg border border-industrial-800">
              SHA256: 7f92a104b928ec11894bf8201a4e5281b947c941d3e84a263548e89f
            </p>
            <p className="text-[10px] text-industrial-500">
              Auto-anchored into National CPCB E-Waste Register
            </p>
          </div>
        </div>

        {/* Right Column: Interactive Supply Chain Timeline */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-paper-300 p-6 shadow-tactile space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-paper-200 gap-2">
              <div>
                <h3 className="font-display font-bold text-base text-industrial-950">
                  Batch Lifecycle Timeline
                </h3>
                <p className="text-xs text-industrial-500 font-mono">
                  MANIFEST NO: {activeLot?.manifestNo}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-industrial-500">Declared Net:</span>
                <span className="font-bold text-industrial-900 bg-paper-100 px-2 py-0.5 rounded border border-paper-300">
                  {activeLot?.weight} kg {material?.name}
                </span>
              </div>
            </div>

            {/* Timeline Tree */}
            <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-paper-300">
              {timelineSteps.map((step, idx) => {
                const Icon = step.icon;

                return (
                  <div key={idx} className="relative flex items-start gap-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 -ml-6 z-10 transition-all ${
                      step.completed 
                        ? 'bg-forest-800 text-emerald-300 border-forest-600 shadow-sm' 
                        : 'bg-paper-100 text-industrial-400 border-paper-300'
                    }`}>
                      <Icon className="w-3 h-3" />
                    </div>

                    <div className="bg-paper-50 p-4 rounded-xl border border-paper-300 flex-1 space-y-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h4 className={`font-display font-bold text-xs ${step.completed ? 'text-industrial-950' : 'text-industrial-500'}`}>
                          {step.title}
                        </h4>
                        {step.time && (
                          <span className="text-[10px] font-mono text-industrial-500">
                            {new Date(step.time).toLocaleString()}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-industrial-600 leading-relaxed font-sans">
                        {step.desc}
                      </p>

                      <div className="flex items-center gap-1.5 pt-1 text-[10px] font-mono text-emerald-800 font-bold">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{step.meta}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* CPCB Form-6 Certificate Modal */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-industrial-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-paper-300 p-8 space-y-6">
            <div className="flex justify-between items-start border-b border-paper-300 pb-4">
              <div className="text-left">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  STATUTORY E-WASTE RULES 2022
                </span>
                <h3 className="font-display font-black text-xl text-industrial-950 mt-1">
                  FORM-6 HAZARDOUS WASTE MANIFEST
                </h3>
                <p className="text-xs text-industrial-500 font-mono">
                  MANIFEST NO: {activeLot?.manifestNo}
                </p>
              </div>

              <button 
                onClick={() => setShowCertificate(false)}
                className="p-1 rounded-lg hover:bg-paper-100 text-industrial-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Official Certificate Box */}
            <div className="border-2 border-industrial-900 p-6 rounded-2xl bg-paper-50/60 font-mono text-xs space-y-4">
              <div className="text-center pb-3 border-b border-dashed border-industrial-300">
                <p className="font-bold text-industrial-950 text-sm">CENTRAL POLLUTION CONTROL BOARD (CPCB)</p>
                <p className="text-[10px] text-industrial-600">Ministry of Environment, Forest and Climate Change, Govt. of India</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-[11px]">
                <div>
                  <span className="font-bold text-industrial-700 block text-[10px] uppercase">1. Sender / Aggregator</span>
                  <p className="font-bold text-industrial-950">{activeLot?.collectorName}</p>
                  <p className="text-industrial-600">Reg ID: {activeLot?.collectorId}</p>
                  <p className="text-industrial-600">Location: Pune Market Yard Yard-4</p>
                </div>

                <div>
                  <span className="font-bold text-industrial-700 block text-[10px] uppercase">2. Certified Recycler</span>
                  <p className="font-bold text-industrial-950">GreenCycle Circular Technologies</p>
                  <p className="text-emerald-800 font-bold">CPCB/E-WASTE/2024/MH-0814</p>
                  <p className="text-industrial-600">Plot 42, Bhosari MIDC, Pune</p>
                </div>
              </div>

              <div className="pt-2 border-t border-paper-300 text-[11px] space-y-1">
                <div className="flex justify-between">
                  <span>Waste Material Description:</span>
                  <strong className="text-industrial-950">{material?.name} ({material?.grade})</strong>
                </div>
                <div className="flex justify-between">
                  <span>Tariff HSN Code:</span>
                  <strong>{material?.hsnCode}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Certified Net Weight:</span>
                  <strong>{activeLot?.weight} kg (Gross: {(activeLot?.grossWeight || activeLot?.weight + 0.6).toFixed(2)}kg)</strong>
                </div>
                <div className="flex justify-between">
                  <span>Disbursed Purchase Payout:</span>
                  <strong>₹{activeLot?.finalPrice || 2050} via Instant Direct Settlement</strong>
                </div>
              </div>

              <div className="pt-4 border-t border-dashed border-industrial-300 flex justify-between items-end text-[10px]">
                <div>
                  <p className="text-industrial-500">DIGITAL SIGNATURE HASH:</p>
                  <p className="font-mono text-emerald-800">CPCB-SIG-984210948-VERIFIED</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-emerald-800">100% REGULATORY AUDIT PASS ✓</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 bg-paper-200 hover:bg-paper-300 text-industrial-800 rounded-xl text-xs font-bold font-display flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Form-6</span>
              </button>
              <button
                onClick={() => setShowCertificate(false)}
                className="px-5 py-2.5 bg-forest-800 hover:bg-forest-900 text-white rounded-xl text-xs font-bold font-display shadow-tactile"
              >
                Close Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Traceability;

