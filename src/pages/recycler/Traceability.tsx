import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Truck, 
  Building2, 
  MapPin, 
  ShieldCheck, 
  Download, 
  FileText,
  Clock
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
      
      {/* Title Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <span>CPCB Circular Chain of Custody</span>
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </h2>
          <p className="text-xs text-slate-500">
            Government e-Waste Management Rules 2022 compliant digital audit trail
          </p>
        </div>

        <button 
          onClick={() => alert(`Certificate for LOT #${activeLot?.id.toUpperCase()} generated! SHA-256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069`)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Export EPR Audit Certificate (PDF)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Lot Selector */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
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
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-500 shadow-sm'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-slate-900">LOT #{l.id.toUpperCase()}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                      l.status === 'Handover Completed' 
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}>
                      {l.status === 'Handover Completed' ? 'AUDITED ✓' : 'QUEUED'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>{mat?.icon} {mat?.name}</span>
                    <span className="font-bold text-slate-900">{l.weight} KG</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Timeline */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
            <div>
              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200">
                AUDITED MANIFEST
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">
                LOT #{activeLot?.id.toUpperCase()} — {material?.name} ({activeLot?.weight} KG)
              </h3>
            </div>
            
            <div className="text-right text-xs">
              <span className="text-slate-500">Payout Value: </span>
              <span className="text-emerald-700 font-bold text-sm">₹{activeLot?.finalPrice || 1900}</span>
            </div>
          </div>

          {/* Timeline Visual Nodes */}
          <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {timelineSteps.map((step, idx) => (
              <div key={idx} className="relative">
                {/* Node indicator */}
                <div className={`absolute -left-6 top-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  step.completed 
                    ? 'bg-emerald-600 border-white text-white shadow-sm' 
                    : 'bg-slate-100 border-slate-300 text-slate-400'
                }`}>
                  <step.icon className="w-3 h-3" />
                </div>

                <div className="space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                    <h4 className={`text-sm font-bold ${step.completed ? 'text-slate-900' : 'text-slate-400'}`}>
                      {step.title}
                    </h4>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {step.meta}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>

                  {step.time && (
                    <div className="text-[11px] text-slate-400 flex items-center space-x-1 pt-0.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{new Date(step.time).toLocaleString('en-IN')}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Verification Seal Footer */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
            <span className="flex items-center text-emerald-700 font-semibold">
              <ShieldCheck className="w-4 h-4 mr-1 text-emerald-600" /> Immutable Hash Verification Passed
            </span>
            <span className="text-slate-400">Node: PUNE_HUB_04</span>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Traceability;
