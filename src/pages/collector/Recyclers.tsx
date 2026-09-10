import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  MapPin, 
  Truck, 
  Phone, 
  Star, 
  ChevronRight, 
  ArrowRight,
  Building2,
  CheckCircle2
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import type { Recycler } from '../../data/mockData';
import { MaterialBadge } from '../../components/ui/MaterialBadge';

const Recyclers: React.FC = () => {
  const { recyclers, lots, materials, updateLot } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();
  
  const currentLotId = location.state?.lotId;
  const currentLot = lots.find(l => l.id === currentLotId);
  const material = materials.find(m => m.id === currentLot?.materialId);

  const pendingLots = lots.filter(l => l.status === 'Created');
  const currentLot = pendingLots.length > 0 ? pendingLots[0] : null;
  const currentMaterial = currentLot ? materials.find(m => m.id === currentLot.materialId) : materials[0];
  const materialId = currentLot ? currentLot.materialId : 'm3';

  const filteredRecyclers = recyclers.filter(r => {
    if (selectedFilter === 'pickup') return r.pickup;
    if (selectedFilter === 'authorized') return r.authorized;
    return true;
  });

  const handleAcceptOffer = (recycler: Recycler) => {
    if (currentLot) {
      const offeredRate = recycler.offers[currentLot.materialId] || 200;
      const finalPrice = Math.round(offeredRate * currentLot.weight);
      
      updateLot(currentLot.id, { 
        recyclerId: recycler.id, 
        status: 'Offer Accepted',
        finalPrice,
        ratePerKg: offeredRate
      });
      navigate(`/collector/handover/${currentLot.id}`);
    } else {
      navigate('/collector/create');
    }
  };

  return (
    <div className="p-4 space-y-4 pb-8">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-700">
          <ShieldCheck className="w-4 h-4" />
          <span>CPCB AUTHORIZED BUYERS</span>
        </div>
        <h2 className="text-xl font-black text-slate-900 leading-tight">
          {language === 'mr' ? 'जवळचे अधिकृत खरेदीदार' : 
           language === 'hi' ? 'निकटतम अधिकृत खरीदार' : 
           'Authorized Recyclers'}
        </h2>
        <p className="text-xs text-slate-500">
          सर्व खरेदीदार सरकारमान्य असून वजन काट्याची व त्वरित पेमेंटची खात्री देतात.
        </p>

        {currentLot && (
          <div className="mt-2 bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xl">{currentMaterial?.icon}</span>
              <div>
                <p className="text-xs font-bold text-slate-900">{currentLot.weight} KG {currentMaterial?.name}</p>
                <p className="text-[10px] text-emerald-700 font-medium">लॉट #{currentLot.id.toUpperCase()}</p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-white px-2 py-1 rounded-lg border border-emerald-200">
              Matching Buyer
            </span>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2">
        {[
          { id: 'rate', label: language === 'mr' ? 'उत्तम भाव (Best Rate)' : 'Best Rate' },
          { id: 'distance', label: language === 'mr' ? 'जवळचे (Nearest)' : 'Nearest' },
          { id: 'pickup', label: language === 'mr' ? 'पिकअप (Pickup)' : 'Pickup' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilterType(f.id as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterType === f.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Recyclers List */}
      <div className="space-y-3">
        {sortedRecyclers.map((r, i) => {
          const offerPerKg = r.offers[materialId] || 220;
          const isTopMatch = i === 0;

          return (
            <div 
              key={r.id}
              className={`bg-white rounded-2xl border transition-all overflow-hidden shadow-sm ${
                isTopMatch ? 'border-emerald-500 ring-1 ring-emerald-500/20' : 'border-slate-200'
              }`}
            >
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-slate-900 text-base">{r.name}</h3>
                      {r.authorized && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          CPCB ✓
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-3 text-xs text-slate-500 mt-1">
                      <span className="flex items-center">
                        <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        {r.distance} KM अंतर
                      </span>
                      <span className="flex items-center text-amber-600 font-semibold">
                        <Star className="w-3.5 h-3.5 mr-0.5 fill-amber-400 text-amber-500" />
                        {r.rating}
                      </span>
                    </div>
                  </div>

                  {isTopMatch && (
                    <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Best Offer</span>
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500">
                  📍 {r.address}
                </p>

                {/* Badges */}
                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  {r.pickup ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
                      <Truck className="w-3 h-3 mr-1 text-emerald-600" /> वाहन पिकअप उपलब्ध
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 border border-slate-200 font-medium">
                      स्वतः आणून देणे (Self Drop)
                    </span>
                  )}
                  <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 font-medium">
                    रोख / UPI
                  </span>
                </div>
              </div>

              {/* Offer Price Footer */}
              <div className="bg-slate-50 px-4 py-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold">
                    ऑफर भाव ({currentMaterial?.name || 'PCB'})
                  </span>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-2xl font-black text-emerald-700">
                      ₹{offerPerKg}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">/किलो</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <a
                    href="tel:9876543210"
                    className="p-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors bg-white shadow-sm"
                    title="फोन करा"
                  >
                    <Phone className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => handleAcceptOffer(r)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-sm transition-all flex items-center space-x-1.5"
                  >
                    <span>{currentLot ? 'ऑफर स्वीकारा' : 'लॉट जोडा'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default Recyclers;

