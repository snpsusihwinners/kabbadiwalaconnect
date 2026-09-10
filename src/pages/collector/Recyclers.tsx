import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2,
  MapPin, 
  Star, 
  ShieldCheck, 
  Truck,
  Phone,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const Recyclers: React.FC = () => {
  const navigate = useNavigate();
  const { recyclers, materials, transactions, updateTransaction, language } = useAppContext();
  const [filterType, setFilterType] = useState<'rate'|'distance'|'pickup'>('rate');

  const pendingLots = transactions.filter(t => t.status === 'Pending');
  const currentLot = pendingLots.length > 0 ? pendingLots[0] : null;
  const currentMaterial = currentLot ? materials.find(m => m.id === currentLot.materialId) : materials[0];
  const materialId = currentLot ? currentLot.materialId : 'm3';

  const sortedRecyclers = [...recyclers].sort((a, b) => {
    if (filterType === 'rate') return (b.offers[materialId] || 0) - (a.offers[materialId] || 0);
    if (filterType === 'distance') return a.distance - b.distance;
    if (filterType === 'pickup') return (b.pickup ? 1 : 0) - (a.pickup ? 1 : 0);
    return 0;
  });

  const handleAcceptOffer = (recycler: any) => {
    if (currentLot) {
      const offerPerKg = recycler.offers[materialId] || 220;
      updateTransaction(currentLot.id, {
        recyclerId: recycler.id,
        finalPrice: offerPerKg * currentLot.weight,
        status: 'Pending'
      });
      navigate(`/collector/handover/${currentLot.id}`);
    } else {
      navigate('/collector/lot/new');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-khata-paper text-khata-ink bg-ruled-pattern pb-10">
      
      {/* Header */}
      <div className="bg-khata-blue text-khata-paper p-4 brutal-border-b border-b-2 border-khata-ink shadow-brutal-sm">
        <div className="flex items-center space-x-2 mb-2">
          <Building2 className="w-5 h-5" />
          <span className="text-[10px] font-mono uppercase tracking-widest font-bold">
            AUTHORIZED NETWORK
          </span>
        </div>
        <h1 className="font-vernacular text-3xl font-black mb-1">
          {language === 'mr' ? 'खरेदीदार' : 'BUYERS'}
        </h1>
        <p className="text-xs font-mono font-bold bg-khata-ink text-khata-paper inline-block px-2 py-0.5 mt-1">
          CPCB CERTIFIED ONLY
        </p>

        {currentLot && (
          <div className="mt-4 border-2 border-khata-ink bg-white text-khata-ink p-3 shadow-brutal-sm">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold font-mono">MATCHING FOR:</span>
              <span className="text-xs font-mono bg-khata-red text-khata-paper px-1">{currentLot.id.toUpperCase()}</span>
            </div>
            <div className="text-xl font-black font-vernacular">
              {currentLot.weight} KG {currentMaterial?.name}
            </div>
          </div>
        )}
      </div>

      <div className="p-4 space-y-4 flex-1">
        
        {/* Filters */}
        <div className="flex space-x-2 border-b-2 border-khata-ink pb-3">
          {[
            { id: 'rate', label: language === 'mr' ? 'भाव' : 'RATE' },
            { id: 'distance', label: language === 'mr' ? 'जवळ' : 'NEAR' },
            { id: 'pickup', label: language === 'mr' ? 'पिकअप' : 'PICKUP' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id as any)}
              className={`px-3 py-1 font-mono text-sm font-bold transition-all border-2 ${
                filterType === f.id
                  ? 'border-khata-ink bg-khata-ink text-khata-paper'
                  : 'border-transparent text-khata-ink/60 hover:text-khata-ink'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="space-y-4">
          {sortedRecyclers.map((r, i) => {
            const offerPerKg = r.offers[materialId] || 220;
            const isTopMatch = i === 0;

            return (
              <div 
                key={r.id}
                className={`brutal-card bg-white p-0 overflow-hidden ${
                  isTopMatch ? 'ring-2 ring-khata-red' : ''
                }`}
              >
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-vernacular text-2xl leading-none mb-1">{r.name}</h3>
                      {r.authorized && (
                        <span className="inline-flex items-center text-[10px] font-mono font-bold border border-khata-green text-khata-green px-1">
                          <ShieldCheck className="w-3 h-3 mr-1" /> CPCB VERIFIED
                        </span>
                      )}
                    </div>
                    {isTopMatch && (
                      <span className="bg-khata-red text-khata-paper text-[10px] font-mono font-bold px-2 py-1 flex items-center shadow-brutal-active">
                        <Sparkles className="w-3 h-3 mr-1" /> TOP MATCH
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-xs font-mono font-bold mt-3 mb-2">
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" /> {r.distance} KM
                    </span>
                    <span className="flex items-center">
                      <Star className="w-4 h-4 mr-1 text-khata-red" /> {r.rating}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 text-[10px] font-mono font-bold mt-2">
                    {r.pickup ? (
                      <span className="border border-khata-ink px-1 flex items-center">
                        <Truck className="w-3 h-3 mr-1" /> YES
                      </span>
                    ) : (
                      <span className="border border-khata-ink px-1 opacity-60">DROP-OFF</span>
                    )}
                  </div>
                </div>

                {/* Offer Footer */}
                <div className="bg-khata-paper border-t-2 border-khata-ink p-3 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-mono font-bold bg-khata-ink text-khata-paper px-1 mb-1 block w-max">
                      OFFER RATE
                    </span>
                    <span className="text-2xl font-black font-mono">₹{offerPerKg}</span>
                    <span className="text-xs font-mono">/KG</span>
                  </div>

                  <div className="flex space-x-2">
                    <a href="tel:9876543210" className="p-2 border-2 border-khata-ink bg-white active:bg-khata-ink active:text-khata-paper transition-colors">
                      <Phone className="w-5 h-5" />
                    </a>
                    <button
                      onClick={() => handleAcceptOffer(r)}
                      className="px-4 py-2 bg-khata-green text-khata-paper border-2 border-khata-ink font-mono font-bold flex items-center shadow-brutal-sm active:shadow-none active:translate-y-1 active:translate-x-1 transition-all"
                    >
                      {currentLot ? 'ACCEPT' : 'NEW LOT'} <ArrowRight className="w-4 h-4 ml-1" />
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
