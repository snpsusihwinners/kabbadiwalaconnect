import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Truck, 
  Building2, 
  MapPin, 
  Search, 
  ShieldCheck, 
  Download, 
  QrCode, 
  FileText,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const Traceability: React.FC = () => {
  const { lots, materials, recyclers } = useAppContext();
  const [selectedLotId, setSelectedLotId] = useState(
    lots.find(l => l.status === 'Handover Completed')?.id || lots[0]?.id || 'l1'
  );

  const activeLot = lots.find(l => l.id === selectedLotId) || lots[0];
  const material = materials.find(m => m.id === activeLot?.materialId);
  const recycler = recyclers.find(r => r.id === activeLot?.recyclerId) || recyclers[0];

  const timelineSteps = [
    { 
      title: '1. Sourced from Aggregator', 
      desc: `Aggregator Raju Scrap Co. (COL-1028) identified ${material?.name} via mobile AI scanner.`, 
      time: activeLot?.createdAt, 
      icon: MapPin, 
      completed: true,
      meta: 'GPS: 18.5204° N, 73.8567° E'
    },
    { 
      title: '2. Digital Lot Manifest Created', 
      desc: `Certified ${activeLot?.weight} KG recorded at fair mandi floor ₹${activeLot?.estimatedValueRange[0]}–₹${activeLot?.estimatedValueRange[1]}.`, 
      time: activeLot?.createdAt, 
      icon: FileText, 
      completed: true,
      meta: `LOT #${activeLot?.id.toUpperCase()}`
    },
    { 
      title: '3. Authorized Recycler Matched', 
      desc: `${recycler.name} (CPCB: #EW-MH-PUN-089) accepted lot and locked buying price.`, 
      time: new Date().toISOString(), 
      icon: ShieldCheck, 
      completed: activeLot?.status !== 'Created',
      meta: `Offered Rate: ₹${recycler.offers[material?.id || 'm3'] || 230}/kg`
    },
    { 
      title: '4. Physical Handover & Instant Payout', 
      desc: `QR pass scanned at collection node. Cash payout ₹${activeLot?.finalPrice || 1900} completed.`, 
      time: activeLot?.status === 'Handover Completed' ? '10 Sep 2026, 5:42 PM' : null, 
      icon: Truck, 
      completed: activeLot?.status === 'Handover Completed',
      meta: 'Tamper-Evident Geostamp'
    },
    { 
      title: '5. Facility Refining & EPR Smelting', 
      desc: 'Batch queued for mechanical sorting, PCB shredding and copper electrolytic refining.', 
      time: null, 
      icon: Building2, 
      completed: false,
      meta: 'Estimated EPR Credit: 14.8 kg Cu'
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white font-mono uppercase tracking-wider flex items-center space-x-2">
            <span>CPCB Circular Chain of Custody</span>
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Government e-Waste Management Rules 2022 compliant digital audit trail
          </p>
        </div>

        <button 
          onClick={() => alert(`Certificate for LOT #${activeLot?.id.toUpperCase()} generated! SHA-256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069`)}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs px-4 py-2.5 rounded-xl shadow-tactile-green active:translate-y-0.5 transition-all flex items-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Export EPR Audit Certificate (PDF)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Lot Selector */}
        <div className="bg-[#0b2118]/80 border border-emerald-900/50 rounded-3xl p-5 shadow-lg space-y-4">
          <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
            Select Trackable Scrap Lot
          </h3>

          <div className="space-y-2">
            {lots.map((l) => {
              const mat = materials.find(m => m.id === l.materialId);
              const isSelected = l.id === selectedLotId;

              return (
                <div
                  key={l.id}
                  onClick={() => setSelectedLotId(l.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer font-mono ${
                    isSelected
                      ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-inner'
                      : 'bg-[#061710] border-emerald-950 text-slate-400 hover:border-emerald-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-white">LOT #{l.id.toUpperCase()}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      l.status === 'Handover Completed' 
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}>
                      {l.status === 'Handover Completed' ? 'AUDITED ✓' : 'QUEUED'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span>{mat?.icon} {mat?.name}</span>
                    <span className="font-bold text-emerald-400">{l.weight} KG</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Interactive Blockchain/Audit Timeline */}
        <div className="lg:col-span-2 bg-[#0b2118]/80 border border-emerald-900/50 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-emerald-950/80 gap-2">
            <div>
              <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">
                AUDITED MANIFEST
              </span>
              <h3 className="text-lg font-black text-white font-mono mt-1">
                LOT #{activeLot?.id.toUpperCase()} — {material?.name} ({activeLot?.weight} KG)
              </h3>
            </div>
            
            <div className="text-right font-mono text-xs">
              <span className="text-slate-400">Ledger Value: </span>
              <span className="text-amber-300 font-bold">₹{activeLot?.finalPrice || 1900}</span>
            </div>
          </div>

          {/* Timeline Visual Nodes */}
          <div className="relative pl-6 space-y-8 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-emerald-400 before:via-emerald-700 before:to-slate-800">
            {timelineSteps.map((step, idx) => (
              <div key={idx} className="relative group">
                {/* Node indicator */}
                <div className={`absolute -left-6 top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  step.completed 
                    ? 'bg-emerald-400 border-[#0b2118] text-slate-950 shadow-[0_0_12px_#34d399]' 
                    : 'bg-[#061710] border-slate-700 text-slate-600'
                }`}>
                  <step.icon className="w-3 h-3" />
                </div>

                <div className="space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                    <h4 className={`text-sm font-bold font-mono ${step.completed ? 'text-white' : 'text-slate-500'}`}>
                      {step.title}
                    </h4>
                    <span className="text-[10px] font-mono text-emerald-400/80">
                      {step.meta}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    {step.desc}
                  </p>

                  {step.time && (
                    <div className="text-[10px] font-mono text-slate-500 flex items-center space-x-1 pt-0.5">
                      <Clock className="w-3 h-3 text-slate-600" />
                      <span>{new Date(step.time).toLocaleString('en-IN')}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Verification Seal Footer */}
          <div className="pt-4 border-t border-emerald-950/80 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-400 gap-2">
            <span className="flex items-center text-emerald-400">
              <ShieldCheck className="w-4 h-4 mr-1.5" /> Immutable Hash Verification Passed
            </span>
            <span className="text-slate-500">Node: PUNE_HUB_04</span>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Traceability;
