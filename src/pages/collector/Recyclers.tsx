import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  MapPin, 
  Truck, 
  ChevronRight, 
  Star, 
  Phone, 
  ArrowRight,
  Filter,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import type { Recycler } from '../../data/mockData';

const Recyclers: React.FC = () => {
  const { recyclers, lots, updateLot, materials } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();
  
  const currentLotId = location.state?.lotId;
  const currentLot = lots.find(l => l.id === currentLotId);
  const materialId = currentLot?.materialId || 'm3';
  const currentMaterial = materials.find(m => m.id === materialId);

  const [filterType, setFilterType] = useState<'rate' | 'distance' | 'pickup'>('rate');

  const sortedRecyclers = [...recyclers].sort((a, b) => {
    if (filterType === 'rate') {
      return (b.offers[materialId] || 0) - (a.offers[materialId] || 0);
    }
    if (filterType === 'distance') {
      return a.distance - b.distance;
    }
    return (b.pickup ? 1 : 0) - (a.pickup ? 1 : 0);
  });

  const handleAcceptOffer = (recycler: Recycler) => {
    const targetLotId = currentLot?.id || lots[0]?.id;
    if (targetLotId) {
      const offeredRate = recycler.offers[materialId] || 230;
      const weightVal = currentLot?.weight || 8.2;
      updateLot(targetLotId, { 
        recyclerId: recycler.id, 
        status: 'Offer Accepted',
        finalPrice: Math.round(offeredRate * weightVal)
      });
      navigate(`/collector/handover/${targetLotId}`);
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-[#fbf8f1] text-[#13261e] pb-10">
      
      {/* Header */}
      <div className="bg-[#0b241a] text-white px-5 pt-4 pb-5 rounded-b-[30px] shadow-md relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-300 font-bold">
              CERTIFIED RECYCLER NETWORK
            </span>
          </div>
          <h1 className="text-xl font-black text-white">
            {currentLot ? 'आपके लॉट के लिए ऑफर' : 'पास के अधिकृत रीसाइक्लर'}
          </h1>
          <p className="text-xs text-emerald-200/80 mt-0.5">
            CPCB व प्रदूषण नियंत्रण बोर्ड द्वारा प्रमाणित
          </p>
        </div>

        {/* Current Lot Badge if matched */}
        {currentLot && (
          <div className="mt-3 bg-gradient-to-r from-emerald-950 to-[#072418] border border-emerald-500/30 rounded-2xl p-3 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <span className="text-2xl">{currentMaterial?.icon}</span>
              <div>
                <p className="text-xs font-black text-white">{currentLot.weight} KG {currentMaterial?.name}</p>
                <p className="text-[10px] font-mono text-emerald-300">लॉट ID #{currentLot.id.toUpperCase()}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-mono">अनुमानित भाव</span>
              <p className="text-sm font-black text-amber-300 font-mono">
                ₹{currentLot.estimatedValueRange[0]} - ₹{currentLot.estimatedValueRange[1]}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 space-y-3.5 flex-1">
        
        {/* Filter Chips */}
        <div className="flex space-x-2">
          {[
            { id: 'rate', label: 'उच्चतम भाव (Highest Rate)' },
            { id: 'distance', label: 'निकटतम (Nearest)' },
            { id: 'pickup', label: 'पिकअप उपलब्ध' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all ${
                filterType === f.id
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-white border border-[#e6decb] text-slate-600 hover:bg-slate-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Recycler Cards */}
        <div className="space-y-3">
          {sortedRecyclers.map((r, i) => {
            const offerPerKg = r.offers[materialId] || 220;
            const isTopMatch = i === 0;

            return (
              <div 
                key={r.id}
                className={`bg-white rounded-[24px] border transition-all overflow-hidden shadow-card-elevated ${
                  isTopMatch ? 'border-emerald-500/60 ring-1 ring-emerald-500/30' : 'border-[#e6decb]'
                }`}
              >
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <h3 className="font-black text-slate-900 text-base">{r.name}</h3>
                        {r.authorized && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <ShieldCheck className="w-3 h-3 mr-0.5 text-emerald-600" />
                            CPCB VERIFIED
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-3 text-xs text-slate-500 mt-1 font-mono">
                        <span className="flex items-center">
                          <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                          {r.distance} किमी दूर
                        </span>
                        <span className="flex items-center text-amber-600 font-bold">
                          <Star className="w-3.5 h-3.5 mr-0.5 fill-amber-400 text-amber-500" />
                          {r.rating}
                        </span>
                      </div>
                    </div>

                    {isTopMatch && (
                      <span className="bg-emerald-600 text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center space-x-1">
                        <Sparkles className="w-3 h-3" />
                        <span>BEST MATCH</span>
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 font-medium">
                    📍 {r.address}
                  </p>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-1.5 text-[11px] font-mono">
                    {r.pickup ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-teal-50 text-teal-800 border border-teal-200">
                        <Truck className="w-3 h-3 mr-1 text-teal-600" /> गोदाम पिकअप उपलब्ध
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-slate-50 text-slate-600 border border-slate-200">
                        स्वयं डिलीवरी (Self Drop)
                      </span>
                    )}
                    <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                      नकद / UPI भुगतान
                    </span>
                  </div>
                </div>

                {/* Offer Price Bar & Accept CTA */}
                <div className="bg-[#f8fbf9] p-3.5 border-t border-[#eaf2ed] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">
                      ऑफर भाव ({currentMaterial?.name || 'PCB'})
                    </span>
                    <div className="flex items-baseline space-x-1">
                      <span className="text-2xl font-black text-emerald-900 font-mono tracking-tight">
                        ₹{offerPerKg}
                      </span>
                      <span className="text-xs text-slate-600 font-mono">/ किग्रा</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <a
                      href="tel:9876543210"
                      className="p-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors"
                      title="कॉल करें"
                    >
                      <Phone className="w-4 h-4" />
                    </a>

                    <button
                      onClick={() => handleAcceptOffer(r)}
                      className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs font-mono py-2.5 px-4 rounded-xl shadow-tactile-green active:translate-y-0.5 transition-all flex items-center space-x-1.5"
                    >
                      <span>ऑफर स्वीकारें</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default Recyclers;
