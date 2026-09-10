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
  CheckCircle2,
  BadgePercent
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import type { Recycler } from '../../data/mockData';
import { MaterialBadge } from '../../components/ui/MaterialBadge';

const Recyclers: React.FC = () => {
  const { recyclers, lots, materials, updateLot, language } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();
  
  const currentLotId = location.state?.lotId;
  const currentLot = lots.find(l => l.id === currentLotId);
  const material = materials.find(m => m.id === currentLot?.materialId);

  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pickup' | 'authorized'>('all');

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
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="bg-white rounded-2xl p-4 border border-paper-300 shadow-tactile flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-base text-industrial-950">
            {currentLot ? 'Match Found for Your Lot' : 'Certified Recycler Facilities'}
          </h1>
          <p className="text-xs text-industrial-500 font-medium">
            {recyclers.length} CPCB / SPCB Approved Facilities in Pune Industrial Area
          </p>
        </div>

        <div className="w-9 h-9 rounded-xl bg-forest-50 border border-forest-200 flex items-center justify-center text-forest-800">
          <Building2 className="w-5 h-5" />
        </div>
      </div>

      {/* Active Lot In-Progress Notice */}
      {currentLot && material && (
        <div className="bg-gradient-to-r from-forest-900 to-forest-950 text-white rounded-2xl p-4 border border-forest-800 shadow-tactile space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-300">
              MATCHING BUYERS FOR
            </span>
            <span className="text-[10px] font-mono text-forest-300">
              Lot {currentLot.id.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <MaterialBadge iconKey={material.icon} category={material.category} size="sm" />
              <div>
                <h3 className="font-bold text-sm text-white">{material.name}</h3>
                <p className="text-xs text-forest-300">{currentLot.weight} kg Net Weight</p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-xs text-forest-300">Mandi Estimate</p>
              <p className="text-sm font-black font-mono text-emerald-300">
                ₹{currentLot.estimatedValueRange[0]} - ₹{currentLot.estimatedValueRange[1]}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 text-xs">
        <button
          onClick={() => setSelectedFilter('all')}
          className={`px-3 py-1.5 rounded-xl font-bold border transition-all ${
            selectedFilter === 'all' 
              ? 'bg-forest-800 text-white border-forest-700 shadow-sm' 
              : 'bg-white text-industrial-600 border-paper-300'
          }`}
        >
          All Facilities ({recyclers.length})
        </button>
        <button
          onClick={() => setSelectedFilter('pickup')}
          className={`px-3 py-1.5 rounded-xl font-bold border transition-all ${
            selectedFilter === 'pickup' 
              ? 'bg-forest-800 text-white border-forest-700 shadow-sm' 
              : 'bg-white text-industrial-600 border-paper-300'
          }`}
        >
          Pickup Available
        </button>
      </div>

      {/* Recyclers Directory List */}
      <div className="space-y-3.5">
        {filteredRecyclers.map((r, i) => {
          const lotRate = currentLot ? r.offers[currentLot.materialId] : null;
          const totalLotVal = lotRate && currentLot ? Math.round(lotRate * currentLot.weight) : null;

          return (
            <div 
              key={r.id} 
              className="bg-white rounded-2xl border border-paper-300 p-4 shadow-tactile space-y-3 relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-display font-bold text-sm text-industrial-950">
                      {r.name}
                    </h3>
                    {r.authorized && (
                      <span title="CPCB Authorized Recycler">
                        <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-industrial-500 font-medium">
                    {r.legalEntity}
                  </p>
                  <p className="text-[10px] text-emerald-800 font-mono mt-0.5">
                    CPCB: {r.cpcbReg}
                  </p>
                </div>

                <div className="flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-lg text-xs font-bold shrink-0">
                  <Star className="w-3 h-3 text-amber-600 fill-amber-500" />
                  <span>{r.rating}</span>
                  <span className="text-[10px] text-amber-700">({r.reviewsCount})</span>
                </div>
              </div>

              {/* Location & Services */}
              <div className="flex flex-wrap gap-2 text-[11px] text-industrial-600">
                <div className="flex items-center gap-1 bg-paper-100 px-2 py-0.5 rounded-md">
                  <MapPin className="w-3 h-3 text-industrial-500" />
                  <span>{r.distance} km • {r.address}</span>
                </div>
                {r.pickup && (
                  <div className="flex items-center gap-1 bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200">
                    <Truck className="w-3 h-3 text-emerald-600" />
                    <span>Free Pickup Service</span>
                  </div>
                )}
                {r.weighbridgeCertified && (
                  <div className="flex items-center gap-1 bg-blue-50 text-blue-800 px-2 py-0.5 rounded-md border border-blue-200">
                    <CheckCircle2 className="w-3 h-3 text-blue-600" />
                    <span>Digital Kanta Scale Validated</span>
                  </div>
                )}
              </div>

              {/* Specific Lot Deal Bar if coming from Lot Flow */}
              {currentLot && (
                <div className="bg-forest-50 border border-forest-200 rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-forest-700 font-mono uppercase">Offered Buying Rate</span>
                    <p className="text-base font-black font-mono text-forest-950">
                      ₹{lotRate}/kg <span className="text-xs font-bold text-emerald-700">(₹{totalLotVal})</span>
                    </p>
                  </div>

                  <button
                    onClick={() => handleAcceptOffer(r)}
                    className="bg-forest-800 hover:bg-forest-900 active:scale-95 text-white font-display font-bold text-xs px-4 py-2.5 rounded-xl shadow-tactile flex items-center gap-1.5 transition-all"
                  >
                    <span>Accept & Issue QR</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Regular Directory View */}
              {!currentLot && (
                <div className="pt-2 border-t border-paper-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <a 
                      href={`tel:${r.phone}`}
                      className="inline-flex items-center gap-1 text-industrial-700 hover:text-industrial-950 font-bold bg-paper-100 px-2.5 py-1 rounded-lg border border-paper-300"
                    >
                      <Phone className="w-3 h-3 text-emerald-700" />
                      <span>{r.phone}</span>
                    </a>
                    <span className="text-[10px] text-industrial-500 font-mono">
                      Cap: {r.dailyCapacityTons} T/day
                    </span>
                  </div>

                  <button
                    onClick={() => navigate('/collector/create')}
                    className="font-bold text-forest-800 hover:text-forest-950 flex items-center gap-0.5"
                  >
                    <span>Create Lot for Buyer</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Recyclers;

